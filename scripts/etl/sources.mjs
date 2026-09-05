/* ============================================================================
 * Source manifest.
 *
 * Everything the measured layer is built from, pinned to a public mirror of
 * the cfbfastR data release. These are the same files the R package ships;
 * mirroring the URLs here means `npm run etl` reproduces src/data/measured.ts
 * byte for byte on any machine with network access.
 * ========================================================================== */

const BASE = 'https://raw.githubusercontent.com/sportsdataverse/cfbfastR-cfb-data/main/cfb';

/** The completed season the efficiency prior is measured from. */
export const PRIOR_SEASON = 2025;
/** The season being projected — returning production and talent use this vintage. */
export const PROJECTION_SEASON = 2026;

/**
 * How much evidence the preseason projection is worth once the season starts,
 * measured in games. scripts/etl/inseason.mjs fits the trade-off week by week
 * across 2022-2025 — build a rating from last season, build one from the games
 * played so far, and let real margins decide how to weigh them. The answer is
 * strikingly flat: about 2.2 games at every point from week 1 to week 11.
 *
 * Two games. That is all a preseason projection is worth once real ones exist,
 * and it is why this rebuilds every Tuesday rather than standing still.
 */
export const PRIOR_SEASON_GAMES = 2.2;

/** Games in a typical full season, used to spread that weight across one. */
export const SEASON_GAMES = 13;

/**
 * Seasons the back-test walks over. Each season's projection is built from the
 * season before it and scored on results it never saw. Fetch with
 * `node scripts/etl/fetch.mjs --backtest`.
 */
export const BACKTEST_SEASONS = [2021, 2022, 2023, 2024, 2025];

export const SOURCES = {
  pbp: {
    file: `play_by_play_${PRIOR_SEASON}.parquet`,
    url: `${BASE}/pbp/parquet/play_by_play_${PRIOR_SEASON}.parquet`,
    what: 'Every play of the 2025 FBS season, with EPA, success, havoc and line yards attached.',
  },
  current: {
    file: `play_by_play_${PROJECTION_SEASON}.parquet`,
    url: `${BASE}/pbp/parquet/play_by_play_${PROJECTION_SEASON}.parquet`,
    what: 'The season in progress. Empty in August, and the dominant input by October.',
    optional: true,
  },
  returning: {
    file: `cfb_returning_production_${PROJECTION_SEASON}.parquet`,
    url: `${BASE}/cfb_returning_production/parquet/cfb_returning_production_${PROJECTION_SEASON}.parquet`,
    what: 'Share of 2025 production returning to each 2026 roster, by side of the ball.',
  },
  talent: {
    file: `cfb_team_talent_${PROJECTION_SEASON}.parquet`,
    url: `${BASE}/cfb_team_talent/parquet/cfb_team_talent_${PROJECTION_SEASON}.parquet`,
    what: 'Four-year weighted recruiting composite and blue-chip ratio for each 2026 roster.',
  },
  roster: {
    file: `cfb_rosters_${PRIOR_SEASON}.parquet`,
    url: `${BASE}/cfb_rosters/parquet/cfb_rosters_${PRIOR_SEASON}.parquet`,
    what: 'Every rostered FBS player in 2025 with position, jersey and class — carries the same athlete id the play-by-play does.',
  },
  schedulePrior: {
    file: `cfb_schedules_${PRIOR_SEASON}.parquet`,
    url: `${BASE}/cfb_schedules/parquet/cfb_schedules_${PRIOR_SEASON}.parquet`,
    what: 'Every 2025 game with division, conference and neutral-site flags — what tells an FBS opponent from an FCS one.',
  },
  schedule: {
    file: `cfb_schedules_${PROJECTION_SEASON}.parquet`,
    url: `${BASE}/cfb_schedules/parquet/cfb_schedules_${PROJECTION_SEASON}.parquet`,
    what: 'The full 2026 slate for both conferences: opponents, sites, kickoff dates, and results as they are played.',
  },
};

/* -------------------------------------------------------------------------- */
/* The pool                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The two conferences the app projects, ESPN team id → app team id.
 *
 * The opponent adjustment in adjust.mjs has always been fitted over every FBS
 * game, not just these — that is the whole point of removing a schedule. What
 * this map decides is only which teams get written out at the end. Adding the
 * Big Ten therefore changes no SEC number: the same fit, surfaced wider.
 */
export const CONFERENCES = {
  SEC: {
    name: 'SEC',
    /** How the schedule mirror spells it, for joining on conference. */
    sourceName: 'SEC',
    championship: { venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA' },
    teams: {
      333: 'ALA', 8: 'ARK', 2: 'AUB', 57: 'FLA', 61: 'UGA', 96: 'UK', 99: 'LSU',
      145: 'MISS', 344: 'MSST', 142: 'MIZ', 201: 'OU', 2579: 'SC', 2633: 'TENN',
      251: 'TEX', 245: 'TAM', 238: 'VAN',
    },
  },
  B1G: {
    name: 'Big Ten',
    sourceName: 'Big Ten',
    championship: { venue: 'Lucas Oil Stadium', city: 'Indianapolis, IN' },
    teams: {
      356: 'ILL', 84: 'IND', 2294: 'IOWA', 120: 'MD', 130: 'MICH', 127: 'MSU',
      135: 'MINN', 158: 'NEB', 77: 'NW', 194: 'OSU', 2483: 'ORE', 213: 'PSU',
      2509: 'PUR', 164: 'RUT', 26: 'UCLA', 30: 'USC', 264: 'WASH', 275: 'WISC',
    },
  },
};

/** Every projected team, ESPN id → app id. */
export const TEAM_IDS = Object.fromEntries(
  Object.values(CONFERENCES).flatMap((c) => Object.entries(c.teams)),
);

/** App team id → conference key. */
export const CONFERENCE_OF = Object.fromEntries(
  Object.entries(CONFERENCES).flatMap(([key, c]) => Object.values(c.teams).map((id) => [id, key])),
);

/** Kept for the back-test, which walks seasons when the pool was SEC-only. */
export const SEC_TEAM_IDS = CONFERENCES.SEC.teams;
