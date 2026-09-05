/* ============================================================================
 * How fast should a preseason projection give way to the season itself?
 *
 *   node --max-old-space-size=8000 scripts/etl/inseason.mjs
 *
 * A preseason number is the best guess available in August and the worst one
 * available in November. Somewhere in between the games become better evidence
 * than the projection, and the question this answers is exactly where.
 *
 * The method is the same walk-forward discipline as the season back-test. For
 * every season and every week W: build the preseason rating from the prior
 * season, build an opponent-adjusted rating from weeks 1..W of the season being
 * played, then predict the games in weeks W+1 and later — which neither input
 * has seen. The two are fit against real margins, and the weight the fit puts
 * on each is the answer. Weights come from other seasons only.
 * ========================================================================== */

import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { fitEffects } from './adjust.mjs';

const DATA = '.data';
const SEASONS = [2021, 2022, 2023, 2024, 2025];
const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const num = (v) => (v == null ? null : Number(v));
const read = (f, columns) =>
  asyncBufferFromFile(`${DATA}/${f}`).then((file) => parquetReadObjects({ file, compressors, columns }));

const sd = (xs) => {
  const v = xs.filter((x) => x != null && Number.isFinite(x));
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length) || 1;
};
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/* -------------------------------------------------------------------------- */

const season = new Map();
for (const year of SEASONS) {
  const plays = await read(`play_by_play_${year}.parquet`, [
    'game_id', 'pos_team_id', 'def_pos_team_id', 'scrimmage_play', 'kneel_down', 'EPA',
    'week', 'seasonType', 'game_play_number', 'homeTeamId', 'awayTeamId',
    'end.homeScore', 'end.awayScore',
  ]);

  const finals = new Map();
  for (const p of plays) {
    const g = String(p.game_id);
    const n = num(p.game_play_number) ?? 0;
    const cur = finals.get(g);
    if (cur && n <= cur.n) continue;
    finals.set(g, {
      id: g, n, home: String(p.homeTeamId), away: String(p.awayTeamId),
      hs: num(p['end.homeScore']) ?? 0, as: num(p['end.awayScore']) ?? 0,
      week: num(p.week) ?? 0, post: num(p.seasonType) === 3,
    });
  }

  // Per team-game EPA, tagged with the week so it can be cut at any point.
  const acc = new Map();
  for (const p of plays) {
    if (p.scrimmage_play !== true || p.kneel_down === true || p.EPA == null) continue;
    const off = String(p.pos_team_id);
    const def = String(p.def_pos_team_id);
    if (off === 'null' || def === 'null') continue;
    const k = `${p.game_id}|${off}`;
    let a = acc.get(k);
    if (!a) acc.set(k, (a = { game: String(p.game_id), off, def, week: num(p.week) ?? 0, sum: 0, n: 0 }));
    a.sum += p.EPA;
    a.n += 1;
  }
  const teamGames = [...acc.values()].filter((a) => a.n >= 10)
    .map((a) => ({ ...a, value: a.sum / a.n, weight: a.n }));

  season.set(year, { finals: [...finals.values()], teamGames });
  console.log(`${year}: ${finals.size} games`);
}

/** Opponent-adjusted net rating from a slice of a season, in EPA per play. */
function ratingsThrough(year, week) {
  const obs = season.get(year).teamGames.filter((t) => t.week <= week);
  if (obs.length < 50) return null;
  const fit = fitEffects(obs, { lambda: 100 });
  const out = new Map();
  const played = new Map();
  for (const o of obs) played.set(o.off, (played.get(o.off) ?? 0) + 1);
  for (const t of fit.offense.keys()) {
    out.set(t, {
      net: (fit.offense.get(t) - fit.mu) - (fit.defense.get(t) - fit.mu),
      games: played.get(t) ?? 0,
    });
  }
  return out;
}

/** Full prior season, which is what a preseason projection is built on. */
const priorOf = new Map();
for (const year of SEASONS) {
  const r = ratingsThrough(year, 99);
  priorOf.set(year, r);
}

/* -------------------------------------------------------------------------- */
/* Two features per game: the preseason rating gap, and the in-season one      */
/* -------------------------------------------------------------------------- */

function rows(year, week) {
  const prior = priorOf.get(year - 1);
  const now = ratingsThrough(year, week);
  if (!prior || !now) return [];

  const pz = sd([...prior.values()].map((v) => v.net));
  const nz = sd([...now.values()].map((v) => v.net));

  const out = [];
  for (const g of season.get(year).finals) {
    if (g.week <= week || g.post) continue;
    const hp = prior.get(g.home);
    const ap = prior.get(g.away);
    const hn = now.get(g.home);
    const an = now.get(g.away);
    if (!hp || !ap || !hn || !an) continue;
    out.push({
      priorDiff: (hp.net - ap.net) / pz,
      nowDiff: (hn.net - an.net) / nz,
      margin: g.hs - g.as,
    });
  }
  return out;
}

