/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npm run etl
 *
 * Built from 173,339 plays across 1,012 games and 139 teams —
 * the 2025 season plus 56 games of 2026 through week 1 —
 * with 2026 returning-production and recruiting files.
 *
 * The two seasons are not averaged after the fact. Last season's games are
 * discounted inside the same fit, to about 2.2 games of weight in total, so the
 * season in progress takes over on its own as it is played: its share is
 * games / (games + 2.2). That trade-off is fitted, not chosen — see
 * scripts/etl/inseason.mjs.
 *
 * Quality metrics are opponent-adjusted: each is fit as `mu + offence − defence`
 * over every FBS game in the season, ridge-regularised, with the ridge weight
 * chosen per metric by five-fold cross-validation on held-out games. Pace and
 * style metrics (tempo, pass rate, fourth-down aggression, special teams, field
 * position, turnover margin) are season rates, left unadjusted on purpose.
 *
 * Sources, pinned in scripts/etl/sources.mjs:
 *   play_by_play_2025.parquet
 *     Every play of the 2025 FBS season, with EPA, success, havoc and line yards attached.
 *   play_by_play_2026.parquet
 *     The season in progress. Empty in August, and the dominant input by October.
 *   cfb_returning_production_2026.parquet
 *     Share of 2025 production returning to each 2026 roster, by side of the ball.
 *   cfb_team_talent_2026.parquet
 *     Four-year weighted recruiting composite and blue-chip ratio for each 2026 roster.
 *   cfb_rosters_2025.parquet
 *     Every rostered FBS player in 2025 with position, jersey and class — carries the same athlete id the play-by-play does.
 *   cfb_schedules_2025.parquet
 *     Every 2025 game with division, conference and neutral-site flags — what tells an FBS opponent from an FCS one.
 *   cfb_schedules_2026.parquet
 *     The full 2026 slate for both conferences: opponents, sites, kickoff dates, and results as they are played.
 * ========================================================================== */

import type { EfficiencyProfile, SeasonRecord, TeamId } from './types';

export interface MeasuredReturning {
  overall: number;
  offense: number;
  defense: number;
}

export interface MeasuredTalent {
  blueChipRatio: number;
  composite: number;
}

/** How the measured layer was built — surfaced in the app's methodology page. */
export const MEASURED_META = {
  "priorSeason": 2025,
  "projectionSeason": 2026,
  "throughWeek": 1,
  "currentGames": 56,
  "priorSeasonGames": 2.2,
  "plays": 173339,
  "scrimmagePlays": 131158,
  "games": 1012,
  "teams": 139,
  "builtAt": "2026-09-05",
  "marginR2": {
    "adjusted": 0.392,
    "raw": 0.251
  },
  "tuning": {
    "epa": {
      "lambda": 200,
      "error": 0.039987178959785846,
      "observations": 2024
    },
    "success": {
      "lambda": 200,
      "error": 0.006130000999056604,
      "observations": 2024
    },
    "successEpa": {
      "lambda": 800,
      "error": 0.055357514727991025,
      "observations": 2022
    },
    "lineYards": {
      "lambda": 400,
      "error": 0.2666870169752562,
      "observations": 2024
    },
    "sackRate": {
      "lambda": 800,
      "error": 0.002390226656223017,
      "observations": 2022
    },
    "havoc": {
      "lambda": 1600,
      "error": 0.0034224704120470926,
      "observations": 2024
    },
    "finishing": {
      "lambda": 100,
      "error": 2.8271476318019766,
      "observations": 2006
    },
    "redZoneTd": {
      "lambda": 800,
      "error": 0.10127287243874775,
      "observations": 1910
    }
  }
} as const;

/**
 * Points per game each conference is worth above an average FBS team, fitted
 * from scoring margins across every FBS game with home advantage removed.
 *
 * The model's components are standardised, so they place the pool average at
 * zero. These numbers are what move it back to where the results say it
 * belongs, and they are the only thing separating the two conferences on an
 * absolute scale — no margin *inside* a conference depends on them.
 */
export const MEASURED_ANCHOR = {
  "SEC": 8.56,
  "B1G": 7.06
} as const;

/** Home-field advantage across the same games, in points. */
export const MEASURED_HFA = 3.9;

/**
 * Every FBS team's scoring margin against an average FBS opponent on a neutral
 * field, from the same fit the conference anchors come from.
 *
 * This is what a non-conference opponent is worth. Those ratings used to be
 * authored one by one, on a scale that had drifted well away from the one the
 * projection itself uses; here they are the projection's own scale by
 * construction, so a September opponent and a November one are directly
 * comparable.
 */
