/* ============================================================================
 * Does the opponent adjustment actually work?
 *
 *   node scripts/etl/validate.mjs
 *
 * Two questions, both answered out of sample:
 *   1. Which garbage-time cut produces ratings that predict games best?
 *   2. Does removing the schedule beat leaving it in?
 *
 * The test is game margin. Ratings are fit on four fifths of the season and
 * scored on the fifth they never saw, so a rating cannot earn credit for
 * memorising a result.
 * ========================================================================== */

import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { fitEffects, spearman } from './adjust.mjs';
import { SEC_TEAM_IDS } from './sources.mjs';

const rows = await parquetReadObjects({
  file: await asyncBufferFromFile('.data/play_by_play_2025.parquet'), compressors,
  columns: ['game_id', 'pos_team_id', 'def_pos_team_id', 'pos_team', 'scrimmage_play', 'kneel_down',
            'EPA', 'wp_before', 'homeTeamId', 'awayTeamId', 'end.homeScore', 'end.awayScore', 'game_play_number'],
});

/* Final scores, taken from the last play of each game. */
const finals = new Map();
for (const r of rows) {
  const g = String(r.game_id);
  const n = Number(r.game_play_number ?? 0);
  const cur = finals.get(g);
  if (!cur || n > cur.n) {
    finals.set(g, { home: String(r.homeTeamId), away: String(r.awayTeamId), hs: Number(r['end.homeScore'] ?? 0), as: Number(r['end.awayScore'] ?? 0), n });
  }
}

const scrimmage = rows.filter((r) => r.scrimmage_play === true && r.kneel_down !== true && r.EPA != null);

/** Fold plays into per-game EPA rates under a given garbage-time rule. */
function observations(keep) {
  const acc = new Map();
  for (const p of scrimmage) {
    if (!keep(p)) continue;
    const k = `${p.game_id}|${p.pos_team_id}|${p.def_pos_team_id}`;
    let a = acc.get(k);
    if (!a) acc.set(k, (a = { game: String(p.game_id), off: String(p.pos_team_id), def: String(p.def_pos_team_id), sum: 0, n: 0 }));
    a.sum += p.EPA;
    a.n += 1;
  }
  return [...acc.values()].filter((a) => a.n >= 10).map((a) => ({ ...a, value: a.sum / a.n, weight: a.n }));
}

/**
 * Predict every held-out game's margin from ratings fit without it.
 *
 * `scored` is fixed across every experiment. A stricter garbage-time cut drops
 * team-games from the *training* set, and if it were also allowed to drop them
 * from the scoring set it would quietly change the exam: the games that survive
 * a tight filter are the close ones, whose margins are inherently less
 * predictable. Holding the scored games constant keeps the comparison honest.
 */
function crossValidate(obs, { lambda, adjust, scored }) {
  const games = scored;
  const fold = new Map(games.map((g, i) => [g, i % 5]));
  const pred = [];
  const actual = [];

  for (let k = 0; k < 5; k++) {
    const train = obs.filter((o) => fold.get(o.game) !== k && fold.has(o.game));
    let off;
    let def;
    let mu;
    if (adjust) {
      const fit = fitEffects(train, { lambda });
      ({ mu } = fit);
      off = fit.offense;
      def = fit.defense;
    } else {
      // The naive alternative: a raw season average, schedule and all.
      const a = new Map();
      const b = new Map();
      let wy = 0;
      let w = 0;
      for (const o of train) {
        for (const [m, t] of [[a, o.off], [b, o.def]]) {
          const e = m.get(t) ?? { s: 0, n: 0 };
          e.s += o.value * o.weight;
          e.n += o.weight;
          m.set(t, e);
        }
        wy += o.value * o.weight;
        w += o.weight;
      }
      mu = wy / w;
      off = new Map([...a].map(([t, e]) => [t, e.s / e.n]));
      def = new Map([...b].map(([t, e]) => [t, e.s / e.n]));
    }

    for (const g of games.filter((x) => fold.get(x) === k)) {
      const f = finals.get(g);
      if (!f) continue;
      // Expected EPA/play for t's offence against o's defence: t's offensive
      // effect plus however much o's defence concedes above the league mean.
      const net = (t, o) =>
        ((off.get(t) ?? mu) - mu) + ((def.get(o) ?? mu) - mu);
      const edge = net(f.home, f.away) - net(f.away, f.home);
      if (!Number.isFinite(edge)) continue;
      pred.push(edge);
      actual.push(f.hs - f.as);
    }
  }

  // Least-squares scale from EPA edge to points, then the error that leaves.
  const n = pred.length;
  const mp = pred.reduce((s, v) => s + v, 0) / n;
  const ma = actual.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) { num += (pred[i] - mp) * (actual[i] - ma); den += (pred[i] - mp) ** 2; }
  const slope = num / den;
  let sse = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    sse += (actual[i] - (ma + slope * (pred[i] - mp))) ** 2;
    sst += (actual[i] - ma) ** 2;
  }
  return { n, r2: 1 - sse / sst, mae: Math.sqrt(sse / n), rho: spearman(pred, actual) };
}

