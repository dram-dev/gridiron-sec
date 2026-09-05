import { POSITION_SIDE, ROSTERS } from '../data/players';
import { TEAM_BY_ID } from '../data/teams';
import type { Player, Position, TeamId } from '../data/types';
import { LEAGUE_PLAYS, LEAGUE_PPG } from './constants';
import type { GameProjection, Rated } from './game';
import type { RatingTable } from './ratings';
import { normalQuantile } from './rng';
import type { Scenario } from './scenario';

/* ============================================================================
 * Player projections.
 *
 * Production is usage multiplied by efficiency, adjusted for the opponent and
 * for game script. All three of those move: a heavy favourite runs more and
 * throws less, a good defence suppresses efficiency, and tempo changes the
 * number of snaps everyone gets. Each projection carries a distribution rather
 * than a single number, because a running back's floor and ceiling are what
 * the question is usually about.
 * ========================================================================== */

/** League-average defensive rating, used as the matchup baseline. */
const AVG_DEFENSE = 6.5;

/** Points of opponent defensive rating per 1% of efficiency suppressed. */
const MATCHUP_K = 0.011;

export interface StatLine {
  passAttempts?: number;
  completions?: number;
  passYards?: number;
  passTd?: number;
  interceptions?: number;
  carries?: number;
  rushYards?: number;
  rushTd?: number;
  targets?: number;
  receptions?: number;
  recYards?: number;
  recTd?: number;
  tackles?: number;
  tfl?: number;
  sacks?: number;
  passBreakups?: number;
  takeaways?: number;
  /** Total offensive yards, for a single headline figure. */
  scrimmageYards?: number;
}

export interface ProjectedStat {
  key: string;
  label: string;
  mean: number;
  p10: number;
  p90: number;
  /** Decimal places for display. */
  precision: number;
}

export interface PlayerGameProjection {
  player: Player;
  opponent: Rated;
  /** Multiplier applied to efficiency for this matchup. Above 1 is favourable. */
  matchup: number;
  /** Projected team snaps for this game. */
  teamPlays: number;
  /** Pass rate after game-script adjustment. */
  passRate: number;
  line: StatLine;
  stats: ProjectedStat[];
  /** Fantasy-style single number for cross-position comparison. */
  impactScore: number;
}

function lognormalBand(mean: number, cv: number) {
  if (mean <= 0) return { p10: 0, p90: 0 };
  const sigma = Math.sqrt(Math.log(1 + cv * cv));
  const mu = Math.log(mean) - (sigma * sigma) / 2;
  return {
    p10: Math.exp(mu + sigma * normalQuantile(0.1)),
    p90: Math.exp(mu + sigma * normalQuantile(0.9)),
  };
}

function stat(key: string, label: string, mean: number, cv: number, precision = 0): ProjectedStat {
  const b = lognormalBand(mean, cv);
  return { key, label, mean, p10: b.p10, p90: b.p90, precision };
}

/** Efficiency multiplier for facing a given defence. */
export function matchupMultiplier(opponentDefense: number): number {
  return Math.max(0.6, Math.min(1.4, 1 - (opponentDefense - AVG_DEFENSE) * MATCHUP_K));
}

/**
 * Game script: heavy favourites run more and throw less, underdogs the
 * reverse. Roughly 0.6 percentage points of pass rate per point of margin.
 */
export function scriptedPassRate(base: number, margin: number): number {
  return Math.max(0.28, Math.min(0.72, base - margin * 0.006));
}

