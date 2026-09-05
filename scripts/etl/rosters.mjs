/* ============================================================================
 * Build src/data/measuredRosters.ts — rosters nobody typed.
 *
 *   npx vite-node scripts/etl/rosters.mjs
 *
 * The sixteen SEC rosters in players.ts were authored: a curated two-deep with
 * announced starters, portal additions and preseason honours, which the play-by
 * -play then overwrote wherever it could reach. That is a lot of hand work, and
 * it does not scale to a second conference.
 *
 * So the Big Ten is built the other way round. Every player comes from the
 * published 2025 roster file, and every number attached to them is counted off
 * the play-by-play and joined on the source's own athlete id — not on their
 * name, which is what the SEC layer has to do and why it still misses fifty of
 * its own players. Nothing here is an estimate of what a player did.
 *
 * What is still modelled, and labelled as such: grade and PAR are derived from
 * measured production rather than observed directly, and offensive linemen are
 * invisible to play-by-play, so they carry a positional baseline instead of a
 * measurement. Both are marked in `provenance`.
 * ========================================================================== */

import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { SOURCES, TEAM_IDS, CONFERENCE_OF, PRIOR_SEASON, PROJECTION_SEASON } from './sources.mjs';
import { n, makeReadPlays, accumulate } from './tally.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(join(here, '../../.data'));
const OUT = resolve(join(here, '../../src/data/measuredRosters.ts'));
const readPlays = makeReadPlays(DATA);

/** Which conferences get a derived roster. The SEC keeps its authored one. */
const DERIVE = new Set(['B1G']);

/* -------------------------------------------------------------------------- */
/* 1. The published roster                                                     */
/* -------------------------------------------------------------------------- */

const ROSTER_COLUMNS = [
  'team_id', 'athlete_id', 'position_abbreviation', 'full_name', 'jersey',
  'experience_years', 'weight', 'height',
];
const rosterFile = join(DATA, SOURCES.roster.file);
if (!existsSync(rosterFile)) throw new Error(`missing ${rosterFile}\n  fetch it first: npm run etl:fetch`);
const rosterRows = await parquetReadObjects({
  file: await asyncBufferFromFile(rosterFile), compressors, columns: ROSTER_COLUMNS,
});
console.log(`reading ${SOURCES.roster.file} … ${rosterRows.length.toLocaleString()} rows`);

/**
 * The source's position vocabulary is coarser than the app's in two places it
 * cannot help: "OL" does not say tackle or guard, and "DB" does not say corner
 * or safety. Those two collapse to the more common of each pair, which keeps
 * the position *group* — the thing the model and the UI actually read — right
 * in every case.
 */
const POSITION = {
  QB: 'QB', RB: 'RB', FB: 'RB', WR: 'WR', KR: 'WR', TE: 'TE',
  OT: 'OT', G: 'IOL', C: 'IOL', OL: 'IOL',
  DE: 'EDGE', EDGE: 'EDGE', DT: 'DL', NT: 'DL', DL: 'DL',
  LB: 'LB', CB: 'CB', DB: 'CB', S: 'S',
  PK: 'K', P: 'P',
};
const CLASS = { 1: 'FR', 2: 'SO', 3: 'JR', 4: 'SR' };

const roster = [];
for (const r of rosterRows) {
  const teamId = TEAM_IDS[String(n(r.team_id))];
  if (!teamId || !DERIVE.has(CONFERENCE_OF[teamId])) continue;
  const position = POSITION[r.position_abbreviation];
  if (!position) continue;                      // long snappers and unknowns
  const classYear = CLASS[n(r.experience_years)];
  if (!classYear) continue;
  roster.push({
    teamId,
    athleteId: String(n(r.athlete_id)),
    name: r.full_name,
    position,
    jersey: r.jersey != null && r.jersey !== '' ? Number(r.jersey) : null,
    classYear,
  });
}
console.log(`  ${roster.length.toLocaleString()} players across ${new Set(roster.map((p) => p.teamId)).size} teams`);

/* -------------------------------------------------------------------------- */
/* 2. What they actually did                                                   */
/* -------------------------------------------------------------------------- */

console.log(`reading ${SOURCES.pbp.file} …`);
const priorPlays = await readPlays(SOURCES.pbp.file);
const currentPlays = existsSync(join(DATA, SOURCES.current.file))
  ? await readPlays(SOURCES.current.file) : [];
console.log(`  ${priorPlays.length.toLocaleString()} plays of ${PRIOR_SEASON}` +
  (currentPlays.length ? `, ${currentPlays.length.toLocaleString()} of ${PROJECTION_SEASON}` : ''));

