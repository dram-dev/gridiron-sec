/* ============================================================================
 * Gridiron SEC — domain model
 *
 * Every record carries provenance. `verified` values were sourced from public
 * reporting during the build; `modeled` values are analyst estimates derived
 * from the verified layer. The UI surfaces this distinction so nobody mistakes
 * an estimate for a measurement.
 * ========================================================================== */

export type Provenance = 'verified' | 'modeled';

export type TeamId =
  | 'ALA' | 'ARK' | 'AUB' | 'FLA' | 'UGA' | 'UK' | 'LSU' | 'MISS'
  | 'MSST' | 'MIZ' | 'OU' | 'SC' | 'TENN' | 'TEX' | 'TAM' | 'VAN';

export type Position =
  | 'QB' | 'RB' | 'WR' | 'TE' | 'OT' | 'IOL'
  | 'EDGE' | 'DL' | 'LB' | 'CB' | 'S' | 'K' | 'P';

export type PositionGroup = 'QB' | 'Backfield' | 'Receiver' | 'OL' | 'Front' | 'Coverage' | 'Specialist';

export type ClassYear = 'FR' | 'RS-FR' | 'SO' | 'JR' | 'SR';

export type PlayerOrigin = 'returning' | 'transfer' | 'freshman';

export type Availability = 'active' | 'limited' | 'out';

/* -------------------------------------------------------------------------- */
/* Venues                                                                     */
/* -------------------------------------------------------------------------- */

export interface Venue {
  name: string;
  city: string;
  state: string;
  capacity: number;
  /** Points of home-field advantage this venue is worth, above a neutral site. */
  hfa: number;
  opened: number;
}

/* -------------------------------------------------------------------------- */
/* Team efficiency                                                            */
/* -------------------------------------------------------------------------- */

/** Per-play efficiency profile from the prior season, opponent-adjusted. */
export interface EfficiencyProfile {
  /** Offensive EPA per play. Elite ≈ +0.25, average 0, poor ≈ −0.15. */
  offEpa: number;
  /** Defensive EPA per play allowed. Lower is better. */
  defEpa: number;
  /** Share of plays that "succeed" (50% of needed yards on 1st, 70% 2nd, 100% 3rd/4th). */
  offSuccess: number;
  defSuccess: number;
  /** Average EPA on successful plays — the big-play dimension. */
  offExplosive: number;
  defExplosive: number;
  /** Points per scoring opportunity (first down inside the opponent 40). */
  finishing: number;
  finishingAllowed: number;
  /** Share of plays ending in a TFL, forced fumble, INT or PBU. */
  havoc: number;
  havocAllowed: number;
  /** Line yards per rush — the OL/DL push metric. */
  lineYards: number;
  lineYardsAllowed: number;
  sackRate: number;
  sackRateAllowed: number;
  /** Neutral-situation pass rate and pass rate over expected. */
  passRate: number;
  proe: number;
  playsPerGame: number;
  secondsPerPlay: number;
  fourthDownGoRate: number;
  turnoverMargin: number;
  redZoneTdRate: number;
  redZoneTdRateAllowed: number;
  /** Special-teams value in points per game above average. */
  stEpa: number;
  /** Starting field position, own yard line. */
  startingFieldPos: number;
}

/**
 * A team's rating is the sum of these parts, in points per game above an
 * average FBS team on a neutral field. Keeping them separate is what makes the
 * projection explainable — and what lets scenarios move one lever at a time.
 */
export interface RatingComponents {
  /** Returning offensive unit strength, opponent- and talent-adjusted. */
  offense: number;
  defense: number;
  specialTeams: number;
  /** Head-coach effect: program trajectory, development, in-game management. */
  coaching: number;
  /** Continuity credit/debit from returning production. */
  returningProduction: number;
  /** Net value of the transfer portal cycle and incoming recruiting class. */
  portalRecruiting: number;
  /** Quarterback value above a replacement-level SEC starter. */
  quarterback: number;
}

/** How much of each adjustment component lands on the offensive side. */
export const COMPONENT_OFFENSE_SHARE: Record<keyof RatingComponents, number> = {
  offense: 1,
  defense: 0,
  specialTeams: 0.5,
  coaching: 0.55,
  returningProduction: 0.5,
  portalRecruiting: 0.5,
  quarterback: 1,
};

export interface ReturningProduction {
  /** Share of last year's total production returning, 0–1. */
  overall: number;
  offense: number;
  defense: number;
  passingYards: number;
  rushingYards: number;
  receivingYards: number;
  tackles: number;
  /** Returning career starts along the offensive line. */
  olStarts: number;
}

export interface TalentProfile {
  /** Share of the two-deep that were blue-chip (4★/5★) recruits. */
  blueChipRatio: number;
  /** Four-year weighted recruiting composite, 0–1000. */
  composite: number;
  recruitClassRank: number;
  portalClassRank: number;
  /** Net roster value added in the portal, in points of team rating. */
  portalNetPoints: number;
}