export function projectPlayerGame(
  player: Player,
  projection: GameProjection,
  isHome: boolean,
): PlayerGameProjection {
  const team = TEAM_BY_ID[player.teamId];
  const self = isHome ? projection.home : projection.away;
  const opponent = isHome ? projection.away : projection.home;
  const margin = isHome ? projection.margin : -projection.margin;

  const matchup = matchupMultiplier(opponent.defense);
  // Higher-scoring games run slightly more offensive snaps for both sides.
  const flow = 0.75 + 0.25 * (projection.total / (2 * LEAGUE_PPG));
  const teamPlays = self.pace * flow;
  const passRate = scriptedPassRate(team.efficiency.passRate, margin);

  const dropbacks = teamPlays * passRate;
  const rushes = teamPlays * (1 - passRate);
  const u = player.usage;
  const r = player.rates;
  const line: StatLine = {};
  const stats: ProjectedStat[] = [];

  if (player.position === 'QB') {
    const att = dropbacks * (u.passAttemptShare ?? u.snapShare) * 0.93;
    const ypa = (r.ypa ?? 7.4) * matchup;
    const passYards = att * ypa;
    const compPct = Math.max(0.5, Math.min(0.73, 0.55 + (player.grade - 78) * 0.004));
    const passTd = (passYards / 265) * (0.95 + (player.grade - 78) * 0.006);
    const ints = att * (0.028 - (player.grade - 78) * 0.00035);
    const carries = rushes * 0.14 * (player.grade > 82 ? 1.15 : 0.9);
    const rushYards = carries * 4.1 * matchup;

    Object.assign(line, {
      passAttempts: att,
      completions: att * compPct,
      passYards,
      passTd,
      interceptions: Math.max(0.15, ints),
      carries,
      rushYards,
      rushTd: rushYards / 140,
      scrimmageYards: passYards + rushYards,
    });
    stats.push(
      stat('passYards', 'Pass yards', passYards, 0.26),
      stat('passTd', 'Pass TD', passTd, 0.45, 1),
      stat('completions', 'Completions', att * compPct, 0.18),
      stat('rushYards', 'Rush yards', rushYards, 0.42),
      stat('interceptions', 'Interceptions', Math.max(0.15, ints), 0.6, 1),
    );
  } else if (player.position === 'RB') {
    const carries = rushes * (u.carryShare ?? 0.4);
    const ypc = (r.ypc ?? 4.6) * matchup;
    const rushYards = carries * ypc;
    const targets = dropbacks * (u.targetShare ?? 0.06);
    const recYards = targets * 6.6 * matchup;

    Object.assign(line, {
      carries,
      rushYards,
      rushTd: rushYards / 118,
      targets,
      receptions: targets * 0.78,
      recYards,
      recTd: recYards / 210,
      scrimmageYards: rushYards + recYards,
    });
    stats.push(
      stat('rushYards', 'Rush yards', rushYards, 0.34),
      stat('carries', 'Carries', carries, 0.2),
      stat('rushTd', 'Rush TD', rushYards / 118, 0.55, 1),
      stat('recYards', 'Receiving yards', recYards, 0.5),
      stat('scrimmageYards', 'Scrimmage yards', rushYards + recYards, 0.3),
    );
  } else if (player.position === 'WR' || player.position === 'TE') {
    const targets = dropbacks * (u.targetShare ?? 0.12);
    const ypt = (r.ypt ?? 8.2) * matchup;
    const recYards = targets * ypt;
    const catchRate = player.position === 'TE' ? 0.72 : 0.64;

    Object.assign(line, {
      targets,
      receptions: targets * catchRate,
      recYards,
      recTd: recYards / 165,
      scrimmageYards: recYards,
    });
    stats.push(
      stat('recYards', 'Receiving yards', recYards, 0.42),
      stat('receptions', 'Receptions', targets * catchRate, 0.28),
      stat('targets', 'Targets', targets, 0.24),
      stat('recTd', 'Receiving TD', recYards / 165, 0.6, 1),
    );
  } else if (POSITION_SIDE[player.position] === 'defense') {
    const oppPlays = opponent.pace * 0.97;
    const oppDropbacks = oppPlays * 0.48;
    const snaps = oppPlays * u.snapShare;
    const isFront = player.position === 'EDGE' || player.position === 'DL' || player.position === 'LB';
    const tackleRate = player.position === 'LB' ? 0.115 : isFront ? 0.062 : 0.072;
    const tackles = snaps * tackleRate * (0.85 + (player.grade - 78) * 0.008);
    const sacks =
      oppDropbacks * (u.rushSnapShare ?? (isFront ? 0.6 : 0.08)) * (r.pressureRate ?? 0.06) * 0.42;
    const tfl = sacks * 1.5 + (isFront ? 0.25 : 0.1);
    const pbu = player.position === 'CB' || player.position === 'S' ? snaps * 0.014 : snaps * 0.003;

    Object.assign(line, {
      tackles,
      tfl,
      sacks,
      passBreakups: pbu,
      takeaways: pbu * 0.28,
    });
    stats.push(
      stat('tackles', 'Tackles', tackles, 0.3, 1),
      stat('tfl', 'Tackles for loss', tfl, 0.6, 1),
      stat('sacks', 'Sacks', sacks, 0.75, 1),
      stat('passBreakups', 'Pass breakups', pbu, 0.7, 1),
    );
  } else {
    // Specialists
    const attempts = 1.9 * (projection.total / 55);
    Object.assign(line, { scrimmageYards: 0 });
    stats.push(stat('fgAttempts', 'FG attempts', attempts, 0.4, 1));
  }

  const impactScore =
    (line.passYards ?? 0) * 0.04 +
    (line.passTd ?? 0) * 4 -
    (line.interceptions ?? 0) * 2 +
    (line.rushYards ?? 0) * 0.1 +
    (line.recYards ?? 0) * 0.1 +
    ((line.rushTd ?? 0) + (line.recTd ?? 0)) * 6 +
    (line.tackles ?? 0) * 0.5 +
    (line.sacks ?? 0) * 4 +
    (line.takeaways ?? 0) * 6;

  return { player, opponent, matchup, teamPlays, passRate, line, stats, impactScore };
}

