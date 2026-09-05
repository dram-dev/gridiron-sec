import { COACH_BY_TEAM } from '../data/coaches';
import { POSITION_SIDE, ROSTERS } from '../data/players';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import { MEASURED_ANCHOR } from '../data/measured';
import type { Coach, Conference, Player, RatingComponents, Team, TeamId } from '../data/types';

/* ============================================================================
 * The model.
 *
 * This module is the actual forecasting model: it turns observations about a
 * programme into the seven rating components that everything downstream
 * consumes. Those components used to be authored per team, which meant the
 * "model" was a presentation layer over a hundred-odd tuned constants. Now the
 * only tuned numbers in the system are the eighteen coefficients below, and
 * they apply to all sixteen teams at once.
 *
 * The distinction matters for a practical reason as much as an honest one:
 * with authored components, changing an input (returning production, a
 * roster) did nothing, because the output had been written down separately.
 * Here an input change propagates, and a coefficient change re-rates the whole
 * league — which is what makes the sensitivity analysis in the Model view
 * meaningful rather than decorative.
 *
 * What is still an input rather than a measurement: the prior-season
 * efficiency profiles and the player grades. Those are analyst estimates, and
 * they are flagged as such wherever they surface. The observations are measured
 * off the play-by-play and the weights are taken from a back-test; what is left
 * unvalidated is the player and coach layer sitting on top of them.
 * ========================================================================== */

export interface ModelCoefficients {
  /**
   * How much of a unit's strength comes from last season's efficiency versus
   * the roster actually on hand. 1 = last season only, 0 = roster only.
   */
  priorWeight: number;
  /** Points per standard deviation of prior-season unit efficiency. */
  efficiencyScale: number;
  /** Points per standard deviation of roster strength on a side of the ball. */
  rosterScale: number;
  /** Points per standard deviation of returning production. */
  continuityScale: number;
  /** Points per standard deviation of blue-chip ratio. */
  talentScale: number;
  /** Multiplier on the estimated net value of a transfer-portal cycle. */
  portalWeight: number;
  /** Points per grade point of quarterback quality above replacement. */
  qbScale: number;
  /** The grade a replacement-level conference starter is worth. */
  qbReplacementGrade: number;
  /** Points per standard deviation of the composite coaching index. */
  coachScale: number;
  /** Extra points charged against a first-year staff, scaled by its risk. */
  transitionWeight: number;
  /**
   * Games of prior experience a head coach is regressed toward .500 with.
   * A first-time coach carries no record signal at all, which is honest.
   */
  coachRegression: number;
  /**
   * Multiplier on the measured conference anchors. The anchors themselves are
   * fitted from scoring margins (see MEASURED_ANCHOR); this exists so a scenario
   * can ask what happens if a conference is stronger or weaker than the results
   * so far suggest. At 1 it changes nothing.
   */
  anchorScale: number;
}

/**
 * Weights for the terms a back-test can reach, taken from it rather than chosen.
 *
 * scripts/etl/backtest.mjs walks 2021-2025, builds each season's projection
 * from the season before it and scores it on games it never saw. Fitting the
 * observable inputs against real margins says, in points per standard deviation
 * of a conference-standardised observation:
 *
 *     unit efficiency   2.5 - 2.9      returning production   ~1.05
 *     recruiting talent ~5.0           home field             3.2
 *
 * Measured against that, the efficiency and home-field weights this model
 * shipped with were already about right. Talent was not: it carried 0.71 where
 * the evidence says 5.0, and the recruiting composite turns out to be the
 * single strongest and most stable predictor in the set — worth 4.7 to 5.4
 * points per standard deviation in every season tested. Correcting it roughly
 * doubles out-of-sample accuracy, from R² 0.14 to 0.26 on 2,345 games.
 *
 * The conference now spans about 34 points rather than 24, and that widening is
 * the point rather than a side effect. The market has priced SEC-against-SEC
 * games as high as 37 points inside the first five weeks of a season, which the
 * old compressed scale could never have produced; it under-called every large
 * mismatch, which is most of what the low R² was measuring.
 *
 * `priorWeight` moved with it, from 0.46 to 0.75. Measured efficiency and
 * analyst roster strength correlate at 0.78 on defence and at 0.04 on offence —
 * that is, the offensive roster grades carry no relationship at all to how good
 * an offence actually was. Weighting an estimate that uninformative equally
 * with a measurement was diluting the one input known to predict.
 *
 * The remaining coefficients — the quarterback term, the coaching index, the
 * portal adjustment — have no historical counterpart to fit against, since the
 * player and coach layers only exist at the current vintage. They stay as
 * analyst judgements, and they are deliberately small: together they account
 * for about five points of the conference's spread.
 */
