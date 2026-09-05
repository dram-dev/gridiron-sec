import { describe, expect, it } from 'vitest';
import { CONFERENCE_GAMES, ALL_GAMES, NON_CONFERENCE_GAMES } from '../../data/schedule';
import { TEAMS, TEAM_BY_ID } from '../../data/teams';
import { COACHES } from '../../data/coaches';
import { ALL_PLAYERS, ROSTERS } from '../../data/players';
import { rateAll, rankRatings, availabilityImpact } from '../ratings';
import { makeBaselineScenario, scenarioEditCount } from '../scenario';
import { projectGame, simulateGame, solveShift, driveOdds } from '../game';
import { simulateSeason, projectAllGames } from '../season';
import { normalCdf, normalQuantile, makeRng, quantileSorted } from '../rng';
import { projectPlayerGame, rosterValue, matchupMultiplier, scriptedPassRate } from '../players';
import { TD_POINTS, FG_POINTS } from '../constants';
import {
  DEFAULT_COEFFICIENTS, DERIVED, deriveAll, coachIndex, rosterStrength,
  projectedStarter, externalAgreement, spearmanVsSpPlus,
} from '../model';
import { COACH_BY_TEAM } from '../../data/coaches';

const scenario = makeBaselineScenario();
const ratings = rateAll(scenario);

