import type { Availability, TeamId } from '../data/types';

/* ============================================================================
 * A scenario is a set of overrides layered on top of the baseline dataset.
 * Nothing in the engine mutates the data; every projection takes a scenario
 * and derives from it, which is what makes the baseline-vs-scenario diff
 * shown across the app trustworthy.
 * ========================================================================== */

export interface TeamOverride {
  /** Points added to the offensive rating. */
  offense: number;
  /** Points added to the defensive rating. */
  defense: number;
  /** Multiplier on plays per game. 1 = unchanged. */
  pace: number;
  /**
   * Turnover-luck dial in points per game. 2025 turnover margins regress hard;
   * this exists so you can ask what happens if they do not.
   */
  turnoverLuck: number;
}

export interface Weather {
  /** 'clear' leaves the game model untouched. */
  kind: 'clear' | 'rain' | 'wind' | 'cold' | 'extreme';
  label: string;
  /** Multiplier on total points. */
  scoring: number;
  /** Multiplier applied to the passing-driven share of a team's edge. */
  passing: number;
  /** Additional margin volatility. */
  variance: number;
}

export const WEATHER_PRESETS: Weather[] = [
  { kind: 'clear', label: 'Clear', scoring: 1, passing: 1, variance: 1 },
  { kind: 'rain', label: 'Heavy rain', scoring: 0.9, passing: 0.86, variance: 1.08 },
  { kind: 'wind', label: 'High wind', scoring: 0.87, passing: 0.8, variance: 1.12 },
  { kind: 'cold', label: 'Hard freeze', scoring: 0.93, passing: 0.9, variance: 1.05 },
  { kind: 'extreme', label: 'Severe conditions', scoring: 0.8, passing: 0.72, variance: 1.2 },
];

export interface Scenario {
  /** Player availability overrides, keyed by player id. */
  players: Record<string, Availability>;
  /** Per-team dial overrides. */
  teams: Partial<Record<TeamId, Partial<TeamOverride>>>;
  /** Global multiplier on home-field advantage. 0 makes every game neutral. */
  homeFieldMultiplier: number;
  /** Weather applied to the matchup view. */
  weather: Weather;
  /**
   * Forced results for specific games, used for conditional season odds:
   * "if Georgia loses in Tuscaloosa, what happens to everyone else?"
   */
  forcedResults: Record<string, 'home' | 'away'>;
  /** Simulation seed. Changing it reshuffles noise without changing the model. */
  seed: number;
  /** Monte Carlo iterations for the season simulation. */
  iterations: number;
}

export const EMPTY_TEAM_OVERRIDE: TeamOverride = {
  offense: 0,
  defense: 0,
  pace: 1,
  turnoverLuck: 0,
};

export function makeBaselineScenario(): Scenario {
  return {
    players: {},
    teams: {},
    homeFieldMultiplier: 1,
    weather: WEATHER_PRESETS[0],
    forcedResults: {},
    seed: 20260905,
    iterations: 8000,
  };
}

export function teamOverride(s: Scenario, teamId: TeamId): TeamOverride {
  return { ...EMPTY_TEAM_OVERRIDE, ...(s.teams[teamId] ?? {}) };
}

/** How many distinct edits are active — drives the "scenario is live" affordance. */
export function scenarioEditCount(s: Scenario): number {
  let n = 0;
  n += Object.values(s.players).filter((v) => v !== 'active').length;
  for (const t of Object.values(s.teams)) {
    if (!t) continue;
    if (t.offense) n++;
    if (t.defense) n++;
    if (t.pace !== undefined && t.pace !== 1) n++;
    if (t.turnoverLuck) n++;
  }
  if (s.homeFieldMultiplier !== 1) n++;
  if (s.weather.kind !== 'clear') n++;
  n += Object.keys(s.forcedResults).length;
  return n;
}

export function isBaseline(s: Scenario): boolean {
  return scenarioEditCount(s) === 0;
}
