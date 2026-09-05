/* Model constants. Each is a real, defensible quantity rather than a knob —
 * the values are documented in the Methodology view so they can be argued with. */

/** Points scored per team per game by an average FBS offense against an average defense. */
export const LEAGUE_PPG = 27.2;

/** Offensive plays per game for an average FBS team. */
export const LEAGUE_PLAYS = 67.5;

/** Offensive possessions per team per game at league-average tempo. */
export const LEAGUE_DRIVES = 11.6;

/**
 * Standard deviation of (actual margin − projected margin) for a single game.
 * Empirically ~15–17 points in FBS; 15.8 puts one point of spread at roughly
 * 2.5% of win probability near a pick'em, which matches market behaviour.
 */
export const GAME_SIGMA = 15.8;

/**
 * Season-level uncertainty in a team's true strength, applied once per
 * simulated season rather than per game. Without this, simulated win totals
 * are far too tightly clustered — a team that is better than the rating says
 * is better in every game, not independently in each one.
 */
export const TEAM_SIGMA = 3.4;

/** Points of value in coming off a bye week. */
export const REST_BONUS = 0.8;

/** Baseline drive-outcome distribution for a league-average offense. */
export const BASE_DRIVE = {
  td: 0.235,
  fg: 0.145,
  punt: 0.42,
  turnover: 0.185,
  other: 0.015,
} as const;

/** Expected points from a touchdown drive, accounting for extra points and two-point tries. */
export const TD_POINTS = 6.94;
export const FG_POINTS = 3;

/** Probability that a given drive is answered by a defensive or return touchdown. */
export const DEF_TD_RATE = 0.013;

/** Conference championship and playoff structure. */
export const SEC_TITLE_PARTICIPANTS = 2;

/** Win-probability floor/ceiling so nothing ever displays as a certainty. */
export const PROB_FLOOR = 0.001;
export const PROB_CEIL = 0.999;