export const MEASURED_OPPONENT: Record<string, { name: string; conference: string; rating: number }> =
  {
  "2": {
    "name": "Auburn",
    "conference": "SEC",
    "rating": 4.7
  },
  "5": {
    "name": "UAB",
    "conference": "American Athletic",
    "rating": -12
  },
  "6": {
    "name": "South Alabama",
    "conference": "Sun Belt",
    "rating": -8.4
  },
  "8": {
    "name": "Arkansas",
    "conference": "SEC",
    "rating": 2.1
  },
  "9": {
    "name": "Arizona State",
    "conference": "Big 12",
    "rating": 2.3
  },
  "12": {
    "name": "Arizona",
    "conference": "Big 12",
    "rating": 9
  },
  "16": {
    "name": "Sacramento State",
    "conference": "Mid-American",
    "rating": -18.6
  },
  "21": {
    "name": "San Diego State",
    "conference": "Mountain West",
    "rating": 4.4
  },
  "23": {
    "name": "San José State",
    "conference": "Mountain West",
    "rating": -6.7
  },
  "24": {
    "name": "Stanford",
    "conference": "ACC",
    "rating": -4
  },
  "25": {
    "name": "California",
    "conference": "ACC",
    "rating": -1.7
  },
  "26": {
    "name": "UCLA",
    "conference": "Big Ten",
    "rating": -4.4
  },
  "30": {
    "name": "USC",
    "conference": "Big Ten",
    "rating": 15.2
  },
  "36": {
    "name": "Colorado State",
    "conference": "Mountain West",
    "rating": -12.3
  },
  "38": {
    "name": "Colorado",
    "conference": "Big 12",
    "rating": -2.2
  },
  "41": {
    "name": "UConn",
    "conference": "FBS Independents",
    "rating": 4.7
  },
  "48": {
    "name": "Delaware",
    "conference": "Conference USA",
    "rating": -5.6
  },
  "52": {
    "name": "Florida State",
    "conference": "ACC",
    "rating": 7.5
  },
  "55": {
    "name": "Jacksonville State",
    "conference": "Conference USA",
    "rating": -9.4
  },
  "57": {
    "name": "Florida",
    "conference": "SEC",
    "rating": 2.6
  },
  "58": {
    "name": "South Florida",
    "conference": "American Athletic",
    "rating": 11.4
  },
  "59": {
    "name": "Georgia Tech",
    "conference": "ACC",
    "rating": 2.1
  },
  "61": {
    "name": "Georgia",
    "conference": "SEC",
    "rating": 10.5
  },
  "62": {
    "name": "Hawai'i",
    "conference": "Mountain West",
    "rating": -5.5
  },
  "66": {
    "name": "Iowa State",
    "conference": "Big 12",
    "rating": 0.6
  },
  "68": {
    "name": "Boise State",
    "conference": "Mountain West",
    "rating": 9.2
  },
  "77": {
    "name": "Northwestern",
    "conference": "Big Ten",
    "rating": 3.3
  },
  "84": {
    "name": "Indiana",
    "conference": "Big Ten",
    "rating": 32.1
  },
  "87": {
    "name": "Notre Dame",
    "conference": "FBS Independents",
    "rating": 23.1
  },
  "96": {
    "name": "Kentucky",
    "conference": "SEC",
    "rating": -0.6
  },
  "97": {
    "name": "Louisville",
    "conference": "ACC",
    "rating": 7.7
  },
  "98": {
    "name": "Western Kentucky",
    "conference": "Conference USA",
    "rating": -1.4
  },
  "99": {
    "name": "LSU",
    "conference": "SEC",
    "rating": 6.4
  },
  "103": {
    "name": "Boston College",
    "conference": "ACC",
    "rating": -1.8
  },
  "113": {
    "name": "Massachusetts",
    "conference": "Mid-American",
    "rating": -19.1
  },
  "120": {
    "name": "Maryland",
    "conference": "Big Ten",
    "rating": -3.1
  },
  "127": {
    "name": "Michigan State",
    "conference": "Big Ten",
    "rating": 2.4
  },
  "130": {
    "name": "Michigan",
    "conference": "Big Ten",
    "rating": 10.2
  },
  "135": {
    "name": "Minnesota",
    "conference": "Big Ten",
    "rating": 4.8
  },
  "142": {
    "name": "Missouri",
    "conference": "SEC",
    "rating": 10
  },
  "145": {
    "name": "Ole Miss",
    "conference": "SEC",
    "rating": 15.2
  },
  "150": {
    "name": "Duke",
    "conference": "ACC",
    "rating": 5.7
  },
  "151": {
    "name": "East Carolina",
    "conference": "American Athletic",
    "rating": 0.8
  },
  "152": {
    "name": "NC State",
    "conference": "ACC",
    "rating": 1.8
  },
  "153": {
    "name": "North Carolina",
    "conference": "ACC",
    "rating": -1.5
  },
  "154": {
    "name": "Wake Forest",
    "conference": "ACC",
    "rating": 3.8
  },
  "158": {
    "name": "Nebraska",
    "conference": "Big Ten",
    "rating": 7.7
  },
  "164": {
    "name": "Rutgers",
    "conference": "Big Ten",
    "rating": -11.9
  },
  "166": {
    "name": "New Mexico State",
    "conference": "Conference USA",
    "rating": -9
  },
  "167": {
    "name": "New Mexico",
    "conference": "Mountain West",
    "rating": 0.9
  },
  "183": {
    "name": "Syracuse",
    "conference": "ACC",
    "rating": 2.8
  },
  "189": {
    "name": "Bowling Green",
    "conference": "Mid-American",
    "rating": -18.9
  },
  "193": {
    "name": "Miami (OH)",
    "conference": "Mid-American",
    "rating": -11.4
  },
  "194": {
    "name": "Ohio State",
    "conference": "Big Ten",
    "rating": 24.3
  },
  "195": {
    "name": "Ohio",
    "conference": "Mid-American",
    "rating": -7.2
  },
  "197": {
    "name": "Oklahoma State",
    "conference": "Big 12",
    "rating": -12.2
  },
  "201": {
    "name": "Oklahoma",
    "conference": "SEC",
    "rating": 15.8
  },
  "202": {
    "name": "Tulsa",
    "conference": "American Athletic",
    "rating": -12.1
  },
  "204": {
    "name": "Oregon State",
    "conference": "Pac-12",
    "rating": -10.4
  },
  "213": {
    "name": "Penn State",
    "conference": "Big Ten",
    "rating": 8.8
  },
  "218": {
    "name": "Temple",
    "conference": "American Athletic",
    "rating": -10.1
  },
  "221": {
    "name": "Pittsburgh",
    "conference": "ACC",
    "rating": 14.3
  },
  "228": {
    "name": "Clemson",
    "conference": "ACC",
    "rating": 6.6
  },
  "235": {
    "name": "Memphis",
    "conference": "American Athletic",
    "rating": 4.3
  },
  "238": {
    "name": "Vanderbilt",
    "conference": "SEC",
    "rating": 14.4
  },
  "239": {
    "name": "Baylor",
    "conference": "Big 12",
    "rating": 1.1
  },
  "242": {
    "name": "Rice",
    "conference": "American Athletic",
    "rating": -15.4
  },
  "245": {
    "name": "Texas A&M",
    "conference": "SEC",
    "rating": 13.8
  },
  "248": {
    "name": "Houston",
    "conference": "Big 12",
    "rating": 2.3
  },
  "249": {
    "name": "North Texas",
    "conference": "American Athletic",
    "rating": 7.7
  },
  "251": {
    "name": "Texas",
    "conference": "SEC",
    "rating": 10.9
  },
  "252": {
    "name": "BYU",
    "conference": "Big 12",
    "rating": 13.1
  },
  "254": {
    "name": "Utah",
    "conference": "Big 12",
    "rating": 18.9
  },
  "256": {
    "name": "James Madison",
    "conference": "Sun Belt",
    "rating": 9.1
  },
  "258": {
    "name": "Virginia",
    "conference": "ACC",
    "rating": 12.4
  },
  "259": {
    "name": "Virginia Tech",
    "conference": "ACC",
    "rating": -3.6
  },
  "264": {
    "name": "Washington",
    "conference": "Big Ten",
    "rating": 11.5
  },
  "265": {
    "name": "Washington State",
    "conference": "Pac-12",
    "rating": 1.9
  },
  "275": {
    "name": "Wisconsin",
    "conference": "Big Ten",
    "rating": -0.4
  },
  "276": {
    "name": "Marshall",
    "conference": "Sun Belt",
    "rating": -2.3
  },
  "277": {
    "name": "West Virginia",
    "conference": "Big 12",
    "rating": -4.9
  },
  "278": {
    "name": "Fresno State",
    "conference": "Mountain West",
    "rating": -5.1
  },
  "290": {
    "name": "Georgia Southern",
    "conference": "Sun Belt",
    "rating": -8.2
  },
  "295": {
    "name": "Old Dominion",
    "conference": "Sun Belt",
    "rating": 8
  },
  "309": {
    "name": "Louisiana",
    "conference": "Sun Belt",
    "rating": -8.2
  },
  "324": {
    "name": "Coastal Carolina",
    "conference": "Sun Belt",
    "rating": -10.7
  },
  "326": {
    "name": "Texas State",
    "conference": "Sun Belt",
    "rating": 0.2
  },
  "328": {
    "name": "Utah State",
    "conference": "Mountain West",
    "rating": -0.8
  },
  "333": {
    "name": "Alabama",
    "conference": "SEC",
    "rating": 18.9
  },
  "338": {
    "name": "Kennesaw State",
    "conference": "Conference USA",
    "rating": 1.4
  },
  "344": {
    "name": "Mississippi State",
    "conference": "SEC",
    "rating": 0.9
  },
  "349": {
    "name": "Army",
    "conference": "American Athletic",
    "rating": 4.4
  },
  "356": {
    "name": "Illinois",
    "conference": "Big Ten",
    "rating": 5.8
  },
  "2005": {
    "name": "Air Force",
    "conference": "Mountain West",
    "rating": -2
  },
  "2006": {
    "name": "Akron",
    "conference": "Mid-American",
    "rating": -14.4
  },
  "2026": {
    "name": "App State",
    "conference": "Sun Belt",
    "rating": -14.6
  },
  "2032": {
    "name": "Arkansas State",
    "conference": "Sun Belt",
    "rating": -7.6
  },
  "2050": {
    "name": "Ball State",
    "conference": "Mid-American",
    "rating": -19.4
  },
  "2084": {
    "name": "Buffalo",
    "conference": "Mid-American",
    "rating": -14.9
  },
  "2116": {
    "name": "UCF",
    "conference": "Big 12",
    "rating": 9.5
  },
  "2117": {
    "name": "Central Michigan",
    "conference": "Mid-American",
    "rating": -7.3
  },
  "2132": {
    "name": "Cincinnati",
    "conference": "Big 12",
    "rating": 1.6
  },
  "2199": {
    "name": "Eastern Michigan",
    "conference": "Mid-American",
    "rating": -12.1
  },
  "2226": {
    "name": "Florida Atlantic",
    "conference": "American Athletic",
    "rating": -9.5
  },
  "2229": {
    "name": "Florida International",
    "conference": "Conference USA",
    "rating": -6.7
  },
  "2247": {
    "name": "Georgia State",
    "conference": "Sun Belt",
    "rating": -7
  },
  "2294": {
    "name": "Iowa",
    "conference": "Big Ten",
    "rating": 12.8
  },
  "2305": {
    "name": "Kansas",
    "conference": "Big 12",
    "rating": 5.2
  },
  "2306": {
    "name": "Kansas State",
    "conference": "Big 12",
    "rating": 3.9
  },
  "2309": {
    "name": "Kent State",
    "conference": "Mid-American",
    "rating": -22.8
  },
  "2335": {
    "name": "Liberty",
    "conference": "Conference USA",
    "rating": -3
  },
  "2348": {
    "name": "Louisiana Tech",
    "conference": "Conference USA",
    "rating": -0.6
  },
  "2390": {
    "name": "Miami",
    "conference": "ACC",
    "rating": 24.4
  },
  "2393": {
    "name": "Middle Tennessee",
    "conference": "Conference USA",
    "rating": -12.9
  },
  "2426": {
    "name": "Navy",
    "conference": "American Athletic",
    "rating": -4.9
  },
  "2429": {
    "name": "Charlotte",
    "conference": "American Athletic",
    "rating": -20
  },
  "2433": {
    "name": "UL Monroe",
    "conference": "Sun Belt",
    "rating": -16.1
  },
  "2439": {
    "name": "UNLV",
    "conference": "Mountain West",
    "rating": -1.5
  },
  "2440": {
    "name": "Nevada",
    "conference": "Mountain West",
    "rating": -10.1
  },
  "2449": {
    "name": "North Dakota State",
    "conference": "Mountain West",
    "rating": -3.9
  },
  "2459": {
    "name": "Northern Illinois",
    "conference": "Mid-American",
    "rating": -13.6
  },
  "2483": {
    "name": "Oregon",
    "conference": "Big Ten",
    "rating": 14.8
  },
  "2509": {
    "name": "Purdue",
    "conference": "Big Ten",
    "rating": -6.6
  },
  "2534": {
    "name": "Sam Houston",
    "conference": "Conference USA",
    "rating": -19.2
  },
  "2567": {
    "name": "SMU",
    "conference": "ACC",
    "rating": 10.6
  },
  "2572": {
    "name": "Southern Miss",
    "conference": "Sun Belt",
    "rating": -6.1
  },
  "2579": {
    "name": "South Carolina",
    "conference": "SEC",
    "rating": 11.1
  },
  "2623": {
    "name": "Missouri State",
    "conference": "Conference USA",
    "rating": -6.7
  },
  "2628": {
    "name": "TCU",
    "conference": "Big 12",
    "rating": 2
  },
  "2633": {
    "name": "Tennessee",
    "conference": "SEC",
    "rating": 0.2
  },
  "2636": {
    "name": "UTSA",
    "conference": "American Athletic",
    "rating": -5.3
  },
  "2638": {
    "name": "UTEP",
    "conference": "Conference USA",
    "rating": -17.2
  },
  "2641": {
    "name": "Texas Tech",
    "conference": "Big 12",
    "rating": 22.6
  },
  "2649": {
    "name": "Toledo",
    "conference": "Mid-American",
    "rating": 3.5
  },
  "2653": {
    "name": "Troy",
    "conference": "Sun Belt",
    "rating": -4.7
  },
  "2655": {
    "name": "Tulane",
    "conference": "American Athletic",
    "rating": 2.6
  },
  "2711": {
    "name": "Western Michigan",
    "conference": "Mid-American",
    "rating": -0.4
  },
  "2751": {
    "name": "Wyoming",
    "conference": "Mountain West",
    "rating": -8.2
  },
  "FCS": {
    "name": "FCS opponent",
    "conference": "FCS",
    "rating": -28.5
  }
};

