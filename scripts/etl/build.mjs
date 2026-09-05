/* ============================================================================
 * Build src/data/measured.ts from the 2025 play-by-play.
 *
 *   node scripts/etl/build.mjs [--data <dir>] [--out <file>]
 *
 * Every number this writes is counted off a real play. Nothing here is an
 * estimate, a prior or a nudge — the pipeline reads 165,849 plays, folds them
 * into per-game observations, removes the schedule with an additive opponent
 * adjustment, and prints the result.
 * ========================================================================== */

import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { fitEffects, selectLambda } from './adjust.mjs';
import { SOURCES, SEC_TEAM_IDS, PRIOR_SEASON, PROJECTION_SEASON } from './sources.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const DATA = resolve(arg('--data', join(here, '../../.data')));
const OUT = resolve(arg('--out', join(here, '../../src/data/measured.ts')));

const num = (v) => (v == null ? null : Number(v));
const read = async (key, columns) => {
  const path = join(DATA, SOURCES[key].file);
  if (!existsSync(path)) {
    throw new Error(`missing ${path}\n  fetch it first:  node scripts/etl/fetch.mjs`);
  }
  return parquetReadObjects({ file: await asyncBufferFromFile(path), compressors, ...(columns ? { columns } : {}) });
};

/* -------------------------------------------------------------------------- */
/* 1. Read the plays                                                          */
/* -------------------------------------------------------------------------- */

const PLAY_COLUMNS = [
  'game_id', 'week', 'seasonType', 'game_play_number', 'pos_team_id', 'def_pos_team_id',
  'scrimmage_play', 'sp', 'kneel_down', 'down', 'period', 'start.TimeSecsRem',
  'pos_score_diff_start', 'rush', 'pass', 'sack', 'havoc', 'line_yards',
  'EPA', 'EPA_success', 'EPA_sp', 'pos_score_pts', 'scoring_opp', 'rz_play', 'drive.id',
  'start.yardsToEndzone', 'is_turnover', 'turnover_team', 'xpass', 'pass_oe', 'punt', 'fg_attempt',
  'homeTeamId', 'awayTeamId', 'end.homeScore', 'end.awayScore',
];

console.log(`reading ${SOURCES.pbp.file} …`);
const plays = await read('pbp', PLAY_COLUMNS);
console.log(`  ${plays.length.toLocaleString()} plays`);

/**
 * No garbage-time filter — and that is a measured decision, not an oversight.
 *
 * The conventional move is to drop plays once a game is decided, on the theory
 * that backups stop describing the team. scripts/etl/validate.mjs tests that
 * directly, by asking which cut produces ratings that best predict the margin
 * of games they were not fit on. Every cut made it worse, monotonically:
 *
 *     no cut          R² 0.392        win prob 10–90%   R² 0.194
 *     win prob 1–99%  R² 0.307        win prob 20–80%   R² 0.104
 *
 * Two reasons, both real. A blowout is evidence — a team capable of one is
 * better than a team that grinds out the same win. And conditioning on "still
 * competitive" selects each team's better moments, most severely for the worst
 * teams, which flattens exactly the differences the rating exists to find.
 */

/* -------------------------------------------------------------------------- */
/* 2. Fold plays into one record per (game, offense)                          */
/* -------------------------------------------------------------------------- */

const blank = () => ({
  plays: 0, epa: 0, successes: 0, successEpa: 0,
  rushes: 0, lineYards: 0, lineYardsN: 0,
  dropbacks: 0, sacks: 0, havocs: 0,
  allPlays: 0, neutral: 0, neutralPass: 0, passOe: 0, passOeN: 0,
  fourthGo: 0, fourthDecisions: 0, tempo: 0, tempoN: 0,
  giveaways: 0, stFor: 0, stAgainst: 0,
  drives: new Map(),
});

/** @type {Map<string, ReturnType<typeof blank>>} */
const units = new Map();
/** @type {Map<string, Set<string>>} */
const gameTeams = new Map();
const key = (game, team) => `${game}|${team}`;
const unit = (game, team) => {
  const k = key(game, team);
  let u = units.get(k);
  if (!u) units.set(k, (u = blank()));
  if (!gameTeams.has(game)) gameTeams.set(game, new Set());
  gameTeams.get(game).add(String(team));
  return u;
};