/** Ridge with intercept over two features. */
function fit2(data, lambda = 5) {
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const b = [0, 0, 0];
  for (const r of data) {
    const x = [1, r.priorDiff, r.nowDiff];
    for (let i = 0; i < 3; i++) {
      b[i] += x[i] * r.margin;
      for (let j = 0; j < 3; j++) A[i][j] += x[i] * x[j];
    }
  }
  A[1][1] += lambda;
  A[2][2] += lambda;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    const d = M[c][c] || 1e-9;
    for (let k = c; k < 4; k++) M[c][k] /= d;
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const f = M[r][c];
      for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
    }
  }
  return { hfa: M[0][3], prior: M[1][3], now: M[2][3] };
}

const r2 = (data, predict) => {
  const ys = data.map((d) => d.margin);
  const my = mean(ys);
  let sse = 0;
  let sst = 0;
  for (const d of data) {
    sse += (d.margin - predict(d)) ** 2;
    sst += (d.margin - my) ** 2;
  }
  return 1 - sse / sst;
};

console.log('\n' + '='.repeat(78));
console.log('HOW MUCH TO TRUST THE SEASON IN FRONT OF YOU, BY WEEK');
console.log('='.repeat(78));
console.log('Weights fitted on other seasons; scored on games after the cut in the held-out one.\n');
console.log(`${'after wk'.padEnd(9)} ${'games'.padStart(6)} ${'w(prior)'.padStart(9)} ${'w(season)'.padStart(10)} ` +
  `${'season share'.padStart(13)} ${'R² both'.padStart(8)} ${'R² prior'.padStart(9)} ${'R² season'.padStart(10)}`);

const curve = [];
for (const w of WEEKS) {
  const byYear = new Map(SEASONS.slice(1).map((y) => [y, rows(y, w)]));
  let n = 0;
  let sumPrior = 0;
  let sumNow = 0;
  const scored = [];
  const scoredPrior = [];
  const scoredNow = [];

  for (const [y, test] of byYear) {
    if (!test.length) continue;
    const train = [...byYear.entries()].filter(([k]) => k !== y).flatMap(([, v]) => v);
    if (train.length < 300) continue;
    const m = fit2(train);
    const mp = fit2(train.map((r) => ({ ...r, nowDiff: 0 })));
    const mn = fit2(train.map((r) => ({ ...r, priorDiff: 0 })));
    sumPrior += m.prior;
    sumNow += m.now;
    n += 1;
    for (const r of test) {
      scored.push({ margin: r.margin, p: m.hfa + m.prior * r.priorDiff + m.now * r.nowDiff });
      scoredPrior.push({ margin: r.margin, p: mp.hfa + mp.prior * r.priorDiff });
      scoredNow.push({ margin: r.margin, p: mn.hfa + mn.now * r.nowDiff });
    }
  }
  if (!n) continue;
  const wp = sumPrior / n;
  const wn = sumNow / n;
  const share = wn / (wp + wn);
  curve.push({ week: w, prior: wp, now: wn, share });
  console.log(
    `${String(w).padEnd(9)} ${String(scored.length).padStart(6)} ${wp.toFixed(2).padStart(9)} ${wn.toFixed(2).padStart(10)} ` +
    `${`${(share * 100).toFixed(0)}%`.padStart(13)} ${r2(scored, (d) => d.p).toFixed(3).padStart(8)} ` +
    `${r2(scoredPrior, (d) => d.p).toFixed(3).padStart(9)} ${r2(scoredNow, (d) => d.p).toFixed(3).padStart(10)}`,
  );
}

/* The share of weight the season itself earns, as a function of games played,
 * is what the app needs. Expressed as a prior worth K games it is one number. */
console.log('\nThe same curve read as "the preseason projection is worth K games of evidence":');
for (const c of curve) {
  // share = games / (games + K)  ->  K = games * (1 - share) / share
  const games = c.week * 0.85; // a team plays roughly 0.85 games per calendar week
  const K = (games * (1 - c.share)) / c.share;
  console.log(`  after week ${String(c.week).padStart(2)}  season share ${(c.share * 100).toFixed(0).padStart(3)}%  implies K ≈ ${K.toFixed(1)}`);
}