/** Opponent-adjusted 2025 efficiency, one entry per projected team. */
export const MEASURED_EFFICIENCY: Record<TeamId, EfficiencyProfile> = {
  AUB: {
    offEpa: 0.101,
    defEpa: -0.006,
    offSuccess: 0.457,
    defSuccess: 0.411,
    offExplosive: 1.208,
    defExplosive: 1.25,
    finishing: 2.01,
    finishingAllowed: 1.94,
    havoc: 0.136,
    havocAllowed: 0.132,
    lineYards: 3.05,
    lineYardsAllowed: 2.66,
    sackRate: 0.066,
    sackRateAllowed: 0.071,
    passRate: 0.475,
    dropbackRate: 0.506,
    proe: 0,
    playsPerGame: 48,
    secondsPerPlay: 24.8,
    fourthDownGoRate: 0.17,
    turnoverMargin: 0.38,
    redZoneTdRate: 0.389,
    redZoneTdRateAllowed: 0.396,
    stEpa: -0.42,
    startingFieldPos: 28.1,
  },
  ARK: {
    offEpa: 0.206,
    defEpa: 0.168,
    offSuccess: 0.502,
    defSuccess: 0.477,
    offExplosive: 1.259,
    defExplosive: 1.235,
    finishing: 2.38,
    finishingAllowed: 2.23,
    havoc: 0.127,
    havocAllowed: 0.13,
    lineYards: 3.05,
    lineYardsAllowed: 3,
    sackRate: 0.06,
    sackRateAllowed: 0.061,
    passRate: 0.455,
    dropbackRate: 0.524,
    proe: 0.018,
    playsPerGame: 65,
    secondsPerPlay: 26.9,
    fourthDownGoRate: 0.17,
    turnoverMargin: -0.67,
    redZoneTdRate: 0.401,
    redZoneTdRateAllowed: 0.394,
    stEpa: -2.63,
    startingFieldPos: 27.3,
  },
  UCLA: {
    offEpa: 0.072,
    defEpa: 0.101,
    offSuccess: 0.451,
    defSuccess: 0.473,
    offExplosive: 1.21,
    defExplosive: 1.19,
    finishing: 1.87,
    finishingAllowed: 2.47,
    havoc: 0.124,
    havocAllowed: 0.133,
    lineYards: 2.95,
    lineYardsAllowed: 3,
    sackRate: 0.052,
    sackRateAllowed: 0.062,
    passRate: 0.48,
    dropbackRate: 0.531,
    proe: 0.014,
    playsPerGame: 62.2,
    secondsPerPlay: 27.7,
    fourthDownGoRate: 0.3,
    turnoverMargin: -0.58,
    redZoneTdRate: 0.389,
    redZoneTdRateAllowed: 0.4,
    stEpa: 1.24,
    startingFieldPos: 26.3,
  },
  USC: {
    offEpa: 0.274,
    defEpa: 0.045,
    offSuccess: 0.561,
    defSuccess: 0.458,
    offExplosive: 1.202,
    defExplosive: 1.197,
    finishing: 3.36,
    finishingAllowed: 2.07,
    havoc: 0.126,
    havocAllowed: 0.111,
    lineYards: 3.09,
    lineYardsAllowed: 2.95,
    sackRate: 0.068,
    sackRateAllowed: 0.047,
    passRate: 0.472,
    dropbackRate: 0.505,
    proe: 0.069,
    playsPerGame: 66.9,
    secondsPerPlay: 30.4,
    fourthDownGoRate: 0.56,
    turnoverMargin: 0.13,
    redZoneTdRate: 0.404,
    redZoneTdRateAllowed: 0.393,
    stEpa: -1.68,
    startingFieldPos: 28.4,
  },
  FLA: {
    offEpa: 0.038,
    defEpa: 0.016,
    offSuccess: 0.468,
    defSuccess: 0.432,
    offExplosive: 1.174,
    defExplosive: 1.208,
    finishing: 2.04,
    finishingAllowed: 2,
    havoc: 0.122,
    havocAllowed: 0.126,
    lineYards: 3.01,
    lineYardsAllowed: 2.84,
    sackRate: 0.063,
    sackRateAllowed: 0.058,
    passRate: 0.485,
    dropbackRate: 0.524,
    proe: 0.027,
    playsPerGame: 63,
    secondsPerPlay: 28.3,
    fourthDownGoRate: 0.14,
    turnoverMargin: -0.17,
    redZoneTdRate: 0.39,
    redZoneTdRateAllowed: 0.395,
    stEpa: 1.12,
    startingFieldPos: 27.6,
  },
  UGA: {
    offEpa: 0.201,
    defEpa: -0.067,
    offSuccess: 0.524,
    defSuccess: 0.399,
    offExplosive: 1.167,
    defExplosive: 1.194,
    finishing: 2.74,
    finishingAllowed: 2.05,
    havoc: 0.131,
    havocAllowed: 0.124,
    lineYards: 3,
    lineYardsAllowed: 2.79,
    sackRate: 0.054,
    sackRateAllowed: 0.052,
    passRate: 0.418,
    dropbackRate: 0.471,
    proe: 0.014,
    playsPerGame: 56.5,
    secondsPerPlay: 29.7,
    fourthDownGoRate: 0.28,
    turnoverMargin: -0.07,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.393,
    stEpa: 1.76,
    startingFieldPos: 30.4,
  },
  NW: {
    offEpa: 0.043,
    defEpa: 0.018,
    offSuccess: 0.45,
    defSuccess: 0.449,
    offExplosive: 1.205,
    defExplosive: 1.184,
    finishing: 1.89,
    finishingAllowed: 2.16,
    havoc: 0.125,
    havocAllowed: 0.133,
    lineYards: 2.88,
    lineYardsAllowed: 2.99,
    sackRate: 0.06,
    sackRateAllowed: 0.054,
    passRate: 0.427,
    dropbackRate: 0.476,
    proe: -0.005,
    playsPerGame: 63.8,
    secondsPerPlay: 29.6,
    fourthDownGoRate: 0.25,
    turnoverMargin: 0,
    redZoneTdRate: 0.389,
    redZoneTdRateAllowed: 0.398,
    stEpa: 0.57,
    startingFieldPos: 30.2,
  },
  IND: {
    offEpa: 0.313,
    defEpa: -0.101,
    offSuccess: 0.535,
    defSuccess: 0.373,
    offExplosive: 1.22,
    defExplosive: 1.242,
    finishing: 3.14,
    finishingAllowed: 1.21,
    havoc: 0.149,
    havocAllowed: 0.109,
    lineYards: 3.1,
    lineYardsAllowed: 2.77,
    sackRate: 0.065,
    sackRateAllowed: 0.056,
    passRate: 0.414,
    dropbackRate: 0.395,
    proe: -0.02,
    playsPerGame: 59.8,
    secondsPerPlay: 32,
    fourthDownGoRate: 0.26,
    turnoverMargin: 1.24,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.389,
    stEpa: 2.1,
    startingFieldPos: 32.5,
  },
  UK: {
    offEpa: 0.114,
    defEpa: 0.117,
    offSuccess: 0.48,
    defSuccess: 0.488,
    offExplosive: 1.195,
    defExplosive: 1.197,
    finishing: 2.22,
    finishingAllowed: 2.09,
    havoc: 0.126,
    havocAllowed: 0.131,
    lineYards: 3.1,
    lineYardsAllowed: 3.04,
    sackRate: 0.054,
    sackRateAllowed: 0.058,
    passRate: 0.448,
    dropbackRate: 0.497,
    proe: 0.03,
    playsPerGame: 61.3,
    secondsPerPlay: 29.2,
    fourthDownGoRate: 0.15,
    turnoverMargin: -0.46,
    redZoneTdRate: 0.389,
    redZoneTdRateAllowed: 0.395,
    stEpa: -0.82,
    startingFieldPos: 30,
  },
  LSU: {
    offEpa: 0.043,
    defEpa: -0.052,
    offSuccess: 0.435,
    defSuccess: 0.408,
    offExplosive: 1.233,
    defExplosive: 1.222,
    finishing: 2.03,
    finishingAllowed: 2.11,
    havoc: 0.13,
    havocAllowed: 0.13,
    lineYards: 2.82,
    lineYardsAllowed: 2.85,
    sackRate: 0.059,
    sackRateAllowed: 0.06,
    passRate: 0.551,
    dropbackRate: 0.585,
    proe: 0.094,
    playsPerGame: 61.8,
    secondsPerPlay: 27.3,
    fourthDownGoRate: 0.08,
    turnoverMargin: 0.54,
    redZoneTdRate: 0.39,
    redZoneTdRateAllowed: 0.391,
    stEpa: 1.62,
    startingFieldPos: 29.7,
  },
  MD: {
    offEpa: -0.017,
    defEpa: 0.029,
    offSuccess: 0.413,
    defSuccess: 0.462,
    offExplosive: 1.222,
    defExplosive: 1.204,
    finishing: 1.73,
    finishingAllowed: 2.1,
    havoc: 0.126,
    havocAllowed: 0.123,
    lineYards: 2.77,
    lineYardsAllowed: 3.01,
    sackRate: 0.058,
    sackRateAllowed: 0.046,
    passRate: 0.581,
    dropbackRate: 0.626,
    proe: 0.12,
    playsPerGame: 66,
    secondsPerPlay: 25.7,
    fourthDownGoRate: 0.21,
    turnoverMargin: 0.5,
    redZoneTdRate: 0.387,
    redZoneTdRateAllowed: 0.391,
    stEpa: 1.88,
    startingFieldPos: 29.8,
  },
  MSU: {
    offEpa: 0.097,
    defEpa: 0.108,
    offSuccess: 0.478,
    defSuccess: 0.436,
    offExplosive: 1.19,
    defExplosive: 1.276,
    finishing: 1.95,
    finishingAllowed: 2.21,
    havoc: 0.136,
    havocAllowed: 0.135,
    lineYards: 2.89,
    lineYardsAllowed: 2.86,
    sackRate: 0.062,
    sackRateAllowed: 0.068,
    passRate: 0.436,
    dropbackRate: 0.508,
    proe: 0.017,
    playsPerGame: 69.5,
    secondsPerPlay: 28,
    fourthDownGoRate: 0.32,
    turnoverMargin: -0.15,
    redZoneTdRate: 0.39,
    redZoneTdRateAllowed: 0.4,
    stEpa: 0.62,
    startingFieldPos: 29.5,
  },
  MICH: {
    offEpa: 0.147,
    defEpa: -0.006,
    offSuccess: 0.5,
    defSuccess: 0.419,
    offExplosive: 1.181,
    defExplosive: 1.217,
    finishing: 2.28,
    finishingAllowed: 2.18,
    havoc: 0.129,
    havocAllowed: 0.118,
    lineYards: 3.11,
    lineYardsAllowed: 2.83,
    sackRate: 0.061,
    sackRateAllowed: 0.058,
    passRate: 0.415,
    dropbackRate: 0.434,
    proe: -0.029,
    playsPerGame: 63.9,
    secondsPerPlay: 27.8,
    fourthDownGoRate: 0.12,
    turnoverMargin: 0.08,
    redZoneTdRate: 0.393,
    redZoneTdRateAllowed: 0.391,
    stEpa: 0.69,
    startingFieldPos: 30.9,
  },
  MINN: {
    offEpa: 0.04,
    defEpa: 0.055,
    offSuccess: 0.457,
    defSuccess: 0.427,
    offExplosive: 1.186,
    defExplosive: 1.223,
    finishing: 2.03,
    finishingAllowed: 2.46,
    havoc: 0.142,
    havocAllowed: 0.136,
    lineYards: 2.81,
    lineYardsAllowed: 2.9,
    sackRate: 0.066,
    sackRateAllowed: 0.052,
    passRate: 0.557,
    dropbackRate: 0.524,
    proe: 0.061,
    playsPerGame: 63.1,
    secondsPerPlay: 28.6,
    fourthDownGoRate: 0.1,
    turnoverMargin: 0.23,
    redZoneTdRate: 0.392,
    redZoneTdRateAllowed: 0.397,
    stEpa: 1.88,
    startingFieldPos: 32.7,
  },
  MIZ: {
    offEpa: 0.115,
    defEpa: 0.011,
    offSuccess: 0.466,
    defSuccess: 0.409,
    offExplosive: 1.225,
    defExplosive: 1.242,
    finishing: 1.94,
    finishingAllowed: 2.28,
    havoc: 0.133,
    havocAllowed: 0.121,
    lineYards: 3.07,
    lineYardsAllowed: 2.9,
    sackRate: 0.06,
    sackRateAllowed: 0.06,
    passRate: 0.412,
    dropbackRate: 0.432,
    proe: -0.041,
    playsPerGame: 70.9,
    secondsPerPlay: 27,
    fourthDownGoRate: 0.32,
    turnoverMargin: -0.64,
    redZoneTdRate: 0.38,
    redZoneTdRateAllowed: 0.399,
    stEpa: 1.95,
    startingFieldPos: 29.3,
  },
  MISS: {
    offEpa: 0.205,
    defEpa: -0.007,
    offSuccess: 0.499,
    defSuccess: 0.415,
    offExplosive: 1.228,
    defExplosive: 1.215,
    finishing: 2.52,
    finishingAllowed: 2.06,
    havoc: 0.129,
    havocAllowed: 0.12,
    lineYards: 2.85,
    lineYardsAllowed: 2.92,
    sackRate: 0.062,
    sackRateAllowed: 0.05,
    passRate: 0.488,
    dropbackRate: 0.5,
    proe: 0.058,
    playsPerGame: 72.1,
    secondsPerPlay: 23.4,
    fourthDownGoRate: 0.3,
    turnoverMargin: -0.13,
    redZoneTdRate: 0.4,
    redZoneTdRateAllowed: 0.394,
    stEpa: 1.81,
    startingFieldPos: 28.2,
  },
  NEB: {
    offEpa: 0.153,
    defEpa: 0.048,
    offSuccess: 0.49,
    defSuccess: 0.439,
    offExplosive: 1.208,
    defExplosive: 1.208,
    finishing: 2.65,
    finishingAllowed: 2.3,
    havoc: 0.129,
    havocAllowed: 0.123,
    lineYards: 3.13,
    lineYardsAllowed: 2.98,
    sackRate: 0.06,
    sackRateAllowed: 0.066,
    passRate: 0.466,
    dropbackRate: 0.488,
    proe: 0.032,
    playsPerGame: 66.1,
    secondsPerPlay: 26.9,
    fourthDownGoRate: 0.19,
    turnoverMargin: 0.21,
    redZoneTdRate: 0.395,
    redZoneTdRateAllowed: 0.404,
    stEpa: 1.24,
    startingFieldPos: 32.1,
  },
  RUT: {
    offEpa: 0.048,
    defEpa: 0.278,
    offSuccess: 0.45,
    defSuccess: 0.501,
    offExplosive: 1.257,
    defExplosive: 1.256,
    finishing: 1.96,
    finishingAllowed: 2.77,
    havoc: 0.118,
    havocAllowed: 0.144,
    lineYards: 2.82,
    lineYardsAllowed: 3.13,
    sackRate: 0.052,
    sackRateAllowed: 0.076,
    passRate: 0.473,
    dropbackRate: 0.555,
    proe: 0.051,
    playsPerGame: 67.6,
    secondsPerPlay: 25.9,
    fourthDownGoRate: 0.3,
    turnoverMargin: -0.15,
    redZoneTdRate: 0.386,
    redZoneTdRateAllowed: 0.399,
    stEpa: 1.63,
    startingFieldPos: 29,
  },
  OSU: {
    offEpa: 0.242,
    defEpa: -0.152,
    offSuccess: 0.533,
    defSuccess: 0.364,
    offExplosive: 1.194,
    defExplosive: 1.183,
    finishing: 2.86,
    finishingAllowed: 1.55,
    havoc: 0.139,
    havocAllowed: 0.117,
    lineYards: 3,
    lineYardsAllowed: 2.8,
    sackRate: 0.06,
    sackRateAllowed: 0.053,
    passRate: 0.491,
    dropbackRate: 0.509,
    proe: 0.081,
    playsPerGame: 64.5,
    secondsPerPlay: 30.4,
    fourthDownGoRate: 0.31,
    turnoverMargin: 0.4,
    redZoneTdRate: 0.405,
    redZoneTdRateAllowed: 0.387,
    stEpa: 0.16,
    startingFieldPos: 28.9,
  },
  OU: {
    offEpa: 0.059,
    defEpa: -0.171,
    offSuccess: 0.452,
    defSuccess: 0.36,
    offExplosive: 1.181,
    defExplosive: 1.208,
    finishing: 1.89,
    finishingAllowed: 1.5,
    havoc: 0.155,
    havocAllowed: 0.125,
    lineYards: 2.87,
    lineYardsAllowed: 2.67,
    sackRate: 0.08,
    sackRateAllowed: 0.06,
    passRate: 0.466,
    dropbackRate: 0.484,
    proe: 0.034,
    playsPerGame: 63.5,
    secondsPerPlay: 27.1,
    fourthDownGoRate: 0.11,
    turnoverMargin: -0.14,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.381,
    stEpa: 3.31,
    startingFieldPos: 31.3,
  },
  PSU: {
    offEpa: 0.135,
    defEpa: -0.033,
    offSuccess: 0.485,
    defSuccess: 0.424,
    offExplosive: 1.214,
    defExplosive: 1.206,
    finishing: 2.49,
    finishingAllowed: 2.26,
    havoc: 0.133,
    havocAllowed: 0.119,
    lineYards: 2.96,
    lineYardsAllowed: 2.87,
    sackRate: 0.062,
    sackRateAllowed: 0.057,
    passRate: 0.385,
    dropbackRate: 0.443,
    proe: -0.024,
    playsPerGame: 48.5,
    secondsPerPlay: 25.5,
    fourthDownGoRate: 0.35,
    turnoverMargin: 0.21,
    redZoneTdRate: 0.401,
    redZoneTdRateAllowed: 0.395,
    stEpa: 3.63,
    startingFieldPos: 33.4,
  },
  VAN: {
    offEpa: 0.294,
    defEpa: 0.091,
    offSuccess: 0.521,
    defSuccess: 0.456,
    offExplosive: 1.258,
    defExplosive: 1.223,
    finishing: 2.81,
    finishingAllowed: 2.11,
    havoc: 0.127,
    havocAllowed: 0.124,
    lineYards: 3.06,
    lineYardsAllowed: 2.88,
    sackRate: 0.06,
    sackRateAllowed: 0.059,
    passRate: 0.449,
    dropbackRate: 0.533,
    proe: 0.067,
    playsPerGame: 60.6,
    secondsPerPlay: 29,
    fourthDownGoRate: 0.18,
    turnoverMargin: -0.15,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.399,
    stEpa: 2.04,
    startingFieldPos: 30.4,
  },
  TAM: {
    offEpa: 0.172,
    defEpa: -0.056,
    offSuccess: 0.494,
    defSuccess: 0.367,
    offExplosive: 1.205,
    defExplosive: 1.267,
    finishing: 2.33,
    finishingAllowed: 1.87,
    havoc: 0.145,
    havocAllowed: 0.118,
    lineYards: 2.98,
    lineYardsAllowed: 2.85,
    sackRate: 0.072,
    sackRateAllowed: 0.055,
    passRate: 0.459,
    dropbackRate: 0.472,
    proe: 0.021,
    playsPerGame: 69.6,
    secondsPerPlay: 28.2,
    fourthDownGoRate: 0.17,
    turnoverMargin: -0.54,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.39,
    stEpa: -1.17,
    startingFieldPos: 32.2,
  },
  TEX: {
    offEpa: 0.174,
    defEpa: -0.102,
    offSuccess: 0.458,
    defSuccess: 0.397,
    offExplosive: 1.273,
    defExplosive: 1.195,
    finishing: 2.38,
    finishingAllowed: 1.92,
    havoc: 0.135,
    havocAllowed: 0.128,
    lineYards: 2.96,
    lineYardsAllowed: 2.78,
    sackRate: 0.064,
    sackRateAllowed: 0.055,
    passRate: 0.481,
    dropbackRate: 0.537,
    proe: 0.05,
    playsPerGame: 47.3,
    secondsPerPlay: 25.9,
    fourthDownGoRate: 0.22,
    turnoverMargin: 1.14,
    redZoneTdRate: 0.395,
    redZoneTdRateAllowed: 0.39,
    stEpa: 2.12,
    startingFieldPos: 32.7,
  },
  WASH: {
    offEpa: 0.185,
    defEpa: -0.019,
    offSuccess: 0.502,
    defSuccess: 0.426,
    offExplosive: 1.218,
    defExplosive: 1.209,
    finishing: 2.69,
    finishingAllowed: 2.06,
    havoc: 0.124,
    havocAllowed: 0.123,
    lineYards: 3.01,
    lineYardsAllowed: 2.89,
    sackRate: 0.056,
    sackRateAllowed: 0.065,
    passRate: 0.449,
    dropbackRate: 0.485,
    proe: 0.024,
    playsPerGame: 63,
    secondsPerPlay: 28.2,
    fourthDownGoRate: 0.27,
    turnoverMargin: 0.38,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.394,
    stEpa: -1.8,
    startingFieldPos: 30.1,
  },
  WISC: {
    offEpa: -0.041,
    defEpa: 0.009,
    offSuccess: 0.421,
    defSuccess: 0.443,
    offExplosive: 1.209,
    defExplosive: 1.179,
    finishing: 1.75,
    finishingAllowed: 2.18,
    havoc: 0.124,
    havocAllowed: 0.131,
    lineYards: 2.95,
    lineYardsAllowed: 2.86,
    sackRate: 0.066,
    sackRateAllowed: 0.067,
    passRate: 0.402,
    dropbackRate: 0.434,
    proe: -0.078,
    playsPerGame: 57.2,
    secondsPerPlay: 30.1,
    fourthDownGoRate: 0.19,
    turnoverMargin: -0.92,
    redZoneTdRate: 0.391,
    redZoneTdRateAllowed: 0.392,
    stEpa: 0.46,
    startingFieldPos: 29.4,
  },
  ALA: {
    offEpa: 0.168,
    defEpa: -0.098,
    offSuccess: 0.496,
    defSuccess: 0.397,
    offExplosive: 1.201,
    defExplosive: 1.208,
    finishing: 2.57,
    finishingAllowed: 1.85,
    havoc: 0.141,
    havocAllowed: 0.115,
    lineYards: 2.91,
    lineYardsAllowed: 2.54,
    sackRate: 0.071,
    sackRateAllowed: 0.056,
    passRate: 0.484,
    dropbackRate: 0.516,
    proe: 0.063,
    playsPerGame: 69.1,
    secondsPerPlay: 27,
    fourthDownGoRate: 0.26,
    turnoverMargin: 0.44,
    redZoneTdRate: 0.403,
    redZoneTdRateAllowed: 0.388,
    stEpa: -0.56,
    startingFieldPos: 30.2,
  },
  MSST: {
    offEpa: 0.089,
    defEpa: 0.06,
    offSuccess: 0.458,
    defSuccess: 0.451,
    offExplosive: 1.232,
    defExplosive: 1.217,
    finishing: 2.03,
    finishingAllowed: 2.26,
    havoc: 0.12,
    havocAllowed: 0.132,
    lineYards: 2.96,
    lineYardsAllowed: 3.07,
    sackRate: 0.057,
    sackRateAllowed: 0.071,
    passRate: 0.414,
    dropbackRate: 0.465,
    proe: -0.041,
    playsPerGame: 71.2,
    secondsPerPlay: 23.1,
    fourthDownGoRate: 0.23,
    turnoverMargin: 0,
    redZoneTdRate: 0.393,
    redZoneTdRateAllowed: 0.397,
    stEpa: 0.46,
    startingFieldPos: 29.3,
  },
  ILL: {
    offEpa: 0.171,
    defEpa: 0.083,
    offSuccess: 0.504,
    defSuccess: 0.454,
    offExplosive: 1.203,
    defExplosive: 1.209,
    finishing: 2.55,
    finishingAllowed: 2.13,
    havoc: 0.13,
    havocAllowed: 0.125,
    lineYards: 2.94,
    lineYardsAllowed: 3.02,
    sackRate: 0.056,
    sackRateAllowed: 0.061,
    passRate: 0.484,
    dropbackRate: 0.474,
    proe: 0.031,
    playsPerGame: 56.2,
    secondsPerPlay: 28.2,
    fourthDownGoRate: 0.37,
    turnoverMargin: 0.36,
    redZoneTdRate: 0.39,
    redZoneTdRateAllowed: 0.397,
    stEpa: 0.73,
    startingFieldPos: 30.5,
  },
  IOWA: {
    offEpa: 0.069,
    defEpa: -0.066,
    offSuccess: 0.463,
    defSuccess: 0.419,
    offExplosive: 1.168,
    defExplosive: 1.17,
    finishing: 2.27,
    finishingAllowed: 1.76,
    havoc: 0.126,
    havocAllowed: 0.117,
    lineYards: 3.01,
    lineYardsAllowed: 2.88,
    sackRate: 0.06,
    sackRateAllowed: 0.06,
    passRate: 0.329,
    dropbackRate: 0.388,
    proe: -0.08,
    playsPerGame: 60.2,
    secondsPerPlay: 30.9,
    fourthDownGoRate: 0.12,
    turnoverMargin: 0,
    redZoneTdRate: 0.395,
    redZoneTdRateAllowed: 0.39,
    stEpa: 4.25,
    startingFieldPos: 34.1,
  },
  ORE: {
    offEpa: 0.165,
    defEpa: -0.034,
    offSuccess: 0.503,
    defSuccess: 0.399,
    offExplosive: 1.198,
    defExplosive: 1.236,
    finishing: 2.57,
    finishingAllowed: 1.92,
    havoc: 0.131,
    havocAllowed: 0.112,
    lineYards: 3.08,
    lineYardsAllowed: 2.91,
    sackRate: 0.065,
    sackRateAllowed: 0.05,
    passRate: 0.459,
    dropbackRate: 0.48,
    proe: 0.031,
    playsPerGame: 50.6,
    secondsPerPlay: 27.7,
    fourthDownGoRate: 0.42,
    turnoverMargin: 0.25,
    redZoneTdRate: 0.398,
    redZoneTdRateAllowed: 0.396,
    stEpa: 0.34,
    startingFieldPos: 32.1,
  },
  PUR: {
    offEpa: 0.032,
    defEpa: 0.157,
    offSuccess: 0.456,
    defSuccess: 0.457,
    offExplosive: 1.181,
    defExplosive: 1.287,
    finishing: 1.89,
    finishingAllowed: 2.31,
    havoc: 0.134,
    havocAllowed: 0.128,
    lineYards: 2.93,
    lineYardsAllowed: 3.06,
    sackRate: 0.065,
    sackRateAllowed: 0.058,
    passRate: 0.489,
    dropbackRate: 0.525,
    proe: 0.037,
    playsPerGame: 67.6,
    secondsPerPlay: 26.7,
    fourthDownGoRate: 0.2,
    turnoverMargin: -0.69,
    redZoneTdRate: 0.386,
    redZoneTdRateAllowed: 0.394,
    stEpa: -0.02,
    startingFieldPos: 27.1,
  },
  SC: {
    offEpa: 0.129,
    defEpa: -0.038,
    offSuccess: 0.494,
    defSuccess: 0.422,
    offExplosive: 1.193,
    defExplosive: 1.187,
    finishing: 2.25,
    finishingAllowed: 2.02,
    havoc: 0.125,
    havocAllowed: 0.127,
    lineYards: 3.06,
    lineYardsAllowed: 2.84,
    sackRate: 0.054,
    sackRateAllowed: 0.067,
    passRate: 0.465,
    dropbackRate: 0.498,
    proe: 0.027,
    playsPerGame: 65.1,
    secondsPerPlay: 25.7,
    fourthDownGoRate: 0.19,
    turnoverMargin: 0.62,
    redZoneTdRate: 0.398,
    redZoneTdRateAllowed: 0.396,
    stEpa: 2.26,
    startingFieldPos: 26,
  },
  TENN: {
    offEpa: 0.175,
    defEpa: 0.028,
    offSuccess: 0.506,
    defSuccess: 0.459,
    offExplosive: 1.204,
    defExplosive: 1.211,
    finishing: 2.4,
    finishingAllowed: 2.1,
    havoc: 0.132,
    havocAllowed: 0.119,
    lineYards: 2.95,
    lineYardsAllowed: 2.98,
    sackRate: 0.071,
    sackRateAllowed: 0.055,
    passRate: 0.522,
    dropbackRate: 0.508,
    proe: 0.034,
    playsPerGame: 52.2,
    secondsPerPlay: 22.7,
    fourthDownGoRate: 0.28,
    turnoverMargin: 0.07,
    redZoneTdRate: 0.396,
    redZoneTdRateAllowed: 0.397,
    stEpa: -0.34,
    startingFieldPos: 29.6,
  },
};

