import { NON_CONF_BY_ID } from '../data/schedule';
import { TEAM_BY_ID } from '../data/teams';
import type { Game, TeamId } from '../data/types';
import {
  BASE_DRIVE, DEF_TD_RATE, FG_POINTS, GAME_SIGMA, LEAGUE_DRIVES, LEAGUE_PLAYS,
  LEAGUE_PPG, PROB_CEIL, PROB_FLOOR, REST_BONUS, TD_POINTS,
} from './constants';
import type { RatingTable, TeamRating } from './ratings';
import { makeGaussian, makeRng, normalCdf, quantileSorted, type Rng } from './rng';
import type { Scenario } from './scenario';

/* ============================================================================
 * The game model.
 *
 * Two layers, deliberately:
 *   1. A closed-form projection — margin, total, win probability. Fast enough
 *      to run for every game on every keystroke, and it is what the season
 *      simulation uses.
 *   2. A drive-level Monte Carlo — produces the actual score distribution,
 *      including the spikes on 3, 7, 10 and 14 that a normal curve smooths
 *      away. Calibrated to the same expectation as layer one.
 * ========================================================================== */

/** A rating-shaped object, so non-conference opponents flow through unchanged. */
export interface Rated {
  id: string;
  name: string;
  abbr: string;
  total: number;
  offense: number;
  defense: number;
  specialTeams: number;
  pace: number;
  volatility: number;
  isConference: boolean;
  primary: string;
  onDark: string;
}

export function toRated(r: TeamRating): Rated {
  return {
    id: r.teamId,
    name: r.team.school,
    abbr: r.team.abbr,
    total: r.total,
    offense: r.offense,
    defense: r.defense,
    specialTeams: r.specialTeams,
    pace: r.pace,
    volatility: r.volatility,
    isConference: true,
    primary: r.team.primary,
    onDark: r.team.onDark,
  };
}

/** Build a rating for a non-conference opponent from its single rating number. */
export function ratedOpponent(id: string): Rated {
  const o = NON_CONF_BY_ID[id];
  if (!o) {
    return {
      id, name: id, abbr: id, total: 0, offense: 0, defense: 0, specialTeams: 0,
      pace: LEAGUE_PLAYS, volatility: 1, isConference: false, primary: '#64748b', onDark: '#94a3b8',
    };
  }
  return {
    id: o.id,
    name: o.name,
    abbr: o.id,
    total: o.rating,
    offense: o.rating / 2,
    defense: o.rating / 2,
    specialTeams: 0,
    pace: LEAGUE_PLAYS,
    volatility: 1.05,
    isConference: false,
    primary: '#64748b',
    onDark: '#94a3b8',
  };
}

export function resolveRated(id: string, ratings: RatingTable): Rated {
  const t = ratings[id as TeamId];
  return t ? toRated(t) : ratedOpponent(id);
}

/* -------------------------------------------------------------------------- */
/* Closed-form projection                                                     */
/* -------------------------------------------------------------------------- */

export interface ProjectionDriver {
  label: string;
  value: number;
  detail: string;
}

export interface GameProjection {
  gameId: string;
  week: number;
  home: Rated;
  away: Rated;
  neutralSite?: string;
  /** Projected home margin. Positive means the home team is favoured. */
  margin: number;
  /** Spread from the home team's perspective, rounded to the half point. */
  spread: number;
  total: number;
  homePoints: number;
  awayPoints: number;
  homeWinProb: number;
  awayWinProb: number;
  sigma: number;
  hfa: number;
  paceFactor: number;
  drivers: ProjectionDriver[];
}

export interface GameContext {
  /** Teams coming off a bye, by id. */
  rested?: Set<string>;
}

function homeFieldFor(game: Game, scenario: Scenario): number {
  if (game.neutralSite) return 0;
  const t = TEAM_BY_ID[game.homeId];
  const base = t ? t.venue.hfa : 2.6;
  return base * scenario.homeFieldMultiplier;
}