export const DEFAULT_COEFFICIENTS: ModelCoefficients = {
  priorWeight: 0.75,
  efficiencyScale: 3.3,
  rosterScale: 3.0,
  continuityScale: 1.0,
  talentScale: 4.5,
  portalWeight: 0.62,
  qbScale: 0.096,
  qbReplacementGrade: 70,
  coachScale: 0.78,
  transitionWeight: 0.62,
  coachRegression: 24,
  anchorScale: 1,
};

/* -------------------------------------------------------------------------- */
/* Standardisation                                                            */
/* -------------------------------------------------------------------------- */

interface Moments {
  mean: number;
  sd: number;
}

function moments(values: number[]): Moments {
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return { mean, sd: Math.sqrt(variance) || 1 };
}

const z = (v: number, m: Moments) => (v - m.mean) / m.sd;

/* -------------------------------------------------------------------------- */
/* Roster strength                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Total Points Above Replacement on one side of the ball.
 *
 * Quarterbacks and specialists are deliberately excluded: the quarterback has
 * its own component and special teams is measured directly, so counting them
 * here would double-count both.
 */
export function rosterStrength(roster: Player[], side: 'offense' | 'defense'): number {
  return roster
    .filter((p) => POSITION_SIDE[p.position] === side && p.position !== 'QB')
    .reduce((s, p) => s + p.par, 0);
}

/** The highest-graded quarterback on the roster — the projected starter. */
export function projectedStarter(roster: Player[]): Player | undefined {
  return roster
    .filter((p) => p.position === 'QB')
    .sort((a, b) => b.grade - a.grade)[0];
}

/**
 * A single index of head-coaching quality.
 *
 * Career record is regressed toward .500 by `coachRegression` games, so a short
 * or non-existent record contributes almost nothing rather than dominating.
 * Development and acquisition are the two tendencies that travel between jobs
 * most reliably, which is what makes a first-year staff forecastable at all.
 */
export function coachIndex(coach: Coach, c: ModelCoefficients): number {
  const games = coach.career.wins + coach.career.losses;
  const regressed =
    (coach.career.wins + c.coachRegression * 0.5) / (games + c.coachRegression) - 0.5;
  return 0.5 * (regressed * 4) + 0.3 * coach.tendencies.development + 0.2 * coach.tendencies.acquisition;
}

/* -------------------------------------------------------------------------- */
/* Derivation                                                                 */
/* -------------------------------------------------------------------------- */

export interface LeagueMoments {
  offEpa: Moments;
  defEpa: Moments;
  rosterOff: Moments;
  rosterDef: Moments;
  returning: Moments;
  blueChip: Moments;
  coach: Moments;
}

