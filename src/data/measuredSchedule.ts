/* eslint-disable */
/* ============================================================================
 * GENERATED FILE — do not edit by hand.
 *
 *   npm run etl:schedule
 *
 * The 2026 slate for all 34 projected teams, read from the published
 * schedule rather than transcribed: 252 games, 153 of them inside a
 * conference, against 84 opponents from outside the two.
 *
 * Outside opponents carry a measured rating — scoring margin against an average
 * FBS team, from the same fit that produces the conference anchors — so they sit
 * on the projection's own scale instead of a separate authored one.
 * ========================================================================== */

import type { Game, NonConferenceOpponent, WeekMeta } from './types';

export const WEEKS: WeekMeta[] = [
  {
    "week": 1,
    "date": "2026-08-29",
    "label": "Aug 29"
  },
  {
    "week": 2,
    "date": "2026-09-11",
    "label": "Sep 11"
  },
  {
    "week": 3,
    "date": "2026-09-19",
    "label": "Sep 19"
  },
  {
    "week": 4,
    "date": "2026-09-25",
    "label": "Sep 25"
  },
  {
    "week": 5,
    "date": "2026-10-03",
    "label": "Oct 3"
  },
  {
    "week": 6,
    "date": "2026-10-10",
    "label": "Oct 10"
  },
  {
    "week": 7,
    "date": "2026-10-17",
    "label": "Oct 17"
  },
  {
    "week": 8,
    "date": "2026-10-24",
    "label": "Oct 24"
  },
  {
    "week": 9,
    "date": "2026-10-31",
    "label": "Oct 31"
  },
  {
    "week": 10,
    "date": "2026-11-07",
    "label": "Nov 7"
  },
  {
    "week": 11,
    "date": "2026-11-14",
    "label": "Nov 14"
  },
  {
    "week": 12,
    "date": "2026-11-21",
    "label": "Nov 21"
  },
  {
    "week": 13,
    "date": "2026-11-27",
    "label": "Nov 27"
  }
];

export const CHAMPIONSHIPS = {
  "SEC": {
    "venue": "Mercedes-Benz Stadium",
    "city": "Atlanta, GA"
  },
  "B1G": {
    "venue": "Lucas Oil Stadium",
    "city": "Indianapolis, IN"
  }
} as const;

