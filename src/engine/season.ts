import { ALL_GAMES, CONFERENCE_GAMES, WEEKS } from '../data/schedule';
import { TEAMS } from '../data/teams';
import type { Game, TeamId } from '../data/types';
import { GAME_SIGMA, TEAM_SIGMA } from './constants';
import { projectGame, resolveRated, type GameProjection } from './game';
import type { RatingTable } from './ratings';
import { makeGaussian, makeRng } from './rng';
import type { Scenario } from './scenario';

/* ============================================================================
 * Season simulation.
 *
 * The important modelling decision here is that a team's true strength is
 * drawn ONCE per simulated season, not once per game. A team that is three
 * points better than its rating is three points better every week. Without
 * that correlation, simulated win totals cluster far too tightly around the
 * mean and every team looks like a 7-5 team.
 * ========================================================================== */

export interface TeamSeasonOutlook {
  teamId: TeamId;
  meanWins: number;
  meanLosses: number;
  meanConfWins: number;
  /** Probability of finishing with exactly n wins, index = wins. */
  winDistribution: number[];
  /**
   * Wins across the twelve regular-season games only, excluding the conference
   * championship game. Comparable to a model that treats games as independent,
   * which is what makes the effect of season-level correlation measurable.
   */
  regularWinDistribution: number[];
  confWinDistribution: number[];
  pTitleGame: number;
  pChampion: number;
  pPlayoff: number;
  pTenWins: number;
  pBowlEligible: number;
  pUndefeated: number;
  pWinlessConference: number;
  /** Probability of finishing in each conference position, index 0 = first. */
  finishDistribution: number[];
  meanFinish: number;
  /** Average opponent rating across the twelve-game schedule. */
  strengthOfSchedule: number;
  /** Average opponent rating across conference games only. */
  conferenceSos: number;
  gameWinProbs: { gameId: string; opponentId: string; home: boolean; week: number; probability: number }[];
}

/** One week of a fan chart: the distribution of a running quantity. */
export interface TrajectoryPoint {
  week: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
}

export interface TeamTrajectory {
  teamId: TeamId;
  /** Cumulative wins after each week, as a distribution. */
  wins: TrajectoryPoint[];
  /** Conference standing after each week, 1 = first. Lower is better. */
  position: TrajectoryPoint[];
}

/**
 * How much a single game moves a participant's title chances.
 *
 * Computed by conditioning: the simulation set is partitioned on that game's
 * outcome and the championship rate compared across the two halves. Because
 * every other game still plays out inside each half, this is the game's actual
 * marginal effect rather than a guess at its importance.
 */
export interface GameLeverage {
  gameId: string;
  week: number;
  homeId: TeamId;
  awayId: TeamId;
  /** Home team's title probability when it wins, minus when it loses. */
  homeSwing: number;
  awaySwing: number;
  /** Combined swing across both participants. */
  leverage: number;
  homeWinProbability: number;
}

export interface SeasonResult {
  iterations: number;
  teams: Record<TeamId, TeamSeasonOutlook>;
  trajectories: Record<TeamId, TeamTrajectory>;
  /** Conference games ranked by how much they move the title race. */
  leverage: GameLeverage[];
  /** Most likely title-game pairings. */
  titleGamePairs: { a: TeamId; b: TeamId; probability: number }[];
  /** Elapsed wall time, milliseconds. */
  elapsedMs: number;
}

interface PreparedGame {
  id: string;
  week: number;
  homeIdx: number;
  awayIdx: number;
  /** −1 for non-conference participants. */
  conference: boolean;
  baseMargin: number;
  residualSigma: number;
  forced: 'home' | 'away' | null;
}

const TEAM_INDEX: Record<string, number> = Object.fromEntries(TEAMS.map((t, i) => [t.id, i]));
const N = TEAMS.length;

/** Teams coming off a bye in a given week, derived from the schedule itself. */
export function computeRested(): Map<number, Set<string>> {
  const playing = new Map<number, Set<string>>();
  for (const w of WEEKS) playing.set(w.week, new Set());
  for (const g of ALL_GAMES) {
    playing.get(g.week)?.add(g.homeId);
    playing.get(g.week)?.add(g.awayId);
  }
  const rested = new Map<number, Set<string>>();
  for (const w of WEEKS) {
    const s = new Set<string>();
    const prev = playing.get(w.week - 1);
    if (prev) {
      for (const t of TEAMS) if (!prev.has(t.id)) s.add(t.id);
    }
    rested.set(w.week, s);
  }
  return rested;
}