/** Share of 2025 production returning to each 2026 roster. */
export const MEASURED_RETURNING: Record<TeamId, MeasuredReturning> = {
  AUB: {
    overall: 0.348,
    offense: 0.176,
    defense: 0.521,
  },
  ARK: {
    overall: 0.209,
    offense: 0.176,
    defense: 0.242,
  },
  UCLA: {
    overall: 0.487,
    offense: 0.615,
    defense: 0.359,
  },
  USC: {
    overall: 0.606,
    offense: 0.639,
    defense: 0.573,
  },
  FLA: {
    overall: 0.525,
    offense: 0.398,
    defense: 0.653,
  },
  UGA: {
    overall: 0.686,
    offense: 0.719,
    defense: 0.652,
  },
  NW: {
    overall: 0.551,
    offense: 0.541,
    defense: 0.562,
  },
  IND: {
    overall: 0.345,
    offense: 0.142,
    defense: 0.548,
  },
  UK: {
    overall: 0.296,
    offense: 0.185,
    defense: 0.407,
  },
  LSU: {
    overall: 0.315,
    offense: 0.212,
    defense: 0.419,
  },
  MD: {
    overall: 0.703,
    offense: 0.684,
    defense: 0.723,
  },
  MSU: {
    overall: 0.278,
    offense: 0.309,
    defense: 0.248,
  },
  MICH: {
    overall: 0.528,
    offense: 0.723,
    defense: 0.333,
  },
  MINN: {
    overall: 0.638,
    offense: 0.699,
    defense: 0.576,
  },
  MIZ: {
    overall: 0.414,
    offense: 0.488,
    defense: 0.34,
  },
  MISS: {
    overall: 0.502,
    offense: 0.611,
    defense: 0.393,
  },
  NEB: {
    overall: 0.502,
    offense: 0.448,
    defense: 0.557,
  },
  RUT: {
    overall: 0.347,
    offense: 0.392,
    defense: 0.301,
  },
  OSU: {
    overall: 0.524,
    offense: 0.702,
    defense: 0.345,
  },
  OU: {
    overall: 0.657,
    offense: 0.73,
    defense: 0.584,
  },
  PSU: {
    overall: 0.153,
    offense: 0.062,
    defense: 0.243,
  },
  VAN: {
    overall: 0.438,
    offense: 0.328,
    defense: 0.548,
  },
  TAM: {
    overall: 0.608,
    offense: 0.722,
    defense: 0.495,
  },
  TEX: {
    overall: 0.565,
    offense: 0.628,
    defense: 0.501,
  },
  WASH: {
    overall: 0.56,
    offense: 0.595,
    defense: 0.526,
  },
  WISC: {
    overall: 0.367,
    offense: 0.374,
    defense: 0.36,
  },
  ALA: {
    overall: 0.402,
    offense: 0.314,
    defense: 0.491,
  },
  MSST: {
    overall: 0.412,
    offense: 0.399,
    defense: 0.425,
  },
  ILL: {
    overall: 0.343,
    offense: 0.363,
    defense: 0.322,
  },
  IOWA: {
    overall: 0.364,
    offense: 0.41,
    defense: 0.319,
  },
  ORE: {
    overall: 0.619,
    offense: 0.668,
    defense: 0.57,
  },
  PUR: {
    overall: 0.421,
    offense: 0.486,
    defense: 0.355,
  },
  SC: {
    overall: 0.615,
    offense: 0.702,
    defense: 0.527,
  },
  TENN: {
    overall: 0.444,
    offense: 0.368,
    defense: 0.52,
  },
};