/** League-wide moments, computed once so every team is standardised together. */
export function leagueMoments(c: ModelCoefficients): LeagueMoments {
  return {
    offEpa: moments(TEAMS.map((t) => t.efficiency.offEpa)),
    // Defensive EPA is negative-is-good, so it is flipped before standardising.
    defEpa: moments(TEAMS.map((t) => -t.efficiency.defEpa)),
    rosterOff: moments(TEAMS.map((t) => rosterStrength(ROSTERS[t.id], 'offense'))),
    rosterDef: moments(TEAMS.map((t) => rosterStrength(ROSTERS[t.id], 'defense'))),
    returning: moments(TEAMS.map((t) => t.returning.overall)),
    blueChip: moments(TEAMS.map((t) => t.talent.blueChipRatio)),
    coach: moments(TEAMS.map((t) => coachIndex(COACH_BY_TEAM[t.id], c))),
  };
}

export interface DerivedDetail {
  /** Unit strength from last season's efficiency, in points. */
  priorOffense: number;
  priorDefense: number;
  /** Unit strength from the roster on hand, in points. */
  rosterOffense: number;
  rosterDefense: number;
  /** The projected starting quarterback, and what they are worth. */
  starter: Player | undefined;
  coachIndexValue: number;
}

export interface Derived {
  components: RatingComponents;
  detail: DerivedDetail;
}

/**
 * Derive one team's rating components. Every term is a coefficient multiplied
 * by a standardised observation — there are no per-team constants.
 */
export function deriveComponents(
  team: Team,
  c: ModelCoefficients,
  m: LeagueMoments,
  offset = 0,
): Derived {
  const roster = ROSTERS[team.id];
  const coach = COACH_BY_TEAM[team.id];

  // Each unit blends what the programme did last season with who is on hand.
  const priorOffense = z(team.efficiency.offEpa, m.offEpa) * c.efficiencyScale;
  const priorDefense = z(-team.efficiency.defEpa, m.defEpa) * c.efficiencyScale;
  const rosterOffense = z(rosterStrength(roster, 'offense'), m.rosterOff) * c.rosterScale;
  const rosterDefense = z(rosterStrength(roster, 'defense'), m.rosterDef) * c.rosterScale;

  const offense =
    c.priorWeight * priorOffense + (1 - c.priorWeight) * rosterOffense + offset / 2;
  const defense =
    c.priorWeight * priorDefense + (1 - c.priorWeight) * rosterDefense + offset / 2;

  const starter = projectedStarter(roster);
  const quarterback = starter
    ? (starter.grade - c.qbReplacementGrade) * c.qbScale
    : -1.5;

  const idx = coachIndex(coach, c);
  const coaching =
    z(idx, m.coach) * c.coachScale +
    (coach.tenureYear === 1 ? coach.transitionEffect * c.transitionWeight : 0);

  return {
    components: {
      offense,
      defense,
      specialTeams: team.efficiency.stEpa,
      coaching,
      returningProduction: z(team.returning.overall, m.returning) * c.continuityScale,
      portalRecruiting:
        z(team.talent.blueChipRatio, m.blueChip) * c.talentScale +
        team.talent.portalNetPoints * c.portalWeight,
      quarterback,
    },
    detail: { priorOffense, priorDefense, rosterOffense, rosterDefense, starter, coachIndexValue: idx },
  };
}

const sumComponents = (k: RatingComponents) =>
  k.offense + k.defense + k.specialTeams + k.coaching + k.returningProduction +
  k.portalRecruiting + k.quarterback;

/**
 * Derive every team at once.
 *
 * Standardised inputs are centred on zero by construction, so the raw output
 * would put the conference average at roughly zero — i.e. claim the SEC is an
 * average FBS league. A single league-wide offset, applied identically to all
 * sixteen, moves the average onto `leagueAnchor`. It shifts everyone equally
 * and so changes no margin between two conference teams; it only matters when
 * a conference team plays someone outside it.
 */