export function projectGame(
  game: Game,
  ratings: RatingTable,
  scenario: Scenario,
  ctx: GameContext = {},
): GameProjection {
  const home = resolveRated(game.homeId, ratings);
  const away = resolveRated(game.awayId, ratings);

  const hfa = homeFieldFor(game, scenario);
  const rested = ctx.rested ?? new Set<string>();
  const restEdge =
    (rested.has(game.homeId) ? REST_BONUS : 0) - (rested.has(game.awayId) ? REST_BONUS : 0);

  const pf = (home.pace + away.pace) / (2 * LEAGUE_PLAYS);
  const w = scenario.weather;

  // Margin is pure rating arithmetic, so a projection can always be read back
  // as "this team is N points better, plus home field". Tempo does not inflate
  // the favourite's margin — it changes how many points get scored, and it
  // widens the distribution through the drive count, not the expectation.
  // Bad weather compresses margins toward zero, which favours the underdog.
  const marginDamp = 0.6 + 0.4 * w.scoring;
  const margin = (home.total - away.total + hfa + restEdge) * marginDamp;

  // The total responds to both offences and both defences, scaled by tempo.
  const rawTotal =
    2 * LEAGUE_PPG + (home.offense + away.offense) - (home.defense + away.defense);
  const total = Math.max(17, rawTotal * pf * w.scoring);

  const homePoints = Math.max(3, (total + margin) / 2);
  const awayPoints = Math.max(3, (total - margin) / 2);
  const stEdge = (home.specialTeams - away.specialTeams) / 2;
  const sigma =
    GAME_SIGMA * Math.sqrt((home.volatility ** 2 + away.volatility ** 2) / 2) * w.variance;

  const p = normalCdf(margin / sigma);
  const homeWinProb = Math.min(PROB_CEIL, Math.max(PROB_FLOOR, p));

  const drivers: ProjectionDriver[] = [
    {
      label: 'Rating gap',
      value: home.total - away.total,
      detail: `${home.abbr} ${home.total >= 0 ? '+' : ''}${home.total.toFixed(1)} vs ${away.abbr} ${away.total >= 0 ? '+' : ''}${away.total.toFixed(1)} on a neutral field`,
    },
    {
      label: 'Home field',
      value: hfa,
      detail: game.neutralSite
        ? `Neutral site — ${game.neutralSite}`
        : `${TEAM_BY_ID[game.homeId]?.venue.name ?? 'Home venue'}`,
    },
  ];
  if (restEdge !== 0) {
    drivers.push({
      label: 'Rest',
      value: restEdge,
      detail: restEdge > 0 ? `${home.abbr} off a bye` : `${away.abbr} off a bye`,
    });
  }
  if (Math.abs(stEdge) > 0.05) {
    drivers.push({ label: 'Special teams', value: stEdge * 2, detail: 'Kicking, coverage and return margin' });
  }
  drivers.push({
    label: 'Tempo',
    value: 0,
    detail:
      pf >= 1.03
        ? `${(pf * LEAGUE_PLAYS * 2).toFixed(0)} combined plays projected — faster than an average game`
        : pf <= 0.97
          ? `${(pf * LEAGUE_PLAYS * 2).toFixed(0)} combined plays projected — slower than an average game`
          : `${(pf * LEAGUE_PLAYS * 2).toFixed(0)} combined plays projected — in line with an average game`,
  });
  if (w.kind !== 'clear') {
    drivers.push({
      label: w.label,
      value: 0,
      detail: `Total scaled to ${Math.round(w.scoring * 100)}%, margin compressed ${Math.round((1 - marginDamp) * 100)}%`,
    });
  }

  return {
    gameId: game.id,
    week: game.week,
    home,
    away,
    neutralSite: game.neutralSite,
    margin,
    spread: Math.round(-margin * 2) / 2,
    total: homePoints + awayPoints,
    homePoints,
    awayPoints,
    homeWinProb,
    awayWinProb: 1 - homeWinProb,
    sigma,
    paceFactor: pf,
    hfa,
    drivers,
  };
}

/* -------------------------------------------------------------------------- */
/* Drive-level Monte Carlo                                                    */
/* -------------------------------------------------------------------------- */

/** Expected points per drive for a given logit shift on the scoring outcomes. */
function ppdForShift(s: number): number {
  const wTd = BASE_DRIVE.td * Math.exp(1.6 * s);
  const wFg = BASE_DRIVE.fg * Math.exp(0.55 * s);
  const wRest = BASE_DRIVE.punt + BASE_DRIVE.turnover + BASE_DRIVE.other;
  const z = wTd + wFg + wRest;
  return (wTd * TD_POINTS + wFg * FG_POINTS) / z;
}