/** Four-year weighted recruiting composite at the 2026 vintage. */
export const MEASURED_TALENT: Record<TeamId, MeasuredTalent> = {
  AUB: {
    blueChipRatio: 0.392,
    composite: 1127,
  },
  ARK: {
    blueChipRatio: 0.151,
    composite: 923,
  },
  UCLA: {
    blueChipRatio: 0.082,
    composite: 811,
  },
  USC: {
    blueChipRatio: 0.473,
    composite: 1276,
  },
  FLA: {
    blueChipRatio: 0.582,
    composite: 1249,
  },
  UGA: {
    blueChipRatio: 0.73,
    composite: 1455,
  },
  NW: {
    blueChipRatio: 0.048,
    composite: 799,
  },
  IND: {
    blueChipRatio: 0.1,
    composite: 872,
  },
  UK: {
    blueChipRatio: 0.191,
    composite: 957,
  },
  LSU: {
    blueChipRatio: 0.51,
    composite: 1273,
  },
  MD: {
    blueChipRatio: 0.117,
    composite: 934,
  },
  MSU: {
    blueChipRatio: 0.144,
    composite: 937,
  },
  MICH: {
    blueChipRatio: 0.51,
    composite: 1236,
  },
  MINN: {
    blueChipRatio: 0.123,
    composite: 945,
  },
  MIZ: {
    blueChipRatio: 0.282,
    composite: 991,
  },
  MISS: {
    blueChipRatio: 0.414,
    composite: 1077,
  },
  NEB: {
    blueChipRatio: 0.263,
    composite: 1029,
  },
  RUT: {
    blueChipRatio: 0.149,
    composite: 975,
  },
  OSU: {
    blueChipRatio: 0.604,
    composite: 1367,
  },
  OU: {
    blueChipRatio: 0.452,
    composite: 1174,
  },
  PSU: {
    blueChipRatio: 0.408,
    composite: 1094,
  },
  VAN: {
    blueChipRatio: 0.106,
    composite: 899,
  },
  TAM: {
    blueChipRatio: 0.708,
    composite: 1293,
  },
  TEX: {
    blueChipRatio: 0.606,
    composite: 1405,
  },
  WASH: {
    blueChipRatio: 0.27,
    composite: 1044,
  },
  WISC: {
    blueChipRatio: 0.211,
    composite: 907,
  },
  ALA: {
    blueChipRatio: 0.616,
    composite: 1451,
  },
  MSST: {
    blueChipRatio: 0.116,
    composite: 1005,
  },
  ILL: {
    blueChipRatio: 0.078,
    composite: 918,
  },
  IOWA: {
    blueChipRatio: 0.196,
    composite: 987,
  },
  ORE: {
    blueChipRatio: 0.538,
    composite: 1402,
  },
  PUR: {
    blueChipRatio: 0.054,
    composite: 800,
  },
  SC: {
    blueChipRatio: 0.444,
    composite: 1150,
  },
  TENN: {
    blueChipRatio: 0.462,
    composite: 1252,
  },
};

