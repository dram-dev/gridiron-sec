/* ============================================================================
 * Shared play-by-play tally.
 *
 * Both the authored-roster resolver (players.mjs) and the derived-roster
 * builder (rosters.mjs) count the same things off the same plays, keyed by the
 * source's own athlete id. Keeping one implementation is what stops the two
 * from drifting into disagreeing about a player's season.
 * ========================================================================== */

import { join } from 'node:path';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';

export const n = (v) => (v == null ? 0 : Number(v));
export const norm = (s) =>
  (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\b(jr|sr|ii|iii|iv|v)\.?\b/g, '').replace(/[^a-z ]/g, '')
    .replace(/\s+/g, ' ').trim();

export const COLUMNS = [
  'game_id', 'pos_team_id', 'pos_team', 'def_pos_team', 'scrimmage_play', 'rush', 'pass', 'sack',
  'EPA', 'EPA_success', 'EPA_explosive',
  'rusher_player_id', 'rusher_player_name', 'yds_rushed', 'rush_td',
  'passer_player_id', 'passer_player_name', 'pass_attempt', 'completion', 'pass_td', 'int', 'cpoe',
  'receiver_player_id', 'receiver_player_name', 'target', 'yds_receiving',
  'sack_player_id', 'sack_player_name',
  'interception_player_id', 'interception_player_name',
  'pass_breakup_player_id', 'pass_breakup_player_name',
  'fumble_forced_player_id', 'fumble_forced_player_name',
  'fg_kicker_player_id', 'fg_kicker_player_name', 'fg_attempt', 'fg_made', 'yds_fg',
  'punter_player_id', 'punter_player_name', 'yds_punted',
];


export const makeReadPlays = (DATA) => async (file) => parquetReadObjects({
  file: await asyncBufferFromFile(join(DATA, file)), compressors, columns: COLUMNS,
});

export const blank = () => ({
  // Teams are tallied rather than overwritten: a player shows up on offence,
  // on defence and on special teams, and the modal team is the real one.
  name: '', teams: new Map(), games: new Set(),
  carries: 0, rushYds: 0, rushTd: 0, rushEpa: 0, rushSuccess: 0, rushExplosive: 0,
  dropbacks: 0, attempts: 0, completions: 0, passYds: 0, passTd: 0, ints: 0,
  // shareEpa splits each play's EPA evenly among the players the source names
  // on it, so a completed pass is not counted once for the passer and again in
  // full for the receiver. It is what PAR is built from; passEpa and the rest
  // stay whole, because they are what the production line reports.
  shareEpa: 0,
  passEpa: 0, passSuccess: 0, cpoe: 0, cpoeN: 0, sacksTaken: 0,
  targets: 0, receptions: 0, recYds: 0, recTd: 0, recEpa: 0, recSuccess: 0, recExplosive: 0,
  sacks: 0, interceptions: 0, passBreakups: 0, forcedFumbles: 0,
  // EPA the defence took away on the plays this player was credited on, from
  // the defence's point of view: a sack of −1.8 offensive EPA is +1.8 here.
  defEpa: 0, defPlays: 0,
  fgAttempts: 0, fgMade: 0, fgYards: 0, fgLong: 0, punts: 0, puntYards: 0,
});

