/* ============================================================================
 * The measured layer.
 *
 * These tests exist to stop the data quietly regressing to hand-authored
 * numbers. The point of scripts/etl is that no human types a per-play figure;
 * if someone pastes one back in, something here should fail.
 * ========================================================================== */

import { describe, expect, it } from 'vitest';
import { TEAMS } from '../../data/teams';
import {
  MEASURED_EFFICIENCY, MEASURED_META, MEASURED_RECORD,
  MEASURED_RETURNING, MEASURED_TALENT,
} from '../../data/measured';

describe('the measured layer', () => {
  it('is what every team actually uses', () => {
    // Object identity, not deep equality: the team must be pointing at the
    // generated record, not carrying a copy that could drift away from it.
    for (const t of TEAMS) {
      expect(t.efficiency, t.id).toBe(MEASURED_EFFICIENCY[t.id]);
      expect(t.record2025, t.id).toBe(MEASURED_RECORD[t.id]);
    }
  });

  it('reaches every SEC team with finite numbers throughout', () => {
    expect(Object.keys(MEASURED_EFFICIENCY)).toHaveLength(TEAMS.length);
    for (const t of TEAMS) {
      for (const [field, value] of Object.entries(MEASURED_EFFICIENCY[t.id])) {
        expect(Number.isFinite(value), `${t.id}.${field}`).toBe(true);
      }
    }
  });

  it('was built from a full season of real plays', () => {
    expect(MEASURED_META.plays).toBeGreaterThan(150_000);
    expect(MEASURED_META.games).toBeGreaterThan(800);
    // The adjustment is fit over all of FBS, not just the sixteen teams shown.
    expect(MEASURED_META.teams).toBeGreaterThan(130);
    expect(MEASURED_META.priorSeason).toBe(MEASURED_META.projectionSeason - 1);
  });

  it('predicts game margins better with the schedule removed than with it left in', () => {
    // The whole justification for the opponent adjustment, carried in the data.
    expect(MEASURED_META.marginR2.adjusted).toBeGreaterThan(MEASURED_META.marginR2.raw);
    expect(MEASURED_META.marginR2.adjusted).toBeGreaterThan(0.3);
  });

  it('chose every ridge weight by cross-validation rather than by hand', () => {
    const tuned = Object.values(MEASURED_META.tuning);
    expect(tuned.length).toBeGreaterThanOrEqual(8);
    for (const t of tuned) {
      expect(t.lambda).toBeGreaterThan(0);
      expect(t.observations).toBeGreaterThan(1_000);
      expect(Number.isFinite(t.error)).toBe(true);
    }
    // If every metric landed on the same weight, the search is not searching.
    expect(new Set(tuned.map((t) => t.lambda)).size).toBeGreaterThan(1);
  });

  it('holds every rate inside the range its definition allows', () => {
    const rate = (v: number) => v >= 0 && v <= 1;
    for (const t of TEAMS) {
      const e = MEASURED_EFFICIENCY[t.id];
      for (const f of ['offSuccess', 'defSuccess', 'havoc', 'havocAllowed', 'sackRate',
        'sackRateAllowed', 'passRate', 'fourthDownGoRate', 'redZoneTdRate',
        'redZoneTdRateAllowed'] as const) {
        expect(rate(e[f]), `${t.id}.${f} = ${e[f]}`).toBe(true);
      }
      expect(e.playsPerGame).toBeGreaterThan(40);
      expect(e.playsPerGame).toBeLessThan(100);
      expect(e.secondsPerPlay).toBeGreaterThan(15);
      expect(e.secondsPerPlay).toBeLessThan(45);
      expect(e.startingFieldPos).toBeGreaterThan(15);
      expect(e.startingFieldPos).toBeLessThan(50);
      expect(Math.abs(e.proe)).toBeLessThan(0.5);

      const r = MEASURED_RETURNING[t.id];
      for (const f of ['overall', 'offense', 'defense'] as const) {
        expect(rate(r[f]), `${t.id}.returning.${f}`).toBe(true);
      }
      expect(MEASURED_TALENT[t.id].blueChipRatio).toBeLessThanOrEqual(1);
      expect(MEASURED_TALENT[t.id].composite).toBeGreaterThan(0);
    }
  });

  it('reports records that reconcile with a real season', () => {
    for (const t of TEAMS) {
      const r = MEASURED_RECORD[t.id];
      const played = r.wins + r.losses;
      expect(played, t.id).toBeGreaterThanOrEqual(12);
      expect(played, t.id).toBeLessThanOrEqual(16);
      expect(r.confWins + r.confLosses, t.id).toBeLessThanOrEqual(played);
      expect(r.pointsFor / played, t.id).toBeGreaterThan(10);
      expect(r.pointsFor / played, t.id).toBeLessThan(60);
    }
    // Conference play is zero-sum across the league.
    const wins = TEAMS.reduce((n, t) => n + MEASURED_RECORD[t.id].confWins, 0);
    const losses = TEAMS.reduce((n, t) => n + MEASURED_RECORD[t.id].confLosses, 0);
    expect(wins).toBe(losses);
  });

  it('separates the teams it should separate', () => {
    // A measurement that ranked everyone the same would pass every check above
    // and still be useless. The best offence must clear the worst by a margin
    // far larger than the noise in a single game.
    const off = TEAMS.map((t) => MEASURED_EFFICIENCY[t.id].offEpa);
    expect(Math.max(...off) - Math.min(...off)).toBeGreaterThan(0.15);
    const def = TEAMS.map((t) => MEASURED_EFFICIENCY[t.id].defEpa);
    expect(Math.max(...def) - Math.min(...def)).toBeGreaterThan(0.15);
  });

  it('carries no suspiciously round hand-typed efficiency values', () => {
    // Authored numbers cluster on two decimals. Measured ones do not.
    const values = TEAMS.flatMap((t) =>
      (['offEpa', 'defEpa', 'offSuccess', 'defSuccess', 'lineYards'] as const)
        .map((f) => MEASURED_EFFICIENCY[t.id][f]),
    );
    const threeDecimals = values.filter((v) => Math.abs(v * 100 - Math.round(v * 100)) > 1e-9);
    expect(threeDecimals.length / values.length).toBeGreaterThan(0.4);
  });
});