/** Actual 2025 results, counted off the play-by-play. */
export const MEASURED_RECORD: Record<TeamId, SeasonRecord> = {
  AUB: {
    wins: 5,
    losses: 7,
    confWins: 1,
    confLosses: 7,
    pointsFor: 321,
    pointsAgainst: 251,
  },
  ARK: {
    wins: 2,
    losses: 10,
    confWins: 0,
    confLosses: 8,
    pointsFor: 395,
    pointsAgainst: 413,
  },
  UCLA: {
    wins: 3,
    losses: 9,
    confWins: 3,
    confLosses: 6,
    pointsFor: 221,
    pointsAgainst: 407,
  },
  USC: {
    wins: 9,
    losses: 4,
    confWins: 7,
    confLosses: 2,
    pointsFor: 465,
    pointsAgainst: 299,
  },
  FLA: {
    wins: 4,
    losses: 8,
    confWins: 2,
    confLosses: 6,
    pointsFor: 259,
    pointsAgainst: 288,
  },
  UGA: {
    wins: 12,
    losses: 2,
    confWins: 8,
    confLosses: 1,
    pointsFor: 449,
    pointsAgainst: 246,
  },
  NW: {
    wins: 7,
    losses: 6,
    confWins: 4,
    confLosses: 5,
    pointsFor: 304,
    pointsAgainst: 258,
  },
  IND: {
    wins: 16,
    losses: 0,
    confWins: 10,
    confLosses: 0,
    pointsFor: 666,
    pointsAgainst: 187,
  },
  UK: {
    wins: 5,
    losses: 7,
    confWins: 2,
    confLosses: 6,
    pointsFor: 276,
    pointsAgainst: 317,
  },
  LSU: {
    wins: 7,
    losses: 6,
    confWins: 3,
    confLosses: 5,
    pointsFor: 297,
    pointsAgainst: 258,
  },
  MD: {
    wins: 4,
    losses: 8,
    confWins: 1,
    confLosses: 8,
    pointsFor: 282,
    pointsAgainst: 318,
  },
  MSU: {
    wins: 4,
    losses: 8,
    confWins: 1,
    confLosses: 8,
    pointsFor: 303,
    pointsAgainst: 359,
  },
  MICH: {
    wins: 9,
    losses: 4,
    confWins: 7,
    confLosses: 2,
    pointsFor: 358,
    pointsAgainst: 265,
  },
  MINN: {
    wins: 7,
    losses: 5,
    confWins: 5,
    confLosses: 4,
    pointsFor: 279,
    pointsAgainst: 284,
  },
  MIZ: {
    wins: 8,
    losses: 5,
    confWins: 4,
    confLosses: 4,
    pointsFor: 393,
    pointsAgainst: 246,
  },
  MISS: {
    wins: 13,
    losses: 2,
    confWins: 7,
    confLosses: 1,
    pointsFor: 554,
    pointsAgainst: 316,
  },
  NEB: {
    wins: 7,
    losses: 6,
    confWins: 4,
    confLosses: 5,
    pointsFor: 373,
    pointsAgainst: 320,
  },
  RUT: {
    wins: 5,
    losses: 7,
    confWins: 2,
    confLosses: 7,
    pointsFor: 347,
    pointsAgainst: 382,
  },
  OSU: {
    wins: 12,
    losses: 2,
    confWins: 9,
    confLosses: 1,
    pointsFor: 468,
    pointsAgainst: 130,
  },
  OU: {
    wins: 10,
    losses: 3,
    confWins: 6,
    confLosses: 2,
    pointsFor: 341,
    pointsAgainst: 201,
  },
  PSU: {
    wins: 7,
    losses: 6,
    confWins: 3,
    confLosses: 6,
    pointsFor: 403,
    pointsAgainst: 267,
  },
  VAN: {
    wins: 10,
    losses: 3,
    confWins: 6,
    confLosses: 2,
    pointsFor: 500,
    pointsAgainst: 297,
  },
  TAM: {
    wins: 11,
    losses: 2,
    confWins: 7,
    confLosses: 1,
    pointsFor: 445,
    pointsAgainst: 274,
  },
  TEX: {
    wins: 10,
    losses: 3,
    confWins: 6,
    confLosses: 2,
    pointsFor: 396,
    pointsAgainst: 264,
  },
  WASH: {
    wins: 9,
    losses: 4,
    confWins: 5,
    confLosses: 4,
    pointsFor: 443,
    pointsAgainst: 250,
  },
  WISC: {
    wins: 4,
    losses: 8,
    confWins: 2,
    confLosses: 7,
    pointsFor: 154,
    pointsAgainst: 259,
  },
  ALA: {
    wins: 11,
    losses: 4,
    confWins: 7,
    confLosses: 2,
    pointsFor: 443,
    pointsAgainst: 288,
  },
  MSST: {
    wins: 5,
    losses: 8,
    confWins: 1,
    confLosses: 7,
    pointsFor: 395,
    pointsAgainst: 396,
  },
  ILL: {
    wins: 9,
    losses: 4,
    confWins: 5,
    confLosses: 4,
    pointsFor: 382,
    pointsAgainst: 307,
  },
  IOWA: {
    wins: 9,
    losses: 4,
    confWins: 6,
    confLosses: 3,
    pointsFor: 381,
    pointsAgainst: 209,
  },
  ORE: {
    wins: 13,
    losses: 2,
    confWins: 8,
    confLosses: 1,
    pointsFor: 554,
    pointsAgainst: 268,
  },
  PUR: {
    wins: 2,
    losses: 10,
    confWins: 0,
    confLosses: 9,
    pointsFor: 225,
    pointsAgainst: 382,
  },
  SC: {
    wins: 4,
    losses: 8,
    confWins: 1,
    confLosses: 7,
    pointsFor: 272,
    pointsAgainst: 265,
  },
  TENN: {
    wins: 8,
    losses: 5,
    confWins: 4,
    confLosses: 4,
    pointsFor: 517,
    pointsAgainst: 375,
  },
};

