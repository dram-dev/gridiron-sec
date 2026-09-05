/* ============================================================================
 * Print the current ratings as JSON, so a weekly rebuild can say what moved.
 *
 *   npm run etl:snapshot -- --out before.json
 *   npm run etl
 *   npm run etl:snapshot -- --since before.json
 *
 * It writes to a file rather than stdout on purpose: an npm script prints its
 * own banner there, which is enough to make the JSON unparseable.
 *
 * With --since it prints a human-readable diff: which teams moved, by how much,
 * and how far through the season the model has got.
 * ========================================================================== */

import { readFileSync, writeFileSync } from 'node:fs';
import { TEAMS } from '../../src/data/teams.ts';
import { DERIVED } from '../../src/engine/model.ts';
import { MEASURED_META, MEASURED_RECORD_CURRENT } from '../../src/data/measured.ts';

const total = (id) => {
  const c = DERIVED[id].components;
  return c.offense + c.defense + c.specialTeams + c.coaching +
    c.returningProduction + c.portalRecruiting + c.quarterback;
};

const now = {
  throughWeek: MEASURED_META.throughWeek,
  currentGames: MEASURED_META.currentGames,
  builtAt: MEASURED_META.builtAt,
  ratings: Object.fromEntries(TEAMS.map((t) => [t.id, Number(total(t.id).toFixed(2))])),
  records: Object.fromEntries(TEAMS.map((t) => {
    const r = MEASURED_RECORD_CURRENT[t.id];
    return [t.id, `${r.wins}-${r.losses}`];
  })),
};

const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
};
const since = arg('--since');
if (!since) {
  const out = arg('--out');
  if (out) {
    writeFileSync(out, JSON.stringify(now, null, 2));
    console.log(`wrote ${out} — week ${now.throughWeek}, ${now.currentGames} games`);
  } else {
    console.log(JSON.stringify(now, null, 2));
  }
} else {
  const before = JSON.parse(readFileSync(since, 'utf8'));
  const rows = TEAMS.map((t) => ({
    id: t.id,
    was: before.ratings[t.id] ?? null,
    now: now.ratings[t.id],
    record: now.records[t.id],
  })).map((r) => ({ ...r, move: r.was == null ? null : Number((r.now - r.was).toFixed(2)) }));

  const moved = rows.filter((r) => r.move != null && Math.abs(r.move) >= 0.05)
    .sort((a, b) => Math.abs(b.move) - Math.abs(a.move));

  console.log(`week ${before.throughWeek} -> ${now.throughWeek}   ` +
    `games ${before.currentGames} -> ${now.currentGames}`);
  if (!moved.length) {
    console.log('no rating moved by as much as a tenth of a point.');
  } else {
    console.log(`\n${moved.length} of ${rows.length} teams moved:`);
    for (const r of moved) {
      console.log(`  ${r.id.padEnd(5)} ${String(r.was).padStart(6)} -> ${String(r.now).padStart(6)}  ` +
        `${r.move > 0 ? '+' : ''}${r.move.toFixed(2).padStart(6)}   (${r.record})`);
    }
  }
  const order = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const wasOrder = order(before.ratings);
  const nowOrder = order(now.ratings);
  const flips = nowOrder.filter((id, n) => wasOrder[n] !== id);
  console.log(flips.length
    ? `\nconference order changed at ${flips.length} position(s); new top five: ${nowOrder.slice(0, 5).join(', ')}`
    : `\nconference order unchanged; top five: ${nowOrder.slice(0, 5).join(', ')}`);
}