const ordered = plays.slice().sort(
  (a, b) => Number(a.game_id - b.game_id) || Number(a.game_play_number - b.game_play_number),
);

/** Final scores, read off the last play of each game. */
/** @type {Map<string, {home:string, away:string, hs:number, as:number, n:number, conference:boolean}>} */
const finals = new Map();
for (const p of plays) {
  const g = String(p.game_id);
  const n = num(p.game_play_number) ?? 0;
  const cur = finals.get(g);
  if (cur && n <= cur.n) continue;
  const home = String(p.homeTeamId);
  const away = String(p.awayTeamId);
  finals.set(g, {
    home, away, n,
    hs: num(p['end.homeScore']) ?? 0,
    as: num(p['end.awayScore']) ?? 0,
    // A conference game is two SEC teams in the regular season; the title game
    // is postseason and does not count toward a conference record.
    conference: home in SEC_TEAM_IDS && away in SEC_TEAM_IDS && num(p.seasonType) === 2,
  });
}

/** @type {Map<string, {clock: number|null}>} */
const lastSnap = new Map();

for (const p of ordered) {
  const game = String(p.game_id);
  const off = String(p.pos_team_id);
  const def = String(p.def_pos_team_id);
  if (off === 'null' || def === 'null') continue;

  // Special teams are credited net: value gained on your own kicks and returns,
  // minus value the opponent gained on theirs.
  if (p.sp === true && p.EPA_sp != null) {
    unit(game, off).stFor += p.EPA_sp;
    unit(game, def).stAgainst += p.EPA_sp;
  }
  if (p.is_turnover === true && p.turnover_team != null) {
    unit(game, String(p.turnover_team)).giveaways += 1;
  }
  if (p.scrimmage_play !== true || p.kneel_down === true) continue;

  const u = unit(game, off);
  unit(game, def); // make sure the defence exists even in a shutout-of-a-game edge case
  u.allPlays += 1;

  const down = num(p.down);
  const clock = num(p['start.TimeSecsRem']);
  const period = num(p.period);
  const margin = num(p.pos_score_diff_start) ?? 0;

  // Tempo: game-clock burned between consecutive snaps of the same drive.
  // Clamped to drop timeouts, reviews, injuries and the half boundary.
  const driveId = String(p['drive.id']);
  const prev = lastSnap.get(`${game}|${driveId}`);
  if (prev != null && clock != null && prev - clock >= 5 && prev - clock <= 45) {
    u.tempo += prev - clock;
    u.tempoN += 1;
  }
  if (clock != null) lastSnap.set(`${game}|${driveId}`, clock);

  // Fourth-down aggression, over decisions a coach actually got to make:
  // a one-score-ish game, out of the two-minute drills, out of overtime.
  if (down === 4 && period != null && period <= 4 && Math.abs(margin) <= 16 && (clock ?? 999) > 120) {
    const went = (p.rush === true || p.pass === true || p.sack === true) && p.punt !== true && p.fg_attempt !== true;
    if (went || p.punt === true || p.fg_attempt === true) {
      u.fourthDecisions += 1;
      if (went) u.fourthGo += 1;
    }
  }

  // Drive-level rollup, for finishing and red-zone conversion.
  let d = u.drives.get(driveId);
  if (!d) u.drives.set(driveId, (d = { points: 0, scoringOpp: false, redZone: false, startYards: null }));
  d.points += num(p.pos_score_pts) ?? 0;
  d.scoringOpp ||= p.scoring_opp === true;
  d.redZone ||= p.rz_play === true;
  if (d.startYards == null) d.startYards = num(p['start.yardsToEndzone']);

  u.plays += 1;
  if (p.EPA != null) u.epa += p.EPA;
  if (p.EPA_success === true) {
    u.successes += 1;
    if (p.EPA != null) u.successEpa += p.EPA;
  }
  if (p.havoc === true) u.havocs += 1;
  if (p.rush === true) {
    u.rushes += 1;
    if (p.line_yards != null) { u.lineYards += Number(p.line_yards); u.lineYardsN += 1; }
  }
  if (p.pass === true || p.sack === true) {
    u.dropbacks += 1;
    if (p.sack === true) u.sacks += 1;
  }
  if (p.pass_oe != null) { u.passOe += Number(p.pass_oe); u.passOeN += 1; }
  // "Neutral" pass rate: early downs, game within one score.
  if (down != null && down <= 2 && Math.abs(margin) <= 8) {
    u.neutral += 1;
    if (p.pass === true || p.sack === true) u.neutralPass += 1;
  }
}