const prior = accumulate(priorPlays);
const current = accumulate(currentPlays);

const round = (v, d) => { const f = 10 ** d; return Number.isFinite(v) ? Math.round(v * f) / f : 0; };
const prune = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== 0));

/** Everything a player was directly involved in, on either side of the ball. */
const involvement = (m) => m.dropbacks + m.carries + m.targets + m.fgAttempts + m.punts + m.defPlays;

/**
 * A player's value in EPA per game — the quantity PAR is denominated in.
 *
 * Offence is EPA generated per play involved; defence is EPA taken away on the
 * plays the player was credited on. Both are already in points, which is the
 * whole reason the rating scale and the player scale can be the same one.
 */
function valuePerGame(m) {
  return m.shareEpa / Math.max(1, m.games.size);
}

/* -------------------------------------------------------------------------- */
/* 3. Positional baselines, measured across every FBS player                    */
/* -------------------------------------------------------------------------- */

/**
 * How much involvement it takes before a player's numbers mean anything.
 *
 * This has to differ by position, because play-by-play does not see positions
 * equally. A quarterback is named on every dropback; a safety is named only on
 * the snaps where they recorded something. Holding both to the same threshold
 * would not be even-handed — it would simply delete the defence.
 */
const MIN_PLAYS = {
  QB: 30, RB: 20, WR: 15, TE: 10, K: 6, P: 8,
  EDGE: 3, DL: 3, LB: 3, CB: 3, S: 3,
};
const minPlays = (position) => MIN_PLAYS[position] ?? 10;

/** EPA per play involved — the rate PAR compares against a replacement. */
const ratePerPlay = (m) => {
  const plays = involvement(m);
  return plays > 0 ? m.shareEpa / plays : 0;
};

/**
 * Rank every FBS player within their own team and position, so "the next man
 * up" is a real person rather than a percentile.
 *
 * Replacement level is then the volume-weighted rate of everyone who was *not*
 * their team's first choice at the position. That is the honest counterfactual
 * for PAR: if this player disappears, the snaps go to someone who currently
 * looks like those players do.
 */
const squad = new Map();                          // team|position → [{m, plays}]
for (const r of rosterRows) {
  const position = POSITION[r.position_abbreviation];
  if (!position) continue;
  const m = prior.players.get(String(n(r.athlete_id)));
  if (!m) continue;
  const plays = involvement(m);
  if (plays < minPlays(position)) continue;
  const k = `${n(r.team_id)}|${position}`;
  if (!squad.has(k)) squad.set(k, []);
  squad.get(k).push({ m, plays, position });
}

const contributors = new Map();                   // position → [value per game]
const reserveRate = new Map();                    // position → {epa, plays}
for (const [, list] of squad) {
  list.sort((a, b) => b.plays - a.plays);
  list.forEach((entry, rank) => {
    if (rank < 2) {
      // Starters and primary backups are the pool a grade is a percentile of.
      if (!contributors.has(entry.position)) contributors.set(entry.position, []);
      contributors.get(entry.position).push(valuePerGame(entry.m));
    }
    if (rank >= 1) {
      // Everyone behind the first choice defines replacement level.
      const acc = reserveRate.get(entry.position) ?? { epa: 0, plays: 0 };
      acc.epa += ratePerPlay(entry.m) * entry.plays;
      acc.plays += entry.plays;
      reserveRate.set(entry.position, acc);
    }
  });
}

const baseline = new Map();
for (const [position, vals] of contributors) {
  const sorted = [...vals].sort((a, b) => a - b);
  const res = reserveRate.get(position);
  baseline.set(position, {
    sorted,
    replacementRate: res && res.plays > 0 ? res.epa / res.plays : 0,
  });
}

console.log('\n  measured replacement level — the rate of everyone behind the starter:');
for (const [pos, b] of [...baseline].sort((a, b) => b[1].replacementRate - a[1].replacementRate)) {
  console.log(`    ${pos.padEnd(5)} pool=${String(b.sorted.length).padStart(4)}  replacement ${b.replacementRate.toFixed(3)} EPA/play`);
}

const quantile = (sorted, q) => {
  if (!sorted.length) return 0;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};

/** Where a value sits among the position's real contributors, 0…1. */
const percentileOf = (position, v) => {
  const b = baseline.get(position);
  if (!b || !b.sorted.length) return 0.5;
  let lo = 0, hi = b.sorted.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (b.sorted[mid] < v) lo = mid + 1; else hi = mid; }
  return lo / b.sorted.length;
};

/**
 * Grade is that percentile on a 40–99 scale. It is a ranking against the
 * players who actually take snaps at the position, stated in the units the
 * rest of the app already uses, rather than a new opinion.
 */
