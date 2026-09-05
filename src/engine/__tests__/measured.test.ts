/* ============================================================================
 * The measured layer.
 *
 * These tests exist to stop the data quietly regressing to hand-authored
 * numbers. The point of scripts/etl is that no human types a per-play figure;
 * if someone pastes one back in, something here should fail.
 * ========================================================================== */

import { describe, expect, it } from 'vitest';
import { TEAMS } from '../../data/teams';
import { ALL_PLAYERS, PLAYER_BY_ID } from '../../data/players';
import { MEASURED_PLAYERS } from '../../data/measuredPlayers';
import { stabilise, starterWorkload } from '../players';
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

describe('the measured player layer', () => {
  it('reaches the players the play-by-play can actually see', () => {
    const seen = (pos: string) => ALL_PLAYERS.filter((p) => p.position === pos);
    const hit = (pos: string) => seen(pos).filter((p) => MEASURED_PLAYERS[p.id]).length;

    // Ball-carriers are named on every snap, so coverage should be near total.
    for (const pos of ['QB', 'RB', 'WR', 'TE', 'K'] as const) {
      expect(hit(pos) / seen(pos).length, pos).toBeGreaterThan(0.85);
    }
    // Linemen are never named in play-by-play. Claiming otherwise would mean
    // the matcher had latched onto someone else with the same name.
    for (const pos of ['OT', 'IOL'] as const) {
      expect(hit(pos) / seen(pos).length, pos).toBeLessThan(0.2);
    }
  });

  it('lands measured production on the roster itself', () => {
    for (const [id, m] of Object.entries(MEASURED_PLAYERS)) {
      const player = PLAYER_BY_ID[id];
      expect(player, id).toBeDefined();
      expect(player.measuredPlays, id).toBe(m.plays);
      expect(player.provenance, id).toBe('measured');
      for (const [field, value] of Object.entries(m.production)) {
        expect(player.production2025?.[field as keyof typeof m.production], `${id}.${field}`).toBe(value);
      }
    }
  });

  it('keeps every measured line internally consistent', () => {
    for (const [id, m] of Object.entries(MEASURED_PLAYERS)) {
      const p = m.production;
      if (p.completions != null && p.attempts != null) {
        expect(p.completions, id).toBeLessThanOrEqual(p.attempts);
      }
      if (p.receptions != null && p.targets != null) {
        expect(p.receptions, id).toBeLessThanOrEqual(p.targets);
      }
      if (p.carries != null && p.rushYds != null && m.rates.ypc != null) {
        expect(m.rates.ypc, id).toBeCloseTo(p.rushYds / p.carries, 1);
      }
      expect(p.games, id).toBeGreaterThan(0);
      expect(p.games, id).toBeLessThanOrEqual(16);
      for (const share of Object.values(m.usage)) {
        expect(share).toBeGreaterThanOrEqual(0);
        expect(share).toBeLessThanOrEqual(1);
      }
    }
  });

  it('does not credit a transfer to the wrong school', () => {
    for (const p of ALL_PLAYERS) {
      const m = MEASURED_PLAYERS[p.id];
      if (!m) continue;
      const expected = p.origin === 'transfer' && p.from ? p.from : TEAMS.find((t) => t.id === p.teamId)!.school;
      expect(m.school2025.toLowerCase(), `${p.name} (${p.origin})`)
        .toContain(expected.toLowerCase());
    }
  });
});

describe('projecting from measured rates', () => {
  it('pulls an extreme rate toward the mean, in proportion to its evidence', () => {
    const prior = { mean: 4.6, weight: 190 };
    const big = stabilise(6.5, 256, prior);
    const small = stabilise(6.5, 20, prior);

    // Both regress; the one with less evidence regresses further.
    expect(big).toBeLessThan(6.5);
    expect(small).toBeLessThan(big);
    expect(small).toBeGreaterThan(prior.mean);
    // A player with no measured sample is simply the league.
    expect(stabilise(undefined, undefined, prior)).toBe(prior.mean);
    expect(stabilise(6.5, 0, prior)).toBe(prior.mean);
    // Regression cuts both ways.
    expect(stabilise(2.9, 120, prior)).toBeGreaterThan(2.9);
  });

  it('sits starters down as a game gets out of hand', () => {
    expect(starterWorkload(0)).toBe(1);
    expect(starterWorkload(14)).toBe(1);
    expect(starterWorkload(35)).toBeLessThan(1);
    // Symmetric: a team down forty empties the bench too.
    expect(starterWorkload(-45)).toBe(starterWorkload(45));
    // Bounded — the first half still happened.
    for (const m of [-90, -50, 0, 50, 90]) {
      expect(starterWorkload(m)).toBeGreaterThanOrEqual(0.55);
      expect(starterWorkload(m)).toBeLessThanOrEqual(1);
    }
  });
});