const games = [...gameTeams.entries()].filter(([, s]) => s.size === 2);
console.log(`  ${games.length.toLocaleString()} games with both sides present`);

/* -------------------------------------------------------------------------- */
/* 3. Opponent-adjust the quality metrics                                     */
/* -------------------------------------------------------------------------- */

/**
 * Each entry turns one game's offensive record into a rate and a weight. The
 * weight is the denominator that rate was measured over, so a 12-carry game
 * moves line yards less than a 40-carry game.
 */
const METRICS = {
  epa:        { rate: (u) => u.epa / u.plays,                  weight: (u) => u.plays },
  success:    { rate: (u) => u.successes / u.plays,            weight: (u) => u.plays },
  successEpa: { rate: (u) => u.successEpa / u.successes,       weight: (u) => u.successes },
  lineYards:  { rate: (u) => u.lineYards / u.lineYardsN,       weight: (u) => u.lineYardsN },
  sackRate:   { rate: (u) => u.sacks / u.dropbacks,            weight: (u) => u.dropbacks },
  havoc:      { rate: (u) => u.havocs / u.plays,               weight: (u) => u.plays },
  finishing:  { rate: (u) => driveRate(u, 'scoringOpp', 'points'), weight: (u) => driveCount(u, 'scoringOpp') },
  redZoneTd:  { rate: (u) => driveRate(u, 'redZone', 'td'),    weight: (u) => driveCount(u, 'redZone') },
};

function driveCount(u, flag) {
  let n = 0;
  for (const d of u.drives.values()) if (d[flag]) n += 1;
  return n;
}
function driveRate(u, flag, field) {
  let n = 0;
  let total = 0;
  for (const d of u.drives.values()) {
    if (!d[flag]) continue;
    n += 1;
    total += field === 'td' ? (d.points >= 6 ? 1 : 0) : d.points;
  }
  return n > 0 ? total / n : 0;
}

const LAMBDA_GRID = [25, 50, 100, 200, 400, 800, 1600];
/** @type {Record<string, ReturnType<typeof fitEffects>>} */ const fits = {};
/** @type {Record<string, {lambda:number, error:number}>} */ const tuning = {};