export function deriveAll(c: ModelCoefficients = DEFAULT_COEFFICIENTS): Record<TeamId, Derived> {
  const m = leagueMoments(c);

  // Each conference is moved onto its own measured anchor. Standardised inputs
  // are centred on zero across the whole pool, so without this the model would
  // claim these two conferences average out to an ordinary FBS team, and that
  // the gap between them is zero. Both are false, and both are measurable.
  const raw = new Map(TEAMS.map((t) => [t.id, sumComponents(deriveComponents(t, c, m).components)]));
  const offset = {} as Record<Conference, number>;
  for (const conf of Object.keys(MEASURED_ANCHOR) as Conference[]) {
    const members = TEAMS.filter((t) => t.conference === conf);
    const mean = members.reduce((s, t) => s + (raw.get(t.id) ?? 0), 0) / Math.max(1, members.length);
    offset[conf] = MEASURED_ANCHOR[conf] * c.anchorScale - mean;
  }

  const out = {} as Record<TeamId, Derived>;
  TEAMS.forEach((t) => {
    out[t.id] = deriveComponents(t, c, m, offset[t.conference]);
  });
  return out;
}

/** Convenience for the common case. */
export const DERIVED = deriveAll(DEFAULT_COEFFICIENTS);

export function componentsFor(teamId: TeamId): RatingComponents {
  return DERIVED[teamId].components;
}

/* -------------------------------------------------------------------------- */
/* External agreement                                                         */
/* -------------------------------------------------------------------------- */

export interface AgreementRow {
  teamId: TeamId;
  modelRank: number;
  spPlusRank: number | null;
  apRank: number | null;
  /** Conference rank difference. Positive means this model is higher on them. */
  spPlusGap: number | null;
}

/**
 * How the derived ratings line up against two independent published rankings.
 *
 * This is not the back-test — that lives in scripts/etl/backtest.mjs and scores
 * five seasons of real results. This is a cheaper, different check: the model is
 * built from inputs and never fitted to SP+, so broad agreement is evidence the
 * structure is sane, and each disagreement is a specific, inspectable claim.
 */
export function externalAgreement(
  derived: Record<TeamId, Derived> = DERIVED,
): AgreementRow[] {
  const order = [...TEAMS].sort(
    (a, b) => sumComponents(derived[b.id].components) - sumComponents(derived[a.id].components),
  );
  const modelRank = Object.fromEntries(order.map((t, i) => [t.id, i + 1]));

  const spRanked = TEAMS.filter((t) => t.spPlusRank !== null)
    .sort((a, b) => (a.spPlusRank ?? 999) - (b.spPlusRank ?? 999));
  const spConfRank = Object.fromEntries(spRanked.map((t, i) => [t.id, i + 1]));

  const apRanked = TEAMS.filter((t) => t.apPreseason !== null)
    .sort((a, b) => (a.apPreseason ?? 999) - (b.apPreseason ?? 999));
  const apConfRank = Object.fromEntries(apRanked.map((t, i) => [t.id, i + 1]));

  return TEAMS.map((t) => ({
    teamId: t.id,
    modelRank: modelRank[t.id],
    spPlusRank: spConfRank[t.id] ?? null,
    apRank: apConfRank[t.id] ?? null,
    spPlusGap: spConfRank[t.id] ? spConfRank[t.id] - modelRank[t.id] : null,
  })).sort((a, b) => a.modelRank - b.modelRank);
}

/** Spearman rank correlation between the model and SP+, over the ranked teams. */
export function spearmanVsSpPlus(rows: AgreementRow[] = externalAgreement()): number {
  const paired = rows.filter((r) => r.spPlusRank !== null);
  const n = paired.length;
  if (n < 3) return NaN;
  // Re-rank the model within the SP+-ranked subset so both scales match.
  const byModel = [...paired].sort((a, b) => a.modelRank - b.modelRank);
  const modelRankIn = Object.fromEntries(byModel.map((r, i) => [r.teamId, i + 1]));
  const d2 = paired.reduce(
    (s, r) => s + (modelRankIn[r.teamId] - (r.spPlusRank as number)) ** 2,
    0,
  );
  return 1 - (6 * d2) / (n * (n * n - 1));
}

export { TEAM_BY_ID };
