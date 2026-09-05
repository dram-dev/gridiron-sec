import type { DatasetMeta } from './types';

export const DATASET: DatasetMeta = {
  season: 2026,
  compiled: '2026-09-05',
  sources: [
    { label: 'SEC 2026 schedule release (nine-game format, annual opponents)', url: 'https://www.cbssports.com/college-football/news/sec-football-schedule-league-releases-every-game-for-2026-29-with-three-annual-opponents-for-each-team', covers: 'Conference structure and annual opponents' },
    { label: 'Team schedule releases — all sixteen athletic departments', url: 'https://www.secsports.com/', covers: 'Week-by-week opponents, sites and dates' },
    { label: '2026 Preseason Coaches All-SEC Team (first, second and third team)', url: 'https://www.on3.com/news/2026-preseason-coaches-all-sec-football-team-revealed-ahead-of-season/', covers: 'Verified player identities and accolades' },
    { label: 'Announced Week 1 starting quarterbacks, all sixteen teams', url: 'https://www.si.com/fannation/college/cfb-hq/news/sec-week-1-starting-quarterback-projections-all-16-teams-2026-alabama-arkansas-florida-tennessee-vanderbilt', covers: 'Starting quarterbacks' },
    { label: 'ESPN preseason SP+ ratings and conference simulations', url: 'https://www.espn.com/college-football/story/_/id/49593338/final-preseason-college-football-sp+-rankings-takeaways-2026', covers: 'Rating calibration anchors' },
    { label: 'AP preseason Top 25', url: 'https://sports.yahoo.com/college-football/breaking-news/article/college-football-ap-top-25-ohio-state-leads-2026-preseason-poll-ahead-of-oregon-and-georgia-160359231.html', covers: 'Poll comparison layer' },
    { label: '2026 returning production and returning starters by team', url: 'https://www.cbssports.com/college-football/news/college-football-returning-production-2026-rosters-starters-snaps-experience/', covers: 'Continuity inputs' },
    { label: 'Transfer portal cycle — top SEC additions', url: 'https://www.on3.com/transfer-portal/news/ranking-the-top-10-sec-transfers-a-look-at-the-most-impactful-roster-additions-for-the-2026-season', covers: 'Portal valuations' },
    { label: '2025 final SEC standings', url: 'https://www.warrennolan.com/fbs/2025/conference/SEC', covers: 'Prior-season records' },
    { label: 'Coaching carousel — six new SEC head coaches', url: 'https://www.saturdaydownsouth.com/news/college-football/how-will-the-first-time-sec-football-coaches-fare-in-2026/', covers: 'Coach identities and prior stops' },
  ],
  notes: [
    'Every record carries a provenance flag. "Verified" identities, records, schedules and accolades were sourced from the public reporting listed above while this dataset was compiled on 5 September 2026.',
    'Per-play efficiency profiles, usage shares, player grades, PAR values and all seven rating components are the analyst layer — modelled estimates calibrated against the verified layer, not measurements. They are labelled as such throughout the interface.',
    'This is a static snapshot, not a live feed. It does not update for in-season results, injuries or depth-chart changes; the Scenario Studio exists so you can impose those yourself.',
    'Nothing here is betting advice. The model is built to explain and to stress-test assumptions, and its error bars are wide by design.',
  ],
};
