import { COACH_BY_TEAM } from '../data/coaches';
import { POSITION_SIDE, ROSTERS } from '../data/players';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import type { RatingComponents, Team, TeamId } from '../data/types';
import { LEAGUE_PLAYS } from './constants';
import { teamOverride, type Scenario } from './scenario';

/* ============================================================================
 * From components to a rating.
 *
 * A team's rating is points per game above an average FBS opponent on a
 * neutral field. It is the sum of seven named parts, which is what lets the
 * interface show a waterfall instead of a black box — and what lets a scenario
 * move exactly one part at a time.
 * ========================================================================== */

/** Which side of the ball each adjustment component lands on. */
const OFFENSE_SHARE: Record<Exclude<keyof RatingComponents, 'offense' | 'defense' | 'specialTeams'>, number> = {
  coaching: 0.55,
  returningProduction: 0.5,
  portalRecruiting: 0.5,
  quarterback: 1,
};

const ADJUSTMENTS = Object.keys(OFFENSE_SHARE) as (keyof typeof OFFENSE_SHARE)[];

export interface AvailabilityImpact {
  offense: number;
  defense: number;
  special: number;
  total: number;
  missing: { playerId: string; name: string; position: string; points: number; status: string }[];
}

/** Points removed from a team by the scenario's player-availability overrides. */
export function availabilityImpact(teamId: TeamId, scenario: Scenario): AvailabilityImpact {
  const out: AvailabilityImpact = { offense: 0, defense: 0, special: 0, total: 0, missing: [] };
  for (const p of ROSTERS[teamId]) {
    const status = scenario.players[p.id];
    if (!status || status === 'active') continue;
    // A limited player still contributes; the model prices that at 40% of PAR.
    const lost = status === 'out' ? p.par : p.par * 0.4;
    const side = POSITION_SIDE[p.position];
    out[side] += lost;
    out.total += lost;
    out.missing.push({ playerId: p.id, name: p.name, position: p.position, points: lost, status });
  }
  out.missing.sort((a, b) => b.points - a.points);
  return out;
}

export interface TeamRating {
  teamId: TeamId;
  team: Team;
  /** Points per game above an average FBS team, neutral field. */
  total: number;
  offense: number;
  defense: number;
  specialTeams: number;
  /** Component breakdown after scenario adjustments, for the waterfall. */
  parts: { key: string; label: string; value: number; side: 'offense' | 'defense' | 'both' }[];
  /** Offensive plays per game. */
  pace: number;
  /** Game-to-game volatility multiplier from the coaching profile. */
  volatility: number;
  /** Points per game of turnover luck being assumed. */
  turnoverLuck: number;
  /** Baseline rating with no scenario applied — for diffing. */
  baselineTotal: number;
}

const COMPONENT_LABELS: Record<string, string> = {
  offense: 'Returning offense',
  defense: 'Returning defense',
  specialTeams: 'Special teams',
  coaching: 'Coaching',
  returningProduction: 'Continuity',
  portalRecruiting: 'Portal & recruiting',
  quarterback: 'Quarterback',
  availability: 'Availability',
  adjustment: 'Scenario dial',
  turnoverLuck: 'Turnover luck',
};

function rawTotals(c: RatingComponents) {
  let offense = c.offense;
  let defense = c.defense;
  for (const k of ADJUSTMENTS) {
    offense += c[k] * OFFENSE_SHARE[k];
    defense += c[k] * (1 - OFFENSE_SHARE[k]);
  }
  return { offense, defense, specialTeams: c.specialTeams };
}

export function rateTeam(teamId: TeamId, scenario: Scenario): TeamRating {
  const team = TEAM_BY_ID[teamId];
  const coach = COACH_BY_TEAM[teamId];
  const c = team.components;
  const base = rawTotals(c);
  const baselineTotal = base.offense + base.defense + base.specialTeams;

  const ov = teamOverride(scenario, teamId);
  const avail = availabilityImpact(teamId, scenario);

  const offense = base.offense + ov.offense - avail.offense;
  const defense = base.defense + ov.defense - avail.defense;
  const specialTeams = base.specialTeams - avail.special;
  const total = offense + defense + specialTeams + ov.turnoverLuck;

  const parts: TeamRating['parts'] = [
    { key: 'offense', label: COMPONENT_LABELS.offense, value: c.offense, side: 'offense' },
    { key: 'defense', label: COMPONENT_LABELS.defense, value: c.defense, side: 'defense' },
    { key: 'quarterback', label: COMPONENT_LABELS.quarterback, value: c.quarterback, side: 'offense' },
    { key: 'coaching', label: COMPONENT_LABELS.coaching, value: c.coaching, side: 'both' },
    { key: 'returningProduction', label: COMPONENT_LABELS.returningProduction, value: c.returningProduction, side: 'both' },
    { key: 'portalRecruiting', label: COMPONENT_LABELS.portalRecruiting, value: c.portalRecruiting, side: 'both' },
    { key: 'specialTeams', label: COMPONENT_LABELS.specialTeams, value: c.specialTeams, side: 'both' },
  ];
  if (avail.total > 0.001) {
    parts.push({ key: 'availability', label: COMPONENT_LABELS.availability, value: -avail.total, side: 'both' });
  }
  const dial = ov.offense + ov.defense;
  if (Math.abs(dial) > 0.001) {
    parts.push({ key: 'adjustment', label: COMPONENT_LABELS.adjustment, value: dial, side: 'both' });
  }
  if (Math.abs(ov.turnoverLuck) > 0.001) {
    parts.push({ key: 'turnoverLuck', label: COMPONENT_LABELS.turnoverLuck, value: ov.turnoverLuck, side: 'both' });
  }

  return {
    teamId,
    team,
    total,
    offense,
    defense,
    specialTeams,
    parts,
    pace: team.efficiency.playsPerGame * ov.pace,
    volatility: coach?.volatility ?? 1,
    turnoverLuck: ov.turnoverLuck,
    baselineTotal,
  };
}

export type RatingTable = Record<TeamId, TeamRating>;

export function rateAll(scenario: Scenario): RatingTable {
  const out = {} as RatingTable;
  for (const t of TEAMS) out[t.id] = rateTeam(t.id, scenario);
  return out;
}

/** Ratings sorted strongest first, with rank and movement against the baseline. */
export interface RankedRating extends TeamRating {
  rank: number;
  baselineRank: number;
  rankDelta: number;
  totalDelta: number;
}

export function rankRatings(current: RatingTable, baseline: RatingTable): RankedRating[] {
  const baseOrder = Object.values(baseline)
    .slice()
    .sort((a, b) => b.total - a.total)
    .map((r) => r.teamId);
  const baseRank = Object.fromEntries(baseOrder.map((id, i) => [id, i + 1]));

  return Object.values(current)
    .slice()
    .sort((a, b) => b.total - a.total)
    .map((r, i) => ({
      ...r,
      rank: i + 1,
      baselineRank: baseRank[r.teamId],
      rankDelta: baseRank[r.teamId] - (i + 1),
      totalDelta: r.total - baseline[r.teamId].total,
    }));
}

/** Pace factor for a matchup: how many plays relative to a league-average game. */
export function paceFactor(a: TeamRating, b: TeamRating): number {
  return (a.pace + b.pace) / (2 * LEAGUE_PLAYS);
}
