/* ============================================================================
 * Back-test: does any of this actually predict football?
 *
 *   node --max-old-space-size=8000 scripts/etl/backtest.mjs
 *
 * The SP+ agreement figure the app quotes is not a back-test — it compares one
 * preseason guess against another and scores no results. This does score
 * results. For each season it builds the measured layer from the season BEFORE
 * it, projects every game, and grades the projection against what happened.
 *
 * Nothing is fit on a season it is then tested on. The fitted variant walks
 * forward: to predict 2024 it may use 2021-2023 and nothing later.
 *
 * The benchmark is the closing line. That comparison is deliberately unfair to
 * the model — a Vegas number for a week-11 game knows about ten weeks of
 * injuries, weather and form that a preseason projection cannot. It is
 * reported anyway, because it is the only honest measure of how much room is
 * left, and the early-season split below narrows the gap to something closer
 * to like-for-like.
 * ========================================================================== */

import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { fitEffects } from './adjust.mjs';
import { TEAM_IDS } from './sources.mjs';

const DATA = '.data';
const SEASONS = [2021, 2022, 2023, 2024, 2025];

const num = (v) => (v == null ? null : Number(v));
const read = (f, columns) =>
  asyncBufferFromFile(`${DATA}/${f}`).then((file) => parquetReadObjects({ file, compressors, columns }));

/* -------------------------------------------------------------------------- */
/* One season at a time, so five years of play-by-play never sit in memory     */
/* -------------------------------------------------------------------------- */

/** @type {Map<number, {teams: Map<string, any>, games: any[]}>} */
const season = new Map();

for (const year of SEASONS) {
  const plays = await read(`play_by_play_${year}.parquet`, [
    'game_id', 'pos_team_id', 'def_pos_team_id', 'pos_team', 'scrimmage_play', 'kneel_down',
    'EPA', 'week', 'seasonType', 'game_play_number',
    'homeTeamId', 'awayTeamId', 'end.homeScore', 'end.awayScore', 'homeTeamSpread',
  ]);

  // Final score, closing line and week, from the last play of each game.
  const finals = new Map();
  for (const p of plays) {
    const g = String(p.game_id);
    const n = num(p.game_play_number) ?? 0;
    const cur = finals.get(g);
    if (cur && n <= cur.n) continue;
    finals.set(g, {
      id: g, n,
      home: String(p.homeTeamId), away: String(p.awayTeamId),
      hs: num(p['end.homeScore']) ?? 0, as: num(p['end.awayScore']) ?? 0,
      spread: num(p.homeTeamSpread),
      week: num(p.week) ?? 0, post: num(p.seasonType) === 3,
    });
  }

  // Per-game offensive EPA, then the same opponent adjustment the app ships.
  const acc = new Map();
  for (const p of plays) {
    if (p.scrimmage_play !== true || p.kneel_down === true || p.EPA == null) continue;
    const off = String(p.pos_team_id);
    const def = String(p.def_pos_team_id);
    if (off === 'null' || def === 'null') continue;
    const k = `${p.game_id}|${off}|${def}`;
    let a = acc.get(k);
    if (!a) acc.set(k, (a = { game: String(p.game_id), off, def, sum: 0, n: 0 }));
    a.sum += p.EPA;
    a.n += 1;
  }
  const obs = [...acc.values()].filter((a) => a.n >= 10)
    .map((a) => ({ ...a, value: a.sum / a.n, weight: a.n }));
  const fit = fitEffects(obs, { lambda: 100 });

  const teams = new Map();
  for (const t of fit.offense.keys()) {
    const played = obs.filter((o) => o.off === t).length;
    teams.set(t, {
      offEpa: fit.offense.get(t) - fit.mu,
      defEpa: fit.defense.get(t) - fit.mu,
      games: played,
    });
  }

  season.set(year, { teams, games: [...finals.values()] });
  console.log(`${year}: ${finals.size} games, ${teams.size} teams, ${obs.length} team-games`);
}

/* -------------------------------------------------------------------------- */
/* Returning production and recruiting, at the vintage of the season played    */
/* -------------------------------------------------------------------------- */

const vintage = new Map();
for (const year of [...SEASONS, 2026]) {
  const rp = await read(`cfb_returning_production_${year}.parquet`);
  const tl = await read(`cfb_team_talent_${year}.parquet`);
  const m = new Map();
  for (const r of rp) {
    m.set(String(r.team_id), {
      retOff: r.off_returning ?? null,
      retDef: r.def_returning ?? null,
    });
  }
  for (const t of tl) {
    const e = m.get(String(t.team_id)) ?? {};
    e.talent = t.talent_composite ?? null;
    e.blueChip = t.blue_chip_ratio ?? null;
    m.set(String(t.team_id), e);
  }
  vintage.set(year, m);
}