/** Opponents from outside the two conferences, on the projection's own scale. */
export const NON_CONFERENCE: NonConferenceOpponent[] = [
  {
    "id": "x87",
    "name": "Notre Dame",
    "conference": "FBS Independents",
    "rating": 23.9
  },
  {
    "id": "x254",
    "name": "Utah",
    "conference": "Big 12",
    "rating": 19.1
  },
  {
    "id": "x68",
    "name": "Boise State",
    "conference": "Pac-12",
    "rating": 9
  },
  {
    "id": "x249",
    "name": "North Texas",
    "conference": "American Athletic",
    "rating": 8.3
  },
  {
    "id": "x97",
    "name": "Louisville",
    "conference": "ACC",
    "rating": 7.7
  },
  {
    "id": "x52",
    "name": "Florida State",
    "conference": "ACC",
    "rating": 7.4
  },
  {
    "id": "x228",
    "name": "Clemson",
    "conference": "ACC",
    "rating": 6.6
  },
  {
    "id": "x150",
    "name": "Duke",
    "conference": "ACC",
    "rating": 5.7
  },
  {
    "id": "x2305",
    "name": "Kansas",
    "conference": "Big 12",
    "rating": 5.3
  },
  {
    "id": "x41",
    "name": "UConn",
    "conference": "FBS Independents",
    "rating": 4.8
  },
  {
    "id": "x21",
    "name": "San Diego State",
    "conference": "Pac-12",
    "rating": 3.7
  },
  {
    "id": "x154",
    "name": "Wake Forest",
    "conference": "ACC",
    "rating": 3.6
  },
  {
    "id": "x2649",
    "name": "Toledo",
    "conference": "Mid-American",
    "rating": 3.4
  },
  {
    "id": "x9",
    "name": "Arizona State",
    "conference": "Big 12",
    "rating": 2.2
  },
  {
    "id": "x59",
    "name": "Georgia Tech",
    "conference": "ACC",
    "rating": 2.1
  },
  {
    "id": "x265",
    "name": "Washington State",
    "conference": "Pac-12",
    "rating": 1.8
  },
  {
    "id": "x152",
    "name": "NC State",
    "conference": "ACC",
    "rating": 1.7
  },
  {
    "id": "x338",
    "name": "Kennesaw State",
    "conference": "Conference USA",
    "rating": 1.4
  },
  {
    "id": "x239",
    "name": "Baylor",
    "conference": "Big 12",
    "rating": 1.2
  },
  {
    "id": "x167",
    "name": "New Mexico",
    "conference": "Mountain West",
    "rating": 0.8
  },
  {
    "id": "x66",
    "name": "Iowa State",
    "conference": "Big 12",
    "rating": 0.8
  },
  {
    "id": "x151",
    "name": "East Carolina",
    "conference": "American Athletic",
    "rating": 0.3
  },
  {
    "id": "x326",
    "name": "Texas State",
    "conference": "Pac-12",
    "rating": -0.1
  },
  {
    "id": "x2711",
    "name": "Western Michigan",
    "conference": "Mid-American",
    "rating": -0.2
  },
  {
    "id": "x98",
    "name": "Western Kentucky",
    "conference": "Conference USA",
    "rating": -0.9
  },
  {
    "id": "x25",
    "name": "California",
    "conference": "ACC",
    "rating": -0.9
  },
  {
    "id": "x2348",
    "name": "Louisiana Tech",
    "conference": "Sun Belt",
    "rating": -0.9
  },
  {
    "id": "x328",
    "name": "Utah State",
    "conference": "Pac-12",
    "rating": -1.1
  },
  {
    "id": "x103",
    "name": "Boston College",
    "conference": "ACC",
    "rating": -1.9
  },
  {
    "id": "x38",
    "name": "Colorado",
    "conference": "Big 12",
    "rating": -2.3
  },
  {
    "id": "x276",
    "name": "Marshall",
    "conference": "Sun Belt",
    "rating": -2.3
  },
  {
    "id": "x259",
    "name": "Virginia Tech",
    "conference": "ACC",
    "rating": -3.6
  },
  {
    "id": "x278",
    "name": "Fresno State",
    "conference": "Pac-12",
    "rating": -4.4
  },
  {
    "id": "x2653",
    "name": "Troy",
    "conference": "Sun Belt",
    "rating": -4.7
  },
  {
    "id": "x2636",
    "name": "UTSA",
    "conference": "American Athletic",
    "rating": -5.1
  },
  {
    "id": "x2572",
    "name": "Southern Miss",
    "conference": "Sun Belt",
    "rating": -5.2
  },
  {
    "id": "x2623",
    "name": "Missouri State",
    "conference": "Conference USA",
    "rating": -6.5
  },
  {
    "id": "x23",
    "name": "San José State",
    "conference": "Mountain West",
    "rating": -7
  },
  {
    "id": "x195",
    "name": "Ohio",
    "conference": "Mid-American",
    "rating": -7.1
  },
  {
    "id": "x48",
    "name": "Delaware",
    "conference": "Conference USA",
    "rating": -8
  },
  {
    "id": "x6",
    "name": "South Alabama",
    "conference": "Sun Belt",
    "rating": -8
  },
  {
    "id": "x309",
    "name": "Louisiana",
    "conference": "Sun Belt",
    "rating": -8.2
  },
  {
    "id": "x2226",
    "name": "Florida Atlantic",
    "conference": "American Athletic",
    "rating": -9.4
  },
  {
    "id": "x2440",
    "name": "Nevada",
    "conference": "Mountain West",
    "rating": -9.8
  },
  {
    "id": "x218",
    "name": "Temple",
    "conference": "American Athletic",
    "rating": -10
  },
  {
    "id": "x5",
    "name": "UAB",
    "conference": "American Athletic",
    "rating": -11.8
  },
  {
    "id": "x202",
    "name": "Tulsa",
    "conference": "American Athletic",
    "rating": -11.9
  },
  {
    "id": "x197",
    "name": "Oklahoma State",
    "conference": "Big 12",
    "rating": -12.2
  },
  {
    "id": "x2199",
    "name": "Eastern Michigan",
    "conference": "Mid-American",
    "rating": -12.3
  },
  {
    "id": "x2459",
    "name": "Northern Illinois",
    "conference": "Mountain West",
    "rating": -13.6
  },
  {
    "id": "x2006",
    "name": "Akron",
    "conference": "Mid-American",
    "rating": -14.7
  },
  {
    "id": "x2084",
    "name": "Buffalo",
    "conference": "Mid-American",
    "rating": -14.8
  },
  {
    "id": "x2433",
    "name": "UL Monroe",
    "conference": "Sun Belt",
    "rating": -15.8
  },
  {
    "id": "x2638",
    "name": "UTEP",
    "conference": "Mountain West",
    "rating": -16.5
  },
  {
    "id": "x113",
    "name": "Massachusetts",
    "conference": "Mid-American",
    "rating": -17.7
  },
  {
    "id": "x189",
    "name": "Bowling Green",
    "conference": "Mid-American",
    "rating": -19.4
  },
  {
    "id": "x2050",
    "name": "Ball State",
    "conference": "Mid-American",
    "rating": -19.5
  },
  {
    "id": "x2429",
    "name": "Charlotte",
    "conference": "American Athletic",
    "rating": -20.4
  },
  {
    "id": "x2309",
    "name": "Kent State",
    "conference": "Mid-American",
    "rating": -24.3
  },
  {
    "id": "x2453",
    "name": "North Alabama",
    "conference": "UAC",
    "rating": -28.3
  },
  {
    "id": "x2634",
    "name": "Tennessee State",
    "conference": "OVC",
    "rating": -28.3
  },
  {
    "id": "x2754",
    "name": "Youngstown State",
    "conference": "MVFC",
    "rating": -28.3
  },
  {
    "id": "x2029",
    "name": "Arkansas-Pine Bluff",
    "conference": "SWAC",
    "rating": -28.3
  },
  {
    "id": "x231",
    "name": "Furman",
    "conference": "Southern",
    "rating": -28.3
  },
  {
    "id": "x2046",
    "name": "Austin Peay",
    "conference": "UAC",
    "rating": -28.3
  },
  {
    "id": "x2097",
    "name": "Campbell",
    "conference": "Coastal Athletic",
    "rating": -28.3
  },
  {
    "id": "x119",
    "name": "Towson",
    "conference": "Coastal Athletic",
    "rating": -28.3
  },
  {
    "id": "x2377",
    "name": "McNeese",
    "conference": "Southland",
    "rating": -28.3
  },
  {
    "id": "x2643",
    "name": "The Citadel",
    "conference": "Southern",
    "rating": -28.3
  },
  {
    "id": "x236",
    "name": "Chattanooga",
    "conference": "Southern",
    "rating": -28.3
  },
  {
    "id": "x2535",
    "name": "Samford",
    "conference": "Southern",
    "rating": -28.3
  },
  {
    "id": "x2747",
    "name": "Wofford",
    "conference": "Southern",
    "rating": -28.3
  },
  {
    "id": "x2635",
    "name": "Tennessee Tech",
    "conference": "Southern",
    "rating": -28.3
  },
  {
    "id": "x2197",
    "name": "Eastern Illinois",
    "conference": "OVC",
    "rating": -28.3
  },
  {
    "id": "x2261",
    "name": "Hampton",
    "conference": "Coastal Athletic",
    "rating": -28.3
  },
  {
    "id": "x2571",
    "name": "South Dakota State",
    "conference": "MVFC",
    "rating": -28.3
  },
  {
    "id": "x282",
    "name": "Indiana State",
    "conference": "MVFC",
    "rating": -28.3
  },
  {
    "id": "x47",
    "name": "Howard",
    "conference": "MEAC",
    "rating": -28.3
  },
  {
    "id": "x2710",
    "name": "Western Illinois",
    "conference": "OVC",
    "rating": -28.3
  },
  {
    "id": "x79",
    "name": "Southern Illinois",
    "conference": "MVFC",
    "rating": -28.3
  },
  {
    "id": "x155",
    "name": "North Dakota",
    "conference": "MVFC",
    "rating": -28.3
  },
  {
    "id": "x2502",
    "name": "Portland State",
    "conference": "Big Sky",
    "rating": -28.3
  },
  {
    "id": "x331",
    "name": "Eastern Washington",
    "conference": "Big Sky",
    "rating": -28.3
  },
  {
    "id": "x2460",
    "name": "Northern Iowa",
    "conference": "MVFC",
    "rating": -28.3
  }
];