const RESTED_BY_WEEK = computeRested();

export function projectAllGames(ratings: RatingTable, scenario: Scenario): GameProjection[] {
  return ALL_GAMES.map((g) =>
    projectGame(g, ratings, scenario, { rested: RESTED_BY_WEEK.get(g.week) }),
  );
}

function prepare(projections: GameProjection[], scenario: Scenario): PreparedGame[] {
  return projections.map((p) => {
    const homeIdx = TEAM_INDEX[p.home.id] ?? -1;
    const awayIdx = TEAM_INDEX[p.away.id] ?? -1;
    // Total game variance is sigma²; the season-level team draw already
    // supplies 2·TEAM_SIGMA² of it, so the per-game residual carries the rest.
    const teamVar = (homeIdx >= 0 ? TEAM_SIGMA ** 2 : 0) + (awayIdx >= 0 ? TEAM_SIGMA ** 2 : 0);
    const residual = Math.sqrt(Math.max((GAME_SIGMA * 0.35) ** 2, p.sigma ** 2 - teamVar));
    return {
      id: p.gameId,
      week: p.week,
      homeIdx,
      awayIdx,
      conference: homeIdx >= 0 && awayIdx >= 0 && isConferenceGame(p.gameId),
      baseMargin: p.margin,
      residualSigma: residual,
      forced: scenario.forcedResults[p.gameId] ?? null,
    };
  });
}

const CONF_IDS = new Set(CONFERENCE_GAMES.map((g) => g.id));
function isConferenceGame(id: string) {
  return CONF_IDS.has(id);
}

/**
 * Playoff bid probability for a finished season.
 *
 * The selection committee is not a formula, so this is an explicit heuristic
 * rather than a derived quantity, and it is documented as one. Losses are the
 * dominant term because that is how the committee actually behaves. It is
 * shaped to these anchors:
 *
 *   12-1 conference champion  →  99%      10-2 at +18   →  70%
 *   11-1 at +20               →  94%      10-3 at +18   →  37%
 *    9-3 at  +9               →  13%       9-4 at +15   →   7%
 *
 * Across a simulated season this yields roughly three SEC bids, which is the
 * right order of magnitude for one league in a twelve-team field.
 */
function playoffProbability(wins: number, losses: number, champion: boolean, rating: number): number {
  const z =
    3.3 - 1.4 * losses + 0.115 * (rating - 15) + 1.6 * (champion ? 1 : 0) + 0.3 * (wins - 10);
  return 1 / (1 + Math.exp(-z));
}