/* -------------------------------------------------------------------------- */
/* Feature rows: predict season Y from season Y-1                              */
/* -------------------------------------------------------------------------- */

// netEpa is offEpa + defEpa exactly, so it cannot sit alongside them: ridge
// would split one signal across three collinear columns and the individual
// coefficients would mean nothing. It is kept for the single-feature baseline
// only, and excluded from anything fitted.
const FEATURES = ['offEpa', 'defEpa', 'retOff', 'retDef', 'blueChip'];
const ALL_FEATURES = [...FEATURES, 'netEpa', 'talent'];

/** Standardise nationally, over the teams actually available that year. */
function standardise(rows) {
  const stats = {};
  for (const f of ALL_FEATURES) {
    const xs = rows.map((r) => r.raw[f]).filter((v) => v != null && Number.isFinite(v));
    const mean = xs.reduce((s, v) => s + v, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((s, v) => s + (v - mean) ** 2, 0) / xs.length) || 1;
    stats[f] = { mean, sd };
  }
  for (const r of rows) {
    r.z = {};
    for (const f of ALL_FEATURES) {
      const v = r.raw[f];
      r.z[f] = v == null || !Number.isFinite(v) ? 0 : (v - stats[f].mean) / stats[f].sd;
    }
  }
  return stats;
}

/** One row per game of season Y, carrying both teams' prior-season features. */
function buildSeason(year) {
  const prior = season.get(year - 1);
  const now = season.get(year);
  const vint = vintage.get(year);
  if (!prior || !now) return null;

  const teamRows = [];
  for (const [id, t] of prior.teams) {
    // Thin prior seasons are noise; require a real sample.
    if (t.games < 8) continue;
    const v = vint?.get(id) ?? {};
    teamRows.push({
      id,
      raw: {
        netEpa: t.offEpa - t.defEpa,
        offEpa: t.offEpa,
        defEpa: -t.defEpa,
        retOff: v.retOff ?? null,
        retDef: v.retDef ?? null,
        talent: v.talent ?? null,
        blueChip: v.blueChip ?? null,
      },
    });
  }
  standardise(teamRows);
  const byId = new Map(teamRows.map((r) => [r.id, r]));

  const rows = [];
  for (const g of now.games) {
    const h = byId.get(g.home);
    const a = byId.get(g.away);
    if (!h || !a) continue;
    if (g.spread == null) continue;
    const diff = {};
    for (const f of ALL_FEATURES) diff[f] = h.z[f] - a.z[f];
    rows.push({ year, week: g.week, post: g.post, diff, margin: g.hs - g.as, spread: g.spread });
  }
  return rows;
}

const bySeason = new Map();
for (const y of SEASONS.slice(1)) {
  const rows = buildSeason(y);
  if (rows?.length) bySeason.set(y, rows);
}

/* -------------------------------------------------------------------------- */
/* Models                                                                      */
/* -------------------------------------------------------------------------- */

