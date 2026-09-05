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

export const SOURCES = {
  pbp: {
    file: `play_by_play_${PRIOR_SEASON}.parquet`,
    url: `${BASE}/pbp/parquet/play_by_play_${PRIOR_SEASON}.parquet`,
    what: 'Every play of the 2025 FBS season, with EPA, success, havoc and line yards attached.',
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