export function accumulate(plays) {
const players = new Map();
// ESPN credits team rushes (kneels, aborted snaps) to a placeholder "TEAM".
const REAL = (id, name) => id != null && name && norm(name) !== 'team';
const get = (id, name, team, game) => {
  const k = String(id);
  let p = players.get(k);
  if (!p) players.set(k, (p = blank()));
  p.name = name;
  if (team) p.teams.set(team, (p.teams.get(team) ?? 0) + 1);
  p.games.add(String(game));
  return p;
};

/** Team totals, so a usage share is measured against the team it was earned on. */
const teamTotals = new Map();
const teamOf = (t) => {
  let s = teamTotals.get(t);
  if (!s) teamTotals.set(t, (s = { carries: 0, targets: 0, attempts: 0 }));
  return s;
};

for (const p of plays) {
  if (p.scrimmage_play !== true) {
    // Defensive credits can land on special-teams plays too; take them anyway.
  }
  const team = p.pos_team;
  const game = p.game_id;
  const epa = n(p.EPA);
  // A pass with a named target has two credited players; everything else has one.
  const shared = REAL(p.receiver_player_id, p.receiver_player_name) ? epa / 2 : epa;
  const success = p.EPA_success === true;
  const explosive = p.EPA_explosive === true;

  if (REAL(p.rusher_player_id, p.rusher_player_name)) {
    const r = get(p.rusher_player_id, p.rusher_player_name, team, game);
    r.carries += 1;
    r.rushYds += n(p.yds_rushed);
    r.rushTd += p.rush_td === true ? 1 : 0;
    r.rushEpa += epa;
    r.shareEpa += epa;
    r.rushSuccess += success ? 1 : 0;
    r.rushExplosive += explosive ? 1 : 0;
    teamOf(team).carries += 1;
  }

  if (REAL(p.passer_player_id, p.passer_player_name)) {
    const q = get(p.passer_player_id, p.passer_player_name, team, game);
    q.dropbacks += 1;
    q.passEpa += epa;
    q.shareEpa += shared;
    q.passSuccess += success ? 1 : 0;
    if (p.sack === true) q.sacksTaken += 1;
    if (p.pass_attempt === true) { q.attempts += 1; teamOf(team).attempts += 1; }
    if (p.completion === true) { q.completions += 1; q.passYds += n(p.yds_receiving); }
    if (p.pass_td === true) q.passTd += 1;
    if (p.int === true) q.ints += 1;
    if (p.cpoe != null) { q.cpoe += Number(p.cpoe); q.cpoeN += 1; }
  }

  if (REAL(p.receiver_player_id, p.receiver_player_name)) {
    const w = get(p.receiver_player_id, p.receiver_player_name, team, game);
    w.targets += 1;
    w.recEpa += epa;
    w.shareEpa += shared;
    w.recSuccess += success ? 1 : 0;
    if (explosive) w.recExplosive += 1;
    if (p.completion === true) {
      w.receptions += 1;
      w.recYds += n(p.yds_receiving);
      if (p.pass_td === true) w.recTd += 1;
    }
    teamOf(team).targets += 1;
  }

  if (REAL(p.fg_kicker_player_id, p.fg_kicker_player_name) && p.fg_attempt === true) {
    const k = get(p.fg_kicker_player_id, p.fg_kicker_player_name, team, game);
    k.fgAttempts += 1;
    if (p.fg_made === true) {
      k.fgMade += 1;
      k.fgYards += n(p.yds_fg);
      k.fgLong = Math.max(k.fgLong, n(p.yds_fg));
    }
  }
  if (REAL(p.punter_player_id, p.punter_player_name)) {
    const k = get(p.punter_player_id, p.punter_player_name, team, game);
    k.punts += 1;
    k.puntYards += n(p.yds_punted);
  }

  // Defensive credits are recorded against the defence, not the possessing team.
  const counted = new Set();
  for (const [role, field] of [['sack', 'sacks'], ['interception', 'interceptions'],
    ['pass_breakup', 'passBreakups'], ['fumble_forced', 'forcedFumbles']]) {
    const id = p[`${role}_player_id`];
    const name = p[`${role}_player_name`];
    if (!REAL(id, name)) continue;
    // A defensive credit belongs to the defence, not the team with the ball.
    const d = get(id, name, p.def_pos_team, game);
    d[field] += 1;
    // Credit the play's EPA once, even when a player appears in two roles on it.
    if (!counted.has(d)) { d.defEpa -= epa; d.shareEpa -= epa; d.defPlays += 1; counted.add(d); }
  }
}

return { players, teamTotals };
}