export interface SeasonRecord {
  wins: number;
  losses: number;
  confWins: number;
  confLosses: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface Team {
  id: TeamId;
  school: string;
  mascot: string;
  abbr: string;
  location: string;
  /** Team colors, used as data-visualization accents. */
  primary: string;
  secondary: string;
  /** A readable, WCAG-safe version of the primary color for text on dark. */
  onDark: string;
  onLight: string;
  venue: Venue;
  coachId: string;
  joined: number;
  record2025: SeasonRecord;
  efficiency: EfficiencyProfile;
  components: RatingComponents;
  returning: ReturningProduction;
  talent: TalentProfile;
  /** Preseason poll and computer-rating anchors, for model-vs-market contrast. */
  apPreseason: number | null;
  spPlusRank: number | null;
  /** Three annual conference opponents under the 2026 nine-game format. */
  annualOpponents: TeamId[];
  outlook: string;
  strengths: string[];
  concerns: string[];
  provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* Coaches                                                                    */
/* -------------------------------------------------------------------------- */

export interface CoachSeason {
  year: number;
  school: string;
  wins: number;
  losses: number;
  confWins?: number;
  confLosses?: number;
  note?: string;
}

/**
 * Coach tendencies are indexed −1 … +1 against the FBS mean. These persist
 * across jobs far better than roster production does, which is exactly why a
 * first-year staff is still forecastable.
 */
export interface CoachTendencies {
  /** −1 methodical … +1 sprint tempo. */
  pace: number;
  /** −1 run-first identity … +1 pass-first identity. */
  passIdentity: number;
  /** Fourth-down aggression against the analytics-optimal baseline. */
  fourthDown: number;
  /** Pressure/blitz rate on defense. */
  pressure: number;
  /** Reliance on the transfer portal versus high-school development. */
  portalReliance: number;
  /** Player development: production above what raw recruiting talent predicts. */
  development: number;
  /** Recruiting/roster acquisition strength. */
  acquisition: number;
  /** Performance relative to the closing spread as an underdog. */
  underdogEdge: number;
}

export interface CoachTrait {
  label: string;
  detail: string;
}

export interface Coach {
  id: string;
  name: string;
  teamId: TeamId;
  /** Season number at the current school, 1 = first year. */
  tenureYear: number;
  age: number | null;
  almaMater: string;
  previousRole: string;
  /** Career head-coaching record across all stops. */
  career: { wins: number; losses: number; seasons: number };
  /** Record at the current school only. */
  atSchool: { wins: number; losses: number };
  vsRanked: { wins: number; losses: number } | null;
  vsTop10: { wins: number; losses: number } | null;
  seasons: CoachSeason[];
  tendencies: CoachTendencies;
  archetype: string;
  archetypeBlurb: string;
  traits: CoachTrait[];
  /**
   * Modeled first-year effect in points. New staffs historically underperform
   * their roster talent in year one, then recover; elite hires invert this.
   */
  transitionEffect: number;
  /** Uncertainty multiplier applied to this team's game-to-game variance. */
  volatility: number;
  provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* Players                                                                    */
/* -------------------------------------------------------------------------- */

export interface PlayerUsage {
  /** Share of team snaps at the player's position group, 0–1. */
  snapShare: number;
  targetShare?: number;
  carryShare?: number;
  passAttemptShare?: number;
  /** Share of defensive pass-rush snaps. */
  rushSnapShare?: number;
}

export interface PlayerProduction {
  games: number;
  passYds?: number;
  passTd?: number;
  interceptions?: number;
  completions?: number;
  attempts?: number;
  rushYds?: number;
  rushTd?: number;
  carries?: number;
  receptions?: number;
  recYds?: number;
  recTd?: number;
  tackles?: number;
  tfl?: number;
  sacks?: number;
  passBreakups?: number;
  takeaways?: number;
}

export interface PlayerRates {
  /** Yards per attempt / carry / target, as applicable. */
  ypa?: number;
  ypc?: number;
  ypt?: number;
  /** EPA per play generated when this player is involved. */
  epaPerPlay?: number;
  /** Share of pass-rush snaps producing a pressure. */
  pressureRate?: number;
  /** Share of targets into this player's coverage that are completed. */
  completionAllowed?: number;
  missedTackleRate?: number;
  /** Explosive-play rate: gains of 15+ yards as a share of touches. */
  explosiveRate?: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: TeamId;
  position: Position;
  jersey: number | null;
  classYear: ClassYear;
  origin: PlayerOrigin;
  /** Previous school, for transfers. */
  from?: string;
  recruitStars: number | null;
  usage: PlayerUsage;
  production2025?: PlayerProduction;
  rates: PlayerRates;
  /** 0–100 projection grade for 2026. */
  grade: number;
  /**
   * Points Above Replacement: how many points of team rating are lost if this
   * player is replaced by the next man up for a full season.
   */
  par: number;
  /** Modeled probability of a materially better season than baseline. */
  breakoutOdds: number;
  /** Injury/availability risk for the season, 0–1. */
  durabilityRisk: number;
  accolades: string[];
  note: string;
  provenance: Provenance;
}

/* -------------------------------------------------------------------------- */
/* Schedule                                                                   */
/* -------------------------------------------------------------------------- */

export interface NonConferenceOpponent {
  id: string;
  name: string;
  conference: string;
  /** Rating in the same points-above-average units as SEC teams. */
  rating: number;
}

export interface Game {
  id: string;
  week: number;
  date: string;
  homeId: TeamId | string;
  awayId: TeamId | string;
  /** Set when the game is at neither team's home venue. */
  neutralSite?: string;
  conferenceGame: boolean;
  rivalry?: string;
  headline?: boolean;
}

export interface WeekMeta {
  week: number;
  date: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/* Dataset metadata                                                           */
/* -------------------------------------------------------------------------- */

export interface SourceRef {
  label: string;
  url: string;
  covers: string;
}

export interface DatasetMeta {
  season: number;
  compiled: string;
  /** Public reporting the verified layer was built from. */
  sources: SourceRef[];
  notes: string[];
}