/** Results so far in 2026 — all zeroes until the season starts. */
export const MEASURED_RECORD_CURRENT: Record<TeamId, SeasonRecord> = {
  AUB: {
    wins: 0,
    losses: 1,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  ARK: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  UCLA: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  USC: {
    wins: 2,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 81,
    pointsAgainst: 26,
  },
  FLA: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  UGA: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 35,
    pointsAgainst: 0,
  },
  NW: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  IND: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 52,
    pointsAgainst: 16,
  },
  UK: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 45,
    pointsAgainst: 13,
  },
  LSU: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  MD: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  MSU: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 30,
    pointsAgainst: 20,
  },
  MICH: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  MINN: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 59,
    pointsAgainst: 7,
  },
  MIZ: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 54,
    pointsAgainst: 14,
  },
  MISS: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  NEB: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 49,
    pointsAgainst: 21,
  },
  RUT: {
    wins: 0,
    losses: 1,
    confWins: 0,
    confLosses: 0,
    pointsFor: 21,
    pointsAgainst: 37,
  },
  OSU: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 56,
    pointsAgainst: 3,
  },
  OU: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 51,
    pointsAgainst: 0,
  },
  PSU: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 10,
    pointsAgainst: 0,
  },
  VAN: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  TAM: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  TEX: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 14,
    pointsAgainst: 0,
  },
  WASH: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  WISC: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  ALA: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 48,
    pointsAgainst: 10,
  },
  MSST: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  ILL: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 42,
    pointsAgainst: 23,
  },
  IOWA: {
    wins: 0,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  },
  ORE: {
    wins: 0,
    losses: 1,
    confWins: 0,
    confLosses: 0,
    pointsFor: 0,
    pointsAgainst: 7,
  },
  PUR: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 44,
    pointsAgainst: 19,
  },
  SC: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 57,
    pointsAgainst: 0,
  },
  TENN: {
    wins: 1,
    losses: 0,
    confWins: 0,
    confLosses: 0,
    pointsFor: 7,
    pointsAgainst: 0,
  },
};
