/* ============================================================================
 * Build src/data/measuredSchedule.ts from the published 2026 schedule.
 *
 *   npx vite-node scripts/etl/schedule.mjs
 *
 * The SEC slate used to be authored by hand and reconciled across both
 * participants' published schedules — accurate, but seventy-two games of typing
 * that could not survive a second conference. The mirror ships the whole thing:
 * every game, both conferences, with sites, dates, neutral-site flags and
 * results as they are played.
 *
 * Non-conference opponents come with a measured rating rather than an authored
 * one. They are on the projection's own scale — points of scoring margin
 * against an average FBS team — so an opponent in September and one in November
 * can be compared without a conversion.
 * ========================================================================== */

import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { SOURCES, TEAM_IDS, CONFERENCES, CONFERENCE_OF, PROJECTION_SEASON } from './sources.mjs';
import { MEASURED_OPPONENT } from '../../src/data/measured.ts';

const here = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(join(here, '../../.data'));
const OUT = resolve(join(here, '../../src/data/measuredSchedule.ts'));
const num = (v) => (v == null ? null : Number(v));

const file = join(DATA, SOURCES.schedule.file);
if (!existsSync(file)) throw new Error(`missing ${file}\n  fetch it first: npm run etl:fetch`);
const rows = await parquetReadObjects({ file: await asyncBufferFromFile(file), compressors });
console.log(`reading ${SOURCES.schedule.file} … ${rows.length.toLocaleString()} games`);

/* -------------------------------------------------------------------------- */
/* 1. Everything our 34 teams play                                             */
/* -------------------------------------------------------------------------- */

/** Outside opponents keep their numeric source id: unique, and never guessed. */
const outsideId = (espn) => `x${espn}`;

/**
 * A short label for an outside opponent.
 *
 * The id is a source number, which is the right thing to key on and the wrong
 * thing to show a reader — a schedule that reads "@x2050" tells nobody who the
 * opponent was. Prefer the abbreviation the source publishes, and fall back to
 * initials for a multi-word name or a truncation for a single-word one.
 */
function abbreviate(sourceAbbr, name) {
  if (sourceAbbr && sourceAbbr.length <= 5 && sourceAbbr !== '-') return sourceAbbr.toUpperCase();
  const words = String(name).replace(/[()]/g, '').split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.map((w) => w[0]).join('').slice(0, 4).toUpperCase();
  return String(name).slice(0, 4).toUpperCase();
}

const games = [];
const outside = new Map();

for (const g of rows) {
  if (g.season_type !== 'regular') continue;
  const home = String(num(g.home_id));
  const away = String(num(g.away_id));
  const homeTeam = TEAM_IDS[home];
  const awayTeam = TEAM_IDS[away];
  if (!homeTeam && !awayTeam) continue;

  for (const [espn, mine] of [[home, homeTeam], [away, awayTeam]]) {
    if (mine || outside.has(espn)) continue;
    const side = espn === home ? 'home' : 'away';
    const measured = MEASURED_OPPONENT[espn];
    const name = g[`${side}_team`] ?? measured?.name ?? `Team ${espn}`;
    outside.set(espn, {
      id: outsideId(espn),
      abbr: abbreviate(g[`${side}_abbreviation`], name),
      name,
      conference: g[`${side}_conference`] ?? measured?.conference ?? 'FBS',
      // An FCS visitor has no rating of its own; the pooled FCS effect is what
      // the fit actually measured, and it is the honest figure to use.
      rating: measured?.rating ?? MEASURED_OPPONENT.FCS.rating,
      fbs: g[`${side}_division`] === 'fbs',
    });
  }

  const conferenceGame =
    !!homeTeam && !!awayTeam && CONFERENCE_OF[homeTeam] === CONFERENCE_OF[awayTeam];

  const game = {
    id: String(num(g.game_id)),
    week: num(g.week),
    date: String(g.start_date ?? '').slice(0, 10),
    homeId: homeTeam ?? outsideId(home),
    awayId: awayTeam ?? outsideId(away),
    conferenceGame,
  };
  if (g.neutral_site === true) game.neutralSite = g.venue ?? 'Neutral site';
  if (g.completed === true && g.home_points != null) {
    game.completed = true;
    game.homePoints = num(g.home_points);
    game.awayPoints = num(g.away_points);
  }
  games.push(game);
}