const CUTS = {
  'none                ': () => true,
  'win prob 1–99%      ': (p) => p.wp_before != null && p.wp_before > 0.01 && p.wp_before < 0.99,
  'win prob 5–95%      ': (p) => p.wp_before != null && p.wp_before > 0.05 && p.wp_before < 0.95,
  'win prob 10–90%     ': (p) => p.wp_before != null && p.wp_before > 0.10 && p.wp_before < 0.90,
  'win prob 20–80%     ': (p) => p.wp_before != null && p.wp_before > 0.20 && p.wp_before < 0.80,
};

/** Every game gets predicted in every experiment, whatever fed the ratings. */
const allGames = [...new Set(observations(() => true).map((o) => o.game))].sort();

console.log(`Out-of-sample margin prediction, five-fold, ${allGames.length} games scored in every row\n`);
console.log('garbage-time cut       plays   opponent-adjusted        raw season average');
console.log('                               R²      RMSE   rho       R²      RMSE   rho');
let best = null;
for (const [label, keep] of Object.entries(CUTS)) {
  const obs = observations(keep);
  const plays = obs.reduce((s, o) => s + o.weight, 0);
  const adj = crossValidate(obs, { lambda: 200, adjust: true, scored: allGames });
  const raw = crossValidate(obs, { lambda: 200, adjust: false, scored: allGames });
  console.log(
    `${label} ${String(plays).padStart(6)}   ${adj.r2.toFixed(3)}  ${adj.mae.toFixed(2)}  ${adj.rho.toFixed(3)}    ` +
    `${raw.r2.toFixed(3)}  ${raw.mae.toFixed(2)}  ${raw.rho.toFixed(3)}`,
  );
  if (!best || adj.r2 > best.r2) best = { label, r2: adj.r2, keep };
}
console.log(`\nbest cut: ${best.label.trim()} (R² ${best.r2.toFixed(3)})`);

/* National sanity check: is the top of the sport the top of the sport? */
const obs = observations(best.keep);
const fit = fitEffects(obs, { lambda: 200 });
const names = new Map(rows.map((r) => [String(r.pos_team_id), r.pos_team]));
const net = [...fit.offense.keys()]
  .map((t) => ({ t, name: names.get(t) ?? t, net: (fit.offense.get(t) - fit.mu) - (fit.defense.get(t) - fit.mu) }))
  .filter((x) => obs.filter((o) => o.off === x.t).length >= 8)
  .sort((a, b) => b.net - a.net);
console.log('\nTop 25 FBS by opponent-adjusted net EPA/play:');
net.slice(0, 25).forEach((x, i) => console.log(`  ${String(i + 1).padStart(2)}. ${x.name.padEnd(32)} ${x.net >= 0 ? '+' : ''}${x.net.toFixed(3)}`));
const secIds = new Set(Object.keys(SEC_TEAM_IDS));
console.log('\nSEC placement in that national order:');
net.forEach((x, i) => { if (secIds.has(x.t)) console.log(`  #${String(i + 1).padStart(3)}  ${x.name}`); });
