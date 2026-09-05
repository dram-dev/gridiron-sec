import type { Game, NonConferenceOpponent, WeekMeta } from './types';

/* ============================================================================
 * 2026 — the SEC's first nine-game conference season.
 *
 * No divisions. Each school plays three annual opponents plus six rotating,
 * and the top two by conference winning percentage meet in Atlanta on 5 Dec.
 * Every conference game below was reconciled across both participants'
 * published schedules; `verifySchedule` in engine/schedule.ts re-checks the
 * invariants (72 games, nine per team, no double-bookings) at test time.
 * ========================================================================== */

export const WEEKS: WeekMeta[] = [
  { week: 1, date: '2026-09-05', label: 'Sep 5' },
  { week: 2, date: '2026-09-12', label: 'Sep 12' },
  { week: 3, date: '2026-09-19', label: 'Sep 19' },
  { week: 4, date: '2026-09-26', label: 'Sep 26' },
  { week: 5, date: '2026-10-03', label: 'Oct 3' },
  { week: 6, date: '2026-10-10', label: 'Oct 10' },
  { week: 7, date: '2026-10-17', label: 'Oct 17' },
  { week: 8, date: '2026-10-24', label: 'Oct 24' },
  { week: 9, date: '2026-10-31', label: 'Oct 31' },
  { week: 10, date: '2026-11-07', label: 'Nov 7' },
  { week: 11, date: '2026-11-14', label: 'Nov 14' },
  { week: 12, date: '2026-11-21', label: 'Nov 21' },
  { week: 13, date: '2026-11-28', label: 'Nov 28' },
];

export const CHAMPIONSHIP = {
  date: '2026-12-05',
  venue: 'Mercedes-Benz Stadium',
  city: 'Atlanta, GA',
};

/** Non-conference opponents, rated in the same points-above-average units. */
export const NON_CONFERENCE: NonConferenceOpponent[] = [
  { id: 'OSU', name: 'Ohio State', conference: 'Big Ten', rating: 30.0 },
  { id: 'CLEM', name: 'Clemson', conference: 'ACC', rating: 18.5 },
  { id: 'MICH', name: 'Michigan', conference: 'Big Ten', rating: 17.0 },
  { id: 'FSU', name: 'Florida State', conference: 'ACC', rating: 14.0 },
  { id: 'LOU', name: 'Louisville', conference: 'ACC', rating: 13.0 },
  { id: 'UTAH', name: 'Utah', conference: 'Big 12', rating: 12.0 },
  { id: 'GT', name: 'Georgia Tech', conference: 'ACC', rating: 11.0 },
  { id: 'ASU', name: 'Arizona State', conference: 'Big 12', rating: 10.5 },
  { id: 'BAY', name: 'Baylor', conference: 'Big 12', rating: 9.0 },
  { id: 'USF', name: 'South Florida', conference: 'American', rating: 8.0 },
  { id: 'KU', name: 'Kansas', conference: 'Big 12', rating: 7.0 },
  { id: 'MINN', name: 'Minnesota', conference: 'Big Ten', rating: 6.5 },
  { id: 'NCST', name: 'NC State', conference: 'ACC', rating: 6.0 },
  { id: 'TXST', name: 'Texas State', conference: 'Sun Belt', rating: 2.0 },
  { id: 'UTSA', name: 'UTSA', conference: 'American', rating: 1.0 },
  { id: 'ECU', name: 'East Carolina', conference: 'American', rating: 0.5 },
  { id: 'TROY', name: 'Troy', conference: 'Sun Belt', rating: -2.0 },
  { id: 'USA', name: 'South Alabama', conference: 'Sun Belt', rating: -3.0 },
  { id: 'TULSA', name: 'Tulsa', conference: 'American', rating: -6.0 },
  { id: 'WKU', name: 'Western Kentucky', conference: 'Conference USA', rating: -6.0 },
  { id: 'FAU', name: 'Florida Atlantic', conference: 'American', rating: -8.0 },
  { id: 'USM', name: 'Southern Miss', conference: 'Sun Belt', rating: -9.0 },
  { id: 'LATECH', name: 'Louisiana Tech', conference: 'Conference USA', rating: -10.0 },
  { id: 'CHAR', name: 'Charlotte', conference: 'American', rating: -12.0 },
  { id: 'NM', name: 'New Mexico', conference: 'Mountain West', rating: -13.5 },
  { id: 'KENN', name: 'Kennesaw State', conference: 'Conference USA', rating: -14.0 },
  { id: 'DEL', name: 'Delaware', conference: 'Conference USA', rating: -14.5 },
  { id: 'ULM', name: 'Louisiana–Monroe', conference: 'Sun Belt', rating: -16.0 },
  { id: 'UTEP', name: 'UTEP', conference: 'Conference USA', rating: -18.0 },
  { id: 'MOST', name: 'Missouri State', conference: 'Conference USA', rating: -18.5 },
  { id: 'KENT', name: 'Kent State', conference: 'MAC', rating: -20.0 },
  { id: 'YSU', name: 'Youngstown State', conference: 'FCS', rating: -26.0 },
  { id: 'TOW', name: 'Towson', conference: 'FCS', rating: -28.0 },
  { id: 'UNA', name: 'North Alabama', conference: 'FCS', rating: -28.0 },
  { id: 'APSU', name: 'Austin Peay', conference: 'FCS', rating: -29.0 },
  { id: 'TNST', name: 'Tennessee State', conference: 'FCS', rating: -30.0 },
  { id: 'FUR', name: 'Furman', conference: 'FCS', rating: -30.0 },
  { id: 'MCN', name: 'McNeese', conference: 'FCS', rating: -30.0 },
  { id: 'CIT', name: 'The Citadel', conference: 'FCS', rating: -30.5 },
  { id: 'SAM', name: 'Samford', conference: 'FCS', rating: -30.5 },
  { id: 'CAMP', name: 'Campbell', conference: 'FCS', rating: -31.0 },
  { id: 'WOF', name: 'Wofford', conference: 'FCS', rating: -32.0 },
  { id: 'TNTC', name: 'Tennessee Tech', conference: 'FCS', rating: -32.0 },
  { id: 'UAPB', name: 'Arkansas–Pine Bluff', conference: 'FCS', rating: -38.0 },
];

