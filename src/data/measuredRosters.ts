/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npm run etl:rosters
 *
 * 18 rosters built from the published 2025 roster file, joined to the
 * play-by-play on the source's own athlete id. Production, rates and usage
 * shares are counted. Grade is a positional percentile of measured value; PAR
 * is that value less a measured replacement level, in points of team rating per
 * game. Offensive linemen are never named in play-by-play and carry a
 * class-year baseline instead — they are the only 'modeled' rows here.
 * ========================================================================== */

import type { Player, TeamId } from './types';

export const MEASURED_ROSTERS: Partial<Record<TeamId, Player[]>> = {
  ILL: [
    {
      "id": "ill-luke-altmyer",
      "name": "Luke Altmyer",
      "teamId": "ILL",
      "position": "QB",
      "jersey": 9,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.981,
        "carryShare": 0.172,
        "targetShare": 0.005
      },
      "production2025": {
        "games": 13,
        "attempts": 364,
        "completions": 247,
        "passYds": 3019,
        "passTd": 22,
        "interceptions": 5,
        "carries": 72,
        "rushYds": 514,
        "rushTd": 5,
        "targets": 2,
        "receptions": 1,
        "recYds": 3,
        "recTd": 1
      },
      "rates": {
        "ypa": 8.3,
        "ypc": 7.1,
        "ypt": 1.5,
        "epaPerPlay": 0.243,
        "explosiveRate": 0.162
      },
      "measuredPlays": 478,
      "usage2025": {
        "passAttemptShare": 0.981,
        "carryShare": 0.172,
        "targetShare": 0.005
      },
      "grade": 90,
      "par": 5.14,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 478 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-hank-beatty",
      "name": "Hank Beatty",
      "teamId": "ILL",
      "position": "WR",
      "jersey": 80,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.008,
        "carryShare": 0.01,
        "targetShare": 0.247
      },
      "production2025": {
        "games": 13,
        "attempts": 3,
        "completions": 2,
        "passYds": 31,
        "passTd": 1,
        "carries": 4,
        "rushYds": 46,
        "rushTd": 1,
        "targets": 90,
        "receptions": 70,
        "recYds": 864,
        "recTd": 3
      },
      "rates": {
        "ypa": 10.3,
        "ypc": 11.5,
        "ypt": 9.6,
        "epaPerPlay": 0.612,
        "explosiveRate": 0.096
      },
      "measuredPlays": 97,
      "usage2025": {
        "passAttemptShare": 0.008,
        "carryShare": 0.01,
        "targetShare": 0.247
      },
      "grade": 93,
      "par": 1.13,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 97 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-miles-scott",
      "name": "Miles Scott",
      "teamId": "ILL",
      "position": "CB",
      "jersey": 10,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.83
      },
      "production2025": {
        "games": 2,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.932
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 97,
      "par": 1.03,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-tanner-heckel",
      "name": "Tanner Heckel",
      "teamId": "ILL",
      "position": "CB",
      "jersey": 16,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.67
      },
      "production2025": {
        "games": 3,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 2.187
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 86,
      "par": 0.89,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-jordan-anderson",
      "name": "Jordan Anderson",
      "teamId": "ILL",
      "position": "TE",
      "jersey": 23,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.48,
        "carryShare": 0.022,
        "targetShare": 0.008
      },
      "production2025": {
        "games": 6,
        "carries": 9,
        "rushYds": 41,
        "rushTd": 1,
        "targets": 3,
        "receptions": 3,
        "recYds": 12
      },
      "rates": {
        "ypc": 4.6,
        "ypt": 4,
        "epaPerPlay": 0.636,
        "explosiveRate": 0.083
      },
      "measuredPlays": 12,
      "productionCurrent": {
        "games": 1,
        "carries": 3,
        "rushYds": 5
      },
      "usage2025": {
        "carryShare": 0.022,
        "targetShare": 0.008
      },
      "grade": 91,
      "par": 0.88,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 12 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-gabe-jacas",
      "name": "Gabe Jacas",
      "teamId": "ILL",
      "position": "LB",
      "jersey": 17,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 9,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 2.14
      },
      "measuredPlays": 9,
      "usage2025": {},
      "grade": 87,
      "par": 0.44,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 9 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-cole-rusk",
      "name": "Cole Rusk",
      "teamId": "ILL",
      "position": "TE",
      "jersey": 14,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.068
      },
      "production2025": {
        "games": 9,
        "targets": 25,
        "receptions": 20,
        "recYds": 226,
        "recTd": 1
      },
      "rates": {
        "ypt": 9,
        "epaPerPlay": 0.617,
        "explosiveRate": 0.08
      },
      "measuredPlays": 25,
      "usage2025": {
        "targetShare": 0.068
      },
      "grade": 84,
      "par": 0.42,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 25 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-collin-dixon",
      "name": "Collin Dixon",
      "teamId": "ILL",
      "position": "WR",
      "jersey": 17,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.62,
        "carryShare": 0.005,
        "targetShare": 0.159
      },
      "production2025": {
        "games": 13,
        "carries": 2,
        "rushYds": 5,
        "targets": 58,
        "receptions": 35,
        "recYds": 548,
        "recTd": 5
      },
      "rates": {
        "ypc": 2.5,
        "ypt": 9.4,
        "epaPerPlay": 0.517,
        "explosiveRate": 0.117
      },
      "measuredPlays": 60,
      "productionCurrent": {
        "games": 1,
        "targets": 7,
        "receptions": 6,
        "recYds": 70,
        "recTd": 2
      },
      "usage2025": {
        "carryShare": 0.005,
        "targetShare": 0.159
      },
      "grade": 66,
      "par": 0.35,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 60 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-justin-bowick",
      "name": "Justin Bowick",
      "teamId": "ILL",
      "position": "WR",
      "jersey": 0,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.37,
        "targetShare": 0.099
      },
      "production2025": {
        "games": 11,
        "targets": 36,
        "receptions": 22,
        "recYds": 265,
        "recTd": 5
      },
      "rates": {
        "ypt": 7.4,
        "epaPerPlay": 0.558,
        "explosiveRate": 0.167
      },
      "measuredPlays": 36,
      "usage2025": {
        "targetShare": 0.099
      },
      "grade": 58,
      "par": 0.33,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 36 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-kaden-feagin",
      "name": "Kaden Feagin",
      "teamId": "ILL",
      "position": "RB",
      "jersey": 83,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.95,
        "carryShare": 0.292,
        "targetShare": 0.052
      },
      "production2025": {
        "games": 13,
        "carries": 122,
        "rushYds": 510,
        "rushTd": 7,
        "targets": 19,
        "receptions": 16,
        "recYds": 188,
        "recTd": 2
      },
      "rates": {
        "ypc": 4.2,
        "ypt": 9.9,
        "epaPerPlay": 0.081,
        "explosiveRate": 0.057
      },
      "measuredPlays": 141,
      "usage2025": {
        "carryShare": 0.292,
        "targetShare": 0.052
      },
      "grade": 70,
      "par": 0.15,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 141 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-hudson-clement",
      "name": "Hudson Clement",
      "teamId": "ILL",
      "position": "WR",
      "jersey": 13,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.63,
        "targetShare": 0.167
      },
      "production2025": {
        "games": 13,
        "targets": 61,
        "receptions": 36,
        "recYds": 455,
        "recTd": 3
      },
      "rates": {
        "ypt": 7.5,
        "epaPerPlay": 0.41,
        "explosiveRate": 0.098
      },
      "measuredPlays": 61,
      "productionCurrent": {
        "games": 1,
        "targets": 5,
        "receptions": 3,
        "recYds": 26
      },
      "usage2025": {
        "targetShare": 0.167
      },
      "grade": 60,
      "par": 0.12,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 61 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-aidan-laughery",
      "name": "Aidan Laughery",
      "teamId": "ILL",
      "position": "RB",
      "jersey": 21,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.57,
        "carryShare": 0.175,
        "targetShare": 0.033
      },
      "production2025": {
        "games": 9,
        "carries": 73,
        "rushYds": 390,
        "rushTd": 3,
        "targets": 12,
        "receptions": 9,
        "recYds": 54
      },
      "rates": {
        "ypc": 5.3,
        "ypt": 4.5,
        "epaPerPlay": 0.02,
        "explosiveRate": 0.047
      },
      "measuredPlays": 85,
      "productionCurrent": {
        "games": 1,
        "carries": 8,
        "rushYds": 29,
        "rushTd": 1,
        "targets": 1,
        "receptions": 1,
        "recYds": 17
      },
      "usage2025": {
        "carryShare": 0.175,
        "targetShare": 0.033
      },
      "grade": 68,
      "par": 0.08,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 85 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-david-olano",
      "name": "David Olano",
      "teamId": "ILL",
      "position": "K",
      "jersey": 24,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 13,
        "fgAttempts": 23,
        "fgMade": 20,
        "fgLong": 46
      },
      "rates": {},
      "measuredPlays": 23,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 23 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-angelo-mccullom",
      "name": "Angelo McCullom",
      "teamId": "ILL",
      "position": "DL",
      "jersey": 94,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 2,
        "sacks": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.539
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 84,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-ayden-knapik",
      "name": "Ayden Knapik",
      "teamId": "ILL",
      "position": "IOL",
      "jersey": 72,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ill-brandon-henderson",
      "name": "Brandon Henderson",
      "teamId": "ILL",
      "position": "IOL",
      "jersey": 75,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ill-dezmond-schuster",
      "name": "Dezmond Schuster",
      "teamId": "ILL",
      "position": "IOL",
      "jersey": 63,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ill-dylan-rosiek",
      "name": "Dylan Rosiek",
      "teamId": "ILL",
      "position": "LB",
      "jersey": 28,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.33
      },
      "production2025": {
        "games": 2,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.777
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-juice-clarke",
      "name": "Juice Clarke",
      "teamId": "ILL",
      "position": "CB",
      "jersey": 6,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "passBreakups": 6
      },
      "rates": {
        "epaPerPlay": 0.893
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 68,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-tomiwa-durojaiye",
      "name": "Tomiwa Durojaiye",
      "teamId": "ILL",
      "position": "DL",
      "jersey": 13,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 2,
        "sacks": 2,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 1.155
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 65,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-matthew-bailey",
      "name": "Matthew Bailey",
      "teamId": "ILL",
      "position": "CB",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 3,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.386
      },
      "measuredPlays": 3,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 1
      },
      "usage2025": {},
      "grade": 59,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-ca-lil-valentine",
      "name": "Ca'Lil Valentine",
      "teamId": "ILL",
      "position": "RB",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.316,
        "targetShare": 0.041
      },
      "production2025": {
        "games": 13,
        "carries": 132,
        "rushYds": 629,
        "rushTd": 4,
        "targets": 15,
        "receptions": 10,
        "recYds": 57,
        "passBreakups": 1
      },
      "rates": {
        "ypc": 4.8,
        "ypt": 3.8,
        "epaPerPlay": -0.051,
        "explosiveRate": 0.027
      },
      "measuredPlays": 148,
      "productionCurrent": {
        "games": 1,
        "carries": 11,
        "rushYds": 92,
        "rushTd": 1,
        "targets": 2,
        "receptions": 1,
        "recYds": 4
      },
      "usage2025": {
        "carryShare": 0.316,
        "targetShare": 0.041
      },
      "grade": 57,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 148 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-james-thompson-jr",
      "name": "James Thompson Jr.",
      "teamId": "ILL",
      "position": "DL",
      "jersey": 90,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.393
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 54,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ill-keelan-crimmins",
      "name": "Keelan Crimmins",
      "teamId": "ILL",
      "position": "P",
      "jersey": 40,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.002
      },
      "production2025": {
        "games": 13,
        "carries": 1,
        "rushYds": -14,
        "punts": 37,
        "puntAvg": 26.8
      },
      "rates": {
        "ypc": -14,
        "epaPerPlay": -0.081
      },
      "measuredPlays": 38,
      "usage2025": {
        "carryShare": 0.002
      },
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 38 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  IND: [
    {
      "id": "ind-fernando-mendoza",
      "name": "Fernando Mendoza",
      "teamId": "IND",
      "position": "QB",
      "jersey": 15,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.938,
        "carryShare": 0.113
      },
      "production2025": {
        "games": 16,
        "attempts": 379,
        "completions": 272,
        "passYds": 3541,
        "passTd": 42,
        "interceptions": 6,
        "carries": 71,
        "rushYds": 427,
        "rushTd": 7
      },
      "rates": {
        "ypa": 9.3,
        "ypc": 6,
        "epaPerPlay": 0.373,
        "explosiveRate": 0.141
      },
      "measuredPlays": 488,
      "usage2025": {
        "passAttemptShare": 0.938,
        "carryShare": 0.113
      },
      "grade": 95,
      "par": 6.25,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 488 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-alberto-mendoza",
      "name": "Alberto Mendoza",
      "teamId": "IND",
      "position": "QB",
      "jersey": 15,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.09,
        "passAttemptShare": 0.059,
        "carryShare": 0.032
      },
      "production2025": {
        "games": 8,
        "attempts": 24,
        "completions": 18,
        "passYds": 286,
        "passTd": 5,
        "interceptions": 1,
        "carries": 20,
        "rushYds": 190,
        "rushTd": 1
      },
      "rates": {
        "ypa": 11.9,
        "ypc": 9.5,
        "epaPerPlay": 0.655,
        "explosiveRate": 0.15
      },
      "measuredPlays": 44,
      "productionCurrent": {
        "games": 1,
        "attempts": 21,
        "completions": 15,
        "passYds": 222
      },
      "usage2025": {
        "passAttemptShare": 0.059,
        "carryShare": 0.032
      },
      "grade": 89,
      "par": 2.7,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 44 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-lee-beebe-jr",
      "name": "Lee Beebe Jr.",
      "teamId": "IND",
      "position": "RB",
      "jersey": 29,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.11,
        "carryShare": 0.043,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 3,
        "carries": 27,
        "rushYds": 209,
        "rushTd": 1,
        "targets": 1,
        "receptions": 1,
        "recYds": 7
      },
      "rates": {
        "ypc": 7.7,
        "ypt": 7,
        "epaPerPlay": 0.288,
        "explosiveRate": 0.071
      },
      "measuredPlays": 28,
      "productionCurrent": {
        "games": 1,
        "carries": 15,
        "rushYds": 39,
        "targets": 1
      },
      "usage2025": {
        "carryShare": 0.043,
        "targetShare": 0.003
      },
      "grade": 95,
      "par": 2.46,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 28 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-khobie-martin",
      "name": "Khobie Martin",
      "teamId": "IND",
      "position": "RB",
      "jersey": 28,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.31,
        "carryShare": 0.122,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 11,
        "carries": 77,
        "rushYds": 521,
        "rushTd": 6,
        "targets": 1,
        "receptions": 1,
        "recYds": 14
      },
      "rates": {
        "ypc": 6.8,
        "ypt": 14,
        "epaPerPlay": 0.338,
        "explosiveRate": 0.09
      },
      "measuredPlays": 78,
      "usage2025": {
        "carryShare": 0.122,
        "targetShare": 0.003
      },
      "grade": 94,
      "par": 2.2,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 78 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-kaelon-black",
      "name": "Kaelon Black",
      "teamId": "IND",
      "position": "RB",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.77,
        "carryShare": 0.296,
        "targetShare": 0.015
      },
      "production2025": {
        "games": 16,
        "carries": 187,
        "rushYds": 1052,
        "rushTd": 10,
        "targets": 6,
        "receptions": 4,
        "recYds": 36
      },
      "rates": {
        "ypc": 5.6,
        "ypt": 6,
        "epaPerPlay": 0.168,
        "explosiveRate": 0.067
      },
      "measuredPlays": 193,
      "usage2025": {
        "carryShare": 0.296,
        "targetShare": 0.015
      },
      "grade": 91,
      "par": 1.78,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 193 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-louis-moore",
      "name": "Louis Moore",
      "teamId": "IND",
      "position": "CB",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.45
      },
      "production2025": {
        "games": 5,
        "takeaways": 3,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 3.115
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 88,
      "par": 1.59,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-charlie-becker",
      "name": "Charlie Becker",
      "teamId": "IND",
      "position": "WR",
      "jersey": 80,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.52,
        "targetShare": 0.127
      },
      "production2025": {
        "games": 13,
        "targets": 50,
        "receptions": 34,
        "recYds": 679,
        "recTd": 5
      },
      "rates": {
        "ypt": 13.6,
        "epaPerPlay": 1.151,
        "explosiveRate": 0.26
      },
      "measuredPlays": 50,
      "productionCurrent": {
        "games": 1,
        "targets": 5,
        "receptions": 4,
        "recYds": 64,
        "recTd": 2
      },
      "usage2025": {
        "targetShare": 0.127
      },
      "grade": 90,
      "par": 1.52,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 50 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-omar-cooper-jr",
      "name": "Omar Cooper Jr.",
      "teamId": "IND",
      "position": "WR",
      "jersey": 3,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.005,
        "targetShare": 0.239
      },
      "production2025": {
        "games": 16,
        "carries": 3,
        "rushYds": 74,
        "rushTd": 1,
        "targets": 94,
        "receptions": 70,
        "recYds": 971,
        "recTd": 13
      },
      "rates": {
        "ypc": 24.7,
        "ypt": 10.3,
        "epaPerPlay": 0.707,
        "explosiveRate": 0.144
      },
      "measuredPlays": 97,
      "usage2025": {
        "carryShare": 0.005,
        "targetShare": 0.239
      },
      "grade": 90,
      "par": 1.14,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 97 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-elijah-sarratt",
      "name": "Elijah Sarratt",
      "teamId": "IND",
      "position": "WR",
      "jersey": 13,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.94,
        "targetShare": 0.232
      },
      "production2025": {
        "games": 13,
        "targets": 91,
        "receptions": 62,
        "recYds": 787,
        "recTd": 14
      },
      "rates": {
        "ypt": 8.6,
        "epaPerPlay": 0.613,
        "explosiveRate": 0.099
      },
      "measuredPlays": 91,
      "usage2025": {
        "targetShare": 0.232
      },
      "grade": 89,
      "par": 0.89,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 91 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-devan-boykin",
      "name": "Devan Boykin",
      "teamId": "IND",
      "position": "CB",
      "jersey": 12,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.45
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 2.122
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 83,
      "par": 0.75,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-amare-ferrell",
      "name": "Amare Ferrell",
      "teamId": "IND",
      "position": "CB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.36
      },
      "production2025": {
        "games": 4,
        "takeaways": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.162
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 74,
      "par": 0.64,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-e-j-williams-jr",
      "name": "E.J. Williams Jr.",
      "teamId": "IND",
      "position": "WR",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.53,
        "targetShare": 0.127
      },
      "production2025": {
        "games": 14,
        "targets": 50,
        "receptions": 36,
        "recYds": 438,
        "recTd": 6,
        "takeaways": 1
      },
      "rates": {
        "ypt": 8.8,
        "epaPerPlay": 0.642,
        "explosiveRate": 0.08
      },
      "measuredPlays": 51,
      "usage2025": {
        "targetShare": 0.127
      },
      "grade": 68,
      "par": 0.62,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 51 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-riley-nowakowski",
      "name": "Riley Nowakowski",
      "teamId": "IND",
      "position": "TE",
      "jersey": 37,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.003,
        "targetShare": 0.094
      },
      "production2025": {
        "games": 14,
        "carries": 2,
        "rushYds": 2,
        "rushTd": 2,
        "targets": 37,
        "receptions": 33,
        "recYds": 398,
        "recTd": 2
      },
      "rates": {
        "ypc": 1,
        "ypt": 10.8,
        "epaPerPlay": 0.628,
        "explosiveRate": 0.103
      },
      "measuredPlays": 39,
      "usage2025": {
        "carryShare": 0.003,
        "targetShare": 0.094
      },
      "grade": 87,
      "par": 0.52,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 39 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-jonathan-brady",
      "name": "Jonathan Brady",
      "teamId": "IND",
      "position": "WR",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.16,
        "targetShare": 0.041
      },
      "production2025": {
        "games": 9,
        "targets": 16,
        "receptions": 14,
        "recYds": 115,
        "recTd": 3
      },
      "rates": {
        "ypt": 7.2,
        "epaPerPlay": 0.818,
        "explosiveRate": 0.125
      },
      "measuredPlays": 16,
      "usage2025": {
        "targetShare": 0.041
      },
      "grade": 54,
      "par": 0.41,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 16 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-d-angelo-ponds",
      "name": "D'Angelo Ponds",
      "teamId": "IND",
      "position": "CB",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 7,
        "targets": 1,
        "receptions": 1,
        "recYds": 6,
        "takeaways": 2,
        "passBreakups": 8
      },
      "rates": {
        "ypt": 6,
        "epaPerPlay": 1.728
      },
      "measuredPlays": 11,
      "usage2025": {
        "targetShare": 0.003
      },
      "grade": 83,
      "par": 0.24,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-nico-radicic",
      "name": "Nico Radicic",
      "teamId": "IND",
      "position": "K",
      "jersey": 15,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "fgAttempts": 20,
        "fgMade": 18,
        "fgLong": 46
      },
      "rates": {},
      "measuredPlays": 20,
      "productionCurrent": {
        "games": 1,
        "fgAttempts": 1,
        "fgMade": 1
      },
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 20 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-bray-lynch",
      "name": "Bray Lynch",
      "teamId": "IND",
      "position": "IOL",
      "jersey": 74,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ind-carter-smith",
      "name": "Carter Smith",
      "teamId": "IND",
      "position": "IOL",
      "jersey": 65,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ind-drew-evans",
      "name": "Drew Evans",
      "teamId": "IND",
      "position": "IOL",
      "jersey": 62,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ind-tyrique-tucker",
      "name": "Tyrique Tucker",
      "teamId": "IND",
      "position": "DL",
      "jersey": 95,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 6,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.488
      },
      "measuredPlays": 7,
      "productionCurrent": {
        "games": 1,
        "sacks": 1
      },
      "usage2025": {},
      "grade": 77,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-isaiah-jones",
      "name": "Isaiah Jones",
      "teamId": "IND",
      "position": "LB",
      "jersey": 46,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.91
      },
      "production2025": {
        "games": 7,
        "sacks": 6,
        "takeaways": 2,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.539
      },
      "measuredPlays": 10,
      "usage2025": {},
      "grade": 69,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 10 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-rolijah-hardy",
      "name": "Rolijah Hardy",
      "teamId": "IND",
      "position": "LB",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 8,
        "sacks": 6,
        "passBreakups": 5
      },
      "rates": {
        "epaPerPlay": 1.303
      },
      "measuredPlays": 11,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 1
      },
      "usage2025": {},
      "grade": 63,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-stephen-daley",
      "name": "Stephen Daley",
      "teamId": "IND",
      "position": "DL",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 5,
        "takeaways": 2
      },
      "rates": {
        "epaPerPlay": 1.192
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-aiden-fisher",
      "name": "Aiden Fisher",
      "teamId": "IND",
      "position": "LB",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.64
      },
      "production2025": {
        "games": 7,
        "sacks": 4,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.683
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 60,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-mario-landino",
      "name": "Mario Landino",
      "teamId": "IND",
      "position": "DL",
      "jersey": 97,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.86
      },
      "production2025": {
        "games": 5,
        "sacks": 4,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.278
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 59,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-holden-staes",
      "name": "Holden Staes",
      "teamId": "IND",
      "position": "TE",
      "jersey": 19,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.26,
        "targetShare": 0.025
      },
      "production2025": {
        "games": 7,
        "targets": 10,
        "receptions": 7,
        "recYds": 62,
        "recTd": 2
      },
      "rates": {
        "ypt": 6.2,
        "epaPerPlay": 0.182
      },
      "measuredPlays": 10,
      "usage2025": {
        "targetShare": 0.025
      },
      "grade": 54,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 10 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ind-mitch-mccarthy",
      "name": "Mitch McCarthy",
      "teamId": "IND",
      "position": "P",
      "jersey": 44,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "punts": 37,
        "puntAvg": 10.6
      },
      "rates": {},
      "measuredPlays": 37,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 37 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  IOWA: [
    {
      "id": "iowa-mark-gronowski",
      "name": "Mark Gronowski",
      "teamId": "IOWA",
      "position": "QB",
      "jersey": 11,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.916,
        "carryShare": 0.247,
        "targetShare": 0.004
      },
      "production2025": {
        "games": 13,
        "attempts": 261,
        "completions": 166,
        "passYds": 1771,
        "passTd": 10,
        "interceptions": 7,
        "carries": 120,
        "rushYds": 633,
        "rushTd": 16,
        "targets": 1,
        "receptions": 1,
        "recYds": 5,
        "recTd": 1
      },
      "rates": {
        "ypa": 6.8,
        "ypc": 5.3,
        "ypt": 5,
        "epaPerPlay": 0.128,
        "explosiveRate": 0.074
      },
      "measuredPlays": 404,
      "usage2025": {
        "passAttemptShare": 0.916,
        "carryShare": 0.247,
        "targetShare": 0.004
      },
      "grade": 85,
      "par": 3.76,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 404 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-aaron-graves",
      "name": "Aaron Graves",
      "teamId": "IOWA",
      "position": "DL",
      "jersey": 95,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.78
      },
      "production2025": {
        "games": 6,
        "sacks": 5,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.583
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 91,
      "par": 1.16,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-reece-vander-zee",
      "name": "Reece Vander Zee",
      "teamId": "IOWA",
      "position": "WR",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.57,
        "passAttemptShare": 0.004,
        "targetShare": 0.085
      },
      "production2025": {
        "games": 8,
        "attempts": 1,
        "completions": 1,
        "passYds": 5,
        "passTd": 1,
        "targets": 23,
        "receptions": 15,
        "recYds": 219,
        "recTd": 2
      },
      "rates": {
        "ypa": 5,
        "ypt": 9.5,
        "epaPerPlay": 0.839,
        "explosiveRate": 0.261
      },
      "measuredPlays": 24,
      "usage2025": {
        "passAttemptShare": 0.004,
        "targetShare": 0.085
      },
      "grade": 68,
      "par": 0.72,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 24 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-jaziun-patterson",
      "name": "Jaziun Patterson",
      "teamId": "IOWA",
      "position": "RB",
      "jersey": 4,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.33,
        "carryShare": 0.123,
        "targetShare": 0.015
      },
      "production2025": {
        "games": 10,
        "carries": 60,
        "rushYds": 308,
        "targets": 4,
        "receptions": 3,
        "recYds": 9
      },
      "rates": {
        "ypc": 5.1,
        "ypt": 2.3,
        "epaPerPlay": 0.118,
        "explosiveRate": 0.016
      },
      "measuredPlays": 64,
      "productionCurrent": {
        "games": 1,
        "carries": 7,
        "rushYds": 27
      },
      "usage2025": {
        "carryShare": 0.123,
        "targetShare": 0.015
      },
      "grade": 76,
      "par": 0.61,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 64 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-dj-vonnahme",
      "name": "DJ Vonnahme",
      "teamId": "IOWA",
      "position": "TE",
      "jersey": 81,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.148
      },
      "production2025": {
        "games": 10,
        "targets": 40,
        "receptions": 29,
        "recYds": 434,
        "recTd": 3
      },
      "rates": {
        "ypt": 10.9,
        "epaPerPlay": 0.615,
        "explosiveRate": 0.175
      },
      "measuredPlays": 40,
      "usage2025": {
        "targetShare": 0.148
      },
      "grade": 92,
      "par": 0.6,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 40 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-sam-phillips",
      "name": "Sam Phillips",
      "teamId": "IOWA",
      "position": "WR",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.57,
        "targetShare": 0.089
      },
      "production2025": {
        "games": 12,
        "targets": 24,
        "receptions": 16,
        "recYds": 261
      },
      "rates": {
        "ypt": 10.9,
        "epaPerPlay": 0.929,
        "explosiveRate": 0.125
      },
      "measuredPlays": 24,
      "usage2025": {
        "targetShare": 0.089
      },
      "grade": 59,
      "par": 0.57,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 24 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-kamari-moulton",
      "name": "Kamari Moulton",
      "teamId": "IOWA",
      "position": "RB",
      "jersey": 28,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.352,
        "targetShare": 0.085
      },
      "production2025": {
        "games": 11,
        "carries": 171,
        "rushYds": 896,
        "rushTd": 5,
        "targets": 23,
        "receptions": 16,
        "recYds": 99
      },
      "rates": {
        "ypc": 5.2,
        "ypt": 4.3,
        "epaPerPlay": 0.04,
        "explosiveRate": 0.031
      },
      "measuredPlays": 194,
      "usage2025": {
        "carryShare": 0.352,
        "targetShare": 0.085
      },
      "grade": 78,
      "par": 0.52,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 194 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-xavier-williams",
      "name": "Xavier Williams",
      "teamId": "IOWA",
      "position": "RB",
      "jersey": 26,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.3,
        "carryShare": 0.101,
        "targetShare": 0.033
      },
      "production2025": {
        "games": 10,
        "carries": 49,
        "rushYds": 287,
        "rushTd": 3,
        "targets": 9,
        "receptions": 7,
        "recYds": 47
      },
      "rates": {
        "ypc": 5.9,
        "ypt": 5.2,
        "epaPerPlay": 0.056,
        "explosiveRate": 0.052
      },
      "measuredPlays": 58,
      "usage2025": {
        "carryShare": 0.101,
        "targetShare": 0.033
      },
      "grade": 71,
      "par": 0.29,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 58 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-zach-lutmer",
      "name": "Zach Lutmer",
      "teamId": "IOWA",
      "position": "CB",
      "jersey": 6,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.629
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 65,
      "par": 0.11,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-drew-stevens",
      "name": "Drew Stevens",
      "teamId": "IOWA",
      "position": "K",
      "jersey": 18,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "fgAttempts": 27,
        "fgMade": 22,
        "fgLong": 55
      },
      "rates": {},
      "measuredPlays": 27,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 27 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-karson-sharar",
      "name": "Karson Sharar",
      "teamId": "IOWA",
      "position": "LB",
      "jersey": 43,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 4,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.854
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 70,
      "par": 0.01,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-beau-stephens",
      "name": "Beau Stephens",
      "teamId": "IOWA",
      "position": "IOL",
      "jersey": 70,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "iowa-cael-winter",
      "name": "Cael Winter",
      "teamId": "IOWA",
      "position": "IOL",
      "jersey": 61,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "iowa-cannon-leonard",
      "name": "Cannon Leonard",
      "teamId": "IOWA",
      "position": "IOL",
      "jersey": 75,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "iowa-tj-hall",
      "name": "TJ Hall",
      "teamId": "IOWA",
      "position": "CB",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 2,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.064
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 65,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-ethan-hurkett",
      "name": "Ethan Hurkett",
      "teamId": "IOWA",
      "position": "DL",
      "jersey": 49,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.67
      },
      "production2025": {
        "games": 6,
        "sacks": 6
      },
      "rates": {
        "epaPerPlay": 1.438
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-zach-ortwerth",
      "name": "Zach Ortwerth",
      "teamId": "IOWA",
      "position": "TE",
      "jersey": 48,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.28,
        "targetShare": 0.041
      },
      "production2025": {
        "games": 8,
        "targets": 11,
        "receptions": 8,
        "recYds": 78
      },
      "rates": {
        "ypt": 7.1,
        "epaPerPlay": 0.21
      },
      "measuredPlays": 11,
      "usage2025": {
        "targetShare": 0.041
      },
      "grade": 54,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-max-llewellyn",
      "name": "Max Llewellyn",
      "teamId": "IOWA",
      "position": "DL",
      "jersey": 48,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 8,
        "sacks": 6,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.157
      },
      "measuredPlays": 9,
      "usage2025": {},
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 9 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-rhys-dakin",
      "name": "Rhys Dakin",
      "teamId": "IOWA",
      "position": "P",
      "jersey": 9,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "punts": 43,
        "puntAvg": 19.9
      },
      "rates": {},
      "measuredPlays": 43,
      "productionCurrent": {
        "games": 1,
        "punts": 1
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 43 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-jacob-gill",
      "name": "Jacob Gill",
      "teamId": "IOWA",
      "position": "WR",
      "jersey": 5,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.95,
        "targetShare": 0.148
      },
      "production2025": {
        "games": 11,
        "targets": 40,
        "receptions": 24,
        "recYds": 280,
        "recTd": 1
      },
      "rates": {
        "ypt": 7,
        "epaPerPlay": 0.181,
        "explosiveRate": 0.1
      },
      "measuredPlays": 40,
      "usage2025": {
        "targetShare": 0.148
      },
      "grade": 47,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 40 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-koen-entringer",
      "name": "Koen Entringer",
      "teamId": "IOWA",
      "position": "CB",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 2,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 0.154
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 44,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-kaden-wetjen",
      "name": "Kaden Wetjen",
      "teamId": "IOWA",
      "position": "WR",
      "jersey": 21,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.031,
        "targetShare": 0.1
      },
      "production2025": {
        "games": 13,
        "carries": 15,
        "rushYds": 84,
        "rushTd": 2,
        "targets": 27,
        "receptions": 20,
        "recYds": 157,
        "recTd": 1
      },
      "rates": {
        "ypc": 5.6,
        "ypt": 5.8,
        "epaPerPlay": -0.022,
        "explosiveRate": 0.048
      },
      "measuredPlays": 42,
      "usage2025": {
        "carryShare": 0.031,
        "targetShare": 0.1
      },
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 42 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "iowa-seth-anderson",
      "name": "Seth Anderson",
      "teamId": "IOWA",
      "position": "WR",
      "jersey": 6,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.48,
        "targetShare": 0.074
      },
      "production2025": {
        "games": 7,
        "targets": 20,
        "receptions": 10,
        "recYds": 54,
        "recTd": 2
      },
      "rates": {
        "ypt": 2.7,
        "epaPerPlay": -0.245
      },
      "measuredPlays": 20,
      "usage2025": {
        "targetShare": 0.074
      },
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 20 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  MD: [
    {
      "id": "md-malik-washington",
      "name": "Malik Washington",
      "teamId": "MD",
      "position": "QB",
      "jersey": 7,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.965,
        "carryShare": 0.162
      },
      "production2025": {
        "games": 12,
        "attempts": 470,
        "completions": 270,
        "passYds": 2951,
        "passTd": 17,
        "interceptions": 8,
        "carries": 48,
        "rushYds": 378,
        "rushTd": 4
      },
      "rates": {
        "ypa": 6.3,
        "ypc": 7.9,
        "epaPerPlay": 0.052,
        "explosiveRate": 0.146
      },
      "measuredPlays": 531,
      "usage2025": {
        "passAttemptShare": 0.965,
        "carryShare": 0.162
      },
      "grade": 71,
      "par": 2.61,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 531 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-dontay-joyner",
      "name": "Dontay Joyner",
      "teamId": "MD",
      "position": "CB",
      "jersey": 6,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.86
      },
      "production2025": {
        "games": 4,
        "takeaways": 2,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 3.034
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 96,
      "par": 2.27,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-jamare-glasker",
      "name": "Jamare Glasker",
      "teamId": "MD",
      "position": "CB",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "takeaways": 3,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 3.099
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 96,
      "par": 2.21,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-lavain-scruggs",
      "name": "Lavain Scruggs",
      "teamId": "MD",
      "position": "CB",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 3.647
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 93,
      "par": 2.13,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-daniel-wingate",
      "name": "Daniel Wingate",
      "teamId": "MD",
      "position": "LB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 2,
        "sacks": 1,
        "takeaways": 2
      },
      "rates": {
        "epaPerPlay": 2.816
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 94,
      "par": 1.46,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-messiah-delhomme",
      "name": "Messiah Delhomme",
      "teamId": "MD",
      "position": "CB",
      "jersey": 33,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 2.51
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 82,
      "par": 0.99,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-sidney-stewart",
      "name": "Sidney Stewart",
      "teamId": "MD",
      "position": "DL",
      "jersey": 11,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 4,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.947
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 71,
      "par": 0.36,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-shaleak-knotts",
      "name": "Shaleak Knotts",
      "teamId": "MD",
      "position": "WR",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.98,
        "targetShare": 0.175
      },
      "production2025": {
        "games": 12,
        "targets": 83,
        "receptions": 43,
        "recYds": 701,
        "recTd": 6
      },
      "rates": {
        "ypt": 8.4,
        "epaPerPlay": 0.436,
        "explosiveRate": 0.169
      },
      "measuredPlays": 83,
      "usage2025": {
        "targetShare": 0.175
      },
      "grade": 75,
      "par": 0.27,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 83 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-kaleb-webb",
      "name": "Kaleb Webb",
      "teamId": "MD",
      "position": "WR",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.45,
        "targetShare": 0.08
      },
      "production2025": {
        "games": 12,
        "targets": 38,
        "receptions": 22,
        "recYds": 318,
        "recTd": 2
      },
      "rates": {
        "ypt": 8.4,
        "epaPerPlay": 0.501,
        "explosiveRate": 0.158
      },
      "measuredPlays": 38,
      "usage2025": {
        "targetShare": 0.08
      },
      "grade": 56,
      "par": 0.22,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 38 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-sean-o-haire",
      "name": "Sean O'Haire",
      "teamId": "MD",
      "position": "K",
      "jersey": 36,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "fgAttempts": 24,
        "fgMade": 21,
        "fgLong": 49
      },
      "rates": {},
      "measuredPlays": 24,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 24 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-alan-herron",
      "name": "Alan Herron",
      "teamId": "MD",
      "position": "IOL",
      "jersey": 71,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "md-aliou-bah",
      "name": "Aliou Bah",
      "teamId": "MD",
      "position": "IOL",
      "jersey": 55,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "md-carlos-moore",
      "name": "Carlos Moore",
      "teamId": "MD",
      "position": "IOL",
      "jersey": 68,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "md-iverson-howard",
      "name": "Iverson Howard",
      "teamId": "MD",
      "position": "RB",
      "jersey": 24,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.22,
        "carryShare": 0.132,
        "targetShare": 0.006
      },
      "production2025": {
        "games": 10,
        "carries": 39,
        "rushYds": 127,
        "targets": 3,
        "receptions": 2,
        "recYds": 3
      },
      "rates": {
        "ypc": 3.3,
        "ypt": 1,
        "epaPerPlay": -0.18,
        "explosiveRate": 0.024
      },
      "measuredPlays": 42,
      "usage2025": {
        "carryShare": 0.132,
        "targetShare": 0.006
      },
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 42 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-zahir-mathis",
      "name": "Zahir Mathis",
      "teamId": "MD",
      "position": "DL",
      "jersey": 9,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.83
      },
      "production2025": {
        "games": 5,
        "sacks": 5
      },
      "rates": {
        "epaPerPlay": 1.436
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-jalil-farooq",
      "name": "Jalil Farooq",
      "teamId": "MD",
      "position": "WR",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.95,
        "carryShare": 0.007,
        "targetShare": 0.166
      },
      "production2025": {
        "games": 12,
        "carries": 2,
        "rushYds": 8,
        "targets": 79,
        "receptions": 55,
        "recYds": 510,
        "recTd": 3
      },
      "rates": {
        "ypc": 4,
        "ypt": 6.5,
        "epaPerPlay": 0.214,
        "explosiveRate": 0.025
      },
      "measuredPlays": 81,
      "usage2025": {
        "carryShare": 0.007,
        "targetShare": 0.166
      },
      "grade": 54,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 81 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-nolan-ray",
      "name": "Nolan Ray",
      "teamId": "MD",
      "position": "RB",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.46,
        "carryShare": 0.23,
        "targetShare": 0.044
      },
      "production2025": {
        "games": 12,
        "carries": 68,
        "rushYds": 289,
        "rushTd": 2,
        "targets": 21,
        "receptions": 11,
        "recYds": 50
      },
      "rates": {
        "ypc": 4.3,
        "ypt": 2.4,
        "epaPerPlay": -0.195,
        "explosiveRate": 0.022
      },
      "measuredPlays": 89,
      "usage2025": {
        "carryShare": 0.23,
        "targetShare": 0.044
      },
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 89 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-octavian-smith-jr",
      "name": "Octavian Smith Jr.",
      "teamId": "MD",
      "position": "WR",
      "jersey": 5,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.002,
        "carryShare": 0.014,
        "targetShare": 0.168
      },
      "production2025": {
        "games": 12,
        "attempts": 1,
        "carries": 4,
        "rushYds": 17,
        "targets": 80,
        "receptions": 43,
        "recYds": 531
      },
      "rates": {
        "ypc": 4.3,
        "ypt": 6.6,
        "epaPerPlay": 0.137,
        "explosiveRate": 0.083
      },
      "measuredPlays": 85,
      "usage2025": {
        "passAttemptShare": 0.002,
        "carryShare": 0.014,
        "targetShare": 0.168
      },
      "grade": 50,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 85 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-dejuan-williams",
      "name": "DeJuan Williams",
      "teamId": "MD",
      "position": "RB",
      "jersey": 0,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.432,
        "targetShare": 0.137
      },
      "production2025": {
        "games": 12,
        "carries": 128,
        "rushYds": 511,
        "rushTd": 3,
        "targets": 65,
        "receptions": 45,
        "recYds": 430,
        "recTd": 1
      },
      "rates": {
        "ypc": 4,
        "ypt": 6.6,
        "epaPerPlay": -0.064,
        "explosiveRate": 0.036
      },
      "measuredPlays": 193,
      "usage2025": {
        "carryShare": 0.432,
        "targetShare": 0.137
      },
      "grade": 49,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 193 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-bryce-mcferson",
      "name": "Bryce McFerson",
      "teamId": "MD",
      "position": "P",
      "jersey": 34,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "punts": 56,
        "puntAvg": 31.5
      },
      "rates": {},
      "measuredPlays": 56,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 56 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-dorian-fleming",
      "name": "Dorian Fleming",
      "teamId": "MD",
      "position": "TE",
      "jersey": 9,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.141
      },
      "production2025": {
        "games": 12,
        "targets": 67,
        "receptions": 40,
        "recYds": 355,
        "recTd": 3
      },
      "rates": {
        "ypt": 5.3,
        "epaPerPlay": -0.063,
        "explosiveRate": 0.09
      },
      "measuredPlays": 67,
      "usage2025": {
        "targetShare": 0.141
      },
      "grade": 46,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 67 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "md-aj-szymanski",
      "name": "AJ Szymanski",
      "teamId": "MD",
      "position": "TE",
      "jersey": 89,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.16,
        "targetShare": 0.023
      },
      "production2025": {
        "games": 8,
        "targets": 11,
        "receptions": 5,
        "recYds": 32,
        "recTd": 1
      },
      "rates": {
        "ypt": 2.9,
        "epaPerPlay": -0.303,
        "explosiveRate": 0.091
      },
      "measuredPlays": 11,
      "usage2025": {
        "targetShare": 0.023
      },
      "grade": 45,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  MICH: [
    {
      "id": "mich-justice-haynes",
      "name": "Justice Haynes",
      "teamId": "MICH",
      "position": "RB",
      "jersey": 22,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.83,
        "carryShare": 0.25,
        "targetShare": 0.048
      },
      "production2025": {
        "games": 7,
        "carries": 120,
        "rushYds": 858,
        "rushTd": 10,
        "targets": 16,
        "receptions": 13,
        "recYds": 60
      },
      "rates": {
        "ypc": 7.2,
        "ypt": 3.8,
        "epaPerPlay": 0.196,
        "explosiveRate": 0.066
      },
      "measuredPlays": 136,
      "productionCurrent": {
        "games": 1,
        "carries": 13,
        "rushYds": 49
      },
      "usage2025": {
        "carryShare": 0.25,
        "targetShare": 0.048
      },
      "grade": 98,
      "par": 4.01,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 136 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-jordan-marshall",
      "name": "Jordan Marshall",
      "teamId": "MICH",
      "position": "RB",
      "jersey": 23,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.313,
        "targetShare": 0.039
      },
      "production2025": {
        "games": 11,
        "carries": 150,
        "rushYds": 958,
        "rushTd": 10,
        "targets": 13,
        "receptions": 9,
        "recYds": 92
      },
      "rates": {
        "ypc": 6.4,
        "ypt": 7.1,
        "epaPerPlay": 0.214,
        "explosiveRate": 0.061
      },
      "measuredPlays": 163,
      "usage2025": {
        "carryShare": 0.313,
        "targetShare": 0.039
      },
      "grade": 96,
      "par": 2.86,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 163 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-bryce-underwood",
      "name": "Bryce Underwood",
      "teamId": "MICH",
      "position": "QB",
      "jersey": 19,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.985,
        "carryShare": 0.156
      },
      "production2025": {
        "games": 13,
        "attempts": 335,
        "completions": 202,
        "passYds": 2454,
        "passTd": 11,
        "interceptions": 9,
        "carries": 75,
        "rushYds": 492,
        "rushTd": 6
      },
      "rates": {
        "ypa": 7.3,
        "ypc": 6.6,
        "epaPerPlay": 0.081,
        "explosiveRate": 0.12
      },
      "measuredPlays": 438,
      "usage2025": {
        "passAttemptShare": 0.985,
        "carryShare": 0.156
      },
      "grade": 70,
      "par": 1.69,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 438 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-cole-sullivan",
      "name": "Cole Sullivan",
      "teamId": "MICH",
      "position": "LB",
      "jersey": 18,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.86
      },
      "production2025": {
        "games": 5,
        "sacks": 2,
        "takeaways": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 3.233
      },
      "measuredPlays": 6,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 1
      },
      "usage2025": {},
      "grade": 93,
      "par": 1.67,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-tj-guy",
      "name": "TJ Guy",
      "teamId": "MICH",
      "position": "EDGE",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.27
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 3.232
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 94,
      "par": 1.59,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-jimmy-rolder",
      "name": "Jimmy Rolder",
      "teamId": "MICH",
      "position": "LB",
      "jersey": 30,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 2.505
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 76,
      "par": 0.66,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-zack-marshall",
      "name": "Zack Marshall",
      "teamId": "MICH",
      "position": "TE",
      "jersey": 83,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.51,
        "targetShare": 0.066
      },
      "production2025": {
        "games": 8,
        "targets": 22,
        "receptions": 16,
        "recYds": 199,
        "recTd": 1
      },
      "rates": {
        "ypt": 9,
        "epaPerPlay": 0.671,
        "explosiveRate": 0.045
      },
      "measuredPlays": 22,
      "usage2025": {
        "targetShare": 0.066
      },
      "grade": 86,
      "par": 0.49,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 22 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-jyaire-hill",
      "name": "Jyaire Hill",
      "teamId": "MICH",
      "position": "CB",
      "jersey": 20,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.016
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 72,
      "par": 0.49,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-bryson-kuzdzal",
      "name": "Bryson Kuzdzal",
      "teamId": "MICH",
      "position": "RB",
      "jersey": 24,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.51,
        "carryShare": 0.158,
        "targetShare": 0.021
      },
      "production2025": {
        "games": 7,
        "carries": 76,
        "rushYds": 355,
        "rushTd": 4,
        "targets": 7,
        "receptions": 4,
        "recYds": 16
      },
      "rates": {
        "ypc": 4.7,
        "ypt": 2.3,
        "epaPerPlay": 0.029,
        "explosiveRate": 0.024
      },
      "measuredPlays": 83,
      "usage2025": {
        "carryShare": 0.158,
        "targetShare": 0.021
      },
      "grade": 76,
      "par": 0.48,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 83 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-andrew-marsh",
      "name": "Andrew Marsh",
      "teamId": "MICH",
      "position": "WR",
      "jersey": 4,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.76,
        "carryShare": 0.004,
        "targetShare": 0.18
      },
      "production2025": {
        "games": 11,
        "carries": 2,
        "rushYds": 23,
        "rushTd": 1,
        "targets": 60,
        "receptions": 45,
        "recYds": 661,
        "recTd": 4
      },
      "rates": {
        "ypc": 11.5,
        "ypt": 11,
        "epaPerPlay": 0.569,
        "explosiveRate": 0.081
      },
      "measuredPlays": 62,
      "usage2025": {
        "carryShare": 0.004,
        "targetShare": 0.18
      },
      "grade": 74,
      "par": 0.46,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 62 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-derrick-moore",
      "name": "Derrick Moore",
      "teamId": "MICH",
      "position": "EDGE",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 7,
        "sacks": 10,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.797
      },
      "measuredPlays": 11,
      "usage2025": {},
      "grade": 87,
      "par": 0.24,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-deakon-tonielli",
      "name": "Deakon Tonielli",
      "teamId": "MICH",
      "position": "TE",
      "jersey": 43,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.26,
        "targetShare": 0.033
      },
      "production2025": {
        "games": 6,
        "targets": 11,
        "receptions": 8,
        "recYds": 72
      },
      "rates": {
        "ypt": 6.5,
        "epaPerPlay": 0.461,
        "explosiveRate": 0.091
      },
      "measuredPlays": 11,
      "usage2025": {
        "targetShare": 0.033
      },
      "grade": 67,
      "par": 0.14,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-dominic-zvada",
      "name": "Dominic Zvada",
      "teamId": "MICH",
      "position": "K",
      "jersey": 96,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "fgAttempts": 25,
        "fgMade": 17,
        "fgLong": 56
      },
      "rates": {},
      "measuredPlays": 25,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 25 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-connor-jones",
      "name": "Connor Jones",
      "teamId": "MICH",
      "position": "IOL",
      "jersey": 76,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "mich-dan-taraboi",
      "name": "Dan Taraboi",
      "teamId": "MICH",
      "position": "IOL",
      "jersey": 66,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "mich-giovanni-el-hadi",
      "name": "Giovanni El-Hadi",
      "teamId": "MICH",
      "position": "IOL",
      "jersey": 58,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "mich-jaishawn-barham",
      "name": "Jaishawn Barham",
      "teamId": "MICH",
      "position": "LB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 4,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.715
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 75,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-donaven-mcculley",
      "name": "Donaven McCulley",
      "teamId": "MICH",
      "position": "WR",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.003,
        "carryShare": 0.004,
        "targetShare": 0.237
      },
      "production2025": {
        "games": 13,
        "attempts": 1,
        "carries": 2,
        "rushYds": 5,
        "targets": 79,
        "receptions": 39,
        "recYds": 588,
        "recTd": 3
      },
      "rates": {
        "ypc": 2.5,
        "ypt": 7.4,
        "epaPerPlay": 0.34,
        "explosiveRate": 0.086
      },
      "measuredPlays": 82,
      "usage2025": {
        "passAttemptShare": 0.003,
        "carryShare": 0.004,
        "targetShare": 0.237
      },
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 82 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-tj-metcalf",
      "name": "TJ Metcalf",
      "teamId": "MICH",
      "position": "CB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.441
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 60,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-jordan-young",
      "name": "Jordan Young",
      "teamId": "MICH",
      "position": "CB",
      "jersey": 14,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.181
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 55,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-zeke-berry",
      "name": "Zeke Berry",
      "teamId": "MICH",
      "position": "CB",
      "jersey": 10,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "takeaways": 1,
        "passBreakups": 6
      },
      "rates": {
        "epaPerPlay": 0.999
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 55,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-hudson-hollenbeck",
      "name": "Hudson Hollenbeck",
      "teamId": "MICH",
      "position": "P",
      "jersey": 90,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "punts": 40,
        "puntAvg": 25.4
      },
      "rates": {},
      "measuredPlays": 40,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 40 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-channing-goodwin",
      "name": "Channing Goodwin",
      "teamId": "MICH",
      "position": "WR",
      "jersey": 9,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.27,
        "targetShare": 0.066
      },
      "production2025": {
        "games": 8,
        "targets": 22,
        "receptions": 12,
        "recYds": 148
      },
      "rates": {
        "ypt": 6.7,
        "epaPerPlay": 0.076,
        "explosiveRate": 0.091
      },
      "measuredPlays": 22,
      "usage2025": {
        "targetShare": 0.066
      },
      "grade": 43,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 22 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "mich-semaj-morgan",
      "name": "Semaj Morgan",
      "teamId": "MICH",
      "position": "WR",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.54,
        "passAttemptShare": 0.006,
        "carryShare": 0.01,
        "targetShare": 0.111
      },
      "production2025": {
        "games": 11,
        "attempts": 2,
        "carries": 5,
        "rushYds": 25,
        "targets": 37,
        "receptions": 20,
        "recYds": 223,
        "recTd": 1
      },
      "rates": {
        "ypc": 5,
        "ypt": 6,
        "epaPerPlay": 0.057,
        "explosiveRate": 0.071
      },
      "measuredPlays": 44,
      "usage2025": {
        "passAttemptShare": 0.006,
        "carryShare": 0.01,
        "targetShare": 0.111
      },
      "grade": 43,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 44 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  MINN: [
    {
      "id": "minn-john-nestor",
      "name": "John Nestor",
      "teamId": "MINN",
      "position": "CB",
      "jersey": 17,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.7
      },
      "production2025": {
        "games": 5,
        "takeaways": 4,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 3.779
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 98,
      "par": 3.16,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-drake-lindsey",
      "name": "Drake Lindsey",
      "teamId": "MINN",
      "position": "QB",
      "jersey": 5,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.979,
        "carryShare": 0.05
      },
      "production2025": {
        "games": 12,
        "attempts": 370,
        "completions": 229,
        "passYds": 2285,
        "passTd": 17,
        "interceptions": 6,
        "carries": 16,
        "rushYds": 28,
        "rushTd": 4
      },
      "rates": {
        "ypa": 6.2,
        "ypc": 1.8,
        "epaPerPlay": 0.103,
        "explosiveRate": 0.125
      },
      "measuredPlays": 410,
      "productionCurrent": {
        "games": 1,
        "attempts": 24,
        "completions": 19,
        "passYds": 264,
        "passTd": 1,
        "carries": 2,
        "rushYds": 6
      },
      "usage2025": {
        "passAttemptShare": 0.979,
        "carryShare": 0.05
      },
      "grade": 73,
      "par": 1.94,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 410 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-jaxon-howard",
      "name": "Jaxon Howard",
      "teamId": "MINN",
      "position": "DL",
      "jersey": 1,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.33
      },
      "production2025": {
        "games": 2,
        "sacks": 3
      },
      "rates": {
        "epaPerPlay": 2.072
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 92,
      "par": 0.73,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-darius-taylor",
      "name": "Darius Taylor",
      "teamId": "MINN",
      "position": "RB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.37,
        "targetShare": 0.122
      },
      "production2025": {
        "games": 9,
        "carries": 119,
        "rushYds": 559,
        "rushTd": 3,
        "targets": 45,
        "receptions": 30,
        "recYds": 222
      },
      "rates": {
        "ypc": 4.7,
        "ypt": 4.9,
        "epaPerPlay": 0.073,
        "explosiveRate": 0.067
      },
      "measuredPlays": 164,
      "productionCurrent": {
        "games": 1,
        "carries": 15,
        "rushYds": 70,
        "rushTd": 3,
        "targets": 3,
        "receptions": 3,
        "recYds": 31
      },
      "usage2025": {
        "carryShare": 0.37,
        "targetShare": 0.122
      },
      "grade": 74,
      "par": 0.26,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 164 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-jalen-smith",
      "name": "Jalen Smith",
      "teamId": "MINN",
      "position": "WR",
      "jersey": 8,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.67,
        "targetShare": 0.13
      },
      "production2025": {
        "games": 10,
        "targets": 48,
        "receptions": 24,
        "recYds": 388,
        "recTd": 2
      },
      "rates": {
        "ypt": 8.1,
        "epaPerPlay": 0.432,
        "explosiveRate": 0.104
      },
      "measuredPlays": 48,
      "productionCurrent": {
        "games": 1,
        "targets": 3,
        "receptions": 3,
        "recYds": 26
      },
      "usage2025": {
        "targetShare": 0.13
      },
      "grade": 63,
      "par": 0.18,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 48 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-le-meke-brockington",
      "name": "Le'Meke Brockington",
      "teamId": "MINN",
      "position": "WR",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.009,
        "targetShare": 0.188
      },
      "production2025": {
        "games": 12,
        "carries": 3,
        "rushYds": 10,
        "rushTd": 1,
        "targets": 69,
        "receptions": 46,
        "recYds": 494,
        "recTd": 4
      },
      "rates": {
        "ypc": 3.3,
        "ypt": 7.2,
        "epaPerPlay": 0.418,
        "explosiveRate": 0.069
      },
      "measuredPlays": 72,
      "usage2025": {
        "carryShare": 0.009,
        "targetShare": 0.188
      },
      "grade": 66,
      "par": 0.15,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 72 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-brady-denaburg",
      "name": "Brady Denaburg",
      "teamId": "MINN",
      "position": "K",
      "jersey": 92,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "fgAttempts": 21,
        "fgMade": 14,
        "fgLong": 46
      },
      "rates": {},
      "measuredPlays": 21,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 21 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-javon-tracy",
      "name": "Javon Tracy",
      "teamId": "MINN",
      "position": "WR",
      "jersey": 11,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.88,
        "carryShare": 0.003,
        "targetShare": 0.168
      },
      "production2025": {
        "games": 12,
        "carries": 1,
        "rushYds": 15,
        "targets": 62,
        "receptions": 35,
        "recYds": 441,
        "recTd": 6
      },
      "rates": {
        "ypc": 15,
        "ypt": 7.1,
        "epaPerPlay": 0.335,
        "explosiveRate": 0.095
      },
      "measuredPlays": 63,
      "productionCurrent": {
        "games": 1,
        "targets": 7,
        "receptions": 5,
        "recYds": 98
      },
      "usage2025": {
        "carryShare": 0.003,
        "targetShare": 0.168
      },
      "grade": 60,
      "par": 0.01,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 63 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-aluma-nkele",
      "name": "Aluma Nkele",
      "teamId": "MINN",
      "position": "IOL",
      "jersey": 70,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "minn-ashton-beers",
      "name": "Ashton Beers",
      "teamId": "MINN",
      "position": "IOL",
      "jersey": 78,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "minn-dylan-ray",
      "name": "Dylan Ray",
      "teamId": "MINN",
      "position": "IOL",
      "jersey": 73,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "minn-anthony-smith",
      "name": "Anthony Smith",
      "teamId": "MINN",
      "position": "DL",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 7,
        "sacks": 9
      },
      "rates": {
        "epaPerPlay": 1.478
      },
      "measuredPlays": 9,
      "usage2025": {},
      "grade": 69,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 9 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-matt-kingsbury",
      "name": "Matt Kingsbury",
      "teamId": "MINN",
      "position": "LB",
      "jersey": 49,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.599
      },
      "measuredPlays": 4,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 2
      },
      "usage2025": {},
      "grade": 68,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-fame-ijeboi",
      "name": "Fame Ijeboi",
      "teamId": "MINN",
      "position": "RB",
      "jersey": 2,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.68,
        "carryShare": 0.295,
        "targetShare": 0.043
      },
      "production2025": {
        "games": 11,
        "carries": 95,
        "rushYds": 452,
        "rushTd": 2,
        "targets": 16,
        "receptions": 12,
        "recYds": 66,
        "recTd": 1
      },
      "rates": {
        "ypc": 4.8,
        "ypt": 4.1,
        "epaPerPlay": 0.019,
        "explosiveRate": 0.036
      },
      "measuredPlays": 111,
      "productionCurrent": {
        "games": 1,
        "carries": 11,
        "rushYds": 145,
        "rushTd": 1,
        "targets": 2,
        "receptions": 2,
        "recYds": 30
      },
      "usage2025": {
        "carryShare": 0.295,
        "targetShare": 0.043
      },
      "grade": 67,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 111 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-grant-washington",
      "name": "Grant Washington",
      "teamId": "MINN",
      "position": "RB",
      "jersey": 21,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.12,
        "carryShare": 0.062
      },
      "production2025": {
        "games": 2,
        "carries": 20,
        "rushYds": 116
      },
      "rates": {
        "ypc": 5.8,
        "epaPerPlay": -0.023
      },
      "measuredPlays": 20,
      "usage2025": {
        "carryShare": 0.062
      },
      "grade": 63,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 20 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-karter-menz",
      "name": "Karter Menz",
      "teamId": "MINN",
      "position": "DL",
      "jersey": 11,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.56
      },
      "production2025": {
        "games": 4,
        "sacks": 5
      },
      "rates": {
        "epaPerPlay": 1.225
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 59,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-jameson-geers",
      "name": "Jameson Geers",
      "teamId": "MINN",
      "position": "TE",
      "jersey": 86,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.006,
        "targetShare": 0.114
      },
      "production2025": {
        "games": 12,
        "carries": 2,
        "rushYds": 1,
        "targets": 42,
        "receptions": 26,
        "recYds": 207,
        "recTd": 4
      },
      "rates": {
        "ypc": 0.5,
        "ypt": 4.9,
        "epaPerPlay": 0.185,
        "explosiveRate": 0.068
      },
      "measuredPlays": 44,
      "usage2025": {
        "carryShare": 0.006,
        "targetShare": 0.114
      },
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 44 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-koi-perich",
      "name": "Koi Perich",
      "teamId": "MINN",
      "position": "CB",
      "jersey": 3,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.006,
        "targetShare": 0.008
      },
      "production2025": {
        "games": 7,
        "carries": 2,
        "rushYds": 11,
        "targets": 3,
        "receptions": 3,
        "recYds": 55,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "ypc": 5.5,
        "ypt": 18.3,
        "epaPerPlay": 0.972
      },
      "measuredPlays": 10,
      "usage2025": {
        "carryShare": 0.006,
        "targetShare": 0.008
      },
      "grade": 54,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 10 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-drew-biber",
      "name": "Drew Biber",
      "teamId": "MINN",
      "position": "TE",
      "jersey": 87,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.52,
        "targetShare": 0.063
      },
      "production2025": {
        "games": 12,
        "targets": 23,
        "receptions": 17,
        "recYds": 128
      },
      "rates": {
        "ypt": 5.6,
        "epaPerPlay": 0.087
      },
      "measuredPlays": 23,
      "usage2025": {
        "targetShare": 0.063
      },
      "grade": 52,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 23 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-kerry-brown",
      "name": "Kerry Brown",
      "teamId": "MINN",
      "position": "CB",
      "jersey": 14,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 4,
        "takeaways": 1,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 0.734
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-tom-weston",
      "name": "Tom Weston",
      "teamId": "MINN",
      "position": "P",
      "jersey": 42,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "punts": 59,
        "puntAvg": 23.5
      },
      "rates": {},
      "measuredPlays": 59,
      "productionCurrent": {
        "games": 1,
        "punts": 1
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 59 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-emmanuel-karmo",
      "name": "Emmanuel Karmo",
      "teamId": "MINN",
      "position": "LB",
      "jersey": 2,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 2,
        "sacks": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 0.655
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 46,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "minn-logan-loya",
      "name": "Logan Loya",
      "teamId": "MINN",
      "position": "WR",
      "jersey": 17,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.24,
        "carryShare": 0.003,
        "targetShare": 0.043
      },
      "production2025": {
        "games": 9,
        "carries": 1,
        "rushYds": -5,
        "targets": 16,
        "receptions": 10,
        "recYds": 61
      },
      "rates": {
        "ypc": -5,
        "ypt": 3.8,
        "epaPerPlay": -0.394
      },
      "measuredPlays": 17,
      "usage2025": {
        "carryShare": 0.003,
        "targetShare": 0.043
      },
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 17 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  MSU: [
    {
      "id": "msu-aidan-chiles",
      "name": "Aidan Chiles",
      "teamId": "MSU",
      "position": "QB",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.54,
        "carryShare": 0.169,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 8,
        "attempts": 203,
        "completions": 125,
        "passYds": 1392,
        "passTd": 11,
        "interceptions": 3,
        "carries": 58,
        "rushYds": 401,
        "rushTd": 5,
        "targets": 1,
        "punts": 1,
        "puntAvg": 40
      },
      "rates": {
        "ypa": 6.9,
        "ypc": 6.9,
        "epaPerPlay": 0.19,
        "explosiveRate": 0.169
      },
      "measuredPlays": 283,
      "usage2025": {
        "passAttemptShare": 0.54,
        "carryShare": 0.169,
        "targetShare": 0.003
      },
      "grade": 91,
      "par": 5.31,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 283 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-michael-masunas",
      "name": "Michael Masunas",
      "teamId": "MSU",
      "position": "TE",
      "jersey": 15,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.47,
        "targetShare": 0.058
      },
      "production2025": {
        "games": 10,
        "targets": 21,
        "receptions": 18,
        "recYds": 223,
        "recTd": 3
      },
      "rates": {
        "ypt": 10.6,
        "epaPerPlay": 0.839,
        "explosiveRate": 0.048
      },
      "measuredPlays": 21,
      "usage2025": {
        "targetShare": 0.058
      },
      "grade": 85,
      "par": 0.55,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 21 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-alessio-milivojevic",
      "name": "Alessio Milivojevic",
      "teamId": "MSU",
      "position": "QB",
      "jersey": 11,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.74,
        "passAttemptShare": 0.455,
        "carryShare": 0.044
      },
      "production2025": {
        "games": 8,
        "attempts": 171,
        "completions": 110,
        "passYds": 1271,
        "passTd": 10,
        "interceptions": 2,
        "carries": 15,
        "rushYds": 71,
        "rushTd": 1,
        "punts": 3
      },
      "rates": {
        "ypa": 7.4,
        "ypc": 4.7,
        "epaPerPlay": 0.055,
        "explosiveRate": 0.067
      },
      "measuredPlays": 209,
      "productionCurrent": {
        "games": 1,
        "attempts": 34,
        "completions": 26,
        "passYds": 247,
        "passTd": 1,
        "carries": 6,
        "rushYds": 19
      },
      "usage2025": {
        "passAttemptShare": 0.455,
        "carryShare": 0.044
      },
      "grade": 66,
      "par": 0.48,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 209 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-jack-velling",
      "name": "Jack Velling",
      "teamId": "MSU",
      "position": "TE",
      "jersey": 12,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.123
      },
      "production2025": {
        "games": 12,
        "targets": 45,
        "receptions": 36,
        "recYds": 359,
        "recTd": 3
      },
      "rates": {
        "ypt": 8,
        "epaPerPlay": 0.529,
        "explosiveRate": 0.089
      },
      "measuredPlays": 45,
      "usage2025": {
        "targetShare": 0.123
      },
      "grade": 88,
      "par": 0.41,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 45 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-omari-kelly",
      "name": "Omari Kelly",
      "teamId": "MSU",
      "position": "WR",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.74,
        "passAttemptShare": 0.005,
        "carryShare": 0.017,
        "targetShare": 0.203
      },
      "production2025": {
        "games": 12,
        "attempts": 2,
        "completions": 1,
        "passYds": 13,
        "carries": 6,
        "rushYds": 45,
        "targets": 74,
        "receptions": 45,
        "recYds": 583,
        "recTd": 2
      },
      "rates": {
        "ypa": 6.5,
        "ypc": 7.5,
        "ypt": 7.9,
        "epaPerPlay": 0.424,
        "explosiveRate": 0.125
      },
      "measuredPlays": 82,
      "usage2025": {
        "passAttemptShare": 0.005,
        "carryShare": 0.017,
        "targetShare": 0.203
      },
      "grade": 74,
      "par": 0.23,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 82 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-alex-vansumeren",
      "name": "Alex VanSumeren",
      "teamId": "MSU",
      "position": "DL",
      "jersey": 91,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.621
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 61,
      "par": 0.04,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-martin-connington",
      "name": "Martin Connington",
      "teamId": "MSU",
      "position": "K",
      "jersey": 29,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 8,
        "fgAttempts": 16,
        "fgMade": 12,
        "fgLong": 50
      },
      "rates": {},
      "measuredPlays": 16,
      "productionCurrent": {
        "games": 1,
        "fgAttempts": 1,
        "fgMade": 1
      },
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 16 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-caleb-carter",
      "name": "Caleb Carter",
      "teamId": "MSU",
      "position": "IOL",
      "jersey": 72,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "msu-kristian-phillips",
      "name": "Kristian Phillips",
      "teamId": "MSU",
      "position": "IOL",
      "jersey": 71,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "msu-matt-gulbin",
      "name": "Matt Gulbin",
      "teamId": "MSU",
      "position": "IOL",
      "jersey": 51,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "msu-brandon-tullis",
      "name": "Brandon Tullis",
      "teamId": "MSU",
      "position": "RB",
      "jersey": 7,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.65,
        "carryShare": 0.203,
        "targetShare": 0.038
      },
      "production2025": {
        "games": 12,
        "carries": 70,
        "rushYds": 317,
        "rushTd": 4,
        "targets": 14,
        "receptions": 10,
        "recYds": 88
      },
      "rates": {
        "ypc": 4.5,
        "ypt": 6.3,
        "epaPerPlay": -0.047,
        "explosiveRate": 0.048
      },
      "measuredPlays": 84,
      "usage2025": {
        "carryShare": 0.203,
        "targetShare": 0.038
      },
      "grade": 61,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 84 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-elijah-tau-tolliver",
      "name": "Elijah Tau-Tolliver",
      "teamId": "MSU",
      "position": "RB",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.72,
        "carryShare": 0.206,
        "targetShare": 0.06
      },
      "production2025": {
        "games": 12,
        "carries": 71,
        "rushYds": 455,
        "rushTd": 2,
        "targets": 22,
        "receptions": 18,
        "recYds": 139
      },
      "rates": {
        "ypc": 6.4,
        "ypt": 6.3,
        "epaPerPlay": -0.055,
        "explosiveRate": 0.054
      },
      "measuredPlays": 93,
      "usage2025": {
        "carryShare": 0.206,
        "targetShare": 0.06
      },
      "grade": 58,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 93 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-grady-kelly",
      "name": "Grady Kelly",
      "teamId": "MSU",
      "position": "DL",
      "jersey": 16,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 3,
        "sacks": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.501
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 58,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-jordan-hall",
      "name": "Jordan Hall",
      "teamId": "MSU",
      "position": "LB",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 2,
        "takeaways": 3,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.067
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 55,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-malik-spencer",
      "name": "Malik Spencer",
      "teamId": "MSU",
      "position": "CB",
      "jersey": 43,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.8
      },
      "production2025": {
        "games": 4,
        "sacks": 2,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.083
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 53,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-quindarius-dunnigan",
      "name": "Quindarius Dunnigan",
      "teamId": "MSU",
      "position": "DL",
      "jersey": 99,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 3,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 1.013
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 53,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-nick-marsh",
      "name": "Nick Marsh",
      "teamId": "MSU",
      "position": "WR",
      "jersey": 11,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.009,
        "targetShare": 0.296
      },
      "production2025": {
        "games": 12,
        "carries": 3,
        "rushYds": 19,
        "targets": 108,
        "receptions": 58,
        "recYds": 650,
        "recTd": 7
      },
      "rates": {
        "ypc": 6.3,
        "ypt": 6,
        "epaPerPlay": 0.135,
        "explosiveRate": 0.081
      },
      "measuredPlays": 111,
      "productionCurrent": {
        "games": 1,
        "targets": 2,
        "receptions": 2,
        "recYds": 17,
        "recTd": 1
      },
      "usage2025": {
        "carryShare": 0.009,
        "targetShare": 0.296
      },
      "grade": 52,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 111 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-ryan-eckley",
      "name": "Ryan Eckley",
      "teamId": "MSU",
      "position": "P",
      "jersey": 96,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "fgAttempts": 1,
        "punts": 50,
        "puntAvg": 21.6
      },
      "rates": {},
      "measuredPlays": 51,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 51 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-chrishon-mccray",
      "name": "Chrishon McCray",
      "teamId": "MSU",
      "position": "WR",
      "jersey": 13,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.41,
        "carryShare": 0.006,
        "targetShare": 0.118
      },
      "production2025": {
        "games": 11,
        "carries": 2,
        "targets": 43,
        "receptions": 24,
        "recYds": 334,
        "recTd": 3
      },
      "rates": {
        "ypt": 7.8,
        "epaPerPlay": 0.224,
        "explosiveRate": 0.111
      },
      "measuredPlays": 45,
      "productionCurrent": {
        "games": 1,
        "carries": 1,
        "rushYds": 4,
        "targets": 10,
        "receptions": 8,
        "recYds": 69
      },
      "usage2025": {
        "carryShare": 0.006,
        "targetShare": 0.118
      },
      "grade": 47,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 45 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-malcolm-bell",
      "name": "Malcolm Bell",
      "teamId": "MSU",
      "position": "CB",
      "jersey": 14,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 2,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 0.456
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 46,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "msu-makhi-frazier",
      "name": "Makhi Frazier",
      "teamId": "MSU",
      "position": "RB",
      "jersey": 25,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.334,
        "targetShare": 0.041
      },
      "production2025": {
        "games": 9,
        "carries": 115,
        "rushYds": 523,
        "rushTd": 2,
        "targets": 15,
        "receptions": 12,
        "recYds": 37
      },
      "rates": {
        "ypc": 4.5,
        "ypt": 2.5,
        "epaPerPlay": -0.19,
        "explosiveRate": 0.038
      },
      "measuredPlays": 130,
      "usage2025": {
        "carryShare": 0.334,
        "targetShare": 0.041
      },
      "grade": 44,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 130 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  NEB: [
    {
      "id": "neb-kwinten-ives",
      "name": "Kwinten Ives",
      "teamId": "NEB",
      "position": "RB",
      "jersey": 21,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.07,
        "carryShare": 0.048,
        "targetShare": 0.008
      },
      "production2025": {
        "games": 3,
        "carries": 20,
        "rushYds": 133,
        "rushTd": 2,
        "targets": 3,
        "receptions": 3,
        "recYds": 43
      },
      "rates": {
        "ypc": 6.7,
        "ypt": 14.3,
        "epaPerPlay": 0.505,
        "explosiveRate": 0.087
      },
      "measuredPlays": 23,
      "usage2025": {
        "carryShare": 0.048,
        "targetShare": 0.008
      },
      "grade": 97,
      "par": 3.28,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 23 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-emmett-johnson",
      "name": "Emmett Johnson",
      "teamId": "NEB",
      "position": "RB",
      "jersey": 21,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.606,
        "targetShare": 0.163
      },
      "production2025": {
        "games": 12,
        "carries": 251,
        "rushYds": 1483,
        "rushTd": 13,
        "targets": 60,
        "receptions": 46,
        "recYds": 366,
        "recTd": 3
      },
      "rates": {
        "ypc": 5.9,
        "ypt": 6.1,
        "epaPerPlay": 0.128,
        "explosiveRate": 0.039
      },
      "measuredPlays": 311,
      "usage2025": {
        "carryShare": 0.606,
        "targetShare": 0.163
      },
      "grade": 96,
      "par": 2.43,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 311 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-tj-lateef",
      "name": "TJ Lateef",
      "teamId": "NEB",
      "position": "QB",
      "jersey": 14,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.56,
        "passAttemptShare": 0.324,
        "carryShare": 0.094
      },
      "production2025": {
        "games": 7,
        "attempts": 122,
        "completions": 73,
        "passYds": 916,
        "passTd": 5,
        "interceptions": 1,
        "carries": 39,
        "rushYds": 163,
        "rushTd": 4
      },
      "rates": {
        "ypa": 7.5,
        "ypc": 4.2,
        "epaPerPlay": 0.087,
        "explosiveRate": 0.077
      },
      "measuredPlays": 169,
      "usage2025": {
        "passAttemptShare": 0.324,
        "carryShare": 0.094
      },
      "grade": 79,
      "par": 2.08,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 169 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-riley-van-poppel",
      "name": "Riley Van Poppel",
      "teamId": "NEB",
      "position": "DL",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 3.247
      },
      "measuredPlays": 3,
      "productionCurrent": {
        "games": 1,
        "sacks": 1
      },
      "usage2025": {},
      "grade": 94,
      "par": 1.66,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-dylan-raiola",
      "name": "Dylan Raiola",
      "teamId": "NEB",
      "position": "QB",
      "jersey": 15,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.662,
        "carryShare": 0.06
      },
      "production2025": {
        "games": 9,
        "attempts": 249,
        "completions": 179,
        "passYds": 2061,
        "passTd": 19,
        "interceptions": 5,
        "carries": 25,
        "rushYds": 97
      },
      "rates": {
        "ypa": 8.3,
        "ypc": 3.9,
        "epaPerPlay": 0.152,
        "explosiveRate": 0.04
      },
      "measuredPlays": 302,
      "usage2025": {
        "passAttemptShare": 0.662,
        "carryShare": 0.06
      },
      "grade": 63,
      "par": 0.74,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 302 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-mekhi-nelson",
      "name": "Mekhi Nelson",
      "teamId": "NEB",
      "position": "RB",
      "jersey": 35,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.12,
        "carryShare": 0.065,
        "targetShare": 0.027
      },
      "production2025": {
        "games": 10,
        "carries": 27,
        "rushYds": 147,
        "rushTd": 2,
        "targets": 10,
        "receptions": 8,
        "recYds": 110
      },
      "rates": {
        "ypc": 5.4,
        "ypt": 11,
        "epaPerPlay": 0.215,
        "explosiveRate": 0.054
      },
      "measuredPlays": 37,
      "productionCurrent": {
        "games": 1,
        "carries": 10,
        "rushYds": 70,
        "rushTd": 1,
        "targets": 3,
        "receptions": 2,
        "recYds": 65,
        "recTd": 1
      },
      "usage2025": {
        "carryShare": 0.065,
        "targetShare": 0.027
      },
      "grade": 75,
      "par": 0.6,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 37 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-deshon-singleton",
      "name": "DeShon Singleton",
      "teamId": "NEB",
      "position": "CB",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.946
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 81,
      "par": 0.53,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-jacory-barney-jr",
      "name": "Jacory Barney Jr.",
      "teamId": "NEB",
      "position": "WR",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.99,
        "carryShare": 0.012,
        "targetShare": 0.168
      },
      "production2025": {
        "games": 13,
        "carries": 5,
        "rushYds": 26,
        "targets": 62,
        "receptions": 45,
        "recYds": 508,
        "recTd": 5
      },
      "rates": {
        "ypc": 5.2,
        "ypt": 8.2,
        "epaPerPlay": 0.506,
        "explosiveRate": 0.075
      },
      "measuredPlays": 67,
      "productionCurrent": {
        "games": 1,
        "carries": 1,
        "rushYds": 8,
        "targets": 8,
        "receptions": 5,
        "recYds": 64
      },
      "usage2025": {
        "carryShare": 0.012,
        "targetShare": 0.168
      },
      "grade": 70,
      "par": 0.41,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 67 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-nyziah-hunter",
      "name": "Nyziah Hunter",
      "teamId": "NEB",
      "position": "WR",
      "jersey": 13,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.99,
        "carryShare": 0.002,
        "targetShare": 0.179
      },
      "production2025": {
        "games": 12,
        "carries": 1,
        "rushYds": 3,
        "targets": 66,
        "receptions": 43,
        "recYds": 617,
        "recTd": 5
      },
      "rates": {
        "ypc": 3,
        "ypt": 9.3,
        "epaPerPlay": 0.483,
        "explosiveRate": 0.104
      },
      "measuredPlays": 67,
      "productionCurrent": {
        "games": 1,
        "targets": 1,
        "receptions": 1,
        "recYds": 57
      },
      "usage2025": {
        "carryShare": 0.002,
        "targetShare": 0.179
      },
      "grade": 69,
      "par": 0.31,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 67 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-luke-lindenmeyer",
      "name": "Luke Lindenmeyer",
      "teamId": "NEB",
      "position": "TE",
      "jersey": 44,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.106
      },
      "production2025": {
        "games": 12,
        "targets": 39,
        "receptions": 29,
        "recYds": 318,
        "recTd": 2
      },
      "rates": {
        "ypt": 8.2,
        "epaPerPlay": 0.454,
        "explosiveRate": 0.128
      },
      "measuredPlays": 39,
      "productionCurrent": {
        "games": 1,
        "targets": 3,
        "receptions": 2,
        "recYds": 22
      },
      "usage2025": {
        "targetShare": 0.106
      },
      "grade": 79,
      "par": 0.23,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 39 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-dane-key",
      "name": "Dane Key",
      "teamId": "NEB",
      "position": "WR",
      "jersey": 18,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.184
      },
      "production2025": {
        "games": 13,
        "targets": 68,
        "receptions": 40,
        "recYds": 492,
        "recTd": 5
      },
      "rates": {
        "ypt": 7.2,
        "epaPerPlay": 0.394,
        "explosiveRate": 0.103
      },
      "measuredPlays": 68,
      "usage2025": {
        "targetShare": 0.184
      },
      "grade": 62,
      "par": 0.09,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 68 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-kyle-cunanan",
      "name": "Kyle Cunanan",
      "teamId": "NEB",
      "position": "K",
      "jersey": 91,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "fgAttempts": 19,
        "fgMade": 16,
        "fgLong": 52
      },
      "rates": {},
      "measuredPlays": 19,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 19 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-javin-wright",
      "name": "Javin Wright",
      "teamId": "NEB",
      "position": "LB",
      "jersey": 33,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.729
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 89,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-elijah-pritchett",
      "name": "Elijah Pritchett",
      "teamId": "NEB",
      "position": "IOL",
      "jersey": 57,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "neb-henry-lutovsky",
      "name": "Henry Lutovsky",
      "teamId": "NEB",
      "position": "IOL",
      "jersey": 59,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "neb-justin-evans",
      "name": "Justin Evans",
      "teamId": "NEB",
      "position": "IOL",
      "jersey": 51,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "neb-donovan-jones",
      "name": "Donovan Jones",
      "teamId": "NEB",
      "position": "CB",
      "jersey": 37,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.8
      },
      "production2025": {
        "games": 3,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 1.057
      },
      "measuredPlays": 4,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 2
      },
      "usage2025": {},
      "grade": 59,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-archie-wilson",
      "name": "Archie Wilson",
      "teamId": "NEB",
      "position": "P",
      "jersey": 83,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "punts": 37,
        "puntAvg": 19.1
      },
      "rates": {},
      "measuredPlays": 37,
      "productionCurrent": {
        "games": 1,
        "punts": 3
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 37 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-kade-pietrzak",
      "name": "Kade Pietrzak",
      "teamId": "NEB",
      "position": "DL",
      "jersey": 93,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.159
      },
      "measuredPlays": 3,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 1
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-andrew-marshall",
      "name": "Andrew Marshall",
      "teamId": "NEB",
      "position": "CB",
      "jersey": 10,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": -0.06
      },
      "measuredPlays": 3,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 1
      },
      "usage2025": {},
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "neb-heinrich-haarberg",
      "name": "Heinrich Haarberg",
      "teamId": "NEB",
      "position": "TE",
      "jersey": 10,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.54,
        "carryShare": 0.022,
        "targetShare": 0.033
      },
      "production2025": {
        "games": 10,
        "carries": 9,
        "rushYds": 8,
        "targets": 12,
        "receptions": 8,
        "recYds": 56,
        "recTd": 1
      },
      "rates": {
        "ypc": 0.9,
        "ypt": 4.7,
        "epaPerPlay": -0.224
      },
      "measuredPlays": 21,
      "usage2025": {
        "carryShare": 0.022,
        "targetShare": 0.033
      },
      "grade": 41,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 21 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  NW: [
    {
      "id": "nw-cam-porter",
      "name": "Cam Porter",
      "teamId": "NW",
      "position": "RB",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.11,
        "carryShare": 0.043,
        "targetShare": 0.008
      },
      "production2025": {
        "games": 2,
        "carries": 19,
        "rushYds": 135,
        "rushTd": 1,
        "targets": 3,
        "receptions": 3
      },
      "rates": {
        "ypc": 7.1,
        "epaPerPlay": 0.238,
        "explosiveRate": 0.091
      },
      "measuredPlays": 22,
      "usage2025": {
        "carryShare": 0.043,
        "targetShare": 0.008
      },
      "grade": 95,
      "par": 2.57,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 22 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-anto-saka",
      "name": "Anto Saka",
      "teamId": "NW",
      "position": "DL",
      "jersey": 14,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.38
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 3.578
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 96,
      "par": 1.99,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-mac-uihlein",
      "name": "Mac Uihlein",
      "teamId": "NW",
      "position": "LB",
      "jersey": 37,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.71
      },
      "production2025": {
        "games": 5,
        "takeaways": 5
      },
      "rates": {
        "epaPerPlay": 3.211
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 87,
      "par": 1.37,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-aidan-hubbard",
      "name": "Aidan Hubbard",
      "teamId": "NW",
      "position": "DL",
      "jersey": 91,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 8
      },
      "rates": {
        "epaPerPlay": 2.322
      },
      "measuredPlays": 8,
      "usage2025": {},
      "grade": 92,
      "par": 0.98,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 8 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-griffin-wilde",
      "name": "Griffin Wilde",
      "teamId": "NW",
      "position": "WR",
      "jersey": 17,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.002,
        "targetShare": 0.301
      },
      "production2025": {
        "games": 13,
        "carries": 1,
        "rushYds": 5,
        "targets": 111,
        "receptions": 71,
        "recYds": 788,
        "recTd": 8
      },
      "rates": {
        "ypc": 5,
        "ypt": 7.1,
        "epaPerPlay": 0.574,
        "explosiveRate": 0.116
      },
      "measuredPlays": 112,
      "usage2025": {
        "carryShare": 0.002,
        "targetShare": 0.301
      },
      "grade": 93,
      "par": 0.94,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 112 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-braden-turner",
      "name": "Braden Turner",
      "teamId": "NW",
      "position": "CB",
      "jersey": 9,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.67
      },
      "production2025": {
        "games": 3,
        "takeaways": 2,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 2.156
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 85,
      "par": 0.85,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-dashun-reeder",
      "name": "Dashun Reeder",
      "teamId": "NW",
      "position": "RB",
      "jersey": 24,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.11,
        "carryShare": 0.05
      },
      "production2025": {
        "games": 5,
        "carries": 22,
        "rushYds": 222,
        "rushTd": 1
      },
      "rates": {
        "ypc": 10.1,
        "epaPerPlay": 0.202,
        "explosiveRate": 0.045
      },
      "measuredPlays": 22,
      "usage2025": {
        "carryShare": 0.05
      },
      "grade": 79,
      "par": 0.8,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 22 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-hayden-eligon-ii",
      "name": "Hayden Eligon II",
      "teamId": "NW",
      "position": "WR",
      "jersey": 80,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6,
        "targetShare": 0.182
      },
      "production2025": {
        "games": 12,
        "targets": 67,
        "receptions": 37,
        "recYds": 509,
        "recTd": 3
      },
      "rates": {
        "ypt": 7.6,
        "epaPerPlay": 0.522,
        "explosiveRate": 0.194
      },
      "measuredPlays": 67,
      "usage2025": {
        "targetShare": 0.182
      },
      "grade": 74,
      "par": 0.46,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 67 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-lawson-albright",
      "name": "Lawson Albright",
      "teamId": "NW",
      "position": "TE",
      "jersey": 86,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.37,
        "passAttemptShare": 0.005,
        "carryShare": 0.009,
        "targetShare": 0.03
      },
      "production2025": {
        "games": 10,
        "attempts": 2,
        "completions": 1,
        "passYds": 17,
        "carries": 4,
        "rushYds": 13,
        "targets": 11,
        "receptions": 9,
        "recYds": 73,
        "recTd": 1
      },
      "rates": {
        "ypa": 8.5,
        "ypc": 3.3,
        "ypt": 6.6,
        "epaPerPlay": 0.455,
        "explosiveRate": 0.267
      },
      "measuredPlays": 17,
      "usage2025": {
        "passAttemptShare": 0.005,
        "carryShare": 0.009,
        "targetShare": 0.03
      },
      "grade": 69,
      "par": 0.24,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 17 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-caleb-komolafe",
      "name": "Caleb Komolafe",
      "teamId": "NW",
      "position": "RB",
      "jersey": 5,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.436,
        "targetShare": 0.046
      },
      "production2025": {
        "games": 12,
        "carries": 192,
        "rushYds": 905,
        "rushTd": 10,
        "targets": 17,
        "receptions": 11,
        "recYds": 84,
        "recTd": 1
      },
      "rates": {
        "ypc": 4.7,
        "ypt": 4.9,
        "epaPerPlay": 0.026,
        "explosiveRate": 0.062
      },
      "measuredPlays": 209,
      "usage2025": {
        "carryShare": 0.436,
        "targetShare": 0.046
      },
      "grade": 72,
      "par": 0.14,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 209 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-michael-kilbane",
      "name": "Michael Kilbane",
      "teamId": "NW",
      "position": "DL",
      "jersey": 47,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.63
      },
      "production2025": {
        "games": 4,
        "sacks": 4,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.623
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 76,
      "par": 0.05,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-jack-olsen",
      "name": "Jack Olsen",
      "teamId": "NW",
      "position": "K",
      "jersey": 82,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 9,
        "fgAttempts": 21,
        "fgMade": 19,
        "fgLong": 41
      },
      "rates": {},
      "measuredPlays": 21,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 21 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-caleb-tiernan",
      "name": "Caleb Tiernan",
      "teamId": "NW",
      "position": "IOL",
      "jersey": 72,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "nw-evan-beerntsen",
      "name": "Evan Beerntsen",
      "teamId": "NW",
      "position": "IOL",
      "jersey": 60,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "nw-jack-bailey",
      "name": "Jack Bailey",
      "teamId": "NW",
      "position": "IOL",
      "jersey": 69,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "nw-robert-fitzgerald",
      "name": "Robert Fitzgerald",
      "teamId": "NW",
      "position": "CB",
      "jersey": 6,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.67
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.395
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 70,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-hunter-welcing",
      "name": "Hunter Welcing",
      "teamId": "NW",
      "position": "TE",
      "jersey": 84,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.89,
        "targetShare": 0.111
      },
      "production2025": {
        "games": 13,
        "targets": 41,
        "receptions": 26,
        "recYds": 253,
        "recTd": 1
      },
      "rates": {
        "ypt": 6.2,
        "epaPerPlay": 0.254,
        "explosiveRate": 0.049
      },
      "measuredPlays": 41,
      "usage2025": {
        "targetShare": 0.111
      },
      "grade": 65,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 41 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-braydon-brus",
      "name": "Braydon Brus",
      "teamId": "NW",
      "position": "LB",
      "jersey": 33,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 3,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.582
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 63,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-ore-adeyi",
      "name": "Ore Adeyi",
      "teamId": "NW",
      "position": "CB",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "passBreakups": 6
      },
      "rates": {
        "epaPerPlay": 1.218
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 61,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-preston-stone",
      "name": "Preston Stone",
      "teamId": "NW",
      "position": "QB",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.974,
        "carryShare": 0.089
      },
      "production2025": {
        "games": 13,
        "attempts": 370,
        "completions": 219,
        "passYds": 2170,
        "passTd": 16,
        "interceptions": 11,
        "carries": 39,
        "rushYds": 118,
        "rushTd": 1
      },
      "rates": {
        "ypa": 5.9,
        "ypc": 3,
        "epaPerPlay": 0.031,
        "explosiveRate": 0.051
      },
      "measuredPlays": 437,
      "usage2025": {
        "passAttemptShare": 0.974,
        "carryShare": 0.089
      },
      "grade": 58,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 437 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-josh-fussell",
      "name": "Josh Fussell",
      "teamId": "NW",
      "position": "CB",
      "jersey": 13,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.83
      },
      "production2025": {
        "games": 4,
        "passBreakups": 5
      },
      "rates": {
        "epaPerPlay": 0.686
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 50,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-luke-akers",
      "name": "Luke Akers",
      "teamId": "NW",
      "position": "P",
      "jersey": 11,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 13,
        "fgAttempts": 3,
        "fgMade": 3,
        "fgLong": 35,
        "punts": 36,
        "puntAvg": 22.2
      },
      "rates": {},
      "measuredPlays": 39,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 39 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-drew-wagner",
      "name": "Drew Wagner",
      "teamId": "NW",
      "position": "WR",
      "jersey": 19,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.34,
        "carryShare": 0.007,
        "targetShare": 0.095
      },
      "production2025": {
        "games": 9,
        "carries": 3,
        "rushYds": 17,
        "targets": 35,
        "receptions": 23,
        "recYds": 168,
        "recTd": 2
      },
      "rates": {
        "ypc": 5.7,
        "ypt": 4.8,
        "epaPerPlay": 0.106,
        "explosiveRate": 0.053
      },
      "measuredPlays": 38,
      "usage2025": {
        "carryShare": 0.007,
        "targetShare": 0.095
      },
      "grade": 45,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 38 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "nw-ricky-ahumaraeze",
      "name": "Ricky Ahumaraeze",
      "teamId": "NW",
      "position": "WR",
      "jersey": 10,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.21,
        "targetShare": 0.065
      },
      "production2025": {
        "games": 10,
        "targets": 24,
        "receptions": 10,
        "recYds": 148
      },
      "rates": {
        "ypt": 6.2,
        "epaPerPlay": -0.036,
        "explosiveRate": 0.125
      },
      "measuredPlays": 24,
      "usage2025": {
        "targetShare": 0.065
      },
      "grade": 43,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 24 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  ORE: [
    {
      "id": "ore-dante-moore",
      "name": "Dante Moore",
      "teamId": "ORE",
      "position": "QB",
      "jersey": 5,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.947,
        "carryShare": 0.124
      },
      "production2025": {
        "games": 15,
        "attempts": 430,
        "completions": 312,
        "passYds": 3652,
        "passTd": 29,
        "interceptions": 9,
        "carries": 70,
        "rushYds": 349,
        "rushTd": 2
      },
      "rates": {
        "ypa": 8.5,
        "ypc": 5,
        "epaPerPlay": 0.201,
        "explosiveRate": 0.043
      },
      "measuredPlays": 529,
      "productionCurrent": {
        "games": 1,
        "attempts": 5,
        "completions": 4,
        "passYds": 21
      },
      "usage2025": {
        "passAttemptShare": 0.947,
        "carryShare": 0.124
      },
      "grade": 85,
      "par": 3.69,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 529 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-jordon-davison",
      "name": "Jordon Davison",
      "teamId": "ORE",
      "position": "RB",
      "jersey": 0,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.78,
        "carryShare": 0.204,
        "targetShare": 0.029
      },
      "production2025": {
        "games": 14,
        "carries": 115,
        "rushYds": 681,
        "rushTd": 14,
        "targets": 13,
        "receptions": 12,
        "recYds": 62
      },
      "rates": {
        "ypc": 5.9,
        "ypt": 4.8,
        "epaPerPlay": 0.221,
        "explosiveRate": 0.086
      },
      "measuredPlays": 128,
      "usage2025": {
        "carryShare": 0.204,
        "targetShare": 0.029
      },
      "grade": 93,
      "par": 1.95,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 128 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-brandon-finney-jr",
      "name": "Brandon Finney Jr.",
      "teamId": "ORE",
      "position": "CB",
      "jersey": 4,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.89
      },
      "production2025": {
        "games": 6,
        "sacks": 1,
        "takeaways": 4,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 2.589
      },
      "measuredPlays": 8,
      "usage2025": {},
      "grade": 91,
      "par": 1.42,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 8 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-dierre-hill-jr",
      "name": "Dierre Hill Jr.",
      "teamId": "ORE",
      "position": "RB",
      "jersey": 23,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.64,
        "carryShare": 0.149,
        "targetShare": 0.047
      },
      "production2025": {
        "games": 15,
        "carries": 84,
        "rushYds": 750,
        "rushTd": 5,
        "targets": 21,
        "receptions": 17,
        "recYds": 149,
        "recTd": 1
      },
      "rates": {
        "ypc": 8.9,
        "ypt": 7.1,
        "epaPerPlay": 0.206,
        "explosiveRate": 0.086
      },
      "measuredPlays": 105,
      "productionCurrent": {
        "games": 1,
        "carries": 1,
        "rushYds": 2,
        "targets": 1
      },
      "usage2025": {
        "carryShare": 0.149,
        "targetShare": 0.047
      },
      "grade": 87,
      "par": 1.33,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 105 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-jerry-mixon",
      "name": "Jerry Mixon",
      "teamId": "ORE",
      "position": "LB",
      "jersey": 54,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 5,
        "takeaways": 2,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 2.718
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 88,
      "par": 1.05,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-malik-benson",
      "name": "Malik Benson",
      "teamId": "ORE",
      "position": "WR",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.002,
        "targetShare": 0.149
      },
      "production2025": {
        "games": 15,
        "carries": 1,
        "rushYds": 4,
        "targets": 67,
        "receptions": 45,
        "recYds": 730,
        "recTd": 6
      },
      "rates": {
        "ypc": 4,
        "ypt": 10.9,
        "epaPerPlay": 0.765,
        "explosiveRate": 0.162
      },
      "measuredPlays": 68,
      "usage2025": {
        "carryShare": 0.002,
        "targetShare": 0.149
      },
      "grade": 79,
      "par": 0.87,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 68 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-jamari-johnson",
      "name": "Jamari Johnson",
      "teamId": "ORE",
      "position": "TE",
      "jersey": 9,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.51,
        "targetShare": 0.091
      },
      "production2025": {
        "games": 14,
        "targets": 41,
        "receptions": 31,
        "recYds": 471,
        "recTd": 3
      },
      "rates": {
        "ypt": 11.5,
        "epaPerPlay": 0.863,
        "explosiveRate": 0.171
      },
      "measuredPlays": 41,
      "productionCurrent": {
        "games": 1,
        "targets": 1,
        "receptions": 1,
        "recYds": 5
      },
      "usage2025": {
        "targetShare": 0.091
      },
      "grade": 93,
      "par": 0.81,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 41 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-jayden-limar",
      "name": "Jayden Limar",
      "teamId": "ORE",
      "position": "RB",
      "jersey": 17,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.39,
        "carryShare": 0.092,
        "targetShare": 0.027
      },
      "production2025": {
        "games": 8,
        "carries": 52,
        "rushYds": 279,
        "rushTd": 3,
        "targets": 12,
        "receptions": 12,
        "recYds": 95
      },
      "rates": {
        "ypc": 5.4,
        "ypt": 7.9,
        "epaPerPlay": 0.134,
        "explosiveRate": 0.047
      },
      "measuredPlays": 64,
      "usage2025": {
        "carryShare": 0.092,
        "targetShare": 0.027
      },
      "grade": 77,
      "par": 0.68,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 64 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-jeremiah-mcclellan",
      "name": "Jeremiah McClellan",
      "teamId": "ORE",
      "position": "WR",
      "jersey": 11,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.79,
        "targetShare": 0.12
      },
      "production2025": {
        "games": 15,
        "targets": 54,
        "receptions": 38,
        "recYds": 565,
        "recTd": 3
      },
      "rates": {
        "ypt": 10.5,
        "epaPerPlay": 0.596,
        "explosiveRate": 0.111
      },
      "measuredPlays": 54,
      "usage2025": {
        "targetShare": 0.12
      },
      "grade": 63,
      "par": 0.43,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 54 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-james-ferguson-reynolds",
      "name": "James Ferguson-Reynolds",
      "teamId": "ORE",
      "position": "P",
      "jersey": 46,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.002,
        "carryShare": 0.002
      },
      "production2025": {
        "games": 13,
        "attempts": 1,
        "completions": 1,
        "passYds": 11,
        "carries": 1,
        "rushYds": 21,
        "punts": 38,
        "puntAvg": 13.4
      },
      "rates": {
        "ypa": 11,
        "ypc": 21,
        "epaPerPlay": 0.166,
        "explosiveRate": 1
      },
      "measuredPlays": 41,
      "usage2025": {
        "passAttemptShare": 0.002,
        "carryShare": 0.002
      },
      "grade": 97,
      "par": 0.4,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 41 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-nasir-wyatt",
      "name": "Nasir Wyatt",
      "teamId": "ORE",
      "position": "LB",
      "jersey": 32,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.21
      },
      "production2025": {
        "games": 3,
        "sacks": 3
      },
      "rates": {
        "epaPerPlay": 2.133
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 68,
      "par": 0.29,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-atticus-sappington",
      "name": "Atticus Sappington",
      "teamId": "ORE",
      "position": "K",
      "jersey": 36,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "fgAttempts": 24,
        "fgMade": 19,
        "fgLong": 46
      },
      "rates": {},
      "measuredPlays": 24,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 24 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-kenyon-sadiq",
      "name": "Kenyon Sadiq",
      "teamId": "ORE",
      "position": "TE",
      "jersey": 18,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.007,
        "targetShare": 0.169
      },
      "production2025": {
        "games": 14,
        "carries": 4,
        "rushYds": 6,
        "targets": 76,
        "receptions": 55,
        "recYds": 600,
        "recTd": 8
      },
      "rates": {
        "ypc": 1.5,
        "ypt": 7.9,
        "epaPerPlay": 0.342,
        "explosiveRate": 0.138
      },
      "measuredPlays": 80,
      "usage2025": {
        "carryShare": 0.007,
        "targetShare": 0.169
      },
      "grade": 82,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 80 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-teitum-tuioti",
      "name": "Teitum Tuioti",
      "teamId": "ORE",
      "position": "LB",
      "jersey": 44,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.002
      },
      "production2025": {
        "games": 8,
        "targets": 1,
        "receptions": 1,
        "recYds": 11,
        "sacks": 9,
        "passBreakups": 4
      },
      "rates": {
        "ypt": 11,
        "epaPerPlay": 1.712,
        "explosiveRate": 1
      },
      "measuredPlays": 14,
      "usage2025": {
        "targetShare": 0.002
      },
      "grade": 80,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 14 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-alex-harkey",
      "name": "Alex Harkey",
      "teamId": "ORE",
      "position": "IOL",
      "jersey": 71,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ore-charlie-pickard",
      "name": "Charlie Pickard",
      "teamId": "ORE",
      "position": "IOL",
      "jersey": 70,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ore-emmanuel-pregnon",
      "name": "Emmanuel Pregnon",
      "teamId": "ORE",
      "position": "IOL",
      "jersey": 75,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ore-dillon-thieneman",
      "name": "Dillon Thieneman",
      "teamId": "ORE",
      "position": "CB",
      "jersey": 31,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 1,
        "takeaways": 3,
        "passBreakups": 5
      },
      "rates": {
        "epaPerPlay": 1.245
      },
      "measuredPlays": 9,
      "usage2025": {},
      "grade": 77,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 9 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-bryce-boettcher",
      "name": "Bryce Boettcher",
      "teamId": "ORE",
      "position": "LB",
      "jersey": 28,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.71,
        "carryShare": 0.002
      },
      "production2025": {
        "games": 7,
        "carries": 1,
        "rushYds": 1,
        "rushTd": 1,
        "sacks": 1,
        "takeaways": 3,
        "passBreakups": 5
      },
      "rates": {
        "ypc": 1,
        "epaPerPlay": 1.7
      },
      "measuredPlays": 10,
      "usage2025": {
        "carryShare": 0.002
      },
      "grade": 75,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 10 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-brock-thomas",
      "name": "Brock Thomas",
      "teamId": "ORE",
      "position": "QB",
      "jersey": 12,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.06,
        "passAttemptShare": 0.035,
        "carryShare": 0.023
      },
      "production2025": {
        "games": 7,
        "attempts": 16,
        "completions": 12,
        "passYds": 130,
        "passTd": 1,
        "carries": 13,
        "rushYds": 28
      },
      "rates": {
        "ypa": 8.1,
        "ypc": 2.2,
        "epaPerPlay": -0.049
      },
      "measuredPlays": 32,
      "usage2025": {
        "passAttemptShare": 0.035,
        "carryShare": 0.023
      },
      "grade": 72,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 32 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-a-mauri-washington",
      "name": "A'Mauri Washington",
      "teamId": "ORE",
      "position": "DL",
      "jersey": 52,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 1,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 1.553
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 59,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-aaron-flowers",
      "name": "Aaron Flowers",
      "teamId": "ORE",
      "position": "CB",
      "jersey": 21,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.33
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.282
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 57,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-dakorien-moore",
      "name": "Dakorien Moore",
      "teamId": "ORE",
      "position": "WR",
      "jersey": 1,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.88,
        "carryShare": 0.007,
        "targetShare": 0.125
      },
      "production2025": {
        "games": 11,
        "carries": 4,
        "rushYds": 49,
        "rushTd": 1,
        "targets": 56,
        "receptions": 37,
        "recYds": 485,
        "recTd": 2
      },
      "rates": {
        "ypc": 12.3,
        "ypt": 8.7,
        "epaPerPlay": 0.243,
        "explosiveRate": 0.133
      },
      "measuredPlays": 60,
      "productionCurrent": {
        "games": 1,
        "targets": 2,
        "receptions": 2,
        "recYds": 12
      },
      "usage2025": {
        "carryShare": 0.007,
        "targetShare": 0.125
      },
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 60 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-gary-bryant-jr",
      "name": "Gary Bryant Jr.",
      "teamId": "ORE",
      "position": "WR",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.51,
        "targetShare": 0.078
      },
      "production2025": {
        "games": 9,
        "targets": 35,
        "receptions": 30,
        "recYds": 328,
        "recTd": 4
      },
      "rates": {
        "ypt": 9.4,
        "epaPerPlay": 0.263,
        "explosiveRate": 0.086
      },
      "measuredPlays": 35,
      "usage2025": {
        "targetShare": 0.078
      },
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 35 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ore-jadon-canady",
      "name": "Jadon Canady",
      "teamId": "ORE",
      "position": "CB",
      "jersey": 22,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.44
      },
      "production2025": {
        "games": 4,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 0.226
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 44,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  OSU: [
    {
      "id": "osu-julian-sayin",
      "name": "Julian Sayin",
      "teamId": "OSU",
      "position": "QB",
      "jersey": 10,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.958,
        "carryShare": 0.075
      },
      "production2025": {
        "games": 14,
        "attempts": 389,
        "completions": 301,
        "passYds": 3598,
        "passTd": 32,
        "interceptions": 7,
        "carries": 34,
        "rushYds": 77,
        "rushTd": 1
      },
      "rates": {
        "ypa": 9.2,
        "ypc": 2.3,
        "epaPerPlay": 0.399,
        "explosiveRate": 0.029
      },
      "measuredPlays": 448,
      "productionCurrent": {
        "games": 1,
        "attempts": 25,
        "completions": 21,
        "passYds": 320,
        "passTd": 3,
        "carries": 1,
        "rushYds": 3,
        "rushTd": 1
      },
      "usage2025": {
        "passAttemptShare": 0.958,
        "carryShare": 0.075
      },
      "grade": 96,
      "par": 6.48,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 448 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-carnell-tate",
      "name": "Carnell Tate",
      "teamId": "OSU",
      "position": "WR",
      "jersey": 17,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6,
        "carryShare": 0.004,
        "targetShare": 0.164
      },
      "production2025": {
        "games": 11,
        "carries": 2,
        "rushYds": 16,
        "targets": 65,
        "receptions": 51,
        "recYds": 823,
        "recTd": 9
      },
      "rates": {
        "ypc": 8,
        "ypt": 12.7,
        "epaPerPlay": 1.045,
        "explosiveRate": 0.209
      },
      "measuredPlays": 67,
      "usage2025": {
        "carryShare": 0.004,
        "targetShare": 0.164
      },
      "grade": 97,
      "par": 2.14,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 67 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-jeremiah-smith",
      "name": "Jeremiah Smith",
      "teamId": "OSU",
      "position": "WR",
      "jersey": 4,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.007,
        "targetShare": 0.275
      },
      "production2025": {
        "games": 13,
        "carries": 3,
        "rushYds": 21,
        "rushTd": 1,
        "targets": 109,
        "receptions": 88,
        "recYds": 1275,
        "recTd": 12
      },
      "rates": {
        "ypc": 7,
        "ypt": 11.7,
        "epaPerPlay": 0.821,
        "explosiveRate": 0.179
      },
      "measuredPlays": 112,
      "productionCurrent": {
        "games": 1,
        "carries": 1,
        "rushYds": 5,
        "targets": 9,
        "receptions": 8,
        "recYds": 151,
        "recTd": 2
      },
      "usage2025": {
        "carryShare": 0.007,
        "targetShare": 0.275
      },
      "grade": 98,
      "par": 2.03,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 112 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-jermaine-mathews-jr",
      "name": "Jermaine Mathews Jr.",
      "teamId": "OSU",
      "position": "CB",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.58
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 82,
      "par": 1.06,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-bo-jackson",
      "name": "Bo Jackson",
      "teamId": "OSU",
      "position": "RB",
      "jersey": 25,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.393,
        "targetShare": 0.051
      },
      "production2025": {
        "games": 13,
        "carries": 179,
        "rushYds": 1183,
        "rushTd": 5,
        "targets": 20,
        "receptions": 18,
        "recYds": 194,
        "recTd": 1
      },
      "rates": {
        "ypc": 6.6,
        "ypt": 9.7,
        "epaPerPlay": 0.117,
        "explosiveRate": 0.04
      },
      "measuredPlays": 199,
      "productionCurrent": {
        "games": 1,
        "carries": 8,
        "rushYds": 26,
        "targets": 2,
        "receptions": 1,
        "recYds": 13
      },
      "usage2025": {
        "carryShare": 0.393,
        "targetShare": 0.051
      },
      "grade": 85,
      "par": 1,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 199 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-cj-donaldson",
      "name": "CJ Donaldson",
      "teamId": "OSU",
      "position": "RB",
      "jersey": 12,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.56,
        "carryShare": 0.208,
        "targetShare": 0.04
      },
      "production2025": {
        "games": 13,
        "carries": 95,
        "rushYds": 365,
        "rushTd": 10,
        "targets": 16,
        "receptions": 14,
        "recYds": 95,
        "recTd": 1
      },
      "rates": {
        "ypc": 3.8,
        "ypt": 5.9,
        "epaPerPlay": 0.12,
        "explosiveRate": 0.045
      },
      "measuredPlays": 111,
      "usage2025": {
        "carryShare": 0.208,
        "targetShare": 0.04
      },
      "grade": 79,
      "par": 0.7,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 111 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-davison-igbinosun",
      "name": "Davison Igbinosun",
      "teamId": "OSU",
      "position": "CB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 2.191
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 75,
      "par": 0.67,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-james-peoples",
      "name": "James Peoples",
      "teamId": "OSU",
      "position": "RB",
      "jersey": 1,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.36,
        "carryShare": 0.134,
        "targetShare": 0.028
      },
      "production2025": {
        "games": 11,
        "carries": 61,
        "rushYds": 351,
        "rushTd": 3,
        "targets": 11,
        "receptions": 10,
        "recYds": 56
      },
      "rates": {
        "ypc": 5.8,
        "ypt": 5.1,
        "epaPerPlay": 0.066,
        "explosiveRate": 0.056
      },
      "measuredPlays": 72,
      "usage2025": {
        "carryShare": 0.134,
        "targetShare": 0.028
      },
      "grade": 72,
      "par": 0.35,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 72 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-will-kacmarek",
      "name": "Will Kacmarek",
      "teamId": "OSU",
      "position": "TE",
      "jersey": 89,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.32,
        "targetShare": 0.045
      },
      "production2025": {
        "games": 8,
        "targets": 18,
        "receptions": 15,
        "recYds": 168,
        "recTd": 2
      },
      "rates": {
        "ypt": 9.3,
        "epaPerPlay": 0.528,
        "explosiveRate": 0.056
      },
      "measuredPlays": 18,
      "usage2025": {
        "targetShare": 0.045
      },
      "grade": 73,
      "par": 0.24,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 18 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-kayden-mcdonald",
      "name": "Kayden McDonald",
      "teamId": "OSU",
      "position": "DL",
      "jersey": 98,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.745
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 85,
      "par": 0.21,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-max-klare",
      "name": "Max Klare",
      "teamId": "OSU",
      "position": "TE",
      "jersey": 86,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.141
      },
      "production2025": {
        "games": 13,
        "targets": 56,
        "receptions": 43,
        "recYds": 450,
        "recTd": 2
      },
      "rates": {
        "ypt": 8,
        "epaPerPlay": 0.36,
        "explosiveRate": 0.054
      },
      "measuredPlays": 56,
      "usage2025": {
        "targetShare": 0.141
      },
      "grade": 80,
      "par": 0.1,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 56 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-brandon-inniss",
      "name": "Brandon Inniss",
      "teamId": "OSU",
      "position": "WR",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.45,
        "passAttemptShare": 0.002,
        "carryShare": 0.007,
        "targetShare": 0.116
      },
      "production2025": {
        "games": 13,
        "attempts": 1,
        "completions": 1,
        "passYds": 6,
        "carries": 3,
        "rushYds": 16,
        "targets": 46,
        "receptions": 36,
        "recYds": 273,
        "recTd": 3
      },
      "rates": {
        "ypa": 6,
        "ypc": 5.3,
        "ypt": 5.9,
        "epaPerPlay": 0.381,
        "explosiveRate": 0.061
      },
      "measuredPlays": 50,
      "productionCurrent": {
        "games": 1,
        "targets": 3,
        "receptions": 3,
        "recYds": 36
      },
      "usage2025": {
        "passAttemptShare": 0.002,
        "carryShare": 0.007,
        "targetShare": 0.116
      },
      "grade": 55,
      "par": 0.05,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 50 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-jayden-fielding",
      "name": "Jayden Fielding",
      "teamId": "OSU",
      "position": "K",
      "jersey": 38,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "fgAttempts": 20,
        "fgMade": 16,
        "fgLong": 38
      },
      "rates": {},
      "measuredPlays": 20,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 20 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-carson-hinzman",
      "name": "Carson Hinzman",
      "teamId": "OSU",
      "position": "IOL",
      "jersey": 75,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "osu-ethan-onianwa",
      "name": "Ethan Onianwa",
      "teamId": "OSU",
      "position": "OT",
      "jersey": 78,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "osu-julian-goines-jackson",
      "name": "Julian Goines-Jackson",
      "teamId": "OSU",
      "position": "IOL",
      "jersey": 63,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "osu-luke-montgomery",
      "name": "Luke Montgomery",
      "teamId": "OSU",
      "position": "IOL",
      "jersey": 51,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "osu-kenyatta-jackson-jr",
      "name": "Kenyatta Jackson Jr.",
      "teamId": "OSU",
      "position": "EDGE",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.7
      },
      "production2025": {
        "games": 5,
        "sacks": 6,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.489
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 71,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-caden-curry",
      "name": "Caden Curry",
      "teamId": "OSU",
      "position": "EDGE",
      "jersey": 92,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 7,
        "sacks": 9,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.18
      },
      "measuredPlays": 10,
      "usage2025": {},
      "grade": 60,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 10 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-arvell-reese",
      "name": "Arvell Reese",
      "teamId": "OSU",
      "position": "LB",
      "jersey": 8,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 6
      },
      "rates": {
        "epaPerPlay": 1.579
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 57,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-sonny-styles",
      "name": "Sonny Styles",
      "teamId": "OSU",
      "position": "LB",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.83
      },
      "production2025": {
        "games": 5,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.55
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 57,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-joe-mcguire",
      "name": "Joe McGuire",
      "teamId": "OSU",
      "position": "P",
      "jersey": 42,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "punts": 31,
        "puntAvg": 19.9
      },
      "rates": {},
      "measuredPlays": 31,
      "productionCurrent": {
        "games": 1,
        "punts": 3
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 31 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "osu-caleb-downs",
      "name": "Caleb Downs",
      "teamId": "OSU",
      "position": "S",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 0.574
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 44,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  PSU: [
    {
      "id": "psu-drew-allar",
      "name": "Drew Allar",
      "teamId": "PSU",
      "position": "QB",
      "jersey": 15,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.96,
        "passAttemptShare": 0.487,
        "carryShare": 0.073,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 6,
        "attempts": 171,
        "completions": 109,
        "passYds": 1184,
        "passTd": 8,
        "interceptions": 3,
        "carries": 35,
        "rushYds": 231,
        "rushTd": 1,
        "targets": 1,
        "receptions": 1,
        "recYds": 5
      },
      "rates": {
        "ypa": 6.9,
        "ypc": 6.6,
        "ypt": 5,
        "epaPerPlay": 0.111,
        "explosiveRate": 0.167
      },
      "measuredPlays": 215,
      "usage2025": {
        "passAttemptShare": 0.487,
        "carryShare": 0.073,
        "targetShare": 0.003
      },
      "grade": 77,
      "par": 2.61,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 215 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-kaytron-allen",
      "name": "Kaytron Allen",
      "teamId": "PSU",
      "position": "RB",
      "jersey": 13,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.452,
        "targetShare": 0.066
      },
      "production2025": {
        "games": 12,
        "carries": 217,
        "rushYds": 1335,
        "rushTd": 15,
        "targets": 22,
        "receptions": 18,
        "recYds": 78
      },
      "rates": {
        "ypc": 6.2,
        "ypt": 3.5,
        "epaPerPlay": 0.133,
        "explosiveRate": 0.084
      },
      "measuredPlays": 239,
      "usage2025": {
        "carryShare": 0.452,
        "targetShare": 0.066
      },
      "grade": 95,
      "par": 2.5,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 239 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-ethan-grunkemeyer",
      "name": "Ethan Grunkemeyer",
      "teamId": "PSU",
      "position": "QB",
      "jersey": 17,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.507,
        "carryShare": 0.054
      },
      "production2025": {
        "games": 10,
        "attempts": 178,
        "completions": 123,
        "passYds": 1369,
        "passTd": 7,
        "interceptions": 4,
        "carries": 26,
        "rushYds": 68,
        "rushTd": 1
      },
      "rates": {
        "ypa": 7.7,
        "ypc": 2.6,
        "epaPerPlay": 0.141,
        "explosiveRate": 0.077
      },
      "measuredPlays": 224,
      "usage2025": {
        "passAttemptShare": 0.507,
        "carryShare": 0.054
      },
      "grade": 71,
      "par": 1.01,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 224 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-nicholas-singleton",
      "name": "Nicholas Singleton",
      "teamId": "PSU",
      "position": "RB",
      "jersey": 10,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.71,
        "carryShare": 0.279,
        "targetShare": 0.105
      },
      "production2025": {
        "games": 12,
        "carries": 134,
        "rushYds": 599,
        "rushTd": 13,
        "targets": 35,
        "receptions": 27,
        "recYds": 256,
        "recTd": 1
      },
      "rates": {
        "ypc": 4.5,
        "ypt": 7.3,
        "epaPerPlay": 0.105,
        "explosiveRate": 0.077
      },
      "measuredPlays": 169,
      "usage2025": {
        "carryShare": 0.279,
        "targetShare": 0.105
      },
      "grade": 83,
      "par": 0.9,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 169 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-devonte-ross",
      "name": "Devonte Ross",
      "teamId": "PSU",
      "position": "WR",
      "jersey": 5,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.65,
        "carryShare": 0.004,
        "targetShare": 0.153
      },
      "production2025": {
        "games": 13,
        "carries": 2,
        "rushYds": 11,
        "targets": 51,
        "receptions": 36,
        "recYds": 519,
        "recTd": 5
      },
      "rates": {
        "ypc": 5.5,
        "ypt": 10.2,
        "epaPerPlay": 0.748,
        "explosiveRate": 0.113
      },
      "measuredPlays": 53,
      "usage2025": {
        "carryShare": 0.004,
        "targetShare": 0.153
      },
      "grade": 77,
      "par": 0.87,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 53 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-zane-durant",
      "name": "Zane Durant",
      "teamId": "PSU",
      "position": "DL",
      "jersey": 28,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 4,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.159
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 88,
      "par": 0.69,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-quinton-martin-jr",
      "name": "Quinton Martin Jr.",
      "teamId": "PSU",
      "position": "RB",
      "jersey": 25,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.09,
        "carryShare": 0.042,
        "targetShare": 0.006
      },
      "production2025": {
        "games": 1,
        "carries": 20,
        "rushYds": 109,
        "targets": 2,
        "receptions": 1,
        "recYds": 4
      },
      "rates": {
        "ypc": 5.5,
        "ypt": 2,
        "epaPerPlay": -0.006
      },
      "measuredPlays": 22,
      "usage2025": {
        "carryShare": 0.042,
        "targetShare": 0.006
      },
      "grade": 80,
      "par": 0.48,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 22 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-andrew-rappleyea",
      "name": "Andrew Rappleyea",
      "teamId": "PSU",
      "position": "TE",
      "jersey": 87,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.65,
        "targetShare": 0.078
      },
      "production2025": {
        "games": 10,
        "targets": 26,
        "receptions": 20,
        "recYds": 180,
        "recTd": 2
      },
      "rates": {
        "ypt": 6.9,
        "epaPerPlay": 0.523,
        "explosiveRate": 0.115
      },
      "measuredPlays": 26,
      "usage2025": {
        "targetShare": 0.078
      },
      "grade": 77,
      "par": 0.27,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 26 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-khalil-dinkins",
      "name": "Khalil Dinkins",
      "teamId": "PSU",
      "position": "TE",
      "jersey": 16,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.48,
        "targetShare": 0.057
      },
      "production2025": {
        "games": 8,
        "targets": 19,
        "receptions": 15,
        "recYds": 180,
        "recTd": 2
      },
      "rates": {
        "ypt": 9.5,
        "epaPerPlay": 0.499,
        "explosiveRate": 0.053
      },
      "measuredPlays": 19,
      "usage2025": {
        "targetShare": 0.057
      },
      "grade": 73,
      "par": 0.22,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 19 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-elliot-washington-ii",
      "name": "Elliot Washington II",
      "teamId": "PSU",
      "position": "CB",
      "jersey": 3,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.709
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 67,
      "par": 0.19,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-ryan-barker",
      "name": "Ryan Barker",
      "teamId": "PSU",
      "position": "K",
      "jersey": 94,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 9,
        "fgAttempts": 19,
        "fgMade": 18,
        "fgLong": 49
      },
      "rates": {},
      "measuredPlays": 19,
      "productionCurrent": {
        "games": 1,
        "fgAttempts": 1,
        "fgMade": 1
      },
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 19 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-dominic-rulli",
      "name": "Dominic Rulli",
      "teamId": "PSU",
      "position": "IOL",
      "jersey": 52,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "psu-drew-shelton",
      "name": "Drew Shelton",
      "teamId": "PSU",
      "position": "IOL",
      "jersey": 66,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "psu-jim-fitzgerald",
      "name": "Jim Fitzgerald",
      "teamId": "PSU",
      "position": "IOL",
      "jersey": 65,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "psu-dani-dennis-sutton",
      "name": "Dani Dennis-Sutton",
      "teamId": "PSU",
      "position": "EDGE",
      "jersey": 33,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 7,
        "sacks": 9,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.381
      },
      "measuredPlays": 11,
      "usage2025": {},
      "grade": 73,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-king-mack",
      "name": "King Mack",
      "teamId": "PSU",
      "position": "S",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 2,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.632
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 73,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-daryus-dixson",
      "name": "Daryus Dixson",
      "teamId": "PSU",
      "position": "CB",
      "jersey": 5,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "passBreakups": 6
      },
      "rates": {
        "epaPerPlay": 1.066
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 70,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-amare-campbell",
      "name": "Amare Campbell",
      "teamId": "PSU",
      "position": "LB",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.8
      },
      "production2025": {
        "games": 4,
        "sacks": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.719
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 61,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-trebor-pena",
      "name": "Trebor Pena",
      "teamId": "PSU",
      "position": "WR",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.027,
        "targetShare": 0.204
      },
      "production2025": {
        "games": 13,
        "carries": 13,
        "rushYds": 75,
        "targets": 68,
        "receptions": 50,
        "recYds": 566,
        "recTd": 2
      },
      "rates": {
        "ypc": 5.8,
        "ypt": 8.3,
        "epaPerPlay": 0.309,
        "explosiveRate": 0.062
      },
      "measuredPlays": 81,
      "usage2025": {
        "carryShare": 0.027,
        "targetShare": 0.204
      },
      "grade": 60,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 81 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-dominic-deluca",
      "name": "Dominic DeLuca",
      "teamId": "PSU",
      "position": "LB",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 2,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.035
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 52,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-kyron-hudson",
      "name": "Kyron Hudson",
      "teamId": "PSU",
      "position": "WR",
      "jersey": 11,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.64,
        "targetShare": 0.156
      },
      "production2025": {
        "games": 12,
        "targets": 52,
        "receptions": 23,
        "recYds": 291,
        "recTd": 2
      },
      "rates": {
        "ypt": 5.6,
        "epaPerPlay": 0.256,
        "explosiveRate": 0.058
      },
      "measuredPlays": 52,
      "usage2025": {
        "targetShare": 0.156
      },
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 52 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "psu-gabriel-nwosu",
      "name": "Gabriel Nwosu",
      "teamId": "PSU",
      "position": "P",
      "jersey": 99,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 12,
        "punts": 41,
        "puntAvg": 19.8
      },
      "rates": {},
      "measuredPlays": 41,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 41 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  PUR: [
    {
      "id": "pur-hershey-mclaurin",
      "name": "Hershey McLaurin",
      "teamId": "PUR",
      "position": "CB",
      "jersey": 25,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 1,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.862
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 99,
      "par": 4.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-cj-nunnally-iv",
      "name": "CJ Nunnally IV",
      "teamId": "PUR",
      "position": "DL",
      "jersey": 91,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 5,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.149
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 91,
      "par": 0.79,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-devin-mockobee",
      "name": "Devin Mockobee",
      "teamId": "PUR",
      "position": "RB",
      "jersey": 45,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.005,
        "carryShare": 0.35,
        "targetShare": 0.051
      },
      "production2025": {
        "games": 8,
        "attempts": 2,
        "completions": 1,
        "passYds": 14,
        "passTd": 1,
        "interceptions": 1,
        "carries": 124,
        "rushYds": 523,
        "rushTd": 4,
        "targets": 20,
        "receptions": 18,
        "recYds": 215,
        "recTd": 1
      },
      "rates": {
        "ypa": 7,
        "ypc": 4.2,
        "ypt": 10.8,
        "epaPerPlay": 0.1,
        "explosiveRate": 0.056
      },
      "measuredPlays": 146,
      "usage2025": {
        "passAttemptShare": 0.005,
        "carryShare": 0.35,
        "targetShare": 0.051
      },
      "grade": 76,
      "par": 0.39,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 146 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-nitro-tuggle",
      "name": "Nitro Tuggle",
      "teamId": "PUR",
      "position": "WR",
      "jersey": 1,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.88,
        "targetShare": 0.19
      },
      "production2025": {
        "games": 12,
        "targets": 74,
        "receptions": 34,
        "recYds": 505,
        "recTd": 4
      },
      "rates": {
        "ypt": 6.8,
        "epaPerPlay": 0.485,
        "explosiveRate": 0.122
      },
      "measuredPlays": 74,
      "productionCurrent": {
        "games": 1,
        "targets": 2,
        "receptions": 1,
        "recYds": 5
      },
      "usage2025": {
        "targetShare": 0.19
      },
      "grade": 75,
      "par": 0.39,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 74 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-jack-mccallister",
      "name": "Jack McCallister",
      "teamId": "PUR",
      "position": "P",
      "jersey": 38,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.003
      },
      "production2025": {
        "games": 11,
        "carries": 1,
        "rushYds": 10,
        "punts": 50,
        "puntAvg": 22.3
      },
      "rates": {
        "ypc": 10,
        "epaPerPlay": 0.067,
        "explosiveRate": 1
      },
      "measuredPlays": 51,
      "usage2025": {
        "carryShare": 0.003
      },
      "grade": 97,
      "par": 0.31,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 51 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-ryan-browne",
      "name": "Ryan Browne",
      "teamId": "PUR",
      "position": "QB",
      "jersey": 15,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.837,
        "carryShare": 0.147,
        "targetShare": 0.005
      },
      "production2025": {
        "games": 12,
        "attempts": 339,
        "completions": 199,
        "passYds": 2197,
        "passTd": 10,
        "interceptions": 10,
        "carries": 52,
        "rushYds": 271,
        "rushTd": 3,
        "targets": 2,
        "receptions": 2,
        "recYds": 17,
        "recTd": 1
      },
      "rates": {
        "ypa": 6.5,
        "ypc": 5.2,
        "ypt": 8.5,
        "epaPerPlay": 0.02,
        "explosiveRate": 0.167
      },
      "measuredPlays": 416,
      "productionCurrent": {
        "games": 1,
        "attempts": 29,
        "completions": 23,
        "passYds": 317,
        "passTd": 3,
        "carries": 3,
        "rushYds": 12
      },
      "usage2025": {
        "passAttemptShare": 0.837,
        "carryShare": 0.147,
        "targetShare": 0.005
      },
      "grade": 61,
      "par": 0.18,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 416 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-charles-correa",
      "name": "Charles Correa",
      "teamId": "PUR",
      "position": "LB",
      "jersey": 5,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6
      },
      "production2025": {
        "games": 3,
        "sacks": 3
      },
      "rates": {
        "epaPerPlay": 1.915
      },
      "measuredPlays": 3,
      "productionCurrent": {
        "games": 1,
        "passBreakups": 2
      },
      "usage2025": {},
      "grade": 64,
      "par": 0.07,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-spencer-porath",
      "name": "Spencer Porath",
      "teamId": "PUR",
      "position": "K",
      "jersey": 35,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 10,
        "fgAttempts": 17,
        "fgMade": 15,
        "fgLong": 48
      },
      "rates": {},
      "measuredPlays": 17,
      "usage2025": {},
      "grade": 43,
      "par": 0.01,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 17 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-bakyne-coly",
      "name": "Bakyne Coly",
      "teamId": "PUR",
      "position": "IOL",
      "jersey": 78,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "pur-giordano-vaccaro",
      "name": "Giordano Vaccaro",
      "teamId": "PUR",
      "position": "IOL",
      "jersey": 62,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "pur-hayden-timosciek",
      "name": "Hayden Timosciek",
      "teamId": "PUR",
      "position": "IOL",
      "jersey": 54,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "pur-malachi-singleton",
      "name": "Malachi Singleton",
      "teamId": "PUR",
      "position": "QB",
      "jersey": 3,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.28,
        "passAttemptShare": 0.158,
        "carryShare": 0.13
      },
      "production2025": {
        "games": 11,
        "attempts": 64,
        "completions": 38,
        "passYds": 443,
        "passTd": 5,
        "interceptions": 2,
        "carries": 46,
        "rushYds": 238,
        "rushTd": 1
      },
      "rates": {
        "ypa": 6.9,
        "ypc": 5.2,
        "epaPerPlay": -0.018,
        "explosiveRate": 0.087
      },
      "measuredPlays": 118,
      "productionCurrent": {
        "games": 1,
        "attempts": 3,
        "completions": 3,
        "passYds": 49,
        "passTd": 1,
        "carries": 2,
        "rushYds": 4
      },
      "usage2025": {
        "passAttemptShare": 0.158,
        "carryShare": 0.13
      },
      "grade": 68,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 118 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-michael-jackson-iii",
      "name": "Michael Jackson III",
      "teamId": "PUR",
      "position": "WR",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.008,
        "targetShare": 0.208
      },
      "production2025": {
        "games": 12,
        "carries": 3,
        "rushYds": 29,
        "rushTd": 1,
        "targets": 81,
        "receptions": 63,
        "recYds": 576,
        "recTd": 1
      },
      "rates": {
        "ypc": 9.7,
        "ypt": 7.1,
        "epaPerPlay": 0.306,
        "explosiveRate": 0.071
      },
      "measuredPlays": 84,
      "usage2025": {
        "carryShare": 0.008,
        "targetShare": 0.208
      },
      "grade": 65,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 84 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-malachi-thomas",
      "name": "Malachi Thomas",
      "teamId": "PUR",
      "position": "RB",
      "jersey": 24,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.47,
        "carryShare": 0.15,
        "targetShare": 0.038
      },
      "production2025": {
        "games": 11,
        "carries": 53,
        "rushYds": 247,
        "targets": 15,
        "receptions": 11,
        "recYds": 125,
        "recTd": 2
      },
      "rates": {
        "ypc": 4.7,
        "ypt": 8.3,
        "epaPerPlay": -0.031,
        "explosiveRate": 0.029
      },
      "measuredPlays": 68,
      "usage2025": {
        "carryShare": 0.15,
        "targetShare": 0.038
      },
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 68 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-mani-powell",
      "name": "Mani Powell",
      "teamId": "PUR",
      "position": "LB",
      "jersey": 16,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 4,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.594
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 58,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-rico-walker",
      "name": "Rico Walker",
      "teamId": "PUR",
      "position": "TE",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.036
      },
      "production2025": {
        "games": 8,
        "targets": 14,
        "receptions": 9,
        "recYds": 102
      },
      "rates": {
        "ypt": 7.3,
        "epaPerPlay": 0.286,
        "explosiveRate": 0.143
      },
      "measuredPlays": 14,
      "usage2025": {
        "targetShare": 0.036
      },
      "grade": 58,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 14 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-antonio-harris",
      "name": "Antonio Harris",
      "teamId": "PUR",
      "position": "RB",
      "jersey": 22,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.63,
        "carryShare": 0.195,
        "targetShare": 0.059
      },
      "production2025": {
        "games": 11,
        "carries": 69,
        "rushYds": 333,
        "rushTd": 2,
        "targets": 23,
        "receptions": 17,
        "recYds": 137
      },
      "rates": {
        "ypc": 4.8,
        "ypt": 6,
        "epaPerPlay": -0.061,
        "explosiveRate": 0.065
      },
      "measuredPlays": 92,
      "productionCurrent": {
        "games": 1,
        "carries": 6,
        "rushYds": 32
      },
      "usage2025": {
        "carryShare": 0.195,
        "targetShare": 0.059
      },
      "grade": 57,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 92 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-ej-horton-jr",
      "name": "EJ Horton Jr.",
      "teamId": "PUR",
      "position": "WR",
      "jersey": 13,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6,
        "carryShare": 0.006,
        "targetShare": 0.123
      },
      "production2025": {
        "games": 11,
        "carries": 2,
        "rushYds": 40,
        "targets": 48,
        "receptions": 27,
        "recYds": 289,
        "recTd": 1
      },
      "rates": {
        "ypc": 20,
        "ypt": 6,
        "epaPerPlay": 0.239,
        "explosiveRate": 0.08
      },
      "measuredPlays": 50,
      "usage2025": {
        "carryShare": 0.006,
        "targetShare": 0.123
      },
      "grade": 52,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 50 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-hudauri-hines",
      "name": "Hudauri Hines",
      "teamId": "PUR",
      "position": "CB",
      "jersey": 4,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 1.047
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 52,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-arhmad-branch",
      "name": "Arhmad Branch",
      "teamId": "PUR",
      "position": "WR",
      "jersey": 6,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.27,
        "targetShare": 0.059
      },
      "production2025": {
        "games": 9,
        "targets": 23,
        "receptions": 14,
        "recYds": 212,
        "recTd": 2
      },
      "rates": {
        "ypt": 9.2,
        "epaPerPlay": 0.248,
        "explosiveRate": 0.043
      },
      "measuredPlays": 23,
      "usage2025": {
        "targetShare": 0.059
      },
      "grade": 47,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 23 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "pur-corey-smith",
      "name": "Corey Smith",
      "teamId": "PUR",
      "position": "WR",
      "jersey": 12,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.35,
        "targetShare": 0.074
      },
      "production2025": {
        "games": 10,
        "targets": 29,
        "receptions": 14,
        "recYds": 237,
        "recTd": 1
      },
      "rates": {
        "ypt": 8.2,
        "epaPerPlay": 0.101,
        "explosiveRate": 0.069
      },
      "measuredPlays": 29,
      "usage2025": {
        "targetShare": 0.074
      },
      "grade": 43,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 29 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  RUT: [
    {
      "id": "rut-athan-kaliakmanis",
      "name": "Athan Kaliakmanis",
      "teamId": "RUT",
      "position": "QB",
      "jersey": 16,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.974,
        "carryShare": 0.152
      },
      "production2025": {
        "games": 12,
        "attempts": 370,
        "completions": 229,
        "passYds": 3124,
        "passTd": 20,
        "interceptions": 5,
        "carries": 65,
        "rushYds": 187,
        "rushTd": 4
      },
      "rates": {
        "ypa": 8.4,
        "ypc": 2.9,
        "epaPerPlay": 0.183,
        "explosiveRate": 0.031
      },
      "measuredPlays": 479,
      "usage2025": {
        "passAttemptShare": 0.974,
        "carryShare": 0.152
      },
      "grade": 76,
      "par": 2.78,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 479 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-kj-duff",
      "name": "KJ Duff",
      "teamId": "RUT",
      "position": "WR",
      "jersey": 8,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.261
      },
      "production2025": {
        "games": 12,
        "targets": 97,
        "receptions": 60,
        "recYds": 1084,
        "recTd": 7
      },
      "rates": {
        "ypt": 11.2,
        "epaPerPlay": 0.96,
        "explosiveRate": 0.155
      },
      "measuredPlays": 97,
      "productionCurrent": {
        "games": 1,
        "targets": 16,
        "receptions": 9,
        "recYds": 196,
        "recTd": 3
      },
      "usage2025": {
        "targetShare": 0.261
      },
      "grade": 98,
      "par": 2.43,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 97 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-antwan-raymond",
      "name": "Antwan Raymond",
      "teamId": "RUT",
      "position": "RB",
      "jersey": 3,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.575,
        "targetShare": 0.07
      },
      "production2025": {
        "games": 12,
        "carries": 246,
        "rushYds": 1257,
        "rushTd": 13,
        "targets": 26,
        "receptions": 18,
        "recYds": 225,
        "recTd": 2
      },
      "rates": {
        "ypc": 5.1,
        "ypt": 8.7,
        "epaPerPlay": 0.116,
        "explosiveRate": 0.048
      },
      "measuredPlays": 272,
      "productionCurrent": {
        "games": 1,
        "carries": 14,
        "rushYds": 43,
        "targets": 2,
        "receptions": 2,
        "recYds": 8
      },
      "usage2025": {
        "carryShare": 0.575,
        "targetShare": 0.07
      },
      "grade": 94,
      "par": 1.94,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 272 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-farell-gnago",
      "name": "Farell Gnago",
      "teamId": "RUT",
      "position": "DL",
      "jersey": 90,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "takeaways": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 3.402
      },
      "measuredPlays": 3,
      "productionCurrent": {
        "games": 1,
        "sacks": 1
      },
      "usage2025": {},
      "grade": 95,
      "par": 1.82,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-cj-campbell-jr",
      "name": "CJ Campbell Jr.",
      "teamId": "RUT",
      "position": "RB",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.08,
        "carryShare": 0.049
      },
      "production2025": {
        "games": 3,
        "carries": 21,
        "rushYds": 118
      },
      "rates": {
        "ypc": 5.6,
        "epaPerPlay": 0.232,
        "explosiveRate": 0.095
      },
      "measuredPlays": 21,
      "usage2025": {
        "carryShare": 0.049
      },
      "grade": 89,
      "par": 1.49,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 21 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-ja-shon-benjamin",
      "name": "Ja'shon Benjamin",
      "teamId": "RUT",
      "position": "RB",
      "jersey": 20,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.26,
        "carryShare": 0.159,
        "targetShare": 0.011
      },
      "production2025": {
        "games": 10,
        "carries": 68,
        "rushYds": 328,
        "rushTd": 2,
        "targets": 4,
        "receptions": 4,
        "recYds": 19
      },
      "rates": {
        "ypc": 4.8,
        "ypt": 4.8,
        "epaPerPlay": 0.15,
        "explosiveRate": 0.042
      },
      "measuredPlays": 72,
      "usage2025": {
        "carryShare": 0.159,
        "targetShare": 0.011
      },
      "grade": 82,
      "par": 0.96,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 72 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-ian-strong",
      "name": "Ian Strong",
      "teamId": "RUT",
      "position": "WR",
      "jersey": 9,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.86,
        "targetShare": 0.224
      },
      "production2025": {
        "games": 10,
        "targets": 83,
        "receptions": 52,
        "recYds": 762,
        "recTd": 5
      },
      "rates": {
        "ypt": 9.2,
        "epaPerPlay": 0.552,
        "explosiveRate": 0.084
      },
      "measuredPlays": 83,
      "usage2025": {
        "targetShare": 0.224
      },
      "grade": 90,
      "par": 0.8,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 83 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-dt-sheffield",
      "name": "DT Sheffield",
      "teamId": "RUT",
      "position": "WR",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.74,
        "targetShare": 0.194
      },
      "production2025": {
        "games": 12,
        "targets": 72,
        "receptions": 44,
        "recYds": 575,
        "recTd": 5
      },
      "rates": {
        "ypt": 8,
        "epaPerPlay": 0.504,
        "explosiveRate": 0.111
      },
      "measuredPlays": 72,
      "usage2025": {
        "targetShare": 0.194
      },
      "grade": 76,
      "par": 0.44,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 72 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-jett-elad",
      "name": "Jett Elad",
      "teamId": "RUT",
      "position": "CB",
      "jersey": 9,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.57
      },
      "production2025": {
        "games": 4,
        "takeaways": 2,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.634
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 65,
      "par": 0.11,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-bryan-felter",
      "name": "Bryan Felter",
      "teamId": "RUT",
      "position": "IOL",
      "jersey": 65,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "rut-dantae-chin",
      "name": "Dantae Chin",
      "teamId": "RUT",
      "position": "IOL",
      "jersey": 76,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "rut-emir-stinette",
      "name": "Emir Stinette",
      "teamId": "RUT",
      "position": "IOL",
      "jersey": 61,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "rut-bo-mascoe",
      "name": "Bo Mascoe",
      "teamId": "RUT",
      "position": "CB",
      "jersey": 5,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.86
      },
      "production2025": {
        "games": 5,
        "takeaways": 3,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.476
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 68,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-bradley-weaver",
      "name": "Bradley Weaver",
      "teamId": "RUT",
      "position": "DL",
      "jersey": 94,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 2,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.124
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 63,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-cam-miller",
      "name": "Cam Miller",
      "teamId": "RUT",
      "position": "CB",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 5
      },
      "rates": {
        "epaPerPlay": 1.265
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-kenny-fletcher-jr",
      "name": "Kenny Fletcher Jr.",
      "teamId": "RUT",
      "position": "TE",
      "jersey": 12,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.102
      },
      "production2025": {
        "games": 11,
        "targets": 38,
        "receptions": 26,
        "recYds": 238
      },
      "rates": {
        "ypt": 6.3,
        "epaPerPlay": 0.169,
        "explosiveRate": 0.026
      },
      "measuredPlays": 38,
      "usage2025": {
        "targetShare": 0.102
      },
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 38 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-jakob-anderson",
      "name": "Jakob Anderson",
      "teamId": "RUT",
      "position": "P",
      "jersey": 94,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "punts": 33,
        "puntAvg": 24.2
      },
      "rates": {},
      "measuredPlays": 33,
      "productionCurrent": {
        "games": 1,
        "punts": 3
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 33 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-ben-black",
      "name": "Ben Black",
      "teamId": "RUT",
      "position": "WR",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.18,
        "targetShare": 0.046
      },
      "production2025": {
        "games": 6,
        "targets": 17,
        "receptions": 8,
        "recYds": 119,
        "recTd": 1
      },
      "rates": {
        "ypt": 7,
        "epaPerPlay": 0.193,
        "explosiveRate": 0.118
      },
      "measuredPlays": 17,
      "productionCurrent": {
        "games": 1,
        "targets": 2,
        "receptions": 2,
        "recYds": 37
      },
      "usage2025": {
        "targetShare": 0.046
      },
      "grade": 45,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 17 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-colin-weber",
      "name": "Colin Weber",
      "teamId": "RUT",
      "position": "TE",
      "jersey": 18,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.66,
        "targetShare": 0.067
      },
      "production2025": {
        "games": 10,
        "targets": 25,
        "receptions": 17,
        "recYds": 102
      },
      "rates": {
        "ypt": 4.1,
        "epaPerPlay": -0.558
      },
      "measuredPlays": 25,
      "usage2025": {
        "targetShare": 0.067
      },
      "grade": 41,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 25 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-eric-o-neill",
      "name": "Eric O'Neill",
      "teamId": "RUT",
      "position": "DL",
      "jersey": 99,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 3
      },
      "rates": {
        "epaPerPlay": 0.536
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 41,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "rut-jai-patel",
      "name": "Jai Patel",
      "teamId": "RUT",
      "position": "K",
      "jersey": 44,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.002
      },
      "production2025": {
        "games": 11,
        "carries": 1,
        "rushYds": 3,
        "fgAttempts": 18,
        "fgMade": 13,
        "fgLong": 51
      },
      "rates": {
        "ypc": 3,
        "epaPerPlay": -0.151
      },
      "measuredPlays": 19,
      "usage2025": {
        "carryShare": 0.002
      },
      "grade": 41,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 19 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  UCLA: [
    {
      "id": "ucla-luke-duncan",
      "name": "Luke Duncan",
      "teamId": "UCLA",
      "position": "QB",
      "jersey": 12,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.08,
        "passAttemptShare": 0.092
      },
      "production2025": {
        "games": 2,
        "attempts": 34,
        "completions": 21,
        "passYds": 241,
        "passTd": 2
      },
      "rates": {
        "ypa": 7.1,
        "epaPerPlay": 0.531
      },
      "measuredPlays": 34,
      "usage2025": {
        "passAttemptShare": 0.092
      },
      "grade": 96,
      "par": 5.73,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 34 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-nico-iamaleava",
      "name": "Nico Iamaleava",
      "teamId": "UCLA",
      "position": "QB",
      "jersey": 9,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.897,
        "carryShare": 0.248
      },
      "production2025": {
        "games": 11,
        "attempts": 331,
        "completions": 208,
        "passYds": 1898,
        "passTd": 14,
        "interceptions": 7,
        "carries": 87,
        "rushYds": 668,
        "rushTd": 4
      },
      "rates": {
        "ypa": 5.7,
        "ypc": 7.7,
        "epaPerPlay": 0.027,
        "explosiveRate": 0.195
      },
      "measuredPlays": 447,
      "usage2025": {
        "passAttemptShare": 0.897,
        "carryShare": 0.248
      },
      "grade": 70,
      "par": 2.11,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 447 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-cole-martin",
      "name": "Cole Martin",
      "teamId": "UCLA",
      "position": "CB",
      "jersey": 4,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.36,
        "carryShare": 0.003
      },
      "production2025": {
        "games": 3,
        "carries": 1,
        "rushYds": 20,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "ypc": 20,
        "epaPerPlay": 2.248,
        "explosiveRate": 1
      },
      "measuredPlays": 4,
      "usage2025": {
        "carryShare": 0.003
      },
      "grade": 87,
      "par": 0.97,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-anthony-frias-ii",
      "name": "Anthony Frias II",
      "teamId": "UCLA",
      "position": "RB",
      "jersey": 22,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.42,
        "carryShare": 0.068,
        "targetShare": 0.044
      },
      "production2025": {
        "games": 8,
        "carries": 24,
        "rushYds": 185,
        "rushTd": 1,
        "targets": 16,
        "receptions": 13,
        "recYds": 82,
        "recTd": 1
      },
      "rates": {
        "ypc": 7.7,
        "ypt": 5.1,
        "epaPerPlay": 0.172,
        "explosiveRate": 0.1
      },
      "measuredPlays": 40,
      "usage2025": {
        "carryShare": 0.068,
        "targetShare": 0.044
      },
      "grade": 77,
      "par": 0.75,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 40 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-titus-mokiao-atimalala",
      "name": "Titus Mokiao-Atimalala",
      "teamId": "UCLA",
      "position": "WR",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.51,
        "targetShare": 0.13
      },
      "production2025": {
        "games": 12,
        "targets": 47,
        "receptions": 26,
        "recYds": 322,
        "recTd": 3
      },
      "rates": {
        "ypt": 6.9,
        "epaPerPlay": 0.413,
        "explosiveRate": 0.128
      },
      "measuredPlays": 47,
      "usage2025": {
        "targetShare": 0.13
      },
      "grade": 56,
      "par": 0.11,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 47 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-will-karoll",
      "name": "Will Karoll",
      "teamId": "UCLA",
      "position": "P",
      "jersey": 49,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.003
      },
      "production2025": {
        "games": 11,
        "carries": 1,
        "rushYds": 8,
        "punts": 44,
        "puntAvg": 22.4
      },
      "rates": {
        "ypc": 8,
        "epaPerPlay": 0.011
      },
      "measuredPlays": 45,
      "usage2025": {
        "carryShare": 0.003
      },
      "grade": 94,
      "par": 0.05,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 45 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-mateen-bhaghani",
      "name": "Mateen Bhaghani",
      "teamId": "UCLA",
      "position": "K",
      "jersey": 15,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "fgAttempts": 20,
        "fgMade": 16,
        "fgLong": 54
      },
      "rates": {},
      "measuredPlays": 20,
      "usage2025": {},
      "grade": 43,
      "par": 0.02,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 20 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-jalen-berger",
      "name": "Jalen Berger",
      "teamId": "UCLA",
      "position": "RB",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.99,
        "passAttemptShare": 0.008,
        "carryShare": 0.228,
        "targetShare": 0.033
      },
      "production2025": {
        "games": 12,
        "attempts": 3,
        "completions": 3,
        "passYds": 21,
        "carries": 80,
        "rushYds": 374,
        "rushTd": 2,
        "targets": 12,
        "receptions": 10,
        "recYds": 64,
        "recTd": 2
      },
      "rates": {
        "ypa": 7,
        "ypc": 4.7,
        "ypt": 5.3,
        "epaPerPlay": 0.037,
        "explosiveRate": 0.033
      },
      "measuredPlays": 95,
      "usage2025": {
        "passAttemptShare": 0.008,
        "carryShare": 0.228,
        "targetShare": 0.033
      },
      "grade": 66,
      "par": 0.01,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 95 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-caleb-walker",
      "name": "Caleb Walker",
      "teamId": "UCLA",
      "position": "IOL",
      "jersey": 70,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ucla-conor-clyde",
      "name": "Conor Clyde",
      "teamId": "UCLA",
      "position": "IOL",
      "jersey": 75,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ucla-courtland-ford",
      "name": "Courtland Ford",
      "teamId": "UCLA",
      "position": "IOL",
      "jersey": 77,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "ucla-rodrick-pleasant",
      "name": "Rodrick Pleasant",
      "teamId": "UCLA",
      "position": "CB",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.64
      },
      "production2025": {
        "games": 4,
        "passBreakups": 7
      },
      "rates": {
        "epaPerPlay": 1.208
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 74,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-key-lawrence",
      "name": "Key Lawrence",
      "teamId": "UCLA",
      "position": "CB",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.36
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.262
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 66,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-andre-jordan-jr",
      "name": "Andre Jordan Jr.",
      "teamId": "UCLA",
      "position": "CB",
      "jersey": 22,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 6,
        "passBreakups": 11
      },
      "rates": {
        "epaPerPlay": 0.832
      },
      "measuredPlays": 11,
      "usage2025": {},
      "grade": 63,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-anthony-woods",
      "name": "Anthony Woods",
      "teamId": "UCLA",
      "position": "RB",
      "jersey": 6,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.94,
        "carryShare": 0.179,
        "targetShare": 0.075
      },
      "production2025": {
        "games": 11,
        "carries": 63,
        "rushYds": 293,
        "targets": 27,
        "receptions": 25,
        "recYds": 211,
        "recTd": 2
      },
      "rates": {
        "ypc": 4.7,
        "ypt": 7.8,
        "epaPerPlay": -0.003,
        "explosiveRate": 0.033
      },
      "measuredPlays": 90,
      "usage2025": {
        "carryShare": 0.179,
        "targetShare": 0.075
      },
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 90 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-kwazi-gilmer",
      "name": "Kwazi Gilmer",
      "teamId": "UCLA",
      "position": "WR",
      "jersey": 11,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.255
      },
      "production2025": {
        "games": 12,
        "targets": 92,
        "receptions": 51,
        "recYds": 535,
        "recTd": 4
      },
      "rates": {
        "ypt": 5.8,
        "epaPerPlay": 0.148,
        "explosiveRate": 0.054
      },
      "measuredPlays": 92,
      "productionCurrent": {
        "games": 1,
        "targets": 10,
        "receptions": 5,
        "recYds": 58,
        "recTd": 1
      },
      "usage2025": {
        "targetShare": 0.255
      },
      "grade": 52,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 92 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-jack-pedersen",
      "name": "Jack Pedersen",
      "teamId": "UCLA",
      "position": "TE",
      "jersey": 28,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6,
        "targetShare": 0.05
      },
      "production2025": {
        "games": 8,
        "targets": 18,
        "receptions": 11,
        "recYds": 72
      },
      "rates": {
        "ypt": 4,
        "epaPerPlay": 0.031
      },
      "measuredPlays": 18,
      "usage2025": {
        "targetShare": 0.05
      },
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 18 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-rico-flores-jr",
      "name": "Rico Flores Jr.",
      "teamId": "UCLA",
      "position": "WR",
      "jersey": 11,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.47,
        "targetShare": 0.119
      },
      "production2025": {
        "games": 8,
        "targets": 43,
        "receptions": 26,
        "recYds": 274
      },
      "rates": {
        "ypt": 6.4,
        "epaPerPlay": 0.198,
        "explosiveRate": 0.07
      },
      "measuredPlays": 43,
      "usage2025": {
        "targetShare": 0.119
      },
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 43 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-jalen-woods",
      "name": "Jalen Woods",
      "teamId": "UCLA",
      "position": "LB",
      "jersey": 9,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.097
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-anthony-jones-jr",
      "name": "Anthony Jones Jr.",
      "teamId": "UCLA",
      "position": "DL",
      "jersey": 15,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.076
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 47,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-hudson-habermehl",
      "name": "Hudson Habermehl",
      "teamId": "UCLA",
      "position": "TE",
      "jersey": 81,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.083
      },
      "production2025": {
        "games": 11,
        "targets": 30,
        "receptions": 20,
        "recYds": 138
      },
      "rates": {
        "ypt": 4.6,
        "epaPerPlay": -0.064,
        "explosiveRate": 0.067
      },
      "measuredPlays": 30,
      "usage2025": {
        "targetShare": 0.083
      },
      "grade": 47,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 30 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "ucla-mikey-matthews",
      "name": "Mikey Matthews",
      "teamId": "UCLA",
      "position": "WR",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.62,
        "passAttemptShare": 0.003,
        "carryShare": 0.003,
        "targetShare": 0.152
      },
      "production2025": {
        "games": 11,
        "attempts": 1,
        "carries": 1,
        "rushYds": 1,
        "targets": 55,
        "receptions": 33,
        "recYds": 343,
        "recTd": 2
      },
      "rates": {
        "ypc": 1,
        "ypt": 6.2,
        "epaPerPlay": 0.091,
        "explosiveRate": 0.054
      },
      "measuredPlays": 57,
      "usage2025": {
        "passAttemptShare": 0.003,
        "carryShare": 0.003,
        "targetShare": 0.152
      },
      "grade": 44,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 57 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  USC: [
    {
      "id": "usc-jayden-maiava",
      "name": "Jayden Maiava",
      "teamId": "USC",
      "position": "QB",
      "jersey": 14,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.959,
        "carryShare": 0.113
      },
      "production2025": {
        "games": 13,
        "attempts": 402,
        "completions": 265,
        "passYds": 3730,
        "passTd": 24,
        "interceptions": 10,
        "carries": 46,
        "rushYds": 266,
        "rushTd": 6,
        "takeaways": 1
      },
      "rates": {
        "ypa": 9.3,
        "ypc": 5.8,
        "epaPerPlay": 0.418,
        "explosiveRate": 0.13
      },
      "measuredPlays": 474,
      "productionCurrent": {
        "games": 2,
        "attempts": 54,
        "completions": 48,
        "passYds": 626,
        "passTd": 5,
        "carries": 5,
        "rushYds": 10,
        "rushTd": 1
      },
      "usage2025": {
        "passAttemptShare": 0.959,
        "carryShare": 0.113
      },
      "grade": 97,
      "par": 9.2,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 474 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-bishop-fitzgerald",
      "name": "Bishop Fitzgerald",
      "teamId": "USC",
      "position": "S",
      "jersey": 19,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "takeaways": 5,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 3.74
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 98,
      "par": 3.07,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-anthony-lucas",
      "name": "Anthony Lucas",
      "teamId": "USC",
      "position": "EDGE",
      "jersey": 6,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.8
      },
      "production2025": {
        "games": 3,
        "sacks": 4
      },
      "rates": {
        "epaPerPlay": 3.18
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 98,
      "par": 2.05,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-ja-kobi-lane",
      "name": "Ja'Kobi Lane",
      "teamId": "USC",
      "position": "WR",
      "jersey": 8,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.67,
        "targetShare": 0.189
      },
      "production2025": {
        "games": 11,
        "targets": 79,
        "receptions": 49,
        "recYds": 745,
        "recTd": 4
      },
      "rates": {
        "ypt": 9.4,
        "epaPerPlay": 0.843,
        "explosiveRate": 0.114
      },
      "measuredPlays": 79,
      "usage2025": {
        "targetShare": 0.189
      },
      "grade": 96,
      "par": 1.74,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 79 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-waymond-jordan",
      "name": "Waymond Jordan",
      "teamId": "USC",
      "position": "RB",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.56,
        "carryShare": 0.216,
        "targetShare": 0.029
      },
      "production2025": {
        "games": 6,
        "carries": 88,
        "rushYds": 576,
        "rushTd": 5,
        "targets": 12,
        "receptions": 7,
        "recYds": 63
      },
      "rates": {
        "ypc": 6.5,
        "ypt": 5.3,
        "epaPerPlay": 0.111,
        "explosiveRate": 0.08
      },
      "measuredPlays": 100,
      "productionCurrent": {
        "games": 2,
        "carries": 19,
        "rushYds": 121,
        "targets": 2,
        "receptions": 2,
        "recYds": 12
      },
      "usage2025": {
        "carryShare": 0.216,
        "targetShare": 0.029
      },
      "grade": 92,
      "par": 1.72,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 100 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-braylan-shelby",
      "name": "Braylan Shelby",
      "teamId": "USC",
      "position": "EDGE",
      "jersey": 10,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 4,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 2.849
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 97,
      "par": 1.5,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-eli-sanders",
      "name": "Eli Sanders",
      "teamId": "USC",
      "position": "RB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.31,
        "carryShare": 0.113,
        "targetShare": 0.022
      },
      "production2025": {
        "games": 6,
        "carries": 46,
        "rushYds": 255,
        "rushTd": 2,
        "targets": 9,
        "receptions": 8,
        "recYds": 136,
        "recTd": 1
      },
      "rates": {
        "ypc": 5.5,
        "ypt": 15.1,
        "epaPerPlay": 0.208,
        "explosiveRate": 0.036
      },
      "measuredPlays": 55,
      "usage2025": {
        "carryShare": 0.113,
        "targetShare": 0.022
      },
      "grade": 86,
      "par": 1.13,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 55 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-tanook-hines",
      "name": "Tanook Hines",
      "teamId": "USC",
      "position": "WR",
      "jersey": 16,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.45,
        "targetShare": 0.127
      },
      "production2025": {
        "games": 13,
        "targets": 53,
        "receptions": 34,
        "recYds": 565,
        "recTd": 2
      },
      "rates": {
        "ypt": 10.7,
        "epaPerPlay": 0.901,
        "explosiveRate": 0.245
      },
      "measuredPlays": 53,
      "productionCurrent": {
        "games": 1,
        "targets": 2,
        "receptions": 2,
        "recYds": 18,
        "recTd": 1
      },
      "usage2025": {
        "targetShare": 0.127
      },
      "grade": 82,
      "par": 1.11,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 53 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-king-miller",
      "name": "King Miller",
      "teamId": "USC",
      "position": "RB",
      "jersey": 30,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.382,
        "targetShare": 0.05
      },
      "production2025": {
        "games": 12,
        "carries": 156,
        "rushYds": 1012,
        "rushTd": 8,
        "targets": 21,
        "receptions": 16,
        "recYds": 119
      },
      "rates": {
        "ypc": 6.5,
        "ypt": 5.7,
        "epaPerPlay": 0.099,
        "explosiveRate": 0.056
      },
      "measuredPlays": 177,
      "productionCurrent": {
        "games": 2,
        "carries": 30,
        "rushYds": 121,
        "rushTd": 1,
        "targets": 2,
        "receptions": 2,
        "recYds": 6
      },
      "usage2025": {
        "carryShare": 0.382,
        "targetShare": 0.05
      },
      "grade": 86,
      "par": 1.1,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 177 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-makai-lemon",
      "name": "Makai Lemon",
      "teamId": "USC",
      "position": "WR",
      "jersey": 6,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.002,
        "carryShare": 0.022,
        "targetShare": 0.259
      },
      "production2025": {
        "games": 12,
        "attempts": 1,
        "completions": 1,
        "passYds": 24,
        "passTd": 1,
        "carries": 9,
        "rushYds": 8,
        "rushTd": 2,
        "targets": 108,
        "receptions": 79,
        "recYds": 1160,
        "recTd": 11
      },
      "rates": {
        "ypa": 24,
        "ypc": 0.9,
        "ypt": 10.7,
        "epaPerPlay": 0.555,
        "explosiveRate": 0.154
      },
      "measuredPlays": 118,
      "usage2025": {
        "passAttemptShare": 0.002,
        "carryShare": 0.022,
        "targetShare": 0.259
      },
      "grade": 92,
      "par": 0.69,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 118 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-walker-lyons",
      "name": "Walker Lyons",
      "teamId": "USC",
      "position": "TE",
      "jersey": 85,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.57,
        "targetShare": 0.067
      },
      "production2025": {
        "games": 12,
        "targets": 28,
        "receptions": 20,
        "recYds": 223,
        "recTd": 2
      },
      "rates": {
        "ypt": 8,
        "epaPerPlay": 0.696,
        "explosiveRate": 0.071
      },
      "measuredPlays": 28,
      "usage2025": {
        "targetShare": 0.067
      },
      "grade": 83,
      "par": 0.45,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 28 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-jide-abasiri",
      "name": "Jide Abasiri",
      "teamId": "USC",
      "position": "DL",
      "jersey": 97,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 4,
        "takeaways": 1
      },
      "rates": {
        "epaPerPlay": 1.841
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 92,
      "par": 0.43,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-lake-mcree",
      "name": "Lake McRee",
      "teamId": "USC",
      "position": "TE",
      "jersey": 87,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.118
      },
      "production2025": {
        "games": 12,
        "targets": 49,
        "receptions": 30,
        "recYds": 450,
        "recTd": 4
      },
      "rates": {
        "ypt": 9.2,
        "epaPerPlay": 0.388,
        "explosiveRate": 0.143
      },
      "measuredPlays": 49,
      "usage2025": {
        "targetShare": 0.118
      },
      "grade": 81,
      "par": 0.16,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 49 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-jaden-richardson",
      "name": "Jaden Richardson",
      "teamId": "USC",
      "position": "WR",
      "jersey": 15,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.16,
        "targetShare": 0.046
      },
      "production2025": {
        "games": 7,
        "targets": 19,
        "receptions": 12,
        "recYds": 148,
        "recTd": 1
      },
      "rates": {
        "ypt": 7.8,
        "epaPerPlay": 0.478,
        "explosiveRate": 0.105
      },
      "measuredPlays": 19,
      "usage2025": {
        "targetShare": 0.046
      },
      "grade": 54,
      "par": 0.16,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 19 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-dj-wingfield",
      "name": "DJ Wingfield",
      "teamId": "USC",
      "position": "IOL",
      "jersey": 56,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "usc-j-onre-reed",
      "name": "J'Onre Reed",
      "teamId": "USC",
      "position": "IOL",
      "jersey": 50,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "usc-alani-noa",
      "name": "Alani Noa",
      "teamId": "USC",
      "position": "IOL",
      "jersey": 77,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6
      },
      "rates": {},
      "grade": 73,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "usc-decarlos-nicholson",
      "name": "DeCarlos Nicholson",
      "teamId": "USC",
      "position": "CB",
      "jersey": 17,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.86
      },
      "production2025": {
        "games": 5,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 1.249
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 62,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-kameryn-crawford",
      "name": "Kameryn Crawford",
      "teamId": "USC",
      "position": "EDGE",
      "jersey": 1,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 5
      },
      "rates": {
        "epaPerPlay": 1.251
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 57,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-christian-pierce",
      "name": "Christian Pierce",
      "teamId": "USC",
      "position": "S",
      "jersey": 24,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "sacks": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.577
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-devan-thompkins",
      "name": "Devan Thompkins",
      "teamId": "USC",
      "position": "DL",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6
      },
      "production2025": {
        "games": 2,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 0.945
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 55,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-eric-gentry",
      "name": "Eric Gentry",
      "teamId": "USC",
      "position": "LB",
      "jersey": 18,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 3,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 0.955
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-marcelles-williams",
      "name": "Marcelles Williams",
      "teamId": "USC",
      "position": "CB",
      "jersey": 25,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.57
      },
      "production2025": {
        "games": 4,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 0.775
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 49,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-ryon-sayeri",
      "name": "Ryon Sayeri",
      "teamId": "USC",
      "position": "P",
      "jersey": 48,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 13,
        "fgAttempts": 25,
        "fgMade": 21,
        "fgLong": 54
      },
      "rates": {},
      "measuredPlays": 25,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 25 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "usc-james-johnson",
      "name": "James Johnson",
      "teamId": "USC",
      "position": "CB",
      "jersey": 11,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.005,
        "targetShare": 0.012
      },
      "production2025": {
        "games": 2,
        "carries": 2,
        "rushYds": 7,
        "targets": 5,
        "receptions": 5,
        "recYds": 23
      },
      "rates": {
        "ypc": 3.5,
        "ypt": 4.6,
        "epaPerPlay": -0.352
      },
      "measuredPlays": 7,
      "usage2025": {
        "carryShare": 0.005,
        "targetShare": 0.012
      },
      "grade": 40,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  WASH: [
    {
      "id": "wash-demond-williams-jr",
      "name": "Demond Williams Jr.",
      "teamId": "WASH",
      "position": "QB",
      "jersey": 1,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.956,
        "carryShare": 0.281,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 13,
        "attempts": 351,
        "completions": 245,
        "passYds": 3106,
        "passTd": 25,
        "interceptions": 7,
        "carries": 122,
        "rushYds": 834,
        "rushTd": 6,
        "targets": 1,
        "receptions": 1,
        "recYds": 3
      },
      "rates": {
        "ypa": 8.8,
        "ypc": 6.8,
        "ypt": 3,
        "epaPerPlay": 0.247,
        "explosiveRate": 0.163
      },
      "measuredPlays": 508,
      "usage2025": {
        "passAttemptShare": 0.956,
        "carryShare": 0.281,
        "targetShare": 0.003
      },
      "grade": 92,
      "par": 5.9,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 508 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-jonah-coleman",
      "name": "Jonah Coleman",
      "teamId": "WASH",
      "position": "RB",
      "jersey": 1,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.362,
        "targetShare": 0.104
      },
      "production2025": {
        "games": 12,
        "carries": 157,
        "rushYds": 782,
        "rushTd": 15,
        "targets": 37,
        "receptions": 31,
        "recYds": 354,
        "recTd": 2
      },
      "rates": {
        "ypc": 5,
        "ypt": 9.6,
        "epaPerPlay": 0.265,
        "explosiveRate": 0.082
      },
      "measuredPlays": 194,
      "usage2025": {
        "carryShare": 0.362,
        "targetShare": 0.104
      },
      "grade": 96,
      "par": 3.04,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 194 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-jordan-washington",
      "name": "Jordan Washington",
      "teamId": "WASH",
      "position": "RB",
      "jersey": 4,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.15,
        "carryShare": 0.067,
        "targetShare": 0.003
      },
      "production2025": {
        "games": 7,
        "carries": 29,
        "rushYds": 235,
        "rushTd": 1,
        "targets": 1
      },
      "rates": {
        "ypc": 8.1,
        "epaPerPlay": 0.378,
        "explosiveRate": 0.067
      },
      "measuredPlays": 30,
      "usage2025": {
        "carryShare": 0.067,
        "targetShare": 0.003
      },
      "grade": 89,
      "par": 1.63,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 30 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-rahshawn-clark",
      "name": "Rahshawn Clark",
      "teamId": "WASH",
      "position": "S",
      "jersey": 2,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.83
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "takeaways": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.995
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 87,
      "par": 1.26,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-denzel-boston",
      "name": "Denzel Boston",
      "teamId": "WASH",
      "position": "WR",
      "jersey": 12,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.005,
        "targetShare": 0.269
      },
      "production2025": {
        "games": 11,
        "attempts": 2,
        "completions": 2,
        "passYds": 15,
        "passTd": 1,
        "targets": 96,
        "receptions": 62,
        "recYds": 881,
        "recTd": 11
      },
      "rates": {
        "ypa": 7.5,
        "ypt": 9.2,
        "epaPerPlay": 0.631,
        "explosiveRate": 0.125
      },
      "measuredPlays": 98,
      "usage2025": {
        "passAttemptShare": 0.005,
        "targetShare": 0.269
      },
      "grade": 95,
      "par": 1.21,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 98 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-adam-mohammed",
      "name": "Adam Mohammed",
      "teamId": "WASH",
      "position": "RB",
      "jersey": 24,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.64,
        "carryShare": 0.244,
        "targetShare": 0.05
      },
      "production2025": {
        "games": 13,
        "carries": 106,
        "rushYds": 540,
        "rushTd": 5,
        "targets": 18,
        "receptions": 16,
        "recYds": 155
      },
      "rates": {
        "ypc": 5.1,
        "ypt": 8.6,
        "epaPerPlay": 0.162,
        "explosiveRate": 0.024
      },
      "measuredPlays": 124,
      "usage2025": {
        "carryShare": 0.244,
        "targetShare": 0.05
      },
      "grade": 87,
      "par": 1.21,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 124 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-ephesians-prysock",
      "name": "Ephesians Prysock",
      "teamId": "WASH",
      "position": "CB",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 2.251
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 87,
      "par": 0.97,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-zach-durfee",
      "name": "Zach Durfee",
      "teamId": "WASH",
      "position": "EDGE",
      "jersey": 5,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.6
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.535
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 82,
      "par": 0.89,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-xe-ree-alexander",
      "name": "Xe'ree Alexander",
      "teamId": "WASH",
      "position": "LB",
      "jersey": 10,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 1,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 2.048
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 99,
      "par": 0.81,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-zaydrius-rainey-sale",
      "name": "Zaydrius Rainey-Sale",
      "teamId": "WASH",
      "position": "LB",
      "jersey": 23,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 3,
        "sacks": 1,
        "takeaways": 1,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 2.427
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 75,
      "par": 0.58,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-dezmen-roebuck",
      "name": "Dezmen Roebuck",
      "teamId": "WASH",
      "position": "WR",
      "jersey": 2,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.64,
        "carryShare": 0.005,
        "targetShare": 0.171
      },
      "production2025": {
        "games": 12,
        "carries": 2,
        "rushYds": 10,
        "targets": 61,
        "receptions": 42,
        "recYds": 560,
        "recTd": 7
      },
      "rates": {
        "ypc": 5,
        "ypt": 9.2,
        "epaPerPlay": 0.507,
        "explosiveRate": 0.095
      },
      "measuredPlays": 63,
      "usage2025": {
        "carryShare": 0.005,
        "targetShare": 0.171
      },
      "grade": 70,
      "par": 0.4,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 63 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-omari-evans",
      "name": "Omari Evans",
      "teamId": "WASH",
      "position": "WR",
      "jersey": 5,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.3,
        "carryShare": 0.002,
        "targetShare": 0.078
      },
      "production2025": {
        "games": 9,
        "carries": 1,
        "rushYds": 14,
        "targets": 28,
        "receptions": 17,
        "recYds": 254,
        "recTd": 1
      },
      "rates": {
        "ypc": 14,
        "ypt": 9.1,
        "epaPerPlay": 0.564,
        "explosiveRate": 0.069
      },
      "measuredPlays": 29,
      "usage2025": {
        "carryShare": 0.002,
        "targetShare": 0.078
      },
      "grade": 61,
      "par": 0.4,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 29 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-deshawn-lynch",
      "name": "Deshawn Lynch",
      "teamId": "WASH",
      "position": "DL",
      "jersey": 41,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 4,
        "sacks": 1,
        "takeaways": 2,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 1.803
      },
      "measuredPlays": 7,
      "usage2025": {},
      "grade": 92,
      "par": 0.38,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 7 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-alex-mclaughlin",
      "name": "Alex McLaughlin",
      "teamId": "WASH",
      "position": "S",
      "jersey": 7,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "takeaways": 2,
        "passBreakups": 4
      },
      "rates": {
        "epaPerPlay": 2.207
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 75,
      "par": 0.27,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-raiden-vines-bright",
      "name": "Raiden Vines-Bright",
      "teamId": "WASH",
      "position": "WR",
      "jersey": 7,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.32,
        "carryShare": 0.002,
        "targetShare": 0.084
      },
      "production2025": {
        "games": 12,
        "carries": 1,
        "rushYds": 1,
        "targets": 30,
        "receptions": 24,
        "recYds": 254,
        "recTd": 1
      },
      "rates": {
        "ypc": 1,
        "ypt": 8.5,
        "epaPerPlay": 0.519,
        "explosiveRate": 0.097
      },
      "measuredPlays": 31,
      "usage2025": {
        "carryShare": 0.002,
        "targetShare": 0.084
      },
      "grade": 54,
      "par": 0.19,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 31 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-decker-degraaf",
      "name": "Decker DeGraaf",
      "teamId": "WASH",
      "position": "TE",
      "jersey": 86,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "targetShare": 0.112
      },
      "production2025": {
        "games": 12,
        "targets": 40,
        "receptions": 32,
        "recYds": 360,
        "recTd": 2
      },
      "rates": {
        "ypt": 9,
        "epaPerPlay": 0.412,
        "explosiveRate": 0.075
      },
      "measuredPlays": 40,
      "usage2025": {
        "targetShare": 0.112
      },
      "grade": 77,
      "par": 0.17,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 40 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-bryce-butler",
      "name": "Bryce Butler",
      "teamId": "WASH",
      "position": "DL",
      "jersey": 92,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 2,
        "sacks": 3
      },
      "rates": {
        "epaPerPlay": 1.474
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 80,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-carver-willis",
      "name": "Carver Willis",
      "teamId": "WASH",
      "position": "IOL",
      "jersey": 50,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "wash-drew-azzopardi",
      "name": "Drew Azzopardi",
      "teamId": "WASH",
      "position": "IOL",
      "jersey": 74,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "wash-geirean-hatchett",
      "name": "Geirean Hatchett",
      "teamId": "WASH",
      "position": "IOL",
      "jersey": 56,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "wash-jacob-lane",
      "name": "Jacob Lane",
      "teamId": "WASH",
      "position": "EDGE",
      "jersey": 48,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 5,
        "sacks": 4,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.282
      },
      "measuredPlays": 5,
      "usage2025": {},
      "grade": 51,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 5 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-luke-dunne",
      "name": "Luke Dunne",
      "teamId": "WASH",
      "position": "P",
      "jersey": 45,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 11,
        "punts": 34,
        "puntAvg": 15.3
      },
      "rates": {},
      "measuredPlays": 34,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 34 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-makell-esteen",
      "name": "Makell Esteen",
      "teamId": "WASH",
      "position": "S",
      "jersey": 24,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 3,
        "takeaways": 1,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.122
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-ta-ita-i-uiagalelei",
      "name": "Ta'ita'i Uiagalelei",
      "teamId": "WASH",
      "position": "DL",
      "jersey": 11,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.43
      },
      "production2025": {
        "games": 3,
        "sacks": 2,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.009
      },
      "measuredPlays": 3,
      "usage2025": {},
      "grade": 45,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 3 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wash-grady-gross",
      "name": "Grady Gross",
      "teamId": "WASH",
      "position": "K",
      "jersey": 95,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.003
      },
      "production2025": {
        "games": 9,
        "attempts": 1,
        "fgAttempts": 13,
        "fgMade": 10,
        "fgLong": 51
      },
      "rates": {
        "epaPerPlay": -0.18
      },
      "measuredPlays": 14,
      "usage2025": {
        "passAttemptShare": 0.003
      },
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 14 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
  WISC: [
    {
      "id": "wisc-sean-west",
      "name": "Sean West",
      "teamId": "WISC",
      "position": "K",
      "jersey": 91,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.004,
        "carryShare": 0.003
      },
      "production2025": {
        "games": 6,
        "attempts": 1,
        "completions": 1,
        "passYds": 24,
        "carries": 1,
        "rushYds": 20,
        "punts": 27,
        "puntAvg": 12.5
      },
      "rates": {
        "ypa": 24,
        "ypc": 20,
        "epaPerPlay": 0.281,
        "explosiveRate": 1
      },
      "measuredPlays": 29,
      "usage2025": {
        "passAttemptShare": 0.004,
        "carryShare": 0.003
      },
      "grade": 99,
      "par": 1.02,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 29 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-jackson-acker",
      "name": "Jackson Acker",
      "teamId": "WISC",
      "position": "TE",
      "jersey": 34,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.48,
        "carryShare": 0.039,
        "targetShare": 0.042
      },
      "production2025": {
        "games": 10,
        "carries": 15,
        "rushYds": 61,
        "targets": 11,
        "receptions": 8,
        "recYds": 76,
        "recTd": 1
      },
      "rates": {
        "ypc": 4.1,
        "ypt": 6.9,
        "epaPerPlay": 0.533,
        "explosiveRate": 0.115
      },
      "measuredPlays": 26,
      "usage2025": {
        "carryShare": 0.039,
        "targetShare": 0.042
      },
      "grade": 88,
      "par": 0.58,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 26 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-christian-alliegro",
      "name": "Christian Alliegro",
      "teamId": "WISC",
      "position": "LB",
      "jersey": 14,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 4,
        "sacks": 4
      },
      "rates": {
        "epaPerPlay": 2.263
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 71,
      "par": 0.42,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-chris-brooks-jr",
      "name": "Chris Brooks Jr.",
      "teamId": "WISC",
      "position": "WR",
      "jersey": 2,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.28,
        "targetShare": 0.062
      },
      "production2025": {
        "games": 10,
        "targets": 16,
        "receptions": 11,
        "recYds": 124
      },
      "rates": {
        "ypt": 7.8,
        "epaPerPlay": 0.715
      },
      "measuredPlays": 16,
      "usage2025": {
        "targetShare": 0.062
      },
      "grade": 52,
      "par": 0.28,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 16 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-mason-reiger",
      "name": "Mason Reiger",
      "teamId": "WISC",
      "position": "LB",
      "jersey": 22,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.5
      },
      "production2025": {
        "games": 4,
        "sacks": 3,
        "passBreakups": 1
      },
      "rates": {
        "epaPerPlay": 1.912
      },
      "measuredPlays": 4,
      "usage2025": {},
      "grade": 64,
      "par": 0.07,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 4 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-grant-stec",
      "name": "Grant Stec",
      "teamId": "WISC",
      "position": "TE",
      "jersey": 85,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.2,
        "targetShare": 0.042
      },
      "production2025": {
        "games": 7,
        "targets": 11,
        "receptions": 5,
        "recYds": 52
      },
      "rates": {
        "ypt": 4.7,
        "epaPerPlay": 0.344,
        "explosiveRate": 0.182
      },
      "measuredPlays": 11,
      "usage2025": {
        "targetShare": 0.042
      },
      "grade": 61,
      "par": 0.03,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 11 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-darryl-peterson-iii",
      "name": "Darryl Peterson III",
      "teamId": "WISC",
      "position": "LB",
      "jersey": 17,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 3,
        "sacks": 6,
        "passBreakups": 2
      },
      "rates": {
        "epaPerPlay": 1.372
      },
      "measuredPlays": 8,
      "usage2025": {},
      "grade": 91,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 8 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-barrett-nelson",
      "name": "Barrett Nelson",
      "teamId": "WISC",
      "position": "IOL",
      "jersey": 70,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "wisc-davis-heinzen",
      "name": "Davis Heinzen",
      "teamId": "WISC",
      "position": "IOL",
      "jersey": 74,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "wisc-jake-renfro",
      "name": "Jake Renfro",
      "teamId": "WISC",
      "position": "IOL",
      "jersey": 59,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "rates": {},
      "grade": 78,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Offensive line play is never named in play-by-play; the line’s work shows up in the team’s line yards and sack rate instead.",
      "provenance": "modeled"
    },
    {
      "id": "wisc-mason-posa",
      "name": "Mason Posa",
      "teamId": "WISC",
      "position": "LB",
      "jersey": 8,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.75
      },
      "production2025": {
        "games": 4,
        "sacks": 3,
        "passBreakups": 3
      },
      "rates": {
        "epaPerPlay": 1.477
      },
      "measuredPlays": 6,
      "usage2025": {},
      "grade": 70,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 6 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-gideon-ituka",
      "name": "Gideon Ituka",
      "teamId": "WISC",
      "position": "RB",
      "jersey": 10,
      "classYear": "SO",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.69,
        "carryShare": 0.157,
        "targetShare": 0.015
      },
      "production2025": {
        "games": 6,
        "carries": 61,
        "rushYds": 278,
        "targets": 4,
        "receptions": 1
      },
      "rates": {
        "ypc": 4.6,
        "epaPerPlay": -0.094,
        "explosiveRate": 0.015
      },
      "measuredPlays": 65,
      "usage2025": {
        "carryShare": 0.157,
        "targetShare": 0.015
      },
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.28,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 65 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-vinny-anthony-ii",
      "name": "Vinny Anthony II",
      "teamId": "WISC",
      "position": "WR",
      "jersey": 8,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.013,
        "targetShare": 0.2
      },
      "production2025": {
        "games": 12,
        "carries": 5,
        "rushYds": 27,
        "rushTd": 2,
        "targets": 52,
        "receptions": 31,
        "recYds": 391,
        "recTd": 1
      },
      "rates": {
        "ypc": 5.4,
        "ypt": 7.5,
        "epaPerPlay": 0.297,
        "explosiveRate": 0.088
      },
      "measuredPlays": 57,
      "usage2025": {
        "carryShare": 0.013,
        "targetShare": 0.2
      },
      "grade": 56,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 57 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-darrion-dupree",
      "name": "Darrion Dupree",
      "teamId": "WISC",
      "position": "RB",
      "jersey": 6,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "carryShare": 0.214,
        "targetShare": 0.042
      },
      "production2025": {
        "games": 10,
        "carries": 83,
        "rushYds": 379,
        "rushTd": 2,
        "targets": 11,
        "receptions": 7,
        "recYds": 36
      },
      "rates": {
        "ypc": 4.6,
        "ypt": 3.3,
        "epaPerPlay": -0.096,
        "explosiveRate": 0.043
      },
      "measuredPlays": 94,
      "usage2025": {
        "carryShare": 0.214,
        "targetShare": 0.042
      },
      "grade": 55,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 94 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-cade-yacamelli",
      "name": "Cade Yacamelli",
      "teamId": "WISC",
      "position": "RB",
      "jersey": 25,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.45,
        "carryShare": 0.095,
        "targetShare": 0.019
      },
      "production2025": {
        "games": 8,
        "carries": 37,
        "rushYds": 127,
        "targets": 5,
        "receptions": 2,
        "recYds": 26
      },
      "rates": {
        "ypc": 3.4,
        "ypt": 5.2,
        "epaPerPlay": -0.175,
        "explosiveRate": 0.048
      },
      "measuredPlays": 42,
      "productionCurrent": {
        "games": 1,
        "carries": 1
      },
      "usage2025": {
        "carryShare": 0.095,
        "targetShare": 0.019
      },
      "grade": 54,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 42 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-danny-o-neil",
      "name": "Danny O'Neil",
      "teamId": "WISC",
      "position": "QB",
      "jersey": 18,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1,
        "passAttemptShare": 0.328,
        "carryShare": 0.09
      },
      "production2025": {
        "games": 6,
        "attempts": 89,
        "completions": 61,
        "passYds": 663,
        "passTd": 5,
        "interceptions": 5,
        "carries": 35,
        "rushYds": 174,
        "rushTd": 1
      },
      "rates": {
        "ypa": 7.4,
        "ypc": 5,
        "epaPerPlay": -0.058,
        "explosiveRate": 0.086
      },
      "measuredPlays": 138,
      "usage2025": {
        "passAttemptShare": 0.328,
        "carryShare": 0.09
      },
      "grade": 53,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 138 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-atticus-bertrams",
      "name": "Atticus Bertrams",
      "teamId": "WISC",
      "position": "P",
      "jersey": 49,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 1
      },
      "production2025": {
        "games": 10,
        "punts": 37,
        "puntAvg": 34.6
      },
      "rates": {},
      "measuredPlays": 37,
      "productionCurrent": {
        "games": 1,
        "punts": 2
      },
      "usage2025": {},
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 37 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-carter-smith",
      "name": "Carter Smith",
      "teamId": "WISC",
      "position": "QB",
      "jersey": 5,
      "classYear": "FR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.69,
        "passAttemptShare": 0.166,
        "carryShare": 0.103
      },
      "production2025": {
        "games": 4,
        "attempts": 45,
        "completions": 25,
        "passYds": 216,
        "passTd": 2,
        "interceptions": 1,
        "carries": 40,
        "rushYds": 148,
        "rushTd": 1
      },
      "rates": {
        "ypa": 4.8,
        "ypc": 3.7,
        "epaPerPlay": -0.232,
        "explosiveRate": 0.05
      },
      "measuredPlays": 95,
      "usage2025": {
        "passAttemptShare": 0.166,
        "carryShare": 0.103
      },
      "grade": 48,
      "par": 0,
      "breakoutOdds": 0.34,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 95 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-trech-kekahuna",
      "name": "Trech Kekahuna",
      "teamId": "WISC",
      "position": "WR",
      "jersey": 2,
      "classYear": "JR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.98,
        "carryShare": 0.036,
        "targetShare": 0.162
      },
      "production2025": {
        "games": 12,
        "carries": 14,
        "rushYds": 127,
        "rushTd": 1,
        "targets": 42,
        "receptions": 26,
        "recYds": 231
      },
      "rates": {
        "ypc": 9.1,
        "ypt": 5.5,
        "epaPerPlay": 0.034,
        "explosiveRate": 0.107
      },
      "measuredPlays": 56,
      "productionCurrent": {
        "games": 1,
        "targets": 3,
        "receptions": 3,
        "recYds": 38
      },
      "usage2025": {
        "carryShare": 0.036,
        "targetShare": 0.162
      },
      "grade": 47,
      "par": 0,
      "breakoutOdds": 0.22,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 56 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-jayden-ballard",
      "name": "Jayden Ballard",
      "teamId": "WISC",
      "position": "WR",
      "jersey": 4,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.28,
        "targetShare": 0.062
      },
      "production2025": {
        "games": 7,
        "targets": 16,
        "receptions": 7,
        "recYds": 150,
        "recTd": 2
      },
      "rates": {
        "ypt": 9.4,
        "epaPerPlay": 0.238,
        "explosiveRate": 0.125
      },
      "measuredPlays": 16,
      "usage2025": {
        "targetShare": 0.062
      },
      "grade": 45,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 16 plays of 2025 play-by-play.",
      "provenance": "measured"
    },
    {
      "id": "wisc-tyrell-henry",
      "name": "Tyrell Henry",
      "teamId": "WISC",
      "position": "WR",
      "jersey": 0,
      "classYear": "SR",
      "origin": "returning",
      "recruitStars": null,
      "usage": {
        "snapShare": 0.26,
        "passAttemptShare": 0.004,
        "carryShare": 0.023,
        "targetShare": 0.019
      },
      "production2025": {
        "games": 9,
        "attempts": 1,
        "carries": 9,
        "rushYds": 29,
        "targets": 5,
        "receptions": 5,
        "recYds": 39,
        "recTd": 1
      },
      "rates": {
        "ypc": 3.2,
        "ypt": 7.8,
        "epaPerPlay": 0.01,
        "explosiveRate": 0.071
      },
      "measuredPlays": 15,
      "usage2025": {
        "passAttemptShare": 0.004,
        "carryShare": 0.023,
        "targetShare": 0.019
      },
      "grade": 42,
      "par": 0,
      "breakoutOdds": 0.16,
      "durabilityRisk": 0.12,
      "accolades": [],
      "note": "Counted off 15 plays of 2025 play-by-play.",
      "provenance": "measured"
    }
  ],
};