describe('schedule integrity', () => {
  it('has exactly 72 conference games', () => {
    expect(CONFERENCE_GAMES).toHaveLength(72);
  });

  it('gives every team exactly nine conference games and twelve total', () => {
    for (const t of TEAMS) {
      const conf = CONFERENCE_GAMES.filter((g) => g.homeId === t.id || g.awayId === t.id);
      const all = ALL_GAMES.filter((g) => g.homeId === t.id || g.awayId === t.id);
      expect(conf, `${t.id} conference games`).toHaveLength(9);
      expect(all, `${t.id} total games`).toHaveLength(12);
    }
  });

  it('honours all three annual opponents for every team', () => {
    for (const t of TEAMS) {
      for (const opp of t.annualOpponents) {
        const found = CONFERENCE_GAMES.some(
          (g) =>
            (g.homeId === t.id && g.awayId === opp) || (g.awayId === t.id && g.homeId === opp),
        );
        expect(found, `${t.id} must play annual opponent ${opp}`).toBe(true);
      }
    }
  });

  it('never schedules a team twice in the same week', () => {
    const seen = new Set<string>();
    for (const g of ALL_GAMES) {
      for (const side of [g.homeId, g.awayId]) {
        const key = `${side}@${g.week}`;
        expect(seen.has(key), `${side} double-booked in week ${g.week}`).toBe(false);
        seen.add(key);
      }
    }
  });

  it('never pairs the same two conference teams twice', () => {
    const pairs = CONFERENCE_GAMES.map((g) => [g.homeId, g.awayId].sort().join('-'));
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it('has no conference game marked non-conference or vice versa', () => {
    const ids = new Set(TEAMS.map((t) => t.id as string));
    for (const g of CONFERENCE_GAMES) {
      expect(ids.has(g.homeId) && ids.has(g.awayId)).toBe(true);
    }
    for (const g of NON_CONFERENCE_GAMES) {
      expect(ids.has(g.homeId) && ids.has(g.awayId)).toBe(false);
    }
  });
});

describe('data integrity', () => {
  it('gives every team a coach that points back at it', () => {
    for (const t of TEAMS) {
      const coach = COACHES.find((c) => c.id === t.coachId);
      expect(coach, `${t.id} coach`).toBeDefined();
      expect(coach!.teamId).toBe(t.id);
    }
  });

  it('assigns every player to a real team with a unique id', () => {
    const ids = new Set<string>();
    for (const p of ALL_PLAYERS) {
      expect(TEAM_BY_ID[p.teamId], `${p.name} team`).toBeDefined();
      expect(ids.has(p.id), `duplicate player id ${p.id}`).toBe(false);
      ids.add(p.id);
    }
  });

  it('gives every team a roster with at least one quarterback', () => {
    for (const t of TEAMS) {
      expect(ROSTERS[t.id].length).toBeGreaterThanOrEqual(10);
      expect(ROSTERS[t.id].some((p) => p.position === 'QB')).toBe(true);
    }
  });

  it('keeps usage shares and probabilities inside their valid ranges', () => {
    for (const p of ALL_PLAYERS) {
      expect(p.usage.snapShare).toBeGreaterThan(0);
      expect(p.usage.snapShare).toBeLessThanOrEqual(1);
      expect(p.breakoutOdds).toBeGreaterThanOrEqual(0);
      expect(p.breakoutOdds).toBeLessThanOrEqual(1);
      expect(p.durabilityRisk).toBeGreaterThanOrEqual(0);
      expect(p.durabilityRisk).toBeLessThanOrEqual(1);
      expect(p.grade).toBeGreaterThan(0);
      expect(p.grade).toBeLessThanOrEqual(100);
      expect(p.par).toBeGreaterThanOrEqual(0);
    }
  });

  it('does not let target shares within a team exceed one', () => {
    for (const t of TEAMS) {
      const total = ROSTERS[t.id].reduce((s, p) => s + (p.usage.targetShare ?? 0), 0);
      expect(total, `${t.id} target share`).toBeLessThanOrEqual(1.02);
    }
  });
});

describe('statistics helpers', () => {
  it('computes the normal CDF accurately', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
  });

  it('inverts the normal CDF', () => {
    for (const p of [0.05, 0.25, 0.5, 0.75, 0.95]) {
      expect(normalCdf(normalQuantile(p))).toBeCloseTo(p, 4);
    }
  });

  it('produces a reproducible random stream from a seed', () => {
    const a = makeRng(42);
    const b = makeRng(42);
    for (let i = 0; i < 50; i++) expect(a()).toBe(b());
  });

  it('interpolates quantiles', () => {
    expect(quantileSorted([1, 2, 3, 4, 5], 0.5)).toBe(3);
    expect(quantileSorted([0, 10], 0.5)).toBe(5);
  });
});

describe('ratings', () => {
  it('makes a team rating the sum of its offence, defence and special teams', () => {
    for (const t of TEAMS) {
      const r = ratings[t.id];
      expect(r.total).toBeCloseTo(r.offense + r.defense + r.specialTeams, 6);
    }
  });

  it('equals the sum of the derived components', () => {
    for (const t of TEAMS) {
      const c = DERIVED[t.id].components;
      const sum = c.offense + c.defense + c.specialTeams + c.coaching + c.returningProduction + c.portalRecruiting + c.quarterback;
      expect(ratings[t.id].total, t.id).toBeCloseTo(sum, 6);
    }
  });

  it('ranks Georgia first in the baseline', () => {
    const ranked = rankRatings(ratings, ratings);
    expect(ranked[0].teamId).toBe('UGA');
    expect(ranked[ranked.length - 1].teamId).toBe('ARK');
  });

  it('reports no rank movement when the scenario is the baseline', () => {
    for (const r of rankRatings(ratings, ratings)) {
      expect(r.rankDelta).toBe(0);
      expect(r.totalDelta).toBeCloseTo(0, 9);
    }
  });

  it('lowers a rating by exactly the PAR of a player ruled out', () => {
    const qb = ROSTERS.MISS.find((p) => p.name === 'Trinidad Chambliss')!;
    const s = makeBaselineScenario();
    s.players[qb.id] = 'out';
    const after = rateAll(s);
    expect(ratings.MISS.total - after.MISS.total).toBeCloseTo(qb.par, 6);
    expect(availabilityImpact('MISS', s).total).toBeCloseTo(qb.par, 6);
  });

  it('prices a limited player at 40% of their PAR', () => {
    const qb = ROSTERS.MISS.find((p) => p.name === 'Trinidad Chambliss')!;
    const s = makeBaselineScenario();
    s.players[qb.id] = 'limited';
    expect(ratings.MISS.total - rateAll(s).MISS.total).toBeCloseTo(qb.par * 0.4, 6);
  });

  it('leaves other teams untouched when one team loses a player', () => {
    const s = makeBaselineScenario();
    s.players['miss-trinidad-chambliss'] = 'out';
    const after = rateAll(s);
    for (const t of TEAMS) {
      if (t.id === 'MISS') continue;
      expect(after[t.id].total).toBeCloseTo(ratings[t.id].total, 9);
    }
  });

  it('counts scenario edits', () => {
    const s = makeBaselineScenario();
    expect(scenarioEditCount(s)).toBe(0);
    s.players['uga-gunner-stockton'] = 'out';
    s.homeFieldMultiplier = 0;
    expect(scenarioEditCount(s)).toBe(2);
  });
});

describe('the derivation', () => {
  it('carries no per-team rating constants in the data', () => {
    // The whole point of engine/model.ts. If a `components` field ever comes
    // back onto Team, the model has regressed into a lookup table.
    for (const t of TEAMS) {
      expect(Object.keys(t), `${t.id} must not carry authored components`).not.toContain('components');
    }
  });

  it('anchors the conference average on the coefficient', () => {
    const totals = TEAMS.map((t) => ratings[t.id].total);
    const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
    expect(mean).toBeCloseTo(DEFAULT_COEFFICIENTS.leagueAnchor, 6);
  });

  it('spans a plausible power-conference range', () => {
    const totals = TEAMS.map((t) => ratings[t.id].total).sort((a, b) => b - a);
    const spread = totals[0] - totals[totals.length - 1];
    expect(spread).toBeGreaterThan(18);
    expect(spread).toBeLessThan(34);
  });

  it('re-rates the whole league when a coefficient moves', () => {
    const hotter = deriveAll({ ...DEFAULT_COEFFICIENTS, rosterScale: DEFAULT_COEFFICIENTS.rosterScale * 2 });
    const changed = TEAMS.filter(
      (t) => Math.abs(hotter[t.id].components.offense - DERIVED[t.id].components.offense) > 1e-9,
    );
    expect(changed.length).toBe(TEAMS.length);
  });

  it('is near order-invariant when every scale is multiplied together', () => {
    const k = 1.7;
    const scaled = deriveAll({
      ...DEFAULT_COEFFICIENTS,
      efficiencyScale: DEFAULT_COEFFICIENTS.efficiencyScale * k,
      rosterScale: DEFAULT_COEFFICIENTS.rosterScale * k,
      continuityScale: DEFAULT_COEFFICIENTS.continuityScale * k,
      talentScale: DEFAULT_COEFFICIENTS.talentScale * k,
      portalWeight: DEFAULT_COEFFICIENTS.portalWeight * k,
      qbScale: DEFAULT_COEFFICIENTS.qbScale * k,
      coachScale: DEFAULT_COEFFICIENTS.coachScale * k,
    });
    const sum = (d: typeof DERIVED, id: (typeof TEAMS)[number]['id']) => {
      const c = d[id].components;
      return c.offense + c.defense + c.specialTeams + c.coaching +
        c.returningProduction + c.portalRecruiting + c.quarterback;
    };
    const order = (d: typeof DERIVED) =>
      [...TEAMS].sort((a, b) => sum(d, b.id) - sum(d, a.id)).map((t) => t.id);

    // Special teams enters in raw points and does not scale with the
    // standardised terms, so a common multiplier can still flip genuine ties.
    // The claim is near-invariance, not identity.
    const a = order(DERIVED);
    const b = order(scaled);
    const rankA = Object.fromEntries(a.map((id, i) => [id, i + 1]));
    const rankB = Object.fromEntries(b.map((id, i) => [id, i + 1]));
    const n = a.length;
    const d2 = a.reduce((acc, id) => acc + (rankA[id] - rankB[id]) ** 2, 0);
    const rho = 1 - (6 * d2) / (n * (n * n - 1));
    expect(rho).toBeGreaterThan(0.99);

    // Any team that moved must have been close enough that the non-scaling
    // part of its rating could account for it — and that bound is derived, not
    // guessed. Writing the rescale as `scaled = k(sum − fixed) + fixed` inverts
    // to give each team's fixed part exactly, whatever terms happen to make it
    // up. Two teams can only swap when the gap between them is smaller than
    // ((k − 1) / k) × the spread of that fixed part.
    const fixed = (id: (typeof TEAMS)[number]['id']) =>
      (sum(scaled, id) - k * sum(DERIVED, id)) / (1 - k);
    const fixedValues = a.map(fixed);
    const tolerance =
      ((k - 1) / k) * (Math.max(...fixedValues) - Math.min(...fixedValues));

    for (const id of a) {
      if (rankA[id] === rankB[id]) continue;
      const neighbour = a[Math.min(n - 1, Math.max(0, rankB[id] - 1))];
      expect(Math.abs(sum(DERIVED, id) - sum(DERIVED, neighbour)), id)
        .toBeLessThan(tolerance);
    }
  });

  it('excludes quarterbacks and specialists from roster strength', () => {
    for (const t of TEAMS) {
      const manual = ROSTERS[t.id]
        .filter((p) => ['RB', 'WR', 'TE', 'OT', 'IOL'].includes(p.position))
        .reduce((s, p) => s + p.par, 0);
      expect(rosterStrength(ROSTERS[t.id], 'offense'), t.id).toBeCloseTo(manual, 9);
    }
  });

  it('projects the highest-graded quarterback as the starter', () => {
    for (const t of TEAMS) {
      const starter = projectedStarter(ROSTERS[t.id])!;
      const best = Math.max(...ROSTERS[t.id].filter((p) => p.position === 'QB').map((p) => p.grade));
      expect(starter.grade, t.id).toBe(best);
    }
  });

  it('gives a coach with no record no record-based signal', () => {
    const stein = COACH_BY_TEAM.UK;
    expect(stein.career.wins + stein.career.losses).toBe(0);
    // Only the two tendency terms should contribute.
    const expected =
      0.3 * stein.tendencies.development + 0.2 * stein.tendencies.acquisition;
    expect(coachIndex(stein, DEFAULT_COEFFICIENTS)).toBeCloseTo(expected, 9);
  });

  it('agrees closely with an independently published rating', () => {
    // The model is built from inputs, never fitted to SP+, so this is a real
    // external check rather than a restatement. A sharp drop here means the
    // derivation has drifted.
    const rho = spearmanVsSpPlus(externalAgreement());
    expect(rho).toBeGreaterThan(0.85);
  });
});

describe('game model', () => {
  const game = CONFERENCE_GAMES.find((g) => g.id.includes('UGA-ALA'))!;

  it('projects a margin equal to the rating gap plus home field', () => {
    const p = projectGame(game, ratings, scenario);
    const expected = ratings.ALA.total - ratings.UGA.total + p.hfa;
    expect(p.margin).toBeCloseTo(expected, 4);
  });

  it('produces complementary win probabilities', () => {
    const p = projectGame(game, ratings, scenario);
    expect(p.homeWinProb + p.awayWinProb).toBeCloseTo(1, 9);
  });

  it('removes home-field advantage when the multiplier is zero', () => {
    const s = { ...scenario, homeFieldMultiplier: 0 };
    const p = projectGame(game, ratings, s);
    expect(p.hfa).toBe(0);
    expect(p.margin).toBeCloseTo(ratings.ALA.total - ratings.UGA.total, 4);
  });

  it('gives no home-field advantage at a neutral site', () => {
    const redRiver = CONFERENCE_GAMES.find((g) => g.rivalry === 'Red River Rivalry')!;
    expect(projectGame(redRiver, ratings, scenario).hfa).toBe(0);
  });

  it('inverts points-per-drive correctly', () => {
    for (const target of [1.2, 2.07, 3.0, 4.0]) {
      const o = driveOdds(target);
      expect(o.td * TD_POINTS + o.fg * FG_POINTS).toBeCloseTo(target, 3);
      expect(o.td + o.fg + o.empty).toBeCloseTo(1, 9);
    }
  });

  it('finds a shift of about zero for the league-average drive', () => {
    expect(Math.abs(solveShift(2.067))).toBeLessThan(0.02);
  });

  it('agrees between the closed form and the simulation', () => {
    for (const g of CONFERENCE_GAMES.filter((x) => x.headline).slice(0, 5)) {
      const p = projectGame(g, ratings, scenario);
      const sim = simulateGame(p, 12000, 99);
      expect(Math.abs(sim.meanMargin - p.margin), `${g.id} margin`).toBeLessThan(1.0);
      expect(Math.abs(sim.meanTotal - p.total), `${g.id} total`).toBeLessThan(1.5);
      expect(Math.abs(sim.homeWinProb - p.homeWinProb), `${g.id} win prob`).toBeLessThan(0.035);
      expect(Math.abs(sim.marginSd - p.sigma), `${g.id} sigma`).toBeLessThan(1.6);
    }
  });

  it('produces a proper score distribution', () => {
    const p = projectGame(game, ratings, scenario);
    const sim = simulateGame(p, 8000, 5);
    const total = sim.marginHistogram.reduce((s, h) => s + h.probability, 0);
    expect(total).toBeCloseTo(1, 6);
    expect(sim.marginHistogram.some((h) => h.margin === 0)).toBe(false);
  });

  it('moves cover probability monotonically with the spread', () => {
    const p = projectGame(game, ratings, scenario);
    const sim = simulateGame(p, 8000, 3);
    expect(sim.coverProb(-14)).toBeLessThan(sim.coverProb(0));
    expect(sim.coverProb(0)).toBeLessThan(sim.coverProb(14));
    expect(sim.overProb(80)).toBeLessThan(sim.overProb(40));
  });

  it('reduces scoring in bad weather', () => {
    const clear = projectGame(game, ratings, scenario);
    const storm = projectGame(game, ratings, {
      ...scenario,
      weather: { kind: 'extreme', label: 'Severe', scoring: 0.8, passing: 0.72, variance: 1.2 },
    });
    expect(storm.total).toBeLessThan(clear.total);
    expect(storm.sigma).toBeGreaterThan(clear.sigma);
  });
});

describe('season simulation', () => {
  const s = { ...makeBaselineScenario(), iterations: 3000 };
  const result = simulateSeason(rateAll(s), s);

  it('assigns exactly one champion per simulated season', () => {
    const total = TEAMS.reduce((acc, t) => acc + result.teams[t.id].pChampion, 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it('sends exactly two teams to the title game per season', () => {
    const total = TEAMS.reduce((acc, t) => acc + result.teams[t.id].pTitleGame, 0);
    expect(total).toBeCloseTo(2, 6);
  });

  it('fills every finishing position exactly once per season', () => {
    for (let pos = 0; pos < TEAMS.length; pos++) {
      const total = TEAMS.reduce((acc, t) => acc + result.teams[t.id].finishDistribution[pos], 0);
      expect(total, `position ${pos + 1}`).toBeCloseTo(1, 6);
    }
  });

  it('produces win distributions that sum to one', () => {
    for (const t of TEAMS) {
      const sum = result.teams[t.id].winDistribution.reduce((a, b) => a + b, 0);
      expect(sum, t.id).toBeCloseTo(1, 6);
    }
  });

  it('keeps mean wins consistent with the win distribution', () => {
    for (const t of TEAMS) {
      const o = result.teams[t.id];
      const fromDist = o.winDistribution.reduce((s, p, i) => s + p * i, 0);
      expect(fromDist, t.id).toBeCloseTo(o.meanWins, 2);
    }
  });

  it('conserves total wins across the league', () => {
    const total = TEAMS.reduce((s, t) => s + result.teams[t.id].meanWins, 0);
    // 72 conference wins + one championship + non-conference wins.
    expect(total).toBeGreaterThan(100);
    expect(total).toBeLessThan(125);
  });

  it('ranks Georgia as the championship favourite', () => {
    const ordered = TEAMS.map((t) => result.teams[t.id]).sort((a, b) => b.pChampion - a.pChampion);
    expect(ordered[0].teamId).toBe('UGA');
  });

  it('is deterministic for a given seed', () => {
    const a = simulateSeason(rateAll(s), s);
    const b = simulateSeason(rateAll(s), s);
    expect(a.teams.UGA.pChampion).toBe(b.teams.UGA.pChampion);
  });

  it('changes results when the seed changes', () => {
    const other = simulateSeason(rateAll(s), { ...s, seed: s.seed + 1 });
    expect(other.teams.UGA.pChampion).not.toBe(result.teams.UGA.pChampion);
  });

  it('honours a forced result', () => {
    const game = CONFERENCE_GAMES.find((g) => g.id === 'w6-UGA-ALA')!;
    const forced = { ...s, forcedResults: { [game.id]: 'home' as const } };
    const out = simulateSeason(rateAll(forced), forced);
    const uga = out.teams.UGA.gameWinProbs.find((g) => g.gameId === game.id)!;
    expect(uga.probability).toBeCloseTo(0, 6);
    const ala = out.teams.ALA.gameWinProbs.find((g) => g.gameId === game.id)!;
    expect(ala.probability).toBeCloseTo(1, 6);
  });

  it('drops a team’s outlook when its best player is ruled out', () => {
    const injured = { ...s, players: { 'miss-trinidad-chambliss': 'out' as const } };
    const out = simulateSeason(rateAll(injured), injured);
    expect(out.teams.MISS.meanWins).toBeLessThan(result.teams.MISS.meanWins - 0.8);
  });

  it('produces sensible win totals for the strongest and weakest teams', () => {
    expect(result.teams.UGA.meanWins).toBeGreaterThan(8.5);
    expect(result.teams.ARK.meanWins).toBeLessThan(6);
  });

  it('reports a bounded playoff bid count for the league', () => {
    const bids = TEAMS.reduce((acc, t) => acc + result.teams[t.id].pPlayoff, 0);
    expect(bids).toBeGreaterThan(1.5);
    expect(bids).toBeLessThan(5);
  });
});

describe('season trajectories and leverage', () => {
  const s = { ...makeBaselineScenario(), iterations: 3000 };
  const result = simulateSeason(rateAll(s), s);

  it('records a path for every team, one point per week', () => {
    for (const t of TEAMS) {
      const tr = result.trajectories[t.id];
      expect(tr, t.id).toBeDefined();
      expect(tr.wins).toHaveLength(13);
      expect(tr.position).toHaveLength(13);
      expect(tr.wins.map((p) => p.week)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13]);
    }
  });

  it('never lets cumulative wins go down', () => {
    for (const t of TEAMS) {
      const w = result.trajectories[t.id].wins;
      for (let i = 1; i < w.length; i++) {
        expect(w[i].mean, `${t.id} week ${i + 1}`).toBeGreaterThanOrEqual(w[i - 1].mean - 1e-9);
        expect(w[i].p50).toBeGreaterThanOrEqual(w[i - 1].p50);
      }
    }
  });

  it('orders the quantile bands correctly at every week', () => {
    for (const t of TEAMS) {
      for (const p of result.trajectories[t.id].wins) {
        expect(p.p10).toBeLessThanOrEqual(p.p25);
        expect(p.p25).toBeLessThanOrEqual(p.p50);
        expect(p.p50).toBeLessThanOrEqual(p.p75);
        expect(p.p75).toBeLessThanOrEqual(p.p90);
      }
    }
  });

  it('ends the path on the regular-season win total', () => {
    for (const t of TEAMS) {
      const last = result.trajectories[t.id].wins[12];
      const fromDist = result.teams[t.id].regularWinDistribution
        .reduce((acc, p, i) => acc + p * i, 0);
      expect(last.mean, t.id).toBeCloseTo(fromDist, 6);
    }
  });

  it('keeps every standing inside the table', () => {
    for (const t of TEAMS) {
      for (const p of result.trajectories[t.id].position) {
        expect(p.p10).toBeGreaterThanOrEqual(1);
        expect(p.p90).toBeLessThanOrEqual(TEAMS.length);
      }
    }
  });

  it('assigns exactly one team to each standing every week', () => {
    // Medians can tie, but the mean position across all teams must be the mean
    // of 1..16 at every week if each position was filled exactly once.
    const expected = (TEAMS.length + 1) / 2;
    for (let w = 0; w < 13; w++) {
      const mean = TEAMS.reduce((acc, t) => acc + result.trajectories[t.id].position[w].mean, 0) / TEAMS.length;
      expect(mean, `week ${w + 1}`).toBeCloseTo(expected, 6);
    }
  });

  it('rates leverage only on conference games, sorted by swing', () => {
    const confIds = new Set(CONFERENCE_GAMES.map((g) => g.id));
    for (const g of result.leverage) expect(confIds.has(g.gameId)).toBe(true);
    for (let i = 1; i < result.leverage.length; i++) {
      expect(result.leverage[i - 1].leverage).toBeGreaterThanOrEqual(result.leverage[i].leverage);
    }
  });

  it('keeps every swing a valid probability difference', () => {
    for (const g of result.leverage) {
      expect(Math.abs(g.homeSwing)).toBeLessThanOrEqual(1);
      expect(Math.abs(g.awaySwing)).toBeLessThanOrEqual(1);
      expect(g.homeWinProbability).toBeGreaterThan(0);
      expect(g.homeWinProbability).toBeLessThan(1);
    }
  });

  it('finds the biggest swing in a game between two contenders', () => {
    // The heaviest game must involve teams that can actually win the title;
    // a swing concentrated on a team with no path would be a bug.
    const top = result.leverage[0];
    const contender = (id: (typeof TEAMS)[number]['id']) => result.teams[id].pChampion > 0.02;
    expect(contender(top.homeId) || contender(top.awayId)).toBe(true);
    expect(top.leverage).toBeGreaterThan(0.05);
  });
});

describe('player projections', () => {
  const projections = projectAllGames(ratings, scenario);

  it('adjusts efficiency for the opponent defence', () => {
    expect(matchupMultiplier(14)).toBeLessThan(1);
    expect(matchupMultiplier(0)).toBeGreaterThan(1);
    expect(matchupMultiplier(6.5)).toBeCloseTo(1, 6);
  });

  it('has favourites run more and underdogs throw more', () => {
    expect(scriptedPassRate(0.5, 20)).toBeLessThan(0.5);
    expect(scriptedPassRate(0.5, -20)).toBeGreaterThan(0.5);
  });

  it('projects a plausible quarterback line', () => {
    const p = projections.find((x) => x.home.id === 'UGA' && x.away.id === 'OU')!;
    const qb = ROSTERS.UGA.find((x) => x.position === 'QB')!;
    const proj = projectPlayerGame(qb, p, true);
    expect(proj.line.passYards!).toBeGreaterThan(120);
    expect(proj.line.passYards!).toBeLessThan(420);
    expect(proj.line.passAttempts!).toBeGreaterThan(15);
    expect(proj.line.passAttempts!).toBeLessThan(50);
  });

  it('projects a plausible running back line', () => {
    const p = projections.find((x) => x.home.id === 'MIZ')!;
    const rb = ROSTERS.MIZ.find((x) => x.name === 'Ahmad Hardy')!;
    const proj = projectPlayerGame(rb, p, true);
    expect(proj.line.rushYards!).toBeGreaterThan(50);
    expect(proj.line.rushYards!).toBeLessThan(220);
  });

  it('orders projection bands correctly', () => {
    const p = projections[0];
    const player = ROSTERS[p.home.id as 'UGA']?.[0] ?? ALL_PLAYERS[0];
    for (const s of projectPlayerGame(player, p, true).stats) {
      expect(s.p10).toBeLessThanOrEqual(s.mean + 1e-9);
      expect(s.mean).toBeLessThanOrEqual(s.p90 + 1e-9);
    }
  });

  it('summarises roster value with parts that add up', () => {
    for (const t of TEAMS) {
      const rv = rosterValue(t.id);
      const sum = rv.byGroup.reduce((s, g) => s + g.par, 0);
      expect(sum, t.id).toBeCloseTo(rv.totalPar, 6);
      expect(rv.concentration).toBeGreaterThan(0);
      expect(rv.concentration).toBeLessThanOrEqual(1);
    }
  });
});