for (const [name, m] of Object.entries(METRICS)) {
  const obs = [];
  for (const [game, teams] of games) {
    const [a, b] = [...teams];
    for (const [off, def] of [[a, b], [b, a]]) {
      const u = units.get(key(game, off));
      if (!u) continue;
      const weight = m.weight(u);
      const value = m.rate(u);
      if (!Number.isFinite(value) || weight <= 0) continue;
      obs.push({ game, off, def, value, weight });
    }
  }
  const picked = selectLambda(obs, LAMBDA_GRID);
  fits[name] = fitEffects(obs, { lambda: picked.lambda });
  tuning[name] = { lambda: picked.lambda, error: picked.error, observations: obs.length };
  console.log(
    `  ${name.padEnd(11)} n=${String(obs.length).padStart(5)}  mu=${fits[name].mu.toFixed(4)}  ` +
    `lambda=${String(picked.lambda).padStart(4)}  cv=${picked.error.toFixed(5)}`,
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Season totals for the metrics an opponent cannot distort                */
/* -------------------------------------------------------------------------- */

/** Style and pace describe the team, not the schedule, so they stay raw. */
const seasonTotals = new Map();
for (const [game, teams] of games) {
  for (const team of teams) {
    const u = units.get(key(game, team));
    if (!u) continue;
    let s = seasonTotals.get(team);
    if (!s) seasonTotals.set(team, (s = { games: 0, allPlays: 0, dropbacks: 0, neutral: 0, neutralPass: 0, passOe: 0, passOeN: 0, fourthGo: 0, fourthDecisions: 0, tempo: 0, tempoN: 0, st: 0, giveaways: 0, takeaways: 0, driveStart: 0, driveStartN: 0 }));
    s.games += 1;
    s.allPlays += u.allPlays;
    s.dropbacks += u.dropbacks;
    s.neutral += u.neutral;
    s.neutralPass += u.neutralPass;
    s.passOe += u.passOe;
    s.passOeN += u.passOeN;
    s.fourthGo += u.fourthGo;
    s.fourthDecisions += u.fourthDecisions;
    s.tempo += u.tempo;
    s.tempoN += u.tempoN;
    s.st += u.stFor - u.stAgainst;
    s.giveaways += u.giveaways;
    const other = [...teams].find((t) => t !== team);
    s.takeaways += units.get(key(game, other))?.giveaways ?? 0;
    for (const d of u.drives.values()) {
      if (d.startYards != null) { s.driveStart += 100 - d.startYards; s.driveStartN += 1; }
    }
  }
}

/** Win-loss and scoring, counted from the same plays every other number came from. */
const recordOf = (espnId) => {
  const r = { wins: 0, losses: 0, confWins: 0, confLosses: 0, pointsFor: 0, pointsAgainst: 0 };
  for (const f of finals.values()) {
    const home = f.home === espnId;
    if (!home && f.away !== espnId) continue;
    const [pf, pa] = home ? [f.hs, f.as] : [f.as, f.hs];
    r.pointsFor += pf;
    r.pointsAgainst += pa;
    if (pf > pa) { r.wins += 1; if (f.conference) r.confWins += 1; }
    else { r.losses += 1; if (f.conference) r.confLosses += 1; }
  }
  return r;
};
const records = {};
for (const [espnId, id] of Object.entries(SEC_TEAM_IDS)) records[id] = recordOf(String(espnId));

/* -------------------------------------------------------------------------- */
/* 5. Returning production and talent, at the projected season's vintage       */
/* -------------------------------------------------------------------------- */

const returning = await read('returning');
const talent = await read('talent');
const byId = (rows) => new Map(rows.map((r) => [String(r.team_id), r]));
const returningById = byId(returning);
const talentById = byId(talent);

/* -------------------------------------------------------------------------- */
/* 6. Emit                                                                     */
/* -------------------------------------------------------------------------- */

const r2 = (v, digits) => {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
};
const pick = (fit, side, team, digits) => r2(fit[side].get(team) ?? fit.mu, digits);

const efficiency = {};
const returningOut = {};
const talentOut = {};
const audit = [];

for (const [espnId, id] of Object.entries(SEC_TEAM_IDS)) {
  const t = String(espnId);
  const s = seasonTotals.get(t);
  if (!s) throw new Error(`no 2025 games found for ${id} (espn ${espnId})`);

  efficiency[id] = {
    offEpa: pick(fits.epa, 'offense', t, 3),
    defEpa: pick(fits.epa, 'defense', t, 3),
    offSuccess: pick(fits.success, 'offense', t, 3),
    defSuccess: pick(fits.success, 'defense', t, 3),
    offExplosive: pick(fits.successEpa, 'offense', t, 3),
    defExplosive: pick(fits.successEpa, 'defense', t, 3),
    finishing: pick(fits.finishing, 'offense', t, 2),
    finishingAllowed: pick(fits.finishing, 'defense', t, 2),
    havoc: pick(fits.havoc, 'defense', t, 3),
    havocAllowed: pick(fits.havoc, 'offense', t, 3),
    lineYards: pick(fits.lineYards, 'offense', t, 2),
    lineYardsAllowed: pick(fits.lineYards, 'defense', t, 2),
    sackRate: pick(fits.sackRate, 'defense', t, 3),
    sackRateAllowed: pick(fits.sackRate, 'offense', t, 3),
    passRate: r2(s.neutralPass / s.neutral, 3),
    dropbackRate: r2(s.dropbacks / s.allPlays, 3),
    proe: r2(s.passOe / s.passOeN / 100, 3),
    playsPerGame: r2(s.allPlays / s.games, 1),
    secondsPerPlay: r2(s.tempo / s.tempoN, 1),
    fourthDownGoRate: r2(s.fourthGo / s.fourthDecisions, 2),
    turnoverMargin: r2((s.takeaways - s.giveaways) / s.games, 2),
    redZoneTdRate: pick(fits.redZoneTd, 'offense', t, 3),
    redZoneTdRateAllowed: pick(fits.redZoneTd, 'defense', t, 3),
    stEpa: r2(s.st / s.games, 2),
    startingFieldPos: r2(s.driveStart / s.driveStartN, 1),
  };

  const rp = returningById.get(t);
  if (!rp) throw new Error(`no ${PROJECTION_SEASON} returning production for ${id}`);
  const off = rp.off_returning ?? 0;
  const def = rp.def_returning ?? 0;
  // The source ships `overall_returning` as a duplicate of the offensive
  // figure, so overall is recomputed here as the mean of the two sides.
  returningOut[id] = { overall: r2((off + def) / 2, 3), offense: r2(off, 3), defense: r2(def, 3) };

  const tl = talentById.get(t);
  if (!tl) throw new Error(`no ${PROJECTION_SEASON} talent for ${id}`);
  talentOut[id] = { blueChipRatio: r2(tl.blue_chip_ratio ?? 0, 3), composite: r2(tl.talent_composite ?? 0, 0) };

  audit.push({
    id, record: `${records[id].wins}-${records[id].losses}`,
    ppg: r2(records[id].pointsFor / s.games, 1),
    offEpa: efficiency[id].offEpa, defEpa: efficiency[id].defEpa,
    net: r2(efficiency[id].offEpa - efficiency[id].defEpa, 3),
  });
}

const meta = {
  priorSeason: PRIOR_SEASON,
  projectionSeason: PROJECTION_SEASON,
  plays: plays.length,
  scrimmagePlays: [...units.values()].reduce((n, u) => n + u.plays, 0),
  games: games.length,
  teams: fits.epa.offense.size,
  builtAt: new Date().toISOString().slice(0, 10),
  /**
   * Out-of-sample R² on game margin, five-fold by game, from
   * scripts/etl/validate.mjs. The raw figure is the same pipeline with the
   * opponent adjustment switched off.
   */
  marginR2: { adjusted: 0.392, raw: 0.251 },
  tuning,
};

const lit = (v) => (typeof v === 'number' ? String(v) : JSON.stringify(v));
const block = (obj, indent) =>
  Object.entries(obj).map(([k, v]) => `${indent}${k}: ${lit(v)},`).join('\n');
const record = (name, type, rows, doc) => `
/** ${doc} */
export const ${name}: Record<TeamId, ${type}> = {
${Object.entries(rows).map(([id, v]) => `  ${id}: {\n${block(v, '    ')}\n  },`).join('\n')}
};
`;

const out = `/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npm run etl
 *
 * Built from ${meta.plays.toLocaleString()} plays of the ${PRIOR_SEASON} FBS season
 * (${meta.scrimmagePlays.toLocaleString()} of them plays from scrimmage), across ${meta.games.toLocaleString()} games and
 * ${meta.teams} teams, plus ${PROJECTION_SEASON} returning-production and recruiting files.
 *
 * Quality metrics are opponent-adjusted: each is fit as \`mu + offence − defence\`
 * over every FBS game in the season, ridge-regularised, with the ridge weight
 * chosen per metric by five-fold cross-validation on held-out games. Pace and
 * style metrics (tempo, pass rate, fourth-down aggression, special teams, field
 * position, turnover margin) are season rates, left unadjusted on purpose.
 *
 * Sources, pinned in scripts/etl/sources.mjs:
${Object.values(SOURCES).map((s) => ` *   ${s.file}\n *     ${s.what}`).join('\n')}
 * ========================================================================== */

import type { EfficiencyProfile, SeasonRecord, TeamId } from './types';

export interface MeasuredReturning {
  overall: number;
  offense: number;
  defense: number;
}

export interface MeasuredTalent {
  blueChipRatio: number;
  composite: number;
}

/** How the measured layer was built — surfaced in the app's methodology page. */
export const MEASURED_META = ${JSON.stringify(meta, null, 2).replace(/\n/g, '\n')} as const;
${record('MEASURED_EFFICIENCY', 'EfficiencyProfile', efficiency, `Opponent-adjusted ${PRIOR_SEASON} efficiency, one entry per SEC team.`)}${record('MEASURED_RETURNING', 'MeasuredReturning', returningOut, `Share of ${PRIOR_SEASON} production returning to each ${PROJECTION_SEASON} roster.`)}${record('MEASURED_TALENT', 'MeasuredTalent', talentOut, `Four-year weighted recruiting composite at the ${PROJECTION_SEASON} vintage.`)}${record('MEASURED_RECORD', 'SeasonRecord', records, `Actual ${PRIOR_SEASON} results, counted off the play-by-play.`)}`;

writeFileSync(OUT, out);
console.log(`\nwrote ${OUT}`);
console.table(audit.sort((a, b) => b.net - a.net));