/** Invert the above: find the shift that produces a target points-per-drive. */
export function solveShift(targetPpd: number): number {
  let lo = -5;
  let hi = 5;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (ppdForShift(mid) < targetPpd) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface DriveOdds {
  td: number;
  fg: number;
  empty: number;
}

function oddsForShift(s: number): DriveOdds {
  const wTd = BASE_DRIVE.td * Math.exp(1.6 * s);
  const wFg = BASE_DRIVE.fg * Math.exp(0.55 * s);
  const wRest = BASE_DRIVE.punt + BASE_DRIVE.turnover + BASE_DRIVE.other;
  const z = wTd + wFg + wRest;
  return { td: wTd / z, fg: wFg / z, empty: wRest / z };
}

export function driveOdds(targetPpd: number): DriveOdds {
  return oddsForShift(solveShift(Math.max(0.35, Math.min(4.6, targetPpd))));
}

/* The simulation inverts points-per-drive on every iteration, so the bisection
 * is precomputed once onto a 0.01-resolution grid and looked up thereafter. */
const PPD_MIN = 0.35;
const PPD_MAX = 4.6;
const PPD_STEP = 0.01;
const PPD_TABLE: DriveOdds[] = (() => {
  const n = Math.round((PPD_MAX - PPD_MIN) / PPD_STEP) + 1;
  const table: DriveOdds[] = new Array(n);
  for (let i = 0; i < n; i++) table[i] = oddsForShift(solveShift(PPD_MIN + i * PPD_STEP));
  return table;
})();

export function driveOddsFast(targetPpd: number): DriveOdds {
  const clamped = targetPpd < PPD_MIN ? PPD_MIN : targetPpd > PPD_MAX ? PPD_MAX : targetPpd;
  return PPD_TABLE[Math.round((clamped - PPD_MIN) / PPD_STEP)];
}

/** Variance of points on a single drive, given that drive's outcome odds. */
function driveVariance(o: DriveOdds): number {
  const mean = TD_POINTS * o.td + FG_POINTS * o.fg;
  const second = TD_POINTS * TD_POINTS * o.td + FG_POINTS * FG_POINTS * o.fg;
  return second - mean * mean;
}

/**
 * Variance contributed by drive-count jitter, defensive scores and overtime.
 * Small, but it matters when solving for the per-team perturbation below.
 */
const RESIDUAL_VARIANCE = 16;

/**
 * The closed-form layer and the simulation must agree, including on spread.
 * Rather than fix the extra per-team noise at a constant, solve for it: the
 * drive process supplies some of the variance and the perturbation supplies
 * exactly the rest, so simulated margin SD lands on the projection's sigma.
 */
function solvePerturbation(sigma: number, hOdds: DriveOdds, aOdds: DriveOdds, drives: number): number {
  const driveVar = drives * (driveVariance(hOdds) + driveVariance(aOdds));
  const needed = (sigma * sigma - driveVar - RESIDUAL_VARIANCE) / 2;
  return Math.sqrt(Math.max(0.25, needed));
}

function simulateDrives(rng: Rng, odds: DriveOdds, drives: number): number {
  let pts = 0;
  for (let i = 0; i < drives; i++) {
    const r = rng();
    if (r < odds.td) {
      pts += 6;
      // Extra point, with a small share of two-point tries.
      if (rng() < 0.06) pts += rng() < 0.47 ? 2 : 0;
      else if (rng() < 0.955) pts += 1;
    } else if (r < odds.td + odds.fg) {
      pts += FG_POINTS;
    }
  }
  return pts;
}

export interface SimulatedGame {
  iterations: number;
  homeWinProb: number;
  /** Sorted margin samples, home perspective. */
  marginSorted: number[];
  totalSorted: number[];
  meanMargin: number;
  meanTotal: number;
  marginSd: number;
  /** Score-frequency map keyed as "home-away". */
  topScores: { home: number; away: number; probability: number }[];
  /** Probability the home team wins by exactly N, for key-number display. */
  marginHistogram: { margin: number; probability: number }[];
  coverProb: (spread: number) => number;
  overProb: (total: number) => number;
  homePointsMean: number;
  awayPointsMean: number;
}

export function simulateGame(
  projection: GameProjection,
  iterations = 20000,
  seed = 1,
): SimulatedGame {
  const rng = makeRng(seed);
  const gauss = makeGaussian(rng);

  const drivesBase = LEAGUE_DRIVES * projection.paceFactor;

  // Defensive and special-teams touchdowns are part of the projected total, so
  // the offensive drive process targets the points that remain after them.
  const defTdChance = Math.min(0.6, DEF_TD_RATE * drivesBase);
  const defTdPoints = defTdChance * 7;
  const homeOffense = Math.max(3, projection.homePoints - defTdPoints);
  const awayOffense = Math.max(3, projection.awayPoints - defTdPoints);

  const perturb = solvePerturbation(
    projection.sigma,
    driveOddsFast(homeOffense / drivesBase),
    driveOddsFast(awayOffense / drivesBase),
    drivesBase,
  );

  const margins = new Float64Array(iterations);
  const totals = new Float64Array(iterations);
  let homeWins = 0;
  let homeSum = 0;
  let awaySum = 0;
  const scoreCounts = new Map<string, number>();
  const marginCounts = new Map<number, number>();

  for (let i = 0; i < iterations; i++) {
    const hPts = Math.max(0.4, homeOffense + gauss() * perturb);
    const aPts = Math.max(0.4, awayOffense + gauss() * perturb);
    const drives = Math.max(7, Math.round(drivesBase + (rng() - 0.5) * 2.4));

    let home = simulateDrives(rng, driveOddsFast(hPts / drives), drives);
    let away = simulateDrives(rng, driveOddsFast(aPts / drives), drives);

    // Defensive and special-teams touchdowns.
    if (rng() < defTdChance) home += 7;
    if (rng() < defTdChance) away += 7;
    // College football does not end in a tie; overtime resolves it near 50/50.
    if (home === away) {
      if (rng() < 0.5) home += 3;
      else away += 3;
    }

    const m = home - away;
    margins[i] = m;
    totals[i] = home + away;
    homeSum += home;
    awaySum += away;
    if (m > 0) homeWins++;

    const key = `${home}-${away}`;
    scoreCounts.set(key, (scoreCounts.get(key) ?? 0) + 1);
    marginCounts.set(m, (marginCounts.get(m) ?? 0) + 1);
  }

  const marginSorted = Array.from(margins).sort((a, b) => a - b);
  const totalSorted = Array.from(totals).sort((a, b) => a - b);
  const meanMargin = marginSorted.reduce((s, v) => s + v, 0) / iterations;
  const variance =
    marginSorted.reduce((s, v) => s + (v - meanMargin) ** 2, 0) / (iterations - 1);

  const topScores = [...scoreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([k, v]) => {
      const [h, a] = k.split('-').map(Number);
      return { home: h, away: a, probability: v / iterations };
    });

  const marginHistogram = [...marginCounts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([m, v]) => ({ margin: m, probability: v / iterations }));

  return {
    iterations,
    homeWinProb: homeWins / iterations,
    marginSorted,
    totalSorted,
    meanMargin,
    meanTotal: totalSorted.reduce((s, v) => s + v, 0) / iterations,
    marginSd: Math.sqrt(variance),
    topScores,
    marginHistogram,
    homePointsMean: homeSum / iterations,
    awayPointsMean: awaySum / iterations,
    coverProb: (spread: number) => {
      // spread is from the home perspective: −7 means home laying seven.
      let n = 0;
      for (let i = 0; i < marginSorted.length; i++) if (marginSorted[i] + spread > 0) n++;
      return n / marginSorted.length;
    },
    overProb: (line: number) => {
      let n = 0;
      for (let i = 0; i < totalSorted.length; i++) if (totalSorted[i] > line) n++;
      return n / totalSorted.length;
    },
  };
}

export function marginPercentiles(sim: SimulatedGame) {
  return {
    p05: quantileSorted(sim.marginSorted, 0.05),
    p25: quantileSorted(sim.marginSorted, 0.25),
    p50: quantileSorted(sim.marginSorted, 0.5),
    p75: quantileSorted(sim.marginSorted, 0.75),
    p95: quantileSorted(sim.marginSorted, 0.95),
  };
}