/* -------------------------------------------------------------------------- */
/* Season-level player projections                                            */
/* -------------------------------------------------------------------------- */

export interface PlayerSeasonProjection {
  player: Player;
  games: number;
  line: StatLine;
  stats: ProjectedStat[];
  /** Availability-adjusted games played. */
  expectedGames: number;
}

export function projectPlayerSeason(
  player: Player,
  gameProjections: { projection: GameProjection; isHome: boolean }[],
  scenario: Scenario,
): PlayerSeasonProjection {
  const status = scenario.players[player.id] ?? 'active';
  const availability = status === 'out' ? 0 : status === 'limited' ? 0.62 : 1;
  const expectedGames = gameProjections.length * availability * (1 - player.durabilityRisk * 0.55);

  const totals: StatLine = {};
  const perGame: PlayerGameProjection[] = gameProjections.map((g) =>
    projectPlayerGame(player, g.projection, g.isHome),
  );
  for (const g of perGame) {
    for (const [k, v] of Object.entries(g.line)) {
      if (typeof v !== 'number') continue;
      totals[k as keyof StatLine] = ((totals[k as keyof StatLine] ?? 0) as number) + v * availability * (1 - player.durabilityRisk * 0.55);
    }
  }

  const cvSeason = 0.19;
  const stats: ProjectedStat[] = [];
  const push = (key: keyof StatLine, label: string, precision = 0) => {
    const v = totals[key];
    if (typeof v === 'number' && v > 0.05) stats.push(stat(key, label, v, cvSeason, precision));
  };
  push('passYards', 'Pass yards');
  push('passTd', 'Pass TD');
  push('rushYards', 'Rush yards');
  push('rushTd', 'Rush TD', 1);
  push('recYards', 'Receiving yards');
  push('receptions', 'Receptions');
  push('recTd', 'Receiving TD', 1);
  push('tackles', 'Tackles');
  push('sacks', 'Sacks', 1);
  push('tfl', 'Tackles for loss', 1);
  push('passBreakups', 'Pass breakups', 1);

  return { player, games: gameProjections.length, line: totals, stats, expectedGames };
}

/* -------------------------------------------------------------------------- */
/* Roster value                                                               */
/* -------------------------------------------------------------------------- */

export interface RosterValue {
  teamId: TeamId;
  /** Total PAR on the roster. */
  totalPar: number;
  byGroup: { group: string; par: number; players: number }[];
  topPlayers: Player[];
  /** Share of total PAR held by the top three players — a concentration risk measure. */
  concentration: number;
}

const GROUP_ORDER = ['Quarterback', 'Backfield', 'Receiver', 'Offensive line', 'Front seven', 'Secondary', 'Specialist'];

const GROUP_OF: Record<Position, string> = {
  QB: 'Quarterback', RB: 'Backfield', WR: 'Receiver', TE: 'Receiver',
  OT: 'Offensive line', IOL: 'Offensive line',
  EDGE: 'Front seven', DL: 'Front seven', LB: 'Front seven',
  CB: 'Secondary', S: 'Secondary', K: 'Specialist', P: 'Specialist',
};

export function rosterValue(teamId: TeamId): RosterValue {
  const roster = ROSTERS[teamId];
  const totalPar = roster.reduce((s, p) => s + p.par, 0);
  const groups = new Map<string, { par: number; players: number }>();
  for (const p of roster) {
    const g = GROUP_OF[p.position];
    const cur = groups.get(g) ?? { par: 0, players: 0 };
    cur.par += p.par;
    cur.players += 1;
    groups.set(g, cur);
  }
  const sorted = roster.slice().sort((a, b) => b.par - a.par);
  return {
    teamId,
    totalPar,
    byGroup: GROUP_ORDER.filter((g) => groups.has(g)).map((g) => ({ group: g, ...groups.get(g)! })),
    topPlayers: sorted.slice(0, 8),
    concentration: sorted.slice(0, 3).reduce((s, p) => s + p.par, 0) / (totalPar || 1),
  };
}

/** Every player, ranked by PAR — the league-wide value board. */
export function playerValueBoard(): Player[] {
  return Object.values(ROSTERS).flat().sort((a, b) => b.par - a.par);
}

/** Team pace expressed as plays per game relative to the FBS average. */
export function paceIndex(teamId: TeamId, ratings: RatingTable): number {
  return ratings[teamId].pace / LEAGUE_PLAYS;
}