export const CONFERENCE_GAMES: Game[] = [
  {
    "id": "401856674",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "UK",
    "awayId": "ALA",
    "conferenceGame": true
  },
  {
    "id": "401856686",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "ARK",
    "awayId": "UGA",
    "conferenceGame": true
  },
  {
    "id": "401856687",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "AUB",
    "awayId": "FLA",
    "conferenceGame": true
  },
  {
    "id": "401856688",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "MISS",
    "awayId": "LSU",
    "conferenceGame": true
  },
  {
    "id": "401856691",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "SC",
    "awayId": "MSST",
    "conferenceGame": true
  },
  {
    "id": "401856694",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "TAM",
    "awayId": "UK",
    "conferenceGame": true
  },
  {
    "id": "401858457",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "RUT",
    "awayId": "USC",
    "conferenceGame": true
  },
  {
    "id": "401858458",
    "week": 3,
    "date": "2026-09-20",
    "homeId": "UCLA",
    "awayId": "PUR",
    "conferenceGame": true
  },
  {
    "id": "401856696",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "ALA",
    "awayId": "SC",
    "conferenceGame": true
  },
  {
    "id": "401856698",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "AUB",
    "awayId": "VAN",
    "conferenceGame": true
  },
  {
    "id": "401856699",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "FLA",
    "awayId": "MISS",
    "conferenceGame": true
  },
  {
    "id": "401856700",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "UGA",
    "awayId": "OU",
    "conferenceGame": true
  },
  {
    "id": "401856702",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "LSU",
    "awayId": "TAM",
    "conferenceGame": true
  },
  {
    "id": "401856703",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "MSST",
    "awayId": "MIZ",
    "conferenceGame": true
  },
  {
    "id": "401856704",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "TENN",
    "awayId": "TEX",
    "conferenceGame": true
  },
  {
    "id": "401858461",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "IND",
    "awayId": "NW",
    "conferenceGame": true
  },
  {
    "id": "401858462",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "MD",
    "awayId": "UCLA",
    "conferenceGame": true
  },
  {
    "id": "401858463",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "MICH",
    "awayId": "IOWA",
    "conferenceGame": true
  },
  {
    "id": "401858464",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "MSU",
    "awayId": "NEB",
    "conferenceGame": true
  },
  {
    "id": "401858465",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "OSU",
    "awayId": "ILL",
    "conferenceGame": true
  },
  {
    "id": "401858466",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "PSU",
    "awayId": "WISC",
    "conferenceGame": true
  },
  {
    "id": "401858469",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "USC",
    "awayId": "ORE",
    "conferenceGame": true
  },
  {
    "id": "401858470",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "WASH",
    "awayId": "MINN",
    "conferenceGame": true
  },
  {
    "id": "401856705",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "UGA",
    "awayId": "VAN",
    "conferenceGame": true
  },
  {
    "id": "401856707",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "MSST",
    "awayId": "ALA",
    "conferenceGame": true
  },
  {
    "id": "401856708",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "MIZ",
    "awayId": "FLA",
    "conferenceGame": true
  },
  {
    "id": "401856709",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "SC",
    "awayId": "UK",
    "conferenceGame": true
  },
  {
    "id": "401856710",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "TENN",
    "awayId": "AUB",
    "conferenceGame": true
  },
  {
    "id": "401856711",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "TAM",
    "awayId": "ARK",
    "conferenceGame": true
  },
  {
    "id": "401858472",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "ILL",
    "awayId": "PUR",
    "conferenceGame": true
  },
  {
    "id": "401858473",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "IOWA",
    "awayId": "OSU",
    "conferenceGame": true
  },
  {
    "id": "401858474",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "MINN",
    "awayId": "MICH",
    "conferenceGame": true
  },
  {
    "id": "401858475",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "NEB",
    "awayId": "MD",
    "conferenceGame": true
  },
  {
    "id": "401858476",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "NW",
    "awayId": "PSU",
    "conferenceGame": true
  },
  {
    "id": "401858478",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "USC",
    "awayId": "WASH",
    "conferenceGame": true
  },
  {
    "id": "401858479",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "WISC",
    "awayId": "MSU",
    "conferenceGame": true
  },
  {
    "id": "401858477",
    "week": 5,
    "date": "2026-10-04",
    "homeId": "RUT",
    "awayId": "IND",
    "conferenceGame": true
  },
  {
    "id": "401856712",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "ALA",
    "awayId": "UGA",
    "conferenceGame": true
  },
  {
    "id": "401856713",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "ARK",
    "awayId": "TENN",
    "conferenceGame": true
  },
  {
    "id": "401856714",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "FLA",
    "awayId": "SC",
    "conferenceGame": true
  },
  {
    "id": "401856715",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "UK",
    "awayId": "LSU",
    "conferenceGame": true
  },
  {
    "id": "401856716",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "MIZ",
    "awayId": "TAM",
    "conferenceGame": true
  },
  {
    "id": "401856717",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "OU",
    "awayId": "TEX",
    "conferenceGame": true,
    "neutralSite": "Cotton Bowl"
  },
  {
    "id": "401856718",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "VAN",
    "awayId": "MISS",
    "conferenceGame": true
  },
  {
    "id": "401858480",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "MSU",
    "awayId": "ILL",
    "conferenceGame": true
  },
  {
    "id": "401858481",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "NEB",
    "awayId": "IND",
    "conferenceGame": true
  },
  {
    "id": "401858483",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "OSU",
    "awayId": "MD",
    "conferenceGame": true
  },
  {
    "id": "401858484",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "ORE",
    "awayId": "UCLA",
    "conferenceGame": true
  },
  {
    "id": "401858485",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "PSU",
    "awayId": "USC",
    "conferenceGame": true
  },
  {
    "id": "401858486",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "PUR",
    "awayId": "MINN",
    "conferenceGame": true
  },
  {
    "id": "401858487",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "WASH",
    "awayId": "IOWA",
    "conferenceGame": true
  },
  {
    "id": "401856719",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "UGA",
    "awayId": "AUB",
    "conferenceGame": true
  },
  {
    "id": "401856720",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "LSU",
    "awayId": "MSST",
    "conferenceGame": true
  },
  {
    "id": "401856721",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "MISS",
    "awayId": "MIZ",
    "conferenceGame": true
  },
  {
    "id": "401856722",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "OU",
    "awayId": "UK",
    "conferenceGame": true
  },
  {
    "id": "401856723",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "TENN",
    "awayId": "ALA",
    "conferenceGame": true
  },
  {
    "id": "401856724",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "TEX",
    "awayId": "FLA",
    "conferenceGame": true
  },
  {
    "id": "401856726",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "VAN",
    "awayId": "ARK",
    "conferenceGame": true
  },
  {
    "id": "401858488",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "IND",
    "awayId": "OSU",
    "conferenceGame": true
  },
  {
    "id": "401858489",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "MD",
    "awayId": "RUT",
    "conferenceGame": true
  },
  {
    "id": "401858490",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "MICH",
    "awayId": "PSU",
    "conferenceGame": true
  },
  {
    "id": "401858491",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "MSU",
    "awayId": "NW",
    "conferenceGame": true
  },
  {
    "id": "401858492",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "ORE",
    "awayId": "NEB",
    "conferenceGame": true
  },
  {
    "id": "401858493",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "PUR",
    "awayId": "WASH",
    "conferenceGame": true
  },
  {
    "id": "401858494",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "UCLA",
    "awayId": "WISC",
    "conferenceGame": true
  },
  {
    "id": "401856727",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "ALA",
    "awayId": "TAM",
    "conferenceGame": true
  },
  {
    "id": "401856728",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "AUB",
    "awayId": "LSU",
    "conferenceGame": true
  },
  {
    "id": "401856729",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "UK",
    "awayId": "VAN",
    "conferenceGame": true
  },
  {
    "id": "401856730",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "MSST",
    "awayId": "OU",
    "conferenceGame": true
  },
  {
    "id": "401856731",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "SC",
    "awayId": "TENN",
    "conferenceGame": true
  },
  {
    "id": "401856732",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "TEX",
    "awayId": "MISS",
    "conferenceGame": true
  },
  {
    "id": "401858495",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "ILL",
    "awayId": "ORE",
    "conferenceGame": true
  },
  {
    "id": "401858496",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "MICH",
    "awayId": "IND",
    "conferenceGame": true
  },
  {
    "id": "401858497",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "MINN",
    "awayId": "IOWA",
    "conferenceGame": true
  },
  {
    "id": "401858498",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "NW",
    "awayId": "RUT",
    "conferenceGame": true
  },
  {
    "id": "401858499",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "UCLA",
    "awayId": "MSU",
    "conferenceGame": true
  },
  {
    "id": "401858500",
    "week": 8,
    "date": "2026-10-24",
    "homeId": "WISC",
    "awayId": "USC",
    "conferenceGame": true
  },
  {
    "id": "401856733",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "ARK",
    "awayId": "MIZ",
    "conferenceGame": true
  },
  {
    "id": "401856734",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "UGA",
    "awayId": "FLA",
    "conferenceGame": true,
    "neutralSite": "Mercedes-Benz Stadium"
  },
  {
    "id": "401856735",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "MISS",
    "awayId": "AUB",
    "conferenceGame": true
  },
  {
    "id": "401856736",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "OU",
    "awayId": "SC",
    "conferenceGame": true
  },
  {
    "id": "401856737",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "TEX",
    "awayId": "MSST",
    "conferenceGame": true
  },
  {
    "id": "401858501",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "IND",
    "awayId": "MINN",
    "conferenceGame": true
  },
  {
    "id": "401858502",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "IOWA",
    "awayId": "WISC",
    "conferenceGame": true
  },
  {
    "id": "401858503",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "MD",
    "awayId": "ILL",
    "conferenceGame": true
  },
  {
    "id": "401858504",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "NEB",
    "awayId": "WASH",
    "conferenceGame": true
  },
  {
    "id": "401858505",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "ORE",
    "awayId": "NW",
    "conferenceGame": true
  },
  {
    "id": "401858506",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "PSU",
    "awayId": "PUR",
    "conferenceGame": true
  },
  {
    "id": "401858507",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "RUT",
    "awayId": "MICH",
    "conferenceGame": true
  },
  {
    "id": "401858509",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "USC",
    "awayId": "OSU",
    "conferenceGame": true
  },
  {
    "id": "401856738",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "AUB",
    "awayId": "ARK",
    "conferenceGame": true
  },
  {
    "id": "401856739",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "FLA",
    "awayId": "OU",
    "conferenceGame": true
  },
  {
    "id": "401856740",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "LSU",
    "awayId": "ALA",
    "conferenceGame": true
  },
  {
    "id": "401856741",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "MISS",
    "awayId": "UGA",
    "conferenceGame": true
  },
  {
    "id": "401856742",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "MSST",
    "awayId": "VAN",
    "conferenceGame": true
  },
  {
    "id": "401856743",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "MIZ",
    "awayId": "TEX",
    "conferenceGame": true
  },
  {
    "id": "401856744",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "SC",
    "awayId": "TAM",
    "conferenceGame": true
  },
  {
    "id": "401856745",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "TENN",
    "awayId": "UK",
    "conferenceGame": true
  },
  {
    "id": "401858510",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "ILL",
    "awayId": "NEB",
    "conferenceGame": true
  },
  {
    "id": "401858511",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "MICH",
    "awayId": "MSU",
    "conferenceGame": true
  },
  {
    "id": "401858512",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "MINN",
    "awayId": "UCLA",
    "conferenceGame": true
  },
  {
    "id": "401858513",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "NW",
    "awayId": "IOWA",
    "conferenceGame": true
  },
  {
    "id": "401858514",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "OSU",
    "awayId": "ORE",
    "conferenceGame": true
  },
  {
    "id": "401858515",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "PUR",
    "awayId": "MD",
    "conferenceGame": true
  },
  {
    "id": "401858516",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "WASH",
    "awayId": "PSU",
    "conferenceGame": true
  },
  {
    "id": "401858517",
    "week": 10,
    "date": "2026-11-07",
    "homeId": "WISC",
    "awayId": "RUT",
    "conferenceGame": true
  },
  {
    "id": "401856882",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "ARK",
    "awayId": "SC",
    "conferenceGame": true
  },
  {
    "id": "401856883",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "UGA",
    "awayId": "MIZ",
    "conferenceGame": true
  },
  {
    "id": "401856884",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "UK",
    "awayId": "FLA",
    "conferenceGame": true
  },
  {
    "id": "401856885",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "LSU",
    "awayId": "TEX",
    "conferenceGame": true
  },
  {
    "id": "401856886",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "MSST",
    "awayId": "AUB",
    "conferenceGame": true
  },
  {
    "id": "401856887",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "OU",
    "awayId": "MISS",
    "conferenceGame": true
  },
  {
    "id": "401856888",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "TAM",
    "awayId": "TENN",
    "conferenceGame": true
  },
  {
    "id": "401856889",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "VAN",
    "awayId": "ALA",
    "conferenceGame": true
  },
  {
    "id": "401858518",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "IND",
    "awayId": "USC",
    "conferenceGame": true
  },
  {
    "id": "401858519",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "IOWA",
    "awayId": "PUR",
    "conferenceGame": true
  },
  {
    "id": "401858520",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "MD",
    "awayId": "WISC",
    "conferenceGame": true
  },
  {
    "id": "401858521",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "MSU",
    "awayId": "WASH",
    "conferenceGame": true
  },
  {
    "id": "401858522",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "OSU",
    "awayId": "NW",
    "conferenceGame": true
  },
  {
    "id": "401858523",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "ORE",
    "awayId": "MICH",
    "conferenceGame": true
  },
  {
    "id": "401858524",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "PSU",
    "awayId": "MINN",
    "conferenceGame": true
  },
  {
    "id": "401858525",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "RUT",
    "awayId": "NEB",
    "conferenceGame": true
  },
  {
    "id": "401858526",
    "week": 11,
    "date": "2026-11-14",
    "homeId": "UCLA",
    "awayId": "ILL",
    "conferenceGame": true
  },
  {
    "id": "401856748",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "FLA",
    "awayId": "VAN",
    "conferenceGame": true
  },
  {
    "id": "401856751",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "MIZ",
    "awayId": "UK",
    "conferenceGame": true
  },
  {
    "id": "401856752",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "OU",
    "awayId": "TAM",
    "conferenceGame": true
  },
  {
    "id": "401856753",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "SC",
    "awayId": "UGA",
    "conferenceGame": true
  },
  {
    "id": "401856754",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "TENN",
    "awayId": "LSU",
    "conferenceGame": true
  },
  {
    "id": "401856755",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "TEX",
    "awayId": "ARK",
    "conferenceGame": true
  },
  {
    "id": "401858527",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "ILL",
    "awayId": "IOWA",
    "conferenceGame": true
  },
  {
    "id": "401858528",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "MICH",
    "awayId": "UCLA",
    "conferenceGame": true
  },
  {
    "id": "401858529",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "MSU",
    "awayId": "ORE",
    "conferenceGame": true
  },
  {
    "id": "401858530",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "MINN",
    "awayId": "NW",
    "conferenceGame": true
  },
  {
    "id": "401858531",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "NEB",
    "awayId": "OSU",
    "conferenceGame": true
  },
  {
    "id": "401858532",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "PSU",
    "awayId": "RUT",
    "conferenceGame": true
  },
  {
    "id": "401858533",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "PUR",
    "awayId": "WISC",
    "conferenceGame": true
  },
  {
    "id": "401858534",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "USC",
    "awayId": "MD",
    "conferenceGame": true
  },
  {
    "id": "401858535",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "WASH",
    "awayId": "IND",
    "conferenceGame": true
  },
  {
    "id": "401856762",
    "week": 13,
    "date": "2026-11-27",
    "homeId": "MISS",
    "awayId": "MSST",
    "conferenceGame": true
  },
  {
    "id": "401858536",
    "week": 13,
    "date": "2026-11-27",
    "homeId": "IOWA",
    "awayId": "NEB",
    "conferenceGame": true
  },
  {
    "id": "401856756",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "TAM",
    "awayId": "TEX",
    "conferenceGame": true
  },
  {
    "id": "401856757",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "ALA",
    "awayId": "AUB",
    "conferenceGame": true
  },
  {
    "id": "401856758",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "ARK",
    "awayId": "LSU",
    "conferenceGame": true
  },
  {
    "id": "401856763",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "MIZ",
    "awayId": "OU",
    "conferenceGame": true
  },
  {
    "id": "401856765",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "VAN",
    "awayId": "TENN",
    "conferenceGame": true
  },
  {
    "id": "401858537",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "NW",
    "awayId": "ILL",
    "conferenceGame": true
  },
  {
    "id": "401858538",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "IND",
    "awayId": "PUR",
    "conferenceGame": true
  },
  {
    "id": "401858539",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "MD",
    "awayId": "PSU",
    "conferenceGame": true
  },
  {
    "id": "401858540",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "OSU",
    "awayId": "MICH",
    "conferenceGame": true
  },
  {
    "id": "401858541",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "ORE",
    "awayId": "WASH",
    "conferenceGame": true
  },
  {
    "id": "401858542",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "RUT",
    "awayId": "MSU",
    "conferenceGame": true
  },
  {
    "id": "401858543",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "UCLA",
    "awayId": "USC",
    "conferenceGame": true
  },
  {
    "id": "401858544",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "WISC",
    "awayId": "MINN",
    "conferenceGame": true
  }
];

