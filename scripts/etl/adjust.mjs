/* ============================================================================
 * Opponent adjustment.
 *
 * A raw season average lies about the SEC. Sixteen teams that mostly play each
 * other post depressed offensive numbers and flattering defensive ones, because
 * the schedule is the hardest in the sport. Comparing a raw SEC average to a
 * raw Sun Belt average compares schedules, not teams.
 *
 * So each metric is fit as an additive effects model over every FBS game in the
 * season. One observation is one team's offensive output in one game:
 *
 *     y_g  ≈  mu + off[i] − def[j]
 *
 * mu is the play-weighted league mean, off[i] is how far team i pushes a metric
 * above it, and def[j] is how far team j pulls it back down. Solved by
 * alternating least squares: hold the defenses fixed and solve every offense in
 * closed form, then the reverse, until the numbers stop moving.
 *
 * Each solve is ridge-regularised, with lambda carried in units of plays. It is
 * what keeps a team that played one FCS opponent from being credited as though
 * that opponent were an average FBS defense: thin evidence gets pulled toward
 * the league mean in proportion to how thin it is. Lambda is not hand-set — it
 * is chosen per metric by k-fold cross-validation on held-out games, so the
 * amount of shrinkage is the amount that actually predicts best.
 * ========================================================================== */

/**
 * @typedef {{ off: string, def: string, value: number, weight: number }} Obs
 * @typedef {{ offense: Map<string, number>, defense: Map<string, number>, mu: number, lambda: number, iterations: number }} Fit
 */

/**
 * Fit `y = mu + off − def` by ridge-regularised alternating least squares.
 *
 * Returns both sides already folded back onto the metric's own scale:
 * `offense[i]` is what team i would produce against an average defense, and
 * `defense[j]` is what team j would concede to an average offense. That makes
 * every number directly comparable to the raw stat it came from.
 *
 * @param {Obs[]} obs
 * @param {{ lambda: number, iterations?: number, tolerance?: number }} options
 * @returns {Fit}
 */
export function fitEffects(obs, { lambda, iterations = 200, tolerance = 1e-9 }) {
  let wSum = 0;
  let wy = 0;
  for (const o of obs) {
    wSum += o.weight;
    wy += o.weight * o.value;
  }
  const mu = wSum > 0 ? wy / wSum : 0;

  // Group observations by side once; the ALS loop then touches only arrays.
  /** @type {Map<string, Obs[]>} */ const byOff = new Map();
  /** @type {Map<string, Obs[]>} */ const byDef = new Map();
  for (const o of obs) {
    (byOff.get(o.off) ?? byOff.set(o.off, []).get(o.off)).push(o);
    (byDef.get(o.def) ?? byDef.set(o.def, []).get(o.def)).push(o);
  }

  /** @type {Map<string, number>} */ const off = new Map();
  /** @type {Map<string, number>} */ const def = new Map();
  for (const k of byOff.keys()) off.set(k, 0);
  for (const k of byDef.keys()) def.set(k, 0);

  for (let iter = 0; iter < iterations; iter++) {
    let shift = 0;

    for (const [team, rows] of byOff) {
      let num = 0;
      let den = lambda;
      for (const o of rows) {
        num += o.weight * (o.value - mu + (def.get(o.def) ?? 0));
        den += o.weight;
      }
      const next = num / den;
      shift = Math.max(shift, Math.abs(next - off.get(team)));
      off.set(team, next);
    }

    for (const [team, rows] of byDef) {
      let num = 0;
      let den = lambda;
      for (const o of rows) {
        num += o.weight * (mu + (off.get(o.off) ?? 0) - o.value);
        den += o.weight;
      }
      const next = num / den;
      shift = Math.max(shift, Math.abs(next - def.get(team)));
      def.set(team, next);
    }

    if (shift < tolerance) break;
  }

  return {
    mu,
    lambda,
    iterations,
    offense: new Map([...off].map(([k, v]) => [k, mu + v])),
    defense: new Map([...def].map(([k, v]) => [k, mu - v])),
  };
}

/**
 * Choose lambda by k-fold cross-validation over games.
 *
 * Games — not observations — are the fold unit, so a game's two sides never
 * land on opposite sides of the split and leak the answer to each other. The
 * score is weighted squared error on held-out games; the winner is the lambda
 * that predicts games it never saw.
 *
 * @param {(Obs & { game: string })[]} obs
 * @param {number[]} grid
 * @param {number} folds
 * @returns {{ lambda: number, error: number, curve: { lambda: number, error: number }[] }}
 */
export function selectLambda(obs, grid, folds = 5) {
  const games = [...new Set(obs.map((o) => o.game))].sort();
  /** @type {Map<string, number>} */ const fold = new Map();
  games.forEach((g, i) => fold.set(g, i % folds));

  const curve = grid.map((lambda) => {
    let err = 0;
    let wSum = 0;
    for (let k = 0; k < folds; k++) {
      const train = obs.filter((o) => fold.get(o.game) !== k);
      const test = obs.filter((o) => fold.get(o.game) === k);
      if (!train.length || !test.length) continue;
      const fit = fitEffects(train, { lambda });
      for (const o of test) {
        // A team unseen in training contributes no effect, so it predicts mu.
        const predicted =
          (fit.offense.get(o.off) ?? fit.mu) + (fit.defense.get(o.def) ?? fit.mu) - fit.mu;
        err += o.weight * (o.value - predicted) ** 2;
        wSum += o.weight;
      }
    }
    return { lambda, error: wSum > 0 ? err / wSum : Infinity };
  });

  const best = curve.reduce((a, b) => (b.error < a.error ? b : a));
  return { lambda: best.lambda, error: best.error, curve };
}

/** Spearman rank correlation, used to check a fit against an outside rating. */
export function spearman(a, b) {
  const rank = (xs) => {
    const order = xs.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
    const r = new Array(xs.length);
    for (let i = 0; i < order.length; ) {
      let j = i;
      while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
      const tied = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) r[order[k][1]] = tied;
      i = j + 1;
    }
    return r;
  };
  const ra = rank(a);
  const rb = rank(b);
  const n = a.length;
  const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
  const ma = mean(ra);
  const mb = mean(rb);
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (ra[i] - ma) * (rb[i] - mb);
    da += (ra[i] - ma) ** 2;
    db += (rb[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
}
