/* ============================================================================
 * Download the source files the measured layer is built from.
 *
 *   node scripts/etl/fetch.mjs [--data <dir>]
 *
 * They land in .data/, which is gitignored — around 59 MB, dominated by the
 * play-by-play file. Everything else in the pipeline is deterministic, so the
 * generated src/data/measured.ts is what actually ships.
 * ========================================================================== */

import { mkdirSync, createWriteStream, existsSync, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES, BACKTEST_SEASONS } from './sources.mjs';

const BASE = 'https://raw.githubusercontent.com/sportsdataverse/cfbfastR-cfb-data/main/cfb';
/** The extra seasons `npm run etl:backtest` needs — about 210 MB more. */
const backtestSources = () =>
  BACKTEST_SEASONS.flatMap((y) => [
    { file: `play_by_play_${y}.parquet`, url: `${BASE}/pbp/parquet/play_by_play_${y}.parquet`,
      what: `Every play of the ${y} FBS season.` },
    { file: `cfb_returning_production_${y}.parquet`, url: `${BASE}/cfb_returning_production/parquet/cfb_returning_production_${y}.parquet`,
      what: `Returning production at the ${y} vintage.` },
    { file: `cfb_team_talent_${y}.parquet`, url: `${BASE}/cfb_team_talent/parquet/cfb_team_talent_${y}.parquet`,
      what: `Recruiting composite at the ${y} vintage.` },
  ]);

const here = dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--data');
const DATA = resolve(i >= 0 ? process.argv[i + 1] : join(here, '../../.data'));
mkdirSync(DATA, { recursive: true });

const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;

const wanted = process.argv.includes('--backtest')
  ? [...Object.values(SOURCES), ...backtestSources()]
  : Object.values(SOURCES);

for (const { file, url, what } of wanted) {
  const dest = join(DATA, file);
  if (existsSync(dest) && statSync(dest).size > 0) {
    console.log(`have  ${file.padEnd(42)} ${mb(statSync(dest).size)}`);
    continue;
  }
  process.stdout.write(`get   ${file.padEnd(42)} …`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`\n  ${url}\n  ${res.status} ${res.statusText}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  console.log(` ${mb(statSync(dest).size)}\n      ${what}`);
}

console.log(`\nready — now run: npm run etl`);
