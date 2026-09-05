import type { Game } from './types';
import {
  CONFERENCE_GAMES,
  NON_CONFERENCE,
  NON_CONFERENCE_GAMES,
  WEEKS,
  CHAMPIONSHIPS,
} from './measuredSchedule';

/* ============================================================================
 * 2026 — two conferences, read rather than transcribed.
 *
 * This file used to hold the SEC's seventy-two conference games written out by
 * hand and reconciled against both participants' published schedules. That was
 * accurate and it did not scale: adding the Big Ten would have meant another
 * eighty-one, and every one of them a chance to mistype an opponent.
 *
 * The whole slate now comes from the published schedule file — see
 * scripts/etl/schedule.mjs — which also carries neutral sites, kickoff dates and
 * results as they are played. The generated build re-checks the shape it
 * expects (twelve games, nine in conference, for all thirty-four teams) every
 * time it runs, which is a stronger guarantee than the hand-written list ever
 * had.
 * ========================================================================== */

export { CONFERENCE_GAMES, NON_CONFERENCE, NON_CONFERENCE_GAMES, WEEKS, CHAMPIONSHIPS };

export const NON_CONF_BY_ID = Object.fromEntries(NON_CONFERENCE.map((o) => [o.id, o]));

export const ALL_GAMES: Game[] = [...CONFERENCE_GAMES, ...NON_CONFERENCE_GAMES].sort(
  (a, b) => a.week - b.week || a.id.localeCompare(b.id),
);

export const GAME_BY_ID = Object.fromEntries(ALL_GAMES.map((x) => [x.id, x]));

/** Games already played this season, with a result attached. */
export const PLAYED_GAMES: Game[] = ALL_GAMES.filter((g) => g.completed);