games.sort((a, b) => a.week - b.week || a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

const conferenceGames = games.filter((g) => g.conferenceGame);
const nonConferenceGames = games.filter((g) => !g.conferenceGame);
console.log(`  ${games.length} games — ${conferenceGames.length} conference, ${nonConferenceGames.length} non-conference`);
console.log(`  ${outside.size} outside opponents`);

/* -------------------------------------------------------------------------- */
/* 2. Check what the source gave us before trusting it                         */
/* -------------------------------------------------------------------------- */

const perTeam = new Map();
for (const g of games) {
  for (const id of [g.homeId, g.awayId]) {
    if (!TEAM_IDS[Object.keys(TEAM_IDS).find((k) => TEAM_IDS[k] === id)] && !CONFERENCE_OF[id]) continue;
    const t = perTeam.get(id) ?? { total: 0, conference: 0 };
    t.total += 1;
    if (g.conferenceGame) t.conference += 1;
    perTeam.set(id, t);
  }
}
const problems = [];
for (const [conf, meta] of Object.entries(CONFERENCES)) {
  for (const id of Object.values(meta.teams)) {
    const t = perTeam.get(id) ?? { total: 0, conference: 0 };
    if (t.conference !== 9 || t.total !== 12) {
      problems.push(`${id} (${conf}): ${t.total} games, ${t.conference} in conference`);
    }
  }
}
if (problems.length) {
  console.log(`\n  schedule shape differs from the expected 12 games / 9 conference:`);
  for (const p of problems) console.log(`    ${p}`);
} else {
  console.log('  every team: 12 games, 9 in conference');
}

const completed = games.filter((g) => g.completed).length;
console.log(`  ${completed} games already played`);

/* -------------------------------------------------------------------------- */
/* 3. Weeks                                                                    */
/* -------------------------------------------------------------------------- */

const weekDates = new Map();
for (const g of games) {
  const cur = weekDates.get(g.week);
  if (!cur || g.date < cur) weekDates.set(g.week, g.date);
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeks = [...weekDates].sort((a, b) => a[0] - b[0]).map(([week, date]) => {
  const [, m, d] = date.split('-');
  return { week, date, label: `${MONTHS[Number(m) - 1]} ${Number(d)}` };
});

/* -------------------------------------------------------------------------- */
/* 4. Emit                                                                     */
/* -------------------------------------------------------------------------- */

const opponents = [...outside.values()].sort((a, b) => b.rating - a.rating);
const j = (v) => JSON.stringify(v, null, 2).replace(/\n/g, '\n');

const out = `/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npm run etl:schedule
 *
 * The ${PROJECTION_SEASON} slate for all ${Object.values(CONFERENCES).reduce((t, c) => t + Object.keys(c.teams).length, 0)} projected teams, read from the published
 * schedule rather than transcribed: ${games.length} games, ${conferenceGames.length} of them inside a
 * conference, against ${opponents.length} opponents from outside the two.
 *
 * Outside opponents carry a measured rating — scoring margin against an average
 * FBS team, from the same fit that produces the conference anchors — so they sit
 * on the projection's own scale instead of a separate authored one.
 * ========================================================================== */

import type { Game, NonConferenceOpponent, WeekMeta } from './types';

export const WEEKS: WeekMeta[] = ${j(weeks)};

export const CHAMPIONSHIPS = ${j(Object.fromEntries(
  Object.entries(CONFERENCES).map(([k, c]) => [k, c.championship]),
))} as const;

/** Opponents from outside the two conferences, on the projection's own scale. */
export const NON_CONFERENCE: NonConferenceOpponent[] = ${j(opponents.map(({ fbs, ...o }) => o))};

export const CONFERENCE_GAMES: Game[] = ${j(conferenceGames)};

export const NON_CONFERENCE_GAMES: Game[] = ${j(nonConferenceGames)};
`;

writeFileSync(OUT, out);
console.log(`\nwrote ${OUT}`);