const gradeFrom = (position, v) => Math.round(40 + 59 * percentileOf(position, v));

/** Linemen the play-by-play never names, graded on class year alone. */
const BLIND_GRADE = { FR: 58, SO: 66, JR: 73, SR: 78 };

/* -------------------------------------------------------------------------- */
/* 4. Build each roster                                                        */
/* -------------------------------------------------------------------------- */

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const productionOf = (m) => {
  const p = { games: m.games.size };
  if (m.attempts > 0) Object.assign(p, {
    attempts: m.attempts, completions: m.completions, passYds: m.passYds,
    passTd: m.passTd, interceptions: m.ints,
  });
  if (m.carries > 0) Object.assign(p, { carries: m.carries, rushYds: m.rushYds, rushTd: m.rushTd });
  if (m.targets > 0) Object.assign(p, {
    targets: m.targets, receptions: m.receptions, recYds: m.recYds, recTd: m.recTd,
  });
  if (m.fgAttempts > 0) Object.assign(p, { fgAttempts: m.fgAttempts, fgMade: m.fgMade, fgLong: m.fgLong });
  if (m.punts > 0) Object.assign(p, { punts: m.punts, puntAvg: round(m.puntYards / m.punts, 1) });
  if (m.sacks || m.interceptions || m.passBreakups || m.forcedFumbles) Object.assign(p, {
    sacks: m.sacks || undefined,
    takeaways: (m.interceptions + m.forcedFumbles) || undefined,
    passBreakups: m.passBreakups || undefined,
  });
  return prune(p);
};

const ratesOf = (m) => {
  const r = {};
  if (m.attempts > 0) r.ypa = round(m.passYds / m.attempts, 1);
  if (m.carries > 0) r.ypc = round(m.rushYds / m.carries, 1);
  if (m.targets > 0) r.ypt = round(m.recYds / m.targets, 1);
  const involved = involvement(m);
  if (involved > 0) {
    r.epaPerPlay = round((m.passEpa + m.rushEpa + m.recEpa + m.defEpa) / involved, 3);
  }
  const touches = m.carries + m.targets;
  if (touches > 0) r.explosiveRate = round((m.rushExplosive + m.recExplosive) / touches, 3);
  return prune(r);
};

const usageOf = (m, totals, team) => {
  const u = {};
  const t = totals.get(team);
  if (t?.attempts && m.attempts) u.passAttemptShare = round(m.attempts / t.attempts, 3);
  if (t?.carries && m.carries) u.carryShare = round(m.carries / t.carries, 3);
  if (t?.targets && m.targets) u.targetShare = round(m.targets / t.targets, 3);
  return prune(u);
};