export function simulateSeason(
  ratings: RatingTable,
  scenario: Scenario,
  projections?: GameProjection[],
): SeasonResult {
  const started = Date.now();
  const projs = projections ?? projectAllGames(ratings, scenario);
  const games = prepare(projs, scenario);
  const iterations = Math.max(200, scenario.iterations);

  const rng = makeRng(scenario.seed >>> 0);
  const gauss = makeGaussian(rng);

  const ratingArr = TEAMS.map((t) => ratings[t.id].total);

  // Accumulators
  const totalWins = new Float64Array(N);
  const totalConfWins = new Float64Array(N);
  // Thirteen regular-season slots plus a championship game win.
  const winDist: number[][] = TEAMS.map(() => new Array(14).fill(0));
  const regularWinDist: number[][] = TEAMS.map(() => new Array(13).fill(0));
  const confWinDist: number[][] = TEAMS.map(() => new Array(10).fill(0));
  const finishDist: number[][] = TEAMS.map(() => new Array(N).fill(0));
  const titleGame = new Float64Array(N);
  const champion = new Float64Array(N);
  const playoff = new Float64Array(N);
  const tenWins = new Float64Array(N);
  const bowlEligible = new Float64Array(N);
  const undefeated = new Float64Array(N);
  const winlessConf = new Float64Array(N);
  const pairCounts = new Map<string, number>();
  const gameWins = new Float64Array(games.length);

  // Week-by-week paths. Cumulative wins and conference standing are recorded
  // after every week so the season can be shown as a trajectory rather than
  // only as an endpoint. Raw paths are reduced to quantiles before returning.
  const WEEK_COUNT = WEEKS.length;
  const winPath = new Uint8Array(iterations * N * WEEK_COUNT);
  const posPath = new Uint8Array(iterations * N * WEEK_COUNT);

  // Leverage counters, per conference game, per participant.
  const confGameIdx: number[] = [];
  games.forEach((g, i) => { if (g.conference) confGameIdx.push(i); });
  const levWin = new Float64Array(games.length);
  const levHomeChampOnWin = new Float64Array(games.length);
  const levHomeChampOnLoss = new Float64Array(games.length);
  const levAwayChampOnWin = new Float64Array(games.length);
  const levAwayChampOnLoss = new Float64Array(games.length);
  const gameHomeWon = new Uint8Array(games.length);

  // Per-iteration scratch
  const adj = new Float64Array(N);
  const w = new Int32Array(N);
  const l = new Int32Array(N);
  const cw = new Int32Array(N);
  const cl = new Int32Array(N);
  // head[a * N + b] = 1 if a beat b in conference play this season
  const head = new Int8Array(N * N);

  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < N; i++) {
      adj[i] = gauss() * TEAM_SIGMA;
      w[i] = 0; l[i] = 0; cw[i] = 0; cl[i] = 0;
    }
    head.fill(0);

    for (let gi = 0; gi < games.length; gi++) {
      const g = games[gi];
      const hAdj = g.homeIdx >= 0 ? adj[g.homeIdx] : 0;
      const aAdj = g.awayIdx >= 0 ? adj[g.awayIdx] : 0;
      let margin = g.baseMargin + hAdj - aAdj + gauss() * g.residualSigma;
      if (g.forced === 'home') margin = Math.abs(margin) + 0.5;
      else if (g.forced === 'away') margin = -Math.abs(margin) - 0.5;

      const homeWon = margin > 0;
      if (homeWon) gameWins[gi]++;
      gameHomeWon[gi] = homeWon ? 1 : 0;

      if (g.homeIdx >= 0) {
        if (homeWon) w[g.homeIdx]++; else l[g.homeIdx]++;
      }
      if (g.awayIdx >= 0) {
        if (homeWon) l[g.awayIdx]++; else w[g.awayIdx]++;
      }
      if (g.conference) {
        if (homeWon) {
          cw[g.homeIdx]++; cl[g.awayIdx]++;
          head[g.homeIdx * N + g.awayIdx] = 1;
        } else {
          cw[g.awayIdx]++; cl[g.homeIdx]++;
          head[g.awayIdx * N + g.homeIdx] = 1;
        }
      }
    }

    // Snapshot the running state after each week. Games are iterated in
    // schedule order, so this walks the season rather than replaying it.
    {
      const cw2 = new Int32Array(N);
      const cl2 = new Int32Array(N);
      const w2 = new Int32Array(N);
      let gi = 0;
      for (let wk = 1; wk <= WEEK_COUNT; wk++) {
        while (gi < games.length && games[gi].week === wk) {
          const g = games[gi];
          const homeWon = gameHomeWon[gi] === 1;
          if (g.homeIdx >= 0 && homeWon) w2[g.homeIdx]++;
          if (g.awayIdx >= 0 && !homeWon) w2[g.awayIdx]++;
          if (g.conference) {
            if (homeWon) { cw2[g.homeIdx]++; cl2[g.awayIdx]++; }
            else { cw2[g.awayIdx]++; cl2[g.homeIdx]++; }
          }
          gi++;
        }
        // Standing after this week, by conference winning percentage.
        const rank = Array.from({ length: N }, (_, i) => i).sort((a, b) => {
          const pa = cw2[a] / Math.max(1, cw2[a] + cl2[a]);
          const pb = cw2[b] / Math.max(1, cw2[b] + cl2[b]);
          if (pb !== pa) return pb - pa;
          if (w2[b] !== w2[a]) return w2[b] - w2[a];
          return ratingArr[b] - ratingArr[a];
        });
        for (let pos = 0; pos < N; pos++) {
          const base = (it * N + rank[pos]) * WEEK_COUNT + (wk - 1);
          posPath[base] = pos + 1;
        }
        for (let i = 0; i < N; i++) {
          winPath[(it * N + i) * WEEK_COUNT + (wk - 1)] = w2[i];
        }
      }
    }

    // Conference standings. Primary: conference winning percentage.
    // Ties are broken by head-to-head record among the tied group, then by
    // overall record, then by rating — a faithful simplification of the SEC's
    // published multi-step procedure.
    const order = Array.from({ length: N }, (_, i) => i);
    order.sort((a, b) => {
      const pa = cw[a] / Math.max(1, cw[a] + cl[a]);
      const pb = cw[b] / Math.max(1, cw[b] + cl[b]);
      if (pb !== pa) return pb - pa;
      const h = head[b * N + a] - head[a * N + b];
      if (h !== 0) return h;
      if (w[b] !== w[a]) return w[b] - w[a];
      return ratingArr[b] - ratingArr[a];
    });

    for (let pos = 0; pos < N; pos++) finishDist[order[pos]][pos]++;

    const first = order[0];
    const second = order[1];
    titleGame[first]++;
    titleGame[second]++;
    const key = first < second ? `${first}:${second}` : `${second}:${first}`;
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);

    // Record regular-season wins before the championship game is played.
    for (let i = 0; i < N; i++) regularWinDist[i][Math.min(12, w[i])]++;

    // Championship game at a neutral site: rating gap plus season-level form.
    const cMargin =
      ratingArr[first] - ratingArr[second] + adj[first] - adj[second] + gauss() * GAME_SIGMA;
    const champIdx = cMargin > 0 ? first : second;
    champion[champIdx]++;
    w[champIdx]++;
    if (champIdx === first) l[second]++; else l[first]++;

    // Conditional title odds: attribute this season's champion to each game's
    // realised outcome, so the two halves can be compared afterwards.
    for (let k = 0; k < confGameIdx.length; k++) {
      const gi = confGameIdx[k];
      const g = games[gi];
      const homeWon = gameHomeWon[gi] === 1;
      const homeChamp = champIdx === g.homeIdx ? 1 : 0;
      const awayChamp = champIdx === g.awayIdx ? 1 : 0;
      if (homeWon) {
        levWin[gi]++;
        levHomeChampOnWin[gi] += homeChamp;
        levAwayChampOnWin[gi] += awayChamp;
      } else {
        levHomeChampOnLoss[gi] += homeChamp;
        levAwayChampOnLoss[gi] += awayChamp;
      }
    }

    for (let i = 0; i < N; i++) {
      totalWins[i] += w[i];
      totalConfWins[i] += cw[i];
      winDist[i][Math.min(13, w[i])]++;
      confWinDist[i][Math.min(9, cw[i])]++;
      if (w[i] >= 10) tenWins[i]++;
      if (w[i] >= 6) bowlEligible[i]++;
      if (l[i] === 0) undefeated[i]++;
      if (cw[i] === 0) winlessConf[i]++;
      if (rng() < playoffProbability(w[i], l[i], champIdx === i, ratingArr[i])) playoff[i]++;
    }
  }

  // Schedule strength, from the projections rather than the simulation.
  const sos: Record<string, { all: number[]; conf: number[] }> = {};
  for (const t of TEAMS) sos[t.id] = { all: [], conf: [] };
  for (const p of projs) {
    const isConf = isConferenceGame(p.gameId);
    const h = p.home.id;
    const a = p.away.id;
    if (sos[h]) { sos[h].all.push(p.away.total); if (isConf) sos[h].conf.push(p.away.total); }
    if (sos[a]) { sos[a].all.push(p.home.total); if (isConf) sos[a].conf.push(p.home.total); }
  }

  const gameProbByIdx = new Map<string, number>();
  games.forEach((g, i) => gameProbByIdx.set(g.id, gameWins[i] / iterations));

  const teams = {} as Record<TeamId, TeamSeasonOutlook>;
  TEAMS.forEach((t, i) => {
    const mean = (arr: number[]) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);
    const finish = finishDist[i].map((v) => v / iterations);
    teams[t.id] = {
      teamId: t.id,
      meanWins: totalWins[i] / iterations,
      meanLosses: 12 - totalWins[i] / iterations,
      meanConfWins: totalConfWins[i] / iterations,
      winDistribution: winDist[i].map((v) => v / iterations),
      regularWinDistribution: regularWinDist[i].map((v) => v / iterations),
      confWinDistribution: confWinDist[i].map((v) => v / iterations),
      pTitleGame: titleGame[i] / iterations,
      pChampion: champion[i] / iterations,
      pPlayoff: playoff[i] / iterations,
      pTenWins: tenWins[i] / iterations,
      pBowlEligible: bowlEligible[i] / iterations,
      pUndefeated: undefeated[i] / iterations,
      pWinlessConference: winlessConf[i] / iterations,
      finishDistribution: finish,
      meanFinish: finish.reduce((s, v, idx) => s + v * (idx + 1), 0),
      strengthOfSchedule: mean(sos[t.id].all),
      conferenceSos: mean(sos[t.id].conf),
      gameWinProbs: projs
        .filter((p) => p.home.id === t.id || p.away.id === t.id)
        .map((p) => ({
          gameId: p.gameId,
          opponentId: p.home.id === t.id ? p.away.id : p.home.id,
          home: p.home.id === t.id,
          week: p.week,
          probability: p.home.id === t.id
            ? (gameProbByIdx.get(p.gameId) ?? p.homeWinProb)
            : 1 - (gameProbByIdx.get(p.gameId) ?? p.homeWinProb),
        }))
        .sort((a, b) => a.week - b.week),
    };
  });

  const titleGamePairs = [...pairCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([k, v]) => {
      const [x, y] = k.split(':').map(Number);
      return { a: TEAMS[x].id, b: TEAMS[y].id, probability: v / iterations };
    });

  /* ---- Reduce the raw paths to quantile bands ---------------------------- */

  const scratch = new Float64Array(iterations);
  const quantilesAt = (source: Uint8Array, teamIdx: number, weekIdx: number): TrajectoryPoint => {
    let sum = 0;
    for (let it = 0; it < iterations; it++) {
      const v = source[(it * N + teamIdx) * WEEK_COUNT + weekIdx];
      scratch[it] = v;
      sum += v;
    }
    const sorted = scratch.slice(0, iterations).sort();
    const q = (f: number) => sorted[Math.min(iterations - 1, Math.floor(f * (iterations - 1)))];
    return {
      week: weekIdx + 1,
      p10: q(0.1), p25: q(0.25), p50: q(0.5), p75: q(0.75), p90: q(0.9),
      mean: sum / iterations,
    };
  };

  const trajectories = {} as Record<TeamId, TeamTrajectory>;
  TEAMS.forEach((t, i) => {
    trajectories[t.id] = {
      teamId: t.id,
      wins: Array.from({ length: WEEK_COUNT }, (_, w) => quantilesAt(winPath, i, w)),
      position: Array.from({ length: WEEK_COUNT }, (_, w) => quantilesAt(posPath, i, w)),
    };
  });

  /* ---- Leverage ---------------------------------------------------------- */

  const leverage: GameLeverage[] = confGameIdx
    .map((gi) => {
      const g = games[gi];
      const wins = levWin[gi];
      const losses = iterations - wins;
      // A game whose outcome is effectively decided carries no information.
      if (wins < 30 || losses < 30) return null;
      const homeSwing = levHomeChampOnWin[gi] / wins - levHomeChampOnLoss[gi] / losses;
      const awaySwing = levAwayChampOnLoss[gi] / losses - levAwayChampOnWin[gi] / wins;
      return {
        gameId: g.id,
        week: g.week,
        homeId: TEAMS[g.homeIdx].id,
        awayId: TEAMS[g.awayIdx].id,
        homeSwing,
        awaySwing,
        leverage: Math.abs(homeSwing) + Math.abs(awaySwing),
        homeWinProbability: wins / iterations,
      } as GameLeverage;
    })
    .filter((x): x is GameLeverage => x !== null)
    .sort((a, b) => b.leverage - a.leverage);

  return {
    iterations, teams, trajectories, leverage, titleGamePairs,
    elapsedMs: Date.now() - started,
  };
}

/** Games a given team plays, in schedule order. */
export function teamSchedule(teamId: TeamId): Game[] {
  return ALL_GAMES.filter((g) => g.homeId === teamId || g.awayId === teamId).sort(
    (a, b) => a.week - b.week,
  );
}

export function opponentOf(game: Game, teamId: string): string {
  return game.homeId === teamId ? game.awayId : game.homeId;
}

export function describeOpponent(game: Game, teamId: string, ratings: RatingTable) {
  const oppId = opponentOf(game, teamId);
  return resolveRated(oppId, ratings);
}
