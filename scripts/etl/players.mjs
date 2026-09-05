/* ============================================================================
 * Build src/data/measuredPlayers.ts from the 2025 play-by-play.
 *
 *   npx vite-node scripts/etl/players.mjs
 *
 * Runs through vite-node so it can import the roster itself and key its output
 * by the app's own player ids. There is no import cycle: this reads players.ts,
 * players.ts reads the file this writes, and that file imports only types.
 *
 * A player is matched to the play-by-play by name, disambiguated by the school
 * they played for in 2025 — their current team if they are returning, the
 * school they came from if they transferred in. Offensive linemen are not
 * matched at all: play-by-play never names them, which is why the team-level
 * line-yards and sack-rate figures carry the whole story of a line.
 * ========================================================================== */

import { writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { AUTHORED_PLAYERS } from '../../src/data/players.ts';
import { TEAM_BY_ID } from '../../src/data/teams.ts';
import { SOURCES, PRIOR_SEASON, PROJECTION_SEASON } from './sources.mjs';
import { n, norm, makeReadPlays, accumulate } from './tally.mjs';
import { existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(join(here, '../../.data'));
const OUT = resolve(join(here, '../../src/data/measuredPlayers.ts'));
const readPlays = makeReadPlays(DATA);



console.log(`reading ${SOURCES.pbp.file} …`);
const priorPlays = await readPlays(SOURCES.pbp.file);
console.log(`  ${priorPlays.length.toLocaleString()} plays`);

/**
 * The season in progress gets its own tally. A player's current line is what
 * anyone actually wants to see in October, and it is also the sample the rate
 * stabilisation should lean on once it is big enough to mean anything.
 */
const currentPlays = existsSync(join(DATA, SOURCES.current.file))
  ? await readPlays(SOURCES.current.file)
  : [];
if (currentPlays.length) console.log(`  ${currentPlays.length.toLocaleString()} plays of ${PROJECTION_SEASON}`);

/* -------------------------------------------------------------------------- */
/* Per-player accumulation, keyed by the source's own player id               */
/* -------------------------------------------------------------------------- */


const prior = accumulate(priorPlays);
const current = accumulate(currentPlays);
console.log(`  ${prior.players.size.toLocaleString()} named players`);
if (currentPlays.length) console.log(`  ${current.players.size.toLocaleString()} named so far this season`);

/* -------------------------------------------------------------------------- */
/* Resolve app roster → source player                                         */
/* -------------------------------------------------------------------------- */

const modalTeam = (teams) =>
  [...teams.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

/**
 * Where a player lined up in a given season. Last season that is the school
 * they came from if they transferred; this season it is simply their own — a
 * transfer is on their new roster now, and matching them to the old one would
 * reject every one of them.
 */
const schoolIn = (player, live) =>
  !live && player.origin === 'transfer' && player.from
    ? player.from
    : TEAM_BY_ID[player.teamId].school;

function resolveRoster({ players, teamTotals }, live) {
const byName = new Map();
for (const [id, p] of players) {
  const k = norm(p.name);
  if (!k) continue;
  (byName.get(k) ?? byName.set(k, []).get(k)).push({ id, ...p, team: modalTeam(p.teams) });
}

const out = {};
const unmatched = [];
let ambiguousResolved = 0;

for (const player of AUTHORED_PLAYERS) {
  const candidates = byName.get(norm(player.name)) ?? [];
  if (!candidates.length) { unmatched.push(player); continue; }

  // The school must agree, even when the name is unique. Two players share a
  // name more often than you would guess, and a silent mismatch attaches one
  // man's season to another — a worse outcome than no measurement at all. The
  // source names teams as "Georgia Bulldogs"; the roster says "Georgia".
  const want = schoolIn(player, live).toLowerCase();
  const onTeam = candidates.filter((c) => c.team && c.team.toLowerCase().startsWith(want));
  if (onTeam.length !== 1) { unmatched.push(player); continue; }
  if (candidates.length > 1) ambiguousResolved += 1;
  const match = onTeam[0];

  const games = match.games.size;
  const production = { games };
  const rates = {};
  const usage = {};
  const team = teamTotals.get(match.team);

  if (match.attempts > 0) {
    Object.assign(production, {
      attempts: match.attempts, completions: match.completions,
      passYds: match.passYds, passTd: match.passTd, interceptions: match.ints,
    });
    rates.ypa = round(match.passYds / match.attempts, 1);
    if (team?.attempts) usage.passAttemptShare = round(match.attempts / team.attempts, 3);
  }
  if (match.carries > 0) {
    Object.assign(production, { carries: match.carries, rushYds: match.rushYds, rushTd: match.rushTd });
    rates.ypc = round(match.rushYds / match.carries, 1);
    if (team?.carries) usage.carryShare = round(match.carries / team.carries, 3);
  }
  if (match.targets > 0) {
    Object.assign(production, {
      targets: match.targets, receptions: match.receptions,
      recYds: match.recYds, recTd: match.recTd,
    });
    rates.ypt = round(match.recYds / match.targets, 1);
    if (team?.targets) usage.targetShare = round(match.targets / team.targets, 3);
  }
  if (match.fgAttempts > 0) {
    Object.assign(production, {
      fgAttempts: match.fgAttempts, fgMade: match.fgMade, fgLong: match.fgLong,
    });
  }
  if (match.punts > 0) {
    Object.assign(production, {
      punts: match.punts, puntAvg: round(match.puntYards / match.punts, 1),
    });
  }
  if (match.sacks || match.interceptions || match.passBreakups) {
    Object.assign(production, {
      sacks: match.sacks || undefined,
      takeaways: (match.interceptions + match.forcedFumbles) || undefined,
      passBreakups: match.passBreakups || undefined,
    });
  }

  // EPA per play across everything this player was directly involved in, and
  // the explosive rate over the touches that could produce one.
  const involved = match.dropbacks + match.carries + match.targets + match.fgAttempts + match.punts;
  const epa = match.passEpa + match.rushEpa + match.recEpa;
  if (involved > 0) rates.epaPerPlay = round(epa / involved, 3);
  const touches = match.carries + match.targets;
  if (touches > 0) rates.explosiveRate = round((match.rushExplosive + match.recExplosive) / touches, 3);

  out[player.id] = {
    school2025: match.team ?? schoolIn(player, live),
    plays: involved,
    production: prune(production),
    rates: prune(rates),
    usage: prune(usage),
  };
}

function round(v, d) { const f = 10 ** d; return Number.isFinite(v) ? Math.round(v * f) / f : 0; }
/** Only absent values are dropped; a measured zero is a real observation. */
function prune(o) { return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)); }

return { out, unmatched, ambiguousResolved };
}

const priorResolved = resolveRoster(prior, false);
const currentResolved = currentPlays.length ? resolveRoster(current, true) : { out: {}, unmatched: [], ambiguousResolved: 0 };
const out = priorResolved.out;
const unmatched = priorResolved.unmatched;
const ambiguousResolved = priorResolved.ambiguousResolved;

const matched = Object.keys(out).length;
console.log(`  matched ${matched}/${AUTHORED_PLAYERS.length} roster players (${ambiguousResolved} by school)`);
const byPos = {};
for (const p of AUTHORED_PLAYERS) {
  const g = byPos[p.position] ??= { n: 0, hit: 0 };
  g.n += 1;
  if (out[p.id]) g.hit += 1;
}
console.log('  ' + Object.entries(byPos).map(([k, v]) => `${k} ${v.hit}/${v.n}`).join('  '));

/* -------------------------------------------------------------------------- */
/* Emit                                                                        */
/* -------------------------------------------------------------------------- */

const lit = (v) => (typeof v === 'number' ? String(v) : JSON.stringify(v));
const obj = (o, indent) =>
  Object.keys(o).length === 0 ? '{}' :
    `{ ${Object.entries(o).map(([k, v]) => `${k}: ${lit(v)}`).join(', ')} }`;

const emit = (rows) => Object.entries(rows).sort(([a], [b]) => a.localeCompare(b)).map(([id, m]) => `  ${JSON.stringify(id)}: {
    school2025: ${JSON.stringify(m.school2025)},
    plays: ${m.plays},
    production: ${obj(m.production)},
    rates: ${obj(m.rates)},
    usage: ${obj(m.usage)},
  },`).join('\n');
const body = emit(out);
const currentBody = emit(currentResolved.out);

writeFileSync(OUT, `/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npx vite-node scripts/etl/players.mjs
 *
 * Every ${PRIOR_SEASON} snap a rostered player was directly involved in, counted off the
 * play-by-play: carries, targets, dropbacks, the EPA on those plays, and the
 * share of the team's usage they took. ${matched} of ${AUTHORED_PLAYERS.length} rostered players are
 * matched. Transfers carry the production they earned at the school they left.
 *
 * Offensive linemen are absent by construction — play-by-play never names them.
 * A line's work shows up in its team's line yards and sack rate instead.
 * ========================================================================== */

import type { PlayerProduction, PlayerRates, PlayerUsage } from './types';

export interface MeasuredPlayer {
  /** The school this player actually played for in ${PRIOR_SEASON}. */
  school2025: string;
  /** Plays the player was directly involved in — the sample behind the rates. */
  plays: number;
  production: PlayerProduction;
  rates: PlayerRates;
  usage: Partial<PlayerUsage>;
}

export const MEASURED_PLAYERS: Record<string, MeasuredPlayer> = {
${body}
};

/**
 * The same count over the season in progress. Empty until it starts, and the
 * line worth showing once it is not — nobody wants last November's stat line in
 * October. Transfers are matched to their new school here, not the old one.
 */
export const MEASURED_PLAYERS_CURRENT: Record<string, MeasuredPlayer> = {
${currentBody}
};
`);
console.log(`\nwrote ${OUT}`);
if (currentPlays.length) {
  console.log(`  ${Object.keys(currentResolved.out).length} players with ${PROJECTION_SEASON} production so far`);
}
console.log('unmatched:', unmatched.map((p) => `${p.name} (${p.position})`).join(', ').slice(0, 600));
