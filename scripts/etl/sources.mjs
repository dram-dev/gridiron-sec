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
};

/** ESPN team id → app team id, for the sixteen SEC programs. */
export const SEC_TEAM_IDS = {
  333: 'ALA', 8: 'ARK', 2: 'AUB', 57: 'FLA', 61: 'UGA', 96: 'UK', 99: 'LSU',
  145: 'MISS', 344: 'MSST', 142: 'MIZ', 201: 'OU', 2579: 'SC', 2633: 'TENN',
  251: 'TEX', 245: 'TAM', 238: 'VAN',
};