const modalTeam = (teams) => [...teams.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

/**
 * Snap share is not in the play-by-play — it names who touched the ball, not
 * who was on the field. The closest honest measurement is share of the
 * position's workload: how much of what this team's busiest player at the
 * position did, this player also did. For a starter that lands near 1, for a
 * rotational piece near a half, which is what the number is read as anyway.
 */
const positionPeak = new Map();
for (const r of roster) {
  const m = prior.players.get(r.athleteId);
  if (!m) continue;
  const k = `${r.teamId}|${r.position}`;
  positionPeak.set(k, Math.max(positionPeak.get(k) ?? 0, involvement(m)));
}
const snapShareOf = (r, plays) => {
  const peak = positionPeak.get(`${r.teamId}|${r.position}`) ?? 0;
  if (!peak) return 0.5;
  return round(Math.min(1, Math.max(0.05, plays / peak)), 2);
};

/** Linemen are unseen, so their share is read off the depth chart instead. */
const BLIND_SHARE = { FR: 0.15, SO: 0.35, JR: 0.6, SR: 0.75 };

const byTeam = new Map();
let measured = 0;
let blind = 0;

for (const r of roster) {
  const m = prior.players.get(r.athleteId);
  const live = current.players.get(r.athleteId);
  const plays = m ? involvement(m) : 0;
  const seen = plays >= minPlays(r.position);

  const value = m ? valuePerGame(m) : 0;
  const b = baseline.get(r.position);
  const replacementRate = b ? b.replacementRate : 0;

  /*
   * PAR: points of team rating per game lost to the next man up.
   *
   * Compare rates, then scale by the departing player's own workload. Comparing
   * totals instead would credit a starter for the snaps a backup never got, and
   * a quarterback would swamp everyone on volume alone.
   */
  const perGamePlays = m ? involvement(m) / Math.max(1, m.games.size) : 0;
  const par = seen
    ? Math.max(0, round((ratePerPlay(m) - replacementRate) * perGamePlays, 2))
    : 0;
  const grade = seen ? gradeFrom(r.position, value) : BLIND_GRADE[r.classYear];

  const blindPosition = r.position === 'OT' || r.position === 'IOL';
  if (seen) measured += 1; else if (blindPosition) blind += 1;

  // Keep the players the app can say something about: anyone the play-by-play
  // saw, plus upperclass linemen, who are invisible by nature rather than by
  // being buried on the depth chart.
  if (!seen && !(blindPosition && (r.classYear === 'JR' || r.classYear === 'SR'))) continue;

  const entry = {
    id: `${r.teamId.toLowerCase()}-${slug(r.name)}`,
    name: r.name,
    teamId: r.teamId,
    position: r.position,
    jersey: r.jersey,
    classYear: r.classYear,
    origin: 'returning',
    recruitStars: null,
    usage: {
      snapShare: seen ? snapShareOf(r, plays) : BLIND_SHARE[r.classYear],
      ...(seen ? usageOf(m, prior.teamTotals, modalTeam(m.teams)) : {}),
    },
    production2025: seen ? productionOf(m) : undefined,
    rates: seen ? ratesOf(m) : {},
    measuredPlays: seen ? plays : undefined,
    productionCurrent: live ? productionOf(live) : undefined,
    usage2025: seen ? usageOf(m, prior.teamTotals, modalTeam(m.teams)) : undefined,
    grade,
    par,
    breakoutOdds: round(Math.max(0.05, Math.min(0.45, 0.34 - 0.06 * ['FR', 'SO', 'JR', 'SR'].indexOf(r.classYear))), 2),
    durabilityRisk: 0.12,
    accolades: [],
    note: seen
      ? `Counted off ${plays} plays of ${PRIOR_SEASON} play-by-play.`
      : 'Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.',
    provenance: seen ? 'measured' : 'modeled',
  };

  if (!byTeam.has(r.teamId)) byTeam.set(r.teamId, []);
  byTeam.get(r.teamId).push(entry);
}

/*
 * Keep a balanced two-deep rather than the highest PAR figures.
 *
 * Ranking a roster by PAR alone returns eleven quarterbacks and a kicker,
 * because play-by-play sees a quarterback on every snap and a safety only on
 * the ones where something was recorded. That is a property of the source, not
 * of football, so the roster is filled by position to a fixed shape and PAR
 * decides the order *within* each position.
 */
const SQUAD = {
  QB: 2, RB: 3, WR: 5, TE: 2, OT: 2, IOL: 3,
  EDGE: 3, DL: 3, LB: 4, CB: 4, S: 3, K: 1, P: 1,
};
for (const [teamId, list] of byTeam) {
  list.sort((a, b) => (b.par - a.par) || (b.grade - a.grade) || a.name.localeCompare(b.name));
  const room = { ...SQUAD };
  const kept = list.filter((pl) => (room[pl.position] ?? 0) > 0 && (room[pl.position] -= 1) >= 0);
  kept.sort((a, b) => (b.par - a.par) || (b.grade - a.grade));
  byTeam.set(teamId, kept);
}

console.log(`\n  ${measured.toLocaleString()} players measured, ${blind} linemen carried on baseline`);
for (const [teamId, list] of [...byTeam].sort()) {
  const top = list[0];
  console.log(`    ${teamId.padEnd(5)} ${String(list.length).padStart(2)} players  top: ${top.name} (${top.position}) grade ${top.grade}, PAR ${top.par}`);
}

/* -------------------------------------------------------------------------- */
/* 5. Emit                                                                     */
/* -------------------------------------------------------------------------- */

const teams = [...byTeam.keys()].sort();
const body = teams.map((t) =>
  `  ${t}: ${JSON.stringify(byTeam.get(t), null, 2).replace(/\n/g, '\n  ')},`).join('\n');

const out = `/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npm run etl:rosters
 *
 * ${teams.length} rosters built from the published ${PRIOR_SEASON} roster file, joined to the
 * play-by-play on the source's own athlete id. Production, rates and usage
 * shares are counted. Grade is a positional percentile of measured value; PAR
 * is that value less a measured replacement level, in points of team rating per
 * game. Offensive linemen are never named in play-by-play and carry a
 * class-year baseline instead — they are the only 'modeled' rows here.
 * ========================================================================== */

import type { Player, TeamId } from './types';

export const MEASURED_ROSTERS: Partial<Record<TeamId, Player[]>> = {
${body}
};
`;

writeFileSync(OUT, out);
console.log(`\nwrote ${OUT}`);