export const NON_CONFERENCE_GAMES: Game[] = [
  {
    "id": "401864494",
    "week": 1,
    "date": "2026-08-29",
    "homeId": "USC",
    "awayId": "x23",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 42,
    "awayPoints": 26
  },
  {
    "id": "401858423",
    "week": 1,
    "date": "2026-09-03",
    "homeId": "RUT",
    "awayId": "x113",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 21,
    "awayPoints": 37
  },
  {
    "id": "401856663",
    "week": 1,
    "date": "2026-09-04",
    "homeId": "MIZ",
    "awayId": "x2029",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 54,
    "awayPoints": 14
  },
  {
    "id": "401858422",
    "week": 1,
    "date": "2026-09-04",
    "homeId": "MINN",
    "awayId": "x2197",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 59,
    "awayPoints": 7
  },
  {
    "id": "401858424",
    "week": 1,
    "date": "2026-09-04",
    "homeId": "ILL",
    "awayId": "x5",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 42,
    "awayPoints": 23
  },
  {
    "id": "401858435",
    "week": 1,
    "date": "2026-09-04",
    "homeId": "PUR",
    "awayId": "x282",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 44,
    "awayPoints": 19
  },
  {
    "id": "401856634",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "ALA",
    "awayId": "x151",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 48,
    "awayPoints": 10
  },
  {
    "id": "401856635",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "ARK",
    "awayId": "x2453",
    "conferenceGame": false
  },
  {
    "id": "401856636",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "AUB",
    "awayId": "x239",
    "conferenceGame": false,
    "neutralSite": "Mercedes-Benz Stadium"
  },
  {
    "id": "401856637",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "FLA",
    "awayId": "x2226",
    "conferenceGame": false
  },
  {
    "id": "401856658",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "UGA",
    "awayId": "x2634",
    "conferenceGame": false
  },
  {
    "id": "401856659",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "UK",
    "awayId": "x2754",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 45,
    "awayPoints": 13
  },
  {
    "id": "401856660",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "LSU",
    "awayId": "x228",
    "conferenceGame": false
  },
  {
    "id": "401856662",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "MSST",
    "awayId": "x2433",
    "conferenceGame": false
  },
  {
    "id": "401856664",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "OU",
    "awayId": "x2638",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 51,
    "awayPoints": 0
  },
  {
    "id": "401856665",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "SC",
    "awayId": "x2309",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 57,
    "awayPoints": 0
  },
  {
    "id": "401856666",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "TENN",
    "awayId": "x231",
    "conferenceGame": false
  },
  {
    "id": "401856667",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "TEX",
    "awayId": "x326",
    "conferenceGame": false
  },
  {
    "id": "401856668",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "TAM",
    "awayId": "x2623",
    "conferenceGame": false
  },
  {
    "id": "401856669",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "VAN",
    "awayId": "x2046",
    "conferenceGame": false
  },
  {
    "id": "401858425",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "IND",
    "awayId": "x249",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 52,
    "awayPoints": 16
  },
  {
    "id": "401858426",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "IOWA",
    "awayId": "x2459",
    "conferenceGame": false
  },
  {
    "id": "401858428",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "MICH",
    "awayId": "x2711",
    "conferenceGame": false
  },
  {
    "id": "401858429",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "MSU",
    "awayId": "x2649",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 30,
    "awayPoints": 20
  },
  {
    "id": "401858430",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "NEB",
    "awayId": "x195",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 49,
    "awayPoints": 21
  },
  {
    "id": "401858432",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "OSU",
    "awayId": "x2050",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 56,
    "awayPoints": 3
  },
  {
    "id": "401858433",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "ORE",
    "awayId": "x68",
    "conferenceGame": false
  },
  {
    "id": "401858434",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "PSU",
    "awayId": "x276",
    "conferenceGame": false
  },
  {
    "id": "401858436",
    "week": 1,
    "date": "2026-09-05",
    "homeId": "USC",
    "awayId": "x278",
    "conferenceGame": false,
    "completed": true,
    "homePoints": 39,
    "awayPoints": 0
  },
  {
    "id": "401856661",
    "week": 1,
    "date": "2026-09-06",
    "homeId": "MISS",
    "awayId": "x97",
    "conferenceGame": false,
    "neutralSite": "Nissan Stadium"
  },
  {
    "id": "401858210",
    "week": 1,
    "date": "2026-09-06",
    "homeId": "x25",
    "awayId": "UCLA",
    "conferenceGame": false
  },
  {
    "id": "401858427",
    "week": 1,
    "date": "2026-09-06",
    "homeId": "MD",
    "awayId": "x2261",
    "conferenceGame": false
  },
  {
    "id": "401858431",
    "week": 1,
    "date": "2026-09-06",
    "homeId": "NW",
    "awayId": "x2571",
    "conferenceGame": false
  },
  {
    "id": "401858437",
    "week": 1,
    "date": "2026-09-06",
    "homeId": "WASH",
    "awayId": "x265",
    "conferenceGame": false
  },
  {
    "id": "401858438",
    "week": 1,
    "date": "2026-09-06",
    "homeId": "x87",
    "awayId": "WISC",
    "conferenceGame": false,
    "neutralSite": "Lambeau Field"
  },
  {
    "id": "401858214",
    "week": 2,
    "date": "2026-09-11",
    "homeId": "x103",
    "awayId": "RUT",
    "conferenceGame": false
  },
  {
    "id": "401856671",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "AUB",
    "awayId": "x2572",
    "conferenceGame": false
  },
  {
    "id": "401856672",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "FLA",
    "awayId": "x2097",
    "conferenceGame": false
  },
  {
    "id": "401856673",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "UGA",
    "awayId": "x98",
    "conferenceGame": false
  },
  {
    "id": "401856676",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "MISS",
    "awayId": "x2429",
    "conferenceGame": false
  },
  {
    "id": "401856677",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "MINN",
    "awayId": "MSST",
    "conferenceGame": false
  },
  {
    "id": "401856678",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "x2305",
    "awayId": "MIZ",
    "conferenceGame": false
  },
  {
    "id": "401856679",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "MICH",
    "awayId": "OU",
    "conferenceGame": false
  },
  {
    "id": "401856680",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "SC",
    "awayId": "x119",
    "conferenceGame": false
  },
  {
    "id": "401856681",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "x59",
    "awayId": "TENN",
    "conferenceGame": false
  },
  {
    "id": "401856682",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "TEX",
    "awayId": "OSU",
    "conferenceGame": false
  },
  {
    "id": "401856683",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "TAM",
    "awayId": "x9",
    "conferenceGame": false
  },
  {
    "id": "401856684",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "VAN",
    "awayId": "x48",
    "conferenceGame": false
  },
  {
    "id": "401856782",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "x197",
    "awayId": "ORE",
    "conferenceGame": false
  },
  {
    "id": "401856788",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "IOWA",
    "awayId": "x66",
    "conferenceGame": false
  },
  {
    "id": "401858217",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "ILL",
    "awayId": "x150",
    "conferenceGame": false
  },
  {
    "id": "401858224",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "PUR",
    "awayId": "x154",
    "conferenceGame": false
  },
  {
    "id": "401858439",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "IND",
    "awayId": "x47",
    "conferenceGame": false
  },
  {
    "id": "401858440",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "MSU",
    "awayId": "x2199",
    "conferenceGame": false
  },
  {
    "id": "401858441",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "NEB",
    "awayId": "x189",
    "conferenceGame": false
  },
  {
    "id": "401858442",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "x218",
    "awayId": "PSU",
    "conferenceGame": false
  },
  {
    "id": "401858443",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "UCLA",
    "awayId": "x21",
    "conferenceGame": false
  },
  {
    "id": "401858444",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "x41",
    "awayId": "MD",
    "conferenceGame": false
  },
  {
    "id": "401858446",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "WASH",
    "awayId": "x328",
    "conferenceGame": false
  },
  {
    "id": "401858447",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "WISC",
    "awayId": "x2710",
    "conferenceGame": false
  },
  {
    "id": "401867796",
    "week": 2,
    "date": "2026-09-12",
    "homeId": "LSU",
    "awayId": "x2348",
    "conferenceGame": false
  },
  {
    "id": "401856670",
    "week": 2,
    "date": "2026-09-13",
    "homeId": "x254",
    "awayId": "ARK",
    "conferenceGame": false
  },
  {
    "id": "401858445",
    "week": 2,
    "date": "2026-09-13",
    "homeId": "USC",
    "awayId": "x309",
    "conferenceGame": false
  },
  {
    "id": "401856685",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "ALA",
    "awayId": "x52",
    "conferenceGame": false
  },
  {
    "id": "401856689",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "MIZ",
    "awayId": "x2653",
    "conferenceGame": false
  },
  {
    "id": "401856690",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "OU",
    "awayId": "x167",
    "conferenceGame": false
  },
  {
    "id": "401856692",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "TENN",
    "awayId": "x338",
    "conferenceGame": false
  },
  {
    "id": "401856695",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "VAN",
    "awayId": "x152",
    "conferenceGame": false
  },
  {
    "id": "401856796",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "NW",
    "awayId": "x38",
    "conferenceGame": false
  },
  {
    "id": "401858232",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "MD",
    "awayId": "x259",
    "conferenceGame": false
  },
  {
    "id": "401858448",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "ILL",
    "awayId": "x79",
    "conferenceGame": false
  },
  {
    "id": "401858449",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "IND",
    "awayId": "x98",
    "conferenceGame": false
  },
  {
    "id": "401858450",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "MICH",
    "awayId": "x2638",
    "conferenceGame": false
  },
  {
    "id": "401858451",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "MINN",
    "awayId": "x2006",
    "conferenceGame": false
  },
  {
    "id": "401858452",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "NEB",
    "awayId": "x155",
    "conferenceGame": false
  },
  {
    "id": "401858453",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "x87",
    "awayId": "MSU",
    "conferenceGame": false
  },
  {
    "id": "401858454",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "OSU",
    "awayId": "x2309",
    "conferenceGame": false
  },
  {
    "id": "401858455",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "ORE",
    "awayId": "x2502",
    "conferenceGame": false
  },
  {
    "id": "401858456",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "PSU",
    "awayId": "x2084",
    "conferenceGame": false
  },
  {
    "id": "401858459",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "WASH",
    "awayId": "x331",
    "conferenceGame": false
  },
  {
    "id": "401858460",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "WISC",
    "awayId": "x2199",
    "conferenceGame": false
  },
  {
    "id": "401858471",
    "week": 3,
    "date": "2026-09-19",
    "homeId": "IOWA",
    "awayId": "x2460",
    "conferenceGame": false
  },
  {
    "id": "401856693",
    "week": 3,
    "date": "2026-09-20",
    "homeId": "TEX",
    "awayId": "x2636",
    "conferenceGame": false
  },
  {
    "id": "401858468",
    "week": 4,
    "date": "2026-09-25",
    "homeId": "RUT",
    "awayId": "x47",
    "conferenceGame": false
  },
  {
    "id": "401858467",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "PUR",
    "awayId": "x87",
    "conferenceGame": false
  },
  {
    "id": "401864576",
    "week": 4,
    "date": "2026-09-26",
    "homeId": "UK",
    "awayId": "x6",
    "conferenceGame": false
  },
  {
    "id": "401856697",
    "week": 4,
    "date": "2026-09-27",
    "homeId": "ARK",
    "awayId": "x202",
    "conferenceGame": false
  },
  {
    "id": "401856706",
    "week": 5,
    "date": "2026-10-03",
    "homeId": "LSU",
    "awayId": "x2377",
    "conferenceGame": false
  },
  {
    "id": "401858482",
    "week": 6,
    "date": "2026-10-10",
    "homeId": "NW",
    "awayId": "x2050",
    "conferenceGame": false
  },
  {
    "id": "401856725",
    "week": 7,
    "date": "2026-10-17",
    "homeId": "TAM",
    "awayId": "x2643",
    "conferenceGame": false
  },
  {
    "id": "401858508",
    "week": 9,
    "date": "2026-10-31",
    "homeId": "UCLA",
    "awayId": "x2440",
    "conferenceGame": false
  },
  {
    "id": "401856746",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "ALA",
    "awayId": "x236",
    "conferenceGame": false
  },
  {
    "id": "401856747",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "AUB",
    "awayId": "x2535",
    "conferenceGame": false
  },
  {
    "id": "401856749",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "MISS",
    "awayId": "x2747",
    "conferenceGame": false
  },
  {
    "id": "401856750",
    "week": 12,
    "date": "2026-11-21",
    "homeId": "MSST",
    "awayId": "x2635",
    "conferenceGame": false
  },
  {
    "id": "401856759",
    "week": 13,
    "date": "2026-11-27",
    "homeId": "x52",
    "awayId": "FLA",
    "conferenceGame": false
  },
  {
    "id": "401856760",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "UGA",
    "awayId": "x59",
    "conferenceGame": false
  },
  {
    "id": "401856761",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "UK",
    "awayId": "x97",
    "conferenceGame": false
  },
  {
    "id": "401856764",
    "week": 13,
    "date": "2026-11-28",
    "homeId": "x228",
    "awayId": "SC",
    "conferenceGame": false
  }
];