export const NON_CONF_BY_ID = Object.fromEntries(NON_CONFERENCE.map((o) => [o.id, o]));

const g = (
  week: number,
  awayId: string,
  homeId: string,
  conferenceGame: boolean,
  extra: Partial<Game> = {},
): Game => ({
  id: `w${week}-${awayId}-${homeId}`,
  week,
  date: WEEKS[week - 1].date,
  awayId,
  homeId,
  conferenceGame,
  ...extra,
});

/* -------------------------------------------------------------------------- */
/* Conference schedule — 72 games                                             */
/* -------------------------------------------------------------------------- */

export const CONFERENCE_GAMES: Game[] = [
  g(2, 'ALA', 'UK', true, { headline: true }),

  g(3, 'UGA', 'ARK', true),
  g(3, 'LSU', 'MISS', true, { rivalry: 'Kiffin’s return to Oxford', headline: true }),
  g(3, 'UK', 'TAM', true),
  g(3, 'MSST', 'SC', true),
  g(3, 'FLA', 'AUB', true),

  g(4, 'OU', 'UGA', true, { headline: true }),
  g(4, 'TAM', 'LSU', true, { headline: true }),
  g(4, 'MISS', 'FLA', true),
  g(4, 'SC', 'ALA', true),
  g(4, 'TEX', 'TENN', true, { headline: true }),
  g(4, 'VAN', 'AUB', true),
  g(4, 'MIZ', 'MSST', true),

  g(5, 'ALA', 'MSST', true),
  g(5, 'VAN', 'UGA', true),
  g(5, 'AUB', 'TENN', true),
  g(5, 'ARK', 'TAM', true),
  g(5, 'FLA', 'MIZ', true),
  g(5, 'UK', 'SC', true),

  g(6, 'UGA', 'ALA', true, { rivalry: 'The league’s marquee regular-season game', headline: true }),
  g(6, 'LSU', 'UK', true),
  g(6, 'OU', 'TEX', true, { neutralSite: 'Cotton Bowl Stadium, Dallas', rivalry: 'Red River Rivalry', headline: true }),
  g(6, 'MISS', 'VAN', true),
  g(6, 'TENN', 'ARK', true),
  g(6, 'TAM', 'MIZ', true),
  g(6, 'SC', 'FLA', true),

  g(7, 'AUB', 'UGA', true, { rivalry: 'Deep South’s Oldest Rivalry' }),
  g(7, 'MSST', 'LSU', true),
  g(7, 'ALA', 'TENN', true, { rivalry: 'Third Saturday in October', headline: true }),
  g(7, 'MIZ', 'MISS', true),
  g(7, 'FLA', 'TEX', true),
  g(7, 'ARK', 'VAN', true),
  g(7, 'UK', 'OU', true),

  g(8, 'TAM', 'ALA', true, { headline: true }),
  g(8, 'LSU', 'AUB', true),
  g(8, 'TENN', 'SC', true),
  g(8, 'MISS', 'TEX', true, { headline: true }),
  g(8, 'OU', 'MSST', true, { rivalry: 'First meeting between the programs' }),
  g(8, 'VAN', 'UK', true),

  g(9, 'FLA', 'UGA', true, {
    neutralSite: 'Mercedes-Benz Stadium, Atlanta',
    rivalry: 'World’s Largest Outdoor Cocktail Party — in Atlanta while Jacksonville is renovated',
    headline: true,
  }),
  g(9, 'AUB', 'MISS', true),
  g(9, 'MSST', 'TEX', true),
  g(9, 'SC', 'OU', true),
  g(9, 'MIZ', 'ARK', true, { rivalry: 'Battle Line Rivalry' }),

  g(10, 'ALA', 'LSU', true, { rivalry: 'Saturday night in Death Valley', headline: true }),
  g(10, 'UGA', 'MISS', true, { headline: true }),
  g(10, 'UK', 'TENN', true),
  g(10, 'TAM', 'SC', true),
  g(10, 'OU', 'FLA', true, { rivalry: 'First regular-season meeting' }),
  g(10, 'VAN', 'MSST', true),
  g(10, 'TEX', 'MIZ', true),
  g(10, 'ARK', 'AUB', true),

  g(11, 'MIZ', 'UGA', true),
  g(11, 'ALA', 'VAN', true),
  g(11, 'AUB', 'MSST', true),
  g(11, 'MISS', 'OU', true, { headline: true }),
  g(11, 'TENN', 'TAM', true),
  g(11, 'TEX', 'LSU', true, { headline: true }),
  g(11, 'FLA', 'UK', true, { rivalry: 'Sumrall returns to his alma mater' }),
  g(11, 'SC', 'ARK', true),

  g(12, 'UGA', 'SC', true),
  g(12, 'ARK', 'TEX', true, { rivalry: 'Southwest Classic renewed' }),
  g(12, 'LSU', 'TENN', true),
  g(12, 'TAM', 'OU', true),
  g(12, 'UK', 'MIZ', true),
  g(12, 'VAN', 'FLA', true),

  g(13, 'AUB', 'ALA', true, { rivalry: 'Iron Bowl', headline: true }),
  g(13, 'LSU', 'ARK', true, { rivalry: 'Battle for the Golden Boot' }),
  g(13, 'MSST', 'MISS', true, { rivalry: 'Egg Bowl' }),
  g(13, 'TEX', 'TAM', true, { rivalry: 'Lone Star Showdown — Black Friday', headline: true }),
  g(13, 'TENN', 'VAN', true),
  g(13, 'OU', 'MIZ', true),
];