/** Ridge-regularised least squares with an intercept (the home-field term). */
function ridgeFit(rows, features, lambda = 1) {
  const p = features.length;
  const X = rows.map((r) => [1, ...features.map((f) => r.diff[f])]);
  const y = rows.map((r) => r.margin);
  const A = Array.from({ length: p + 1 }, () => new Float64Array(p + 1));
  const b = new Float64Array(p + 1);
  for (let i = 0; i < X.length; i++) {
    for (let j = 0; j <= p; j++) {
      b[j] += X[i][j] * y[i];
      for (let k = 0; k <= p; k++) A[j][k] += X[i][j] * X[i][k];
    }
  }
  for (let j = 1; j <= p; j++) A[j][j] += lambda; // intercept is never penalised

  // Gauss-Jordan; the system is tiny.
  const M = A.map((row, j) => [...row, b[j]]);
  for (let c = 0; c <= p; c++) {
    let piv = c;
    for (let r = c + 1; r <= p; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    const d = M[c][c] || 1e-9;
    for (let k = c; k <= p + 1; k++) M[c][k] /= d;
    for (let r = 0; r <= p; r++) {
      if (r === c) continue;
      const f = M[r][c];
      for (let k = c; k <= p + 1; k++) M[r][k] -= f * M[c][k];
    }
  }
  const w = M.map((row) => row[p + 1]);
  return { intercept: w[0], weights: Object.fromEntries(features.map((f, i) => [f, w[i + 1]])) };
}

const predictFitted = (model, r, features) =>
  model.intercept + features.reduce((s, f) => s + model.weights[f] * r.diff[f], 0);

/**
 * The app's own coefficients, applied to the same standardised observations.
 * Roster strength, the quarterback term and the coaching index have no
 * historical counterpart here, so this is the model's data-driven core only —
 * which is also the only part a back-test could ever reach.
 */
const APP = { priorWeight: 0.46, efficiencyScale: 3.75, continuityScale: 0.72, talentScale: 0.6, hfa: 2.6 };
function predictApp(r) {
  const units = APP.priorWeight * APP.efficiencyScale * (r.diff.offEpa + r.diff.defEpa);
  const continuity = APP.continuityScale * ((r.diff.retOff + r.diff.retDef) / 2);
  const talent = APP.talentScale * r.diff.blueChip;
  return units + continuity + talent + APP.hfa;
}

/**
 * The recalibrated coefficients, in the same shape the app applies them — one
 * shared unit scale, continuity on the mean of the two returning shares, talent
 * on blue-chip ratio. Standardisation is national on both sides here, which is
 * the change that lets a fitted weight transfer into the app unmodified.
 */
const TUNED = { unitScale: 2.95, continuityScale: 1.05, talentScale: 4.69, hfa: 3.2 };
function predictTuned(r) {
  return TUNED.unitScale * (r.diff.offEpa + r.diff.defEpa)
    + TUNED.continuityScale * ((r.diff.retOff + r.diff.retDef) / 2)
    + TUNED.talentScale * r.diff.blueChip
    + TUNED.hfa;
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                     */
/* -------------------------------------------------------------------------- */

function score(rows, predict) {
  const n = rows.length;
  let sse = 0;
  let sae = 0;
  const ys = rows.map((r) => r.margin);
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sst = 0;
  let atsWins = 0;
  let atsGraded = 0;
  let su = 0;
  for (const r of rows) {
    const p = predict(r);
    sse += (r.margin - p) ** 2;
    sae += Math.abs(r.margin - p);
    sst += (r.margin - my) ** 2;
    if (Math.sign(p) === Math.sign(r.margin) || r.margin === 0) su += 1;
    // Against the spread: does the model pick the side the result covers?
    const edge = p - r.spread;
    const cover = r.margin - r.spread;
    if (Math.abs(edge) > 0.5 && cover !== 0) {
      atsGraded += 1;
      if (Math.sign(edge) === Math.sign(cover)) atsWins += 1;
    }
  }
  return {
    n,
    r2: 1 - sse / sst,
    rmse: Math.sqrt(sse / n),
    mae: sae / n,
    su: su / n,
    ats: atsGraded ? atsWins / atsGraded : NaN,
    atsN: atsGraded,
  };
}

const pct = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : '   — ');
const row = (label, s) =>
  `${label.padEnd(34)} ${String(s.n).padStart(5)}  ${s.r2.toFixed(3).padStart(6)}  ` +
  `${s.rmse.toFixed(2).padStart(6)}  ${s.mae.toFixed(2).padStart(6)}  ${pct(s.su).padStart(7)}  ${pct(s.ats).padStart(7)}`;

console.log('\n' + '='.repeat(92));
console.log('WALK-FORWARD BACK-TEST — every projection scored on a season it was not built from');
console.log('='.repeat(92));
console.log(`${''.padEnd(34)} ${'games'.padStart(5)}  ${'R²'.padStart(6)}  ${'RMSE'.padStart(6)}  ` +
  `${'MAE'.padStart(6)}  ${'winner'.padStart(7)}  ${'ATS'.padStart(7)}`);

const all = [];
for (const [year, rows] of bySeason) {
  console.log(`\n${year}  (from ${year - 1} observations, ${rows.length} games)`);
  console.log(row('  market closing line', score(rows, (r) => r.spread)));
  console.log(row('  home field only', score(rows, () => APP.hfa)));
  console.log(row('  prior-season net EPA only', score(rows, (r) => 6.5 * r.diff.netEpa + APP.hfa)));
  console.log(row("  the app's coefficients", score(rows, predictApp)));
  console.log(row('  recalibrated coefficients', score(rows, predictTuned)));

  // Walk forward: fit only on seasons strictly before this one.
  const train = [...bySeason.entries()].filter(([y]) => y < year).flatMap(([, r]) => r);
  if (train.length >= 400) {
    const model = ridgeFit(train, FEATURES, 25);
    const trainedOn = [...bySeason.keys()].filter((y) => y < year);
    console.log(row(`  fitted on ${trainedOn.join(', ')}`, score(rows, (r) => predictFitted(model, r, FEATURES))));
    all.push({ year, model });
  } else {
    console.log('  fitted                             (no prior seasons available yet)');
  }
}

/* Pooled, over every season that had a fitted model available. */
const pooled = [...bySeason.entries()].filter(([y]) => all.some((a) => a.year === y));
if (pooled.length) {
  const rows = pooled.flatMap(([, r]) => r);
  console.log('\n' + '-'.repeat(92));
  console.log(`POOLED over ${pooled.map(([y]) => y).join(', ')}`);
  console.log(row('  market closing line', score(rows, (r) => r.spread)));
  console.log(row('  home field only', score(rows, () => APP.hfa)));
  console.log(row("  the app's coefficients", score(rows, predictApp)));
  console.log(row('  recalibrated coefficients', score(rows, predictTuned)));
  const predByYear = new Map(all.map((a) => [a.year, a.model]));
  console.log(row('  fitted (walk-forward)', score(rows, (r) => predictFitted(predByYear.get(r.year), r, FEATURES))));

  // Early season only: the fairest comparison against a market line, since by
  // week 10 the line knows things a preseason projection never could.
  const early = rows.filter((r) => r.week <= 4 && !r.post);
  console.log(`\nEARLY SEASON ONLY (weeks 1-4, ${early.length} games)`);
  console.log(row('  market closing line', score(early, (r) => r.spread)));
  console.log(row("  the app's coefficients", score(early, predictApp)));
  console.log(row('  recalibrated coefficients', score(early, predictTuned)));
  console.log(row('  fitted (walk-forward)', score(early, (r) => predictFitted(predByYear.get(r.year), r, FEATURES))));

  console.log('\n' + '-'.repeat(92));
  console.log('WHAT THE DATA SAYS THE WEIGHTS SHOULD BE (points of margin per SD, all seasons)');
  const full = ridgeFit(rows, FEATURES, 25);
  console.log(`  home field       ${full.intercept.toFixed(2)}`);
  for (const f of FEATURES) console.log(`  ${f.padEnd(16)} ${full.weights[f].toFixed(2)}`);

  // The app standardises inside its own pool; this fit standardises nationally.
  // A coefficient cannot cross between the two without the ratio of those
  // spreads, so it is measured here rather than assumed.
  //
  // The pool is read from the manifest rather than written out here. When the
  // Big Ten was added the pool doubled, and a ratio still measured against the
  // sixteen would have gone on converting into units the model had stopped
  // using — silently, and in every coefficient at once.
  const POOL_IDS = new Set(Object.keys(TEAM_IDS));
  const sd = (xs) => {
    const v = xs.filter((x) => x != null && Number.isFinite(x));
    if (v.length < 2) return NaN;
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length);
  };

  // Averaged over every season, not one. A single season's ratio is noisy
  // enough to invent an offence/defence asymmetry that the per-season weights
  // above show is not there.
  const ratios = Object.fromEntries(FEATURES.map((f) => [f, []]));
  for (const y of SEASONS.slice(1)) {
    const rowsY = [];
    for (const [id, t] of season.get(y - 1).teams) {
      if (t.games < 8) continue;
      const v = vintage.get(y)?.get(id) ?? {};
      rowsY.push({ id, raw: {
        offEpa: t.offEpa, defEpa: -t.defEpa,
        retOff: v.retOff ?? null, retDef: v.retDef ?? null, blueChip: v.blueChip ?? null } });
    }
    for (const f of FEATURES) {
      const nat = sd(rowsY.map((r) => r.raw[f]));
      const pool = sd(rowsY.filter((r) => POOL_IDS.has(r.id)).map((r) => r.raw[f]));
      if (Number.isFinite(nat) && Number.isFinite(pool) && nat > 0) ratios[f].push(pool / nat);
    }
  }

  console.log(`\nPOOL SPREAD AS A SHARE OF THE NATIONAL SPREAD (${POOL_IDS.size} teams), over all seasons`);
  console.log(`  ${'feature'.padEnd(10)} ${'per-season ratios'.padEnd(30)} ${'mean'.padStart(6)} ${'pts / pool SD'.padStart(14)}`);
  for (const f of FEATURES) {
    const rs = ratios[f];
    const mean = rs.reduce((a, b) => a + b, 0) / rs.length;
    console.log(`  ${f.padEnd(10)} ${rs.map((r) => r.toFixed(2)).join(' ').padEnd(30)} ` +
      `${mean.toFixed(2).padStart(6)} ${(full.weights[f] * mean).toFixed(2).padStart(13)}`);
  }
}
