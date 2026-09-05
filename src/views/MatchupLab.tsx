import { useMemo, useState } from 'react';
import { Distribution, Radar, StackedBar } from '../components/charts';
import {
  Divider, InfoDot, Label, Panel, PanelHead, ProbabilityBar, Segmented, Slider, Stat,
  Table, Td, Th, TeamMark,
} from '../components/ui';
import { ROSTERS } from '../data/players';
import { ALL_GAMES } from '../data/schedule';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import { CONFERENCES } from '../data/conferences';
import type { Game, TeamId } from '../data/types';
import {
  driveOdds, marginPercentiles, projectGame, simulateGame, type GameProjection,
} from '../engine/game';
import { LEAGUE_DRIVES } from '../engine/constants';
import { projectPlayerGame } from '../engine/players';
import { WEATHER_PRESETS } from '../engine/scenario';
import { CATEGORICAL, num, pct, signed, teamInk, toAmericanOdds } from '../lib/viz';
import { useStore } from '../state/store';

type Site = 'home' | 'neutral' | 'away';

export function MatchupLab() {
  const { state, dispatch, ratings, projectionById, go } = useStore();
  const mode = state.theme;
  const homeId = state.selectedTeam;
  const awayId = state.comparisonTeam;
  const home = TEAM_BY_ID[homeId];
  const away = TEAM_BY_ID[awayId];

  const scheduled = useMemo(
    () =>
      ALL_GAMES.find(
        (g) =>
          (g.homeId === homeId && g.awayId === awayId) || (g.homeId === awayId && g.awayId === homeId),
      ),
    [homeId, awayId],
  );

  const [site, setSite] = useState<Site>('home');
  const [useScheduled, setUseScheduled] = useState(true);

  const game: Game = useMemo(() => {
    if (scheduled && useScheduled) return scheduled;
    return {
      id: `custom-${awayId}-${homeId}-${site}`,
      week: 0,
      date: '',
      homeId: site === 'away' ? awayId : homeId,
      awayId: site === 'away' ? homeId : awayId,
      neutralSite: site === 'neutral' ? 'Neutral field' : undefined,
      conferenceGame: true,
    };
  }, [scheduled, useScheduled, homeId, awayId, site]);

  const projection: GameProjection = useMemo(
    () => (scheduled && useScheduled ? projectionById.get(scheduled.id)! : projectGame(game, ratings, state.scenario)),
    [scheduled, useScheduled, projectionById, game, ratings, state.scenario],
  );

  const sim = useMemo(
    () => simulateGame(projection, 30000, state.scenario.seed ^ 0x5f3a),
    [projection, state.scenario.seed],
  );

  const bands = useMemo(() => marginPercentiles(sim), [sim]);

  const homeSide = projection.home;
  const awaySide = projection.away;
  const homeTeam = TEAM_BY_ID[homeSide.id] ?? home;
  const awayTeam = TEAM_BY_ID[awaySide.id] ?? away;
  const homeSideId = homeTeam.id;
  const awaySideId = awayTeam.id;

  /** Swap one side of the projected game for a different team. */
  const replaceSide = (side: 'away' | 'home', id: TeamId) => {
    const keep = side === 'away' ? homeSideId : awaySideId;
    dispatch({ type: 'selectTeam', teamId: id });
    dispatch({ type: 'comparisonTeam', teamId: keep });
  };

  const marginBins = useMemo(() => {
    const map = new Map<number, number>();
    for (const h of sim.marginHistogram) {
      const bucket = Math.max(-45, Math.min(45, h.margin));
      map.set(bucket, (map.get(bucket) ?? 0) + h.probability);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([x, p]) => ({ x, p }));
  }, [sim]);

  const drives = LEAGUE_DRIVES * projection.paceFactor;
  const homeOdds = driveOdds(projection.homePoints / drives);
  const awayOdds = driveOdds(projection.awayPoints / drives);

  const keyPlayers = (teamId: TeamId, isHome: boolean) =>
    [...ROSTERS[teamId]]
      .sort((a, b) => b.par - a.par)
      .slice(0, 6)
      .map((p) => ({ p, proj: projectPlayerGame(p, projection, isHome) }));

  const spreadLadder = [-21, -17, -14, -10, -7, -3, 0, 3, 7, 10, 14, 17, 21];
  const totalLadder = [-9, -6, -3, 0, 3, 6, 9].map((d) => Math.round(projection.total) + d);

  return (
    <div className="space-y-4">
      {/* ---- Selection ----------------------------------------------------- */}
      <Panel>
        <div className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* The pickers are labelled by the roles in the game actually being
              projected, not by which slot the team happens to occupy in state.
              Selecting the real week-6 meeting must not show Georgia as "home"
              when the game is in Tuscaloosa. */}
          <TeamPicker
            label={projection.neutralSite ? 'Team' : 'Away'}
            value={awaySideId}
            exclude={homeSideId}
            onChange={(id) => replaceSide('away', id)}
          />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
              {projection.neutralSite ? 'vs' : 'at'}
            </span>
            <button
              className="btn !px-2 !py-1 !text-[11px]"
              onClick={() => {
                dispatch({ type: 'selectTeam', teamId: awaySideId });
                dispatch({ type: 'comparisonTeam', teamId: homeSideId });
                if (!scheduled || !useScheduled) setSite((v) => (v === 'home' ? 'away' : v === 'away' ? 'home' : v));
              }}
              title="Swap sides"
            >
              Swap
            </button>
          </div>
          <TeamPicker
            label={projection.neutralSite ? 'Team' : 'Home'}
            value={homeSideId}
            exclude={awaySideId}
            onChange={(id) => replaceSide('home', id)}
          />
        </div>
        <Divider />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3">
          {scheduled ? (
            <label className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={useScheduled}
                onChange={(e) => setUseScheduled(e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--accent)]"
              />
              Use the real week {scheduled.week} matchup
              {scheduled.neutralSite && <span className="chip !text-[9.5px]">{scheduled.neutralSite}</span>}
            </label>
          ) : (
            <span className="text-[11.5px]" style={{ color: 'var(--text-faint)' }}>
              These two do not meet in 2026 — this is a hypothetical.
            </span>
          )}
          {(!scheduled || !useScheduled) && (
            <div className="flex items-center gap-2">
              <Label>Site</Label>
              <Segmented
                size="sm"
                ariaLabel="Game site"
                value={site}
                onChange={setSite}
                options={[
                  { value: 'away', label: `At ${away.abbr}` },
                  { value: 'neutral', label: 'Neutral' },
                  { value: 'home', label: `At ${home.abbr}` },
                ]}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Label>Weather</Label>
            <select
              className="field !w-auto !py-1 !text-[12px]"
              value={state.scenario.weather.kind}
              onChange={(e) =>
                dispatch({ type: 'weather', weather: WEATHER_PRESETS.find((w) => w.kind === e.target.value)! })
              }
              aria-label="Weather conditions"
            >
              {WEATHER_PRESETS.map((w) => <option key={w.kind} value={w.kind}>{w.label}</option>)}
            </select>
          </div>
          <div className="min-w-[190px] flex-1">
            <Slider
              label="Home-field advantage"
              value={state.scenario.homeFieldMultiplier}
              min={0}
              max={2}
              step={0.05}
              reset={1}
              onChange={(v) => dispatch({ type: 'homeField', value: v })}
              format={(v) => (v === 0 ? 'Off' : `${Math.round(v * 100)}%`)}
            />
          </div>
        </div>
      </Panel>

      {/* ---- Headline ------------------------------------------------------ */}
      <Panel className="overflow-hidden">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <SideCard team={awayTeam} points={projection.awayPoints} prob={projection.awayWinProb} align="left" mode={mode} />
          <div className="flex flex-col items-center gap-2 text-center">
            <Label>{projection.neutralSite ? 'Neutral site' : `at ${homeTeam.abbr}`}</Label>
            <div className="text-[32px] font-bold leading-none tabular-nums tracking-[-0.03em]" style={{ color: 'var(--text-hi)' }}>
              {Math.abs(projection.margin) < 0.25
                ? 'Pick’em'
                : `${projection.margin > 0 ? homeTeam.abbr : awayTeam.abbr} −${Math.abs(projection.margin).toFixed(1)}`}
            </div>
            <div className="text-[12px] tabular-nums" style={{ color: 'var(--text-low)' }}>
              Total {projection.total.toFixed(1)}
            </div>
            <div className="chip">σ {projection.sigma.toFixed(1)} pts</div>
          </div>
          <SideCard team={homeTeam} points={projection.homePoints} prob={projection.homeWinProb} align="right" mode={mode} />
        </div>

        <div className="px-5 pb-4">
          <ProbabilityBar
            leftLabel={awayTeam.abbr}
            rightLabel={homeTeam.abbr}
            leftProbability={projection.awayWinProb}
            height={30}
          />
        </div>

        <Divider />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {[
            { l: `${awayTeam.abbr} moneyline`, v: toAmericanOdds(projection.awayWinProb), s: pct(projection.awayWinProb, 1) },
            { l: `${homeTeam.abbr} moneyline`, v: toAmericanOdds(projection.homeWinProb), s: pct(projection.homeWinProb, 1) },
            { l: 'Median margin', v: signed(bands.p50, 0), s: `${homeTeam.abbr} perspective` },
            { l: '90% margin range', v: `${signed(bands.p05, 0)} to ${signed(bands.p95, 0)}`, s: '5th to 95th percentile' },
            { l: 'Projected possessions', v: (drives).toFixed(1), s: 'per team' },
            { l: 'One-score game', v: pct(sim.marginSorted.filter((m) => Math.abs(m) <= 8).length / sim.iterations), s: 'within eight points' },
          ].map((x) => (
            <div key={x.l} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
              <Stat label={x.l} value={x.v} sub={x.s} size="sm" />
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- Distribution + drivers ---------------------------------------- */}
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel>
          <PanelHead
            title="Margin distribution"
            subtitle={`${sim.iterations.toLocaleString()} drive-level simulations. The spikes on three, seven and ten are real — football scores are not smooth.`}
            right={<InfoDot text="Each simulated game plays out possession by possession, with drive outcomes calibrated so the expected points match the closed-form projection exactly." />}
          />
          <div className="px-5 pb-4">
            <Distribution
              bins={marginBins}
              height={168}
              format={(x) => (x > 0 ? `${homeTeam.abbr} by ${x}` : `${awayTeam.abbr} by ${-x}`)}
              ariaLabel="Distribution of simulated final margins"
              colorFor={(x) => (x > 0 ? CATEGORICAL[mode][1] : CATEGORICAL[mode][0])}
            />
            <div className="mt-1.5 flex justify-between text-[10.5px]" style={{ color: 'var(--text-faint)' }}>
              <span>{awayTeam.abbr} by 45+</span>
              <span>Even</span>
              <span>{homeTeam.abbr} by 45+</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px]" style={{ color: 'var(--text-low)' }}>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORICAL[mode][0] }} />
                {awayTeam.school} wins
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORICAL[mode][1] }} />
                {homeTeam.school} wins
              </span>
            </div>
          </div>
          <Divider />
          <div className="px-5 py-4">
            <Label>Most likely final scores</Label>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sim.topScores.slice(0, 6).map((s) => (
                <div
                  key={`${s.home}-${s.away}`}
                  className="flex items-center justify-between rounded-[8px] px-3 py-2"
                  style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line-faint)' }}
                >
                  <span className="text-[13px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>
                    {homeTeam.abbr} {s.home} — {s.away} {awayTeam.abbr}
                  </span>
                  <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-low)' }}>{pct(s.probability, 2)}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHead title="What is driving the number" subtitle="The projection is additive — these are the pieces." />
            <div className="space-y-2.5 px-5 pb-4">
              {projection.drivers.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <span className="mt-px w-[92px] shrink-0 text-[11.5px] font-semibold" style={{ color: 'var(--text)' }}>
                    {d.label}
                  </span>
                  {d.value !== 0 && (
                    <span
                      className="w-[52px] shrink-0 text-[12px] font-bold tabular-nums"
                      style={{ color: d.value > 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}
                    >
                      {signed(d.value)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 text-[11.5px] leading-snug" style={{ color: 'var(--text-low)' }}>
                    {d.detail}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title="Drive outcomes"
              subtitle="Projected result of a possession for each side, from the calibrated drive model."
            />
            <div className="space-y-3.5 px-5 pb-4">
              {[
                { t: awayTeam, o: awayOdds, pts: projection.awayPoints },
                { t: homeTeam, o: homeOdds, pts: projection.homePoints },
              ].map((row) => (
                <div key={row.t.id}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: teamInk(row.t, mode) }}>
                      <TeamMark team={row.t} size={9} /> {row.t.school}
                    </span>
                    <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-low)' }}>
                      {(row.pts / drives).toFixed(2)} pts per drive
                    </span>
                  </div>
                  <StackedBar
                    height={14}
                    segments={[
                      { key: 'td', value: row.o.td, color: 'var(--viz-seq-2)', label: 'Touchdown' },
                      { key: 'fg', value: row.o.fg, color: 'var(--viz-seq-4)', label: 'Field goal' },
                      { key: 'no', value: row.o.empty, color: 'var(--bg-active)', label: 'No points' },
                    ]}
                  />
                  <div className="mt-1 flex gap-3 text-[10.5px] tabular-nums" style={{ color: 'var(--text-low)' }}>
                    <span>TD {pct(row.o.td)}</span>
                    <span>FG {pct(row.o.fg)}</span>
                    <span>Empty {pct(row.o.empty)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ---- Betting ladders ------------------------------------------------ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Spread ladder" subtitle={`Probability ${homeTeam.school} covers each number.`} />
          <Table>
            <thead>
              <tr>
                <Th align="right" width={80}>{homeTeam.abbr} line</Th>
                <Th align="right" width={80}>Cover</Th>
                <Th align="right" width={80}>Fair odds</Th>
                <Th>Likelihood</Th>
              </tr>
            </thead>
            <tbody>
              {spreadLadder.map((s) => {
                const p = sim.coverProb(s);
                return (
                  <tr key={s} className="row-hover">
                    <Td align="right" className="font-semibold" style={{ color: 'var(--text-hi)' }}>
                      {s > 0 ? `+${s}` : s === 0 ? 'PK' : s}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text)' }}>{pct(p, 1)}</Td>
                    <Td align="right" style={{ color: 'var(--text-low)' }}>{toAmericanOdds(p)}</Td>
                    <Td>
                      <StackedBar
                        height={7}
                        segments={[
                          { key: 'y', value: p, color: 'var(--viz-seq-3)', label: 'Covers' },
                          { key: 'n', value: 1 - p, color: 'var(--bg-active)', label: 'Does not cover' },
                        ]}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>

        <Panel>
          <PanelHead title="Total ladder" subtitle="Probability the combined score goes over each number." />
          <Table>
            <thead>
              <tr>
                <Th align="right" width={80}>Total</Th>
                <Th align="right" width={80}>Over</Th>
                <Th align="right" width={80}>Fair odds</Th>
                <Th>Likelihood</Th>
              </tr>
            </thead>
            <tbody>
              {totalLadder.map((t) => {
                const p = sim.overProb(t);
                return (
                  <tr key={t} className="row-hover">
                    <Td align="right" className="font-semibold" style={{ color: 'var(--text-hi)' }}>{t}.5</Td>
                    <Td align="right" style={{ color: 'var(--text)' }}>{pct(p, 1)}</Td>
                    <Td align="right" style={{ color: 'var(--text-low)' }}>{toAmericanOdds(p)}</Td>
                    <Td>
                      <StackedBar
                        height={7}
                        segments={[
                          { key: 'o', value: p, color: 'var(--viz-seq-3)', label: 'Over' },
                          { key: 'u', value: 1 - p, color: 'var(--bg-active)', label: 'Under' },
                        ]}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>
      </div>

      {/* ---- Team profiles -------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Team profiles"
          subtitle={`Both rosters on the same normalised axes. Every value is scaled across all ${TEAMS.length} projected teams, so a cross-conference comparison reads on one scale.`}
        />
        <div className="grid gap-5 px-5 pb-5 lg:grid-cols-[auto_1fr] lg:items-center">
          <Radar
            size={280}
            axes={[
              { key: 'off', label: 'Offence' },
              { key: 'def', label: 'Defence' },
              { key: 'explosive', label: 'Explosive' },
              { key: 'havoc', label: 'Havoc' },
              { key: 'trenches', label: 'Trenches' },
              { key: 'pace', label: 'Tempo' },
              { key: 'talent', label: 'Talent' },
            ]}
            series={[awayTeam, homeTeam].map((t, i) => {
              const r = ratings[t.id];
              const norm = (v: number, lo: number, hi: number) => Math.max(0.04, Math.min(1, (v - lo) / (hi - lo)));
              return {
                key: t.id,
                label: t.school,
                color: CATEGORICAL[mode][i],
                values: [
                  norm(r.offense, 0, 14),
                  norm(r.defense, 0, 14),
                  norm(t.efficiency.offExplosive, 0.6, 0.9),
                  norm(t.efficiency.havoc, 0.14, 0.26),
                  norm(t.efficiency.lineYards, 2.5, 3.15),
                  norm(t.efficiency.playsPerGame, 60, 76),
                  norm(t.talent.blueChipRatio, 0.15, 0.9),
                ],
              };
            })}
          />
          <Table>
            <thead>
              <tr>
                <Th>Measure</Th>
                <Th align="right">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORICAL[mode][0] }} />
                    {awayTeam.abbr}
                  </span>
                </Th>
                <Th align="right">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: CATEGORICAL[mode][1] }} />
                    {homeTeam.abbr}
                  </span>
                </Th>
                <Th align="right" width={72}>Edge</Th>
              </tr>
            </thead>
            <tbody>
              {[
                { l: 'Team rating', a: ratings[awayTeam.id].total, h: ratings[homeTeam.id].total, f: (v: number) => signed(v) },
                { l: 'Offence', a: ratings[awayTeam.id].offense, h: ratings[homeTeam.id].offense, f: (v: number) => signed(v) },
                { l: 'Defence', a: ratings[awayTeam.id].defense, h: ratings[homeTeam.id].defense, f: (v: number) => signed(v) },
                { l: 'Special teams', a: ratings[awayTeam.id].specialTeams, h: ratings[homeTeam.id].specialTeams, f: (v: number) => signed(v) },
                { l: 'Plays per game', a: awayTeam.efficiency.playsPerGame, h: homeTeam.efficiency.playsPerGame, f: (v: number) => num(v) },
                { l: 'Success rate', a: awayTeam.efficiency.offSuccess, h: homeTeam.efficiency.offSuccess, f: (v: number) => pct(v, 1) },
                { l: 'Havoc rate', a: awayTeam.efficiency.havoc, h: homeTeam.efficiency.havoc, f: (v: number) => pct(v, 1) },
                { l: 'Sack rate allowed', a: -awayTeam.efficiency.sackRateAllowed, h: -homeTeam.efficiency.sackRateAllowed, f: (v: number) => pct(-v, 1) },
                { l: 'Blue-chip ratio', a: awayTeam.talent.blueChipRatio, h: homeTeam.talent.blueChipRatio, f: (v: number) => pct(v) },
                { l: 'Returning production', a: awayTeam.returning.overall, h: homeTeam.returning.overall, f: (v: number) => pct(v) },
              ].map((row) => {
                const homeBetter = row.h > row.a;
                return (
                  <tr key={row.l} className="row-hover">
                    <Td mono={false} style={{ color: 'var(--text)' }}>{row.l}</Td>
                    <Td align="right" style={{ color: homeBetter ? 'var(--text-low)' : 'var(--text-hi)', fontWeight: homeBetter ? 400 : 600 }}>
                      {row.f(row.a)}
                    </Td>
                    <Td align="right" style={{ color: homeBetter ? 'var(--text-hi)' : 'var(--text-low)', fontWeight: homeBetter ? 600 : 400 }}>
                      {row.f(row.h)}
                    </Td>
                    <Td align="right" style={{ color: homeBetter ? CATEGORICAL[mode][1] : CATEGORICAL[mode][0] }} className="font-semibold">
                      {homeBetter ? homeTeam.abbr : awayTeam.abbr}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Panel>

      {/* ---- Player projections --------------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { team: awayTeam, isHome: false },
          { team: homeTeam, isHome: true },
        ].map(({ team, isHome }) => (
          <Panel key={team.id}>
            <PanelHead
              title={
                <span className="flex items-center gap-2">
                  <TeamMark team={team} size={11} />
                  <span style={{ color: teamInk(team, mode) }}>{team.school}</span>
                  <span style={{ color: 'var(--text-low)' }}>key projections</span>
                </span>
              }
              subtitle="Projected line for this specific matchup, adjusted for the opponent and expected game script."
            />
            <Table>
              <thead>
                <tr>
                  <Th width={48}>Pos</Th>
                  <Th>Player</Th>
                  <Th align="right" width={62}>Matchup</Th>
                  <Th align="right">Projection</Th>
                </tr>
              </thead>
              <tbody>
                {keyPlayers(team.id, isHome).map(({ p, proj }) => {
                  const headline = proj.stats[0];
                  return (
                    <tr key={p.id} className="row-hover cursor-pointer" onClick={() => go('player', { playerId: p.id })}>
                      <Td><span className="chip !text-[9.5px] !px-1.5">{p.position}</span></Td>
                      <Td mono={false}>
                        <span className="font-medium" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                      </Td>
                      <Td align="right" style={{ color: proj.matchup >= 1 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                        {pct(proj.matchup)}
                      </Td>
                      <Td align="right" mono={false}>
                        {headline ? (
                          <span>
                            <span className="font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>
                              {headline.mean.toFixed(headline.precision)}
                            </span>
                            <span className="ml-1.5 text-[11px]" style={{ color: 'var(--text-low)' }}>{headline.label.toLowerCase()}</span>
                            <span className="ml-1.5 text-[10.5px] tabular-nums" style={{ color: 'var(--text-faint)' }}>
                              {headline.p10.toFixed(headline.precision)}–{headline.p90.toFixed(headline.precision)}
                            </span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-faint)' }}>—</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function TeamPicker({
  label, value, exclude, onChange,
}: { label: string; value: TeamId; exclude: TeamId; onChange: (id: TeamId) => void }) {
  const team = TEAM_BY_ID[value];
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5 flex items-center gap-2.5">
        <TeamMark team={team} size={18} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TeamId)}
          className="field !text-[14px] !font-semibold"
          aria-label={`${label} team`}
        >
          {/* Grouped, because picking across conferences is the point of this view. */}
          {CONFERENCES.map((c) => (
            <optgroup key={c.id} label={c.name}>
              {c.teams.filter((t) => t.id !== exclude).map((t) => (
                <option key={t.id} value={t.id}>{t.school}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}

function SideCard({
  team, points, prob, align, mode,
}: {
  team: (typeof TEAMS)[number];
  points: number;
  prob: number;
  align: 'left' | 'right';
  mode: 'dark' | 'light';
}) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
        <TeamMark team={team} size={14} />
        <span className="truncate text-[17px] font-bold tracking-[-0.02em]" style={{ color: teamInk(team, mode) }}>
          {team.school}
        </span>
      </div>
      <div className="mt-2 text-[46px] font-bold leading-none tabular-nums tracking-[-0.04em]" style={{ color: 'var(--text-hi)' }}>
        {points.toFixed(0)}
      </div>
      <div className="mt-1.5 text-[12.5px] font-semibold tabular-nums" style={{ color: 'var(--text-mid)' }}>
        {pct(prob, 1)} to win
      </div>
    </div>
  );
}