/* -------------------------------------------------------------------------- */
/* Non-conference schedule                                                    */
/* -------------------------------------------------------------------------- */

export const NON_CONFERENCE_GAMES: Game[] = [
  // Week 1
  g(1, 'TNST', 'UGA', false),
  g(1, 'TXST', 'TEX', false),
  g(1, 'MOST', 'TAM', false),
  g(1, 'CLEM', 'LSU', false, { headline: true }),
  g(1, 'UTEP', 'OU', false),
  g(1, 'ECU', 'ALA', false),
  g(1, 'FUR', 'TENN', false),
  g(1, 'LOU', 'MISS', false, { neutralSite: 'Nissan Stadium, Nashville' }),
  g(1, 'UAPB', 'MIZ', false),
  g(1, 'FAU', 'FLA', false),
  g(1, 'BAY', 'AUB', false, { neutralSite: 'Mercedes-Benz Stadium, Atlanta' }),
  g(1, 'KENT', 'SC', false),
  g(1, 'APSU', 'VAN', false),
  g(1, 'YSU', 'UK', false),
  g(1, 'ULM', 'MSST', false),
  g(1, 'UNA', 'ARK', false),
  // Week 2
  g(2, 'WKU', 'UGA', false),
  g(2, 'OSU', 'TEX', false, { headline: true }),
  g(2, 'ASU', 'TAM', false),
  g(2, 'LATECH', 'LSU', false),
  g(2, 'OU', 'MICH', false, { headline: true }),
  g(2, 'TENN', 'GT', false),
  g(2, 'CHAR', 'MISS', false),
  g(2, 'MIZ', 'KU', false),
  g(2, 'CAMP', 'FLA', false),
  g(2, 'USM', 'AUB', false),
  g(2, 'TOW', 'SC', false),
  g(2, 'DEL', 'VAN', false),
  g(2, 'MSST', 'MINN', false),
  g(2, 'ARK', 'UTAH', false),
  // Week 3
  g(3, 'UTSA', 'TEX', false),
  g(3, 'FSU', 'ALA', false, { headline: true }),
  g(3, 'KENN', 'TENN', false),
  g(3, 'TROY', 'MIZ', false),
  g(3, 'NCST', 'VAN', false),
  g(3, 'NM', 'OU', false),
  // Week 4
  g(4, 'USA', 'UK', false),
  g(4, 'TULSA', 'ARK', false),
  // Week 5
  g(5, 'MCN', 'LSU', false),
  // Week 7
  g(7, 'CIT', 'TAM', false),
  // Week 12
  g(12, 'USF', 'ALA', false),
  g(12, 'WOF', 'MISS', false),
  g(12, 'SAM', 'AUB', false),
  g(12, 'TNTC', 'MSST', false),
  // Week 13 — rivalry week
  g(13, 'GT', 'UGA', false, { rivalry: 'Clean, Old-Fashioned Hate' }),
  g(13, 'FSU', 'FLA', false, { rivalry: 'Sunshine Showdown' }),
  g(13, 'LOU', 'UK', false, { rivalry: 'Governor’s Cup' }),
  g(13, 'SC', 'CLEM', false, { rivalry: 'Palmetto Bowl' }),
];

export const ALL_GAMES: Game[] = [...CONFERENCE_GAMES, ...NON_CONFERENCE_GAMES].sort(
  (a, b) => a.week - b.week || a.id.localeCompare(b.id),
);

export const GAME_BY_ID = Object.fromEntries(ALL_GAMES.map((x) => [x.id, x]));
