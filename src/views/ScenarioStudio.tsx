import { useMemo, useState } from 'react';
import { BarList, StackedBar } from '../components/charts';
import { IconClose, IconReset, IconSpark } from '../components/icons';
import {
  Divider, EmptyState, InfoDot, Label, Panel, PanelHead, Segmented, Slider,
  Table, Td, Th, TeamMark,
} from '../components/ui';
import { ROSTERS } from '../data/players';
import { CONFERENCE_GAMES } from '../data/schedule';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import type { Availability, Player, TeamId } from '../data/types';
import { WEATHER_PRESETS } from '../engine/scenario';
import { pct, signed, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

/* ============================================================================
 * Scenario Studio.
 *
 * Everything here is an override on the baseline dataset — nothing mutates the
 * underlying data. Every number in the app moves together: rule a quarterback
 * out and his team's rating drops by his PAR, which changes every game he
 * would have played, which changes the standings, which changes the title and
 * playoff odds. The diff against the baseline is always on screen.
 * ========================================================================== */

type Tab = 'availability' | 'dials' | 'conditions' | 'results';

export function ScenarioStudio() {
  const {
    state, dispatch, baselineRatings, ranked, season, baselineSeason, editCount, simulating, go,
  } = useStore();
  const mode = state.theme;
  const [tab, setTab] = useState<Tab>('availability');

  const movers = useMemo(
    () =>
      [...ranked]
        .map((r) => ({
          r,
          ratingDelta: r.total - baselineRatings[r.teamId].total,
          winDelta: season.teams[r.teamId].meanWins - baselineSeason.teams[r.teamId].meanWins,
          titleDelta: season.teams[r.teamId].pChampion - baselineSeason.teams[r.teamId].pChampion,
          cfpDelta: season.teams[r.teamId].pPlayoff - baselineSeason.teams[r.teamId].pPlayoff,
        }))
        // Rating deltas are deterministic; win and odds deltas carry Monte Carlo
        // noise of roughly 1/sqrt(iterations). Trigger on the former so the list
        // never fills with spurious ±0.0 rows.
        .filter((m) => Math.abs(m.ratingDelta) > 0.01 || Math.abs(m.winDelta) > 0.12)
        .sort((a, b) => Math.abs(b.winDelta) - Math.abs(a.winDelta)),
    [ranked, baselineRatings, season, baselineSeason],
  );

  /* ---- Presets --------------------------------------------------------- */

  const applyNeutralFields = () => dispatch({ type: 'homeField', value: 0 });

  const applyTurnoverRegression = () => {
    for (const t of TEAMS) {
      // Turnover margin regresses roughly to zero year over year; each unit of
      // margin is worth about 1.6 points a game.
      dispatch({ type: 'teamDial', teamId: t.id, patch: { turnoverLuck: -t.efficiency.turnoverMargin * 1.6 } });
    }
  };

  const applyQuarterbackCarnage = () => {
    for (const t of TEAMS) {
      const qb = [...ROSTERS[t.id]].filter((p) => p.position === 'QB').sort((a, b) => b.par - a.par)[0];
      if (qb) dispatch({ type: 'playerStatus', playerId: qb.id, status: 'out' });
    }
  };

  const applyStormySeason = () => {
    dispatch({ type: 'weather', weather: WEATHER_PRESETS.find((w) => w.kind === 'wind')! });
  };

  return (
    <div className="space-y-4">
      {/* ---- Control bar ---------------------------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3.5">
          <div className="min-w-0">
            <Label>Scenario</Label>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="text-[16px] font-bold tracking-[-0.01em]"
                style={{ color: editCount ? 'var(--accent-hi)' : 'var(--text-hi)' }}
              >
                {editCount === 0 ? 'Baseline' : `${editCount} override${editCount === 1 ? '' : 's'}`}
              </span>
              {simulating && (
                <span className="chip !text-[10px]" style={{ color: 'var(--accent-hi)' }}>Recomputing…</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="label mr-1">Presets</span>
            <button className="btn !py-1 !text-[11px]" onClick={applyNeutralFields}><IconSpark size={11} /> Neutral fields</button>
            <button className="btn !py-1 !text-[11px]" onClick={applyTurnoverRegression}><IconSpark size={11} /> Turnover regression</button>
            <button className="btn !py-1 !text-[11px]" onClick={applyQuarterbackCarnage}><IconSpark size={11} /> Every QB1 out</button>
            <button className="btn !py-1 !text-[11px]" onClick={applyStormySeason}><IconSpark size={11} /> Windy season</button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Segmented
              size="sm"
              ariaLabel="Simulation precision"
              value={state.precision}
              onChange={(v) => dispatch({ type: 'precision', precision: v })}
              options={[
                { value: 'fast', label: 'Fast', title: '6,000 simulated seasons — responsive while you drag sliders' },
                { value: 'high', label: 'Precise', title: '30,000 simulated seasons — smoother tail probabilities' },
              ]}
            />
            <button
              className="btn !py-1 !text-[11px]"
              onClick={() => dispatch({ type: 'seed', seed: Math.floor(Math.random() * 1e9) })}
              title="Reshuffle the simulation noise without changing the model"
            >
              Reseed
            </button>
            <button className="btn !py-1 !text-[11px]" onClick={() => dispatch({ type: 'resetScenario' })} disabled={editCount === 0}>
              <IconReset size={11} /> Reset
            </button>
          </div>
        </div>

        {editCount > 0 && movers.length > 0 && (
          <>
            <Divider />
            <div className="px-5 py-4">
              <Label>What your scenario changed</Label>
              <div className="mt-2.5 overflow-x-auto">
                <Table>
                  <thead>
                    <tr>
                      <Th width={150}>Team</Th>
                      <Th align="right" width={90}>Rating</Th>
                      <Th align="right" width={100}>Projected wins</Th>
                      <Th align="right" width={110}>SEC title</Th>
                      <Th align="right" width={110}>Playoff bid</Th>
                      <Th width={120}>Rank move</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {movers.slice(0, 10).map((m) => (
                      <tr key={m.r.teamId} className="row-hover cursor-pointer" onClick={() => go('team', { teamId: m.r.teamId })}>
                        <Td mono={false}>
                          <span className="flex items-center gap-2">
                            <TeamMark team={m.r.team} size={10} />
                            <span className="truncate font-medium" style={{ color: teamInk(m.r.team, mode) }}>{m.r.team.school}</span>
                          </span>
                        </Td>
                        <Td align="right">
                          <span style={{ color: 'var(--text-hi)' }}>{m.r.total.toFixed(1)}</span>
                          <span className="ml-1.5 font-semibold" style={{ color: m.ratingDelta >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                            {signed(m.ratingDelta)}
                          </span>
                        </Td>
                        <Td align="right">
                          <span style={{ color: 'var(--text-hi)' }}>{season.teams[m.r.teamId].meanWins.toFixed(1)}</span>
                          <span className="ml-1.5 font-semibold" style={{ color: m.winDelta >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                            {signed(m.winDelta)}
                          </span>
                        </Td>
                        <Td align="right">
                          <span style={{ color: 'var(--text-hi)' }}>{pct(season.teams[m.r.teamId].pChampion, 1)}</span>
                          <span className="ml-1.5 font-semibold" style={{ color: m.titleDelta >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                            {signed(m.titleDelta * 100, 1)}
                          </span>
                        </Td>
                        <Td align="right">
                          <span style={{ color: 'var(--text-hi)' }}>{pct(season.teams[m.r.teamId].pPlayoff)}</span>
                          <span className="ml-1.5 font-semibold" style={{ color: m.cfpDelta >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                            {signed(m.cfpDelta * 100, 1)}
                          </span>
                        </Td>
                        <Td mono={false}>
                          {m.r.rankDelta === 0 ? (
                            <span style={{ color: 'var(--text-faint)' }}>—</span>
                          ) : (
                            <span className="font-semibold" style={{ color: m.r.rankDelta > 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                              {m.r.baselineRank} → {m.r.rank}
                            </span>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </>
        )}
      </Panel>

      {/* ---- Tabs ----------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          ariaLabel="Scenario controls"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'availability', label: 'Availability' },
            { value: 'dials', label: 'Team dials' },
            { value: 'conditions', label: 'Conditions' },
            { value: 'results', label: 'Force results' },
          ]}
        />
      </div>

      {tab === 'availability' && <AvailabilityPanel />}
      {tab === 'dials' && <DialsPanel />}
      {tab === 'conditions' && <ConditionsPanel />}
      {tab === 'results' && <ForcedResultsPanel />}

      {/* ---- Live standings -------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Projected conference standings"
          subtitle="Ordered by simulated conference winning percentage. The bar shows how often each team finishes in the top two, the top six, or outside them."
          right={<InfoDot text="The top two by conference winning percentage meet in Atlanta. Ties are broken by head-to-head, then overall record, then rating." />}
        />
        <Table>
          <thead>
            <tr>
              <Th width={38} align="right">#</Th>
              <Th width={160}>Team</Th>
              <Th align="right" width={96}>SEC record</Th>
              <Th align="right" width={92}>Overall</Th>
              <Th align="right" width={78}>Title game</Th>
              <Th align="right" width={78}>Champion</Th>
              <Th align="right" width={70}>Playoff</Th>
              <Th width={140}>Finish spread</Th>
            </tr>
          </thead>
          <tbody>
            {[...TEAMS]
              .sort((a, b) => season.teams[a.id].meanFinish - season.teams[b.id].meanFinish)
              .map((t, i) => {
                const o = season.teams[t.id];
                const b = baselineSeason.teams[t.id];
                const top2 = o.finishDistribution.slice(0, 2).reduce((s, v) => s + v, 0);
                const top6 = o.finishDistribution.slice(2, 6).reduce((s, v) => s + v, 0);
                return (
                  <tr key={t.id} className="row-hover cursor-pointer" onClick={() => go('team', { teamId: t.id })}>
                    <Td align="right" style={{ color: 'var(--text-faint)' }}>{i + 1}</Td>
                    <Td mono={false}>
                      <span className="flex items-center gap-2">
                        <TeamMark team={t} size={10} />
                        <span className="truncate font-medium" style={{ color: teamInk(t, mode) }}>{t.school}</span>
                      </span>
                    </Td>
                    <Td align="right" style={{ color: 'var(--text-hi)' }}>
                      {o.meanConfWins.toFixed(1)}–{(9 - o.meanConfWins).toFixed(1)}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text)' }}>
                      {o.meanWins.toFixed(1)}–{(12 - o.meanWins).toFixed(1)}
                      {editCount > 0 && Math.abs(o.meanWins - b.meanWins) > 0.05 && (
                        <span className="ml-1 text-[10px] font-bold" style={{ color: o.meanWins > b.meanWins ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                          {signed(o.meanWins - b.meanWins)}
                        </span>
                      )}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text-mid)' }}>{pct(o.pTitleGame, 1)}</Td>
                    <Td align="right" className="font-semibold" style={{ color: o.pChampion > 0.05 ? 'var(--text-hi)' : 'var(--text-low)' }}>
                      {o.pChampion < 0.001 ? '—' : pct(o.pChampion, 1)}
                    </Td>
                    <Td align="right" style={{ color: 'var(--text-low)' }}>{o.pPlayoff < 0.005 ? '—' : pct(o.pPlayoff)}</Td>
                    <Td>
                      <StackedBar
                        height={9}
                        segments={[
                          { key: 'top2', value: top2, color: 'var(--viz-seq-2)', label: 'Top two' },
                          { key: 'top6', value: top6, color: 'var(--viz-seq-4)', label: 'Third to sixth' },
                          { key: 'rest', value: Math.max(0, 1 - top2 - top6), color: 'var(--bg-active)', label: 'Seventh or lower' },
                        ]}
                      />
                    </Td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 text-[10.5px]" style={{ color: 'var(--text-low)', borderTop: '1px solid var(--line-faint)' }}>
          {[
            { c: 'var(--viz-seq-2)', l: 'Finishes top two' },
            { c: 'var(--viz-seq-4)', l: 'Third to sixth' },
            { c: 'var(--bg-active)', l: 'Seventh or lower' },
          ].map((k) => (
            <span key={k.l} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: k.c }} />{k.l}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function AvailabilityPanel() {
  const { state, dispatch, ratings, baselineRatings } = useStore();
  const [teamFilter, setTeamFilter] = useState<TeamId>('UGA');
  const [query, setQuery] = useState('');

  const roster = useMemo(
    () =>
      [...ROSTERS[teamFilter]]
        .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => b.par - a.par),
    [teamFilter, query],
  );

  const sidelined = useMemo(
    () =>
      Object.entries(state.scenario.players)
        .map(([id, status]) => {
          const p = Object.values(ROSTERS).flat().find((x) => x.id === id);
          return p ? { p, status } : null;
        })
        .filter((x): x is { p: Player; status: Availability } => x !== null)
        .sort((a, b) => b.p.par - a.p.par),
    [state.scenario.players],
  );

  const teamDelta = ratings[teamFilter].total - baselineRatings[teamFilter].total;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <Panel>
        <PanelHead
          title="Rule players in or out"
          subtitle="Out removes the player's full Points Above Replacement from their team's rating. Limited prices them at 40% of it."
          right={
            teamDelta !== 0 ? (
              <span className="chip" style={{ color: 'var(--viz-neg)', borderColor: 'var(--viz-neg)' }}>
                {TEAM_BY_ID[teamFilter].abbr} {signed(teamDelta)}
              </span>
            ) : undefined
          }
        />
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {TEAMS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTeamFilter(t.id)}
              className="chip"
              style={t.id === teamFilter ? { borderColor: t.primary, color: 'var(--text-hi)' } : undefined}
            >
              <TeamMark team={t} size={8} /> {t.abbr}
            </button>
          ))}
        </div>
        <div className="px-4 pb-3">
          <input
            className="field"
            placeholder={`Search the ${TEAM_BY_ID[teamFilter].school} roster…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search roster"
          />
        </div>
        <Table>
          <thead>
            <tr>
              <Th width={48}>Pos</Th>
              <Th>Player</Th>
              <Th align="right" width={56}>PAR</Th>
              <Th width={186} align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p) => {
              const status = state.scenario.players[p.id] ?? 'active';
              return (
                <tr key={p.id} className="row-hover" style={status !== 'active' ? { background: 'var(--accent-dim)' } : undefined}>
                  <Td><span className="chip !text-[9.5px] !px-1.5">{p.position}</span></Td>
                  <Td mono={false}>
                    <span className="font-medium" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                    <span className="ml-2 text-[10.5px]" style={{ color: 'var(--text-faint)' }}>{p.classYear}</span>
                  </Td>
                  <Td align="right" className="font-semibold" style={{ color: 'var(--accent-hi)' }}>{p.par.toFixed(1)}</Td>
                  <Td align="right">
                    <Segmented
                      size="sm"
                      ariaLabel={`${p.name} availability`}
                      value={status}
                      onChange={(v) => dispatch({ type: 'playerStatus', playerId: p.id, status: v })}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'limited', label: 'Ltd' },
                        { value: 'out', label: 'Out' },
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
        <PanelHead
          title="Currently sidelined"
          subtitle={sidelined.length === 0 ? 'Nobody has been ruled out yet.' : `${sidelined.length} player${sidelined.length === 1 ? '' : 's'} affected across the conference.`}
          right={
            sidelined.length > 0 ? (
              <button
                className="btn !py-1 !text-[11px]"
                onClick={() => sidelined.forEach(({ p }) => dispatch({ type: 'playerStatus', playerId: p.id, status: 'active' }))}
              >
                <IconClose size={11} /> Clear all
              </button>
            ) : undefined
          }
        />
        {sidelined.length === 0 ? (
          <EmptyState
            title="No availability overrides"
            body="Rule a player out on the left and every projection in the app — game lines, standings, title odds — updates around the hole they leave."
          />
        ) : (
          <div className="px-4 pb-4">
            {sidelined.map(({ p, status }) => {
              const t = TEAM_BY_ID[p.teamId];
              const lost = status === 'out' ? p.par : p.par * 0.4;
              return (
                <div key={p.id} className="flex items-center gap-2.5 border-b py-2 last:border-0" style={{ borderColor: 'var(--line-faint)' }}>
                  <TeamMark team={t} size={10} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                    <span className="block text-[10.5px]" style={{ color: 'var(--text-low)' }}>{p.position} · {t.abbr}</span>
                  </span>
                  <span className="chip !text-[10px]" style={{ color: status === 'out' ? 'var(--viz-neg)' : 'var(--warn)' }}>
                    {status === 'out' ? 'Out' : 'Limited'}
                  </span>
                  <span className="w-[52px] text-right text-[12px] font-bold tabular-nums" style={{ color: 'var(--viz-neg)' }}>
                    −{lost.toFixed(1)}
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'playerStatus', playerId: p.id, status: 'active' })}
                    className="shrink-0 rounded p-1 transition-colors hover:text-[var(--text)]"
                    style={{ color: 'var(--text-faint)' }}
                    aria-label={`Restore ${p.name}`}
                  >
                    <IconClose size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function DialsPanel() {
  const { state, dispatch, ratings, baselineRatings } = useStore();
  const mode = state.theme;
  const [teamId, setTeamId] = useState<TeamId>('UGA');
  const ov = state.scenario.teams[teamId] ?? {};
  const team = TEAM_BY_ID[teamId];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <Panel>
        <PanelHead
          title="Adjust a team directly"
          subtitle="Push a unit up or down in points per game, change the tempo, or restore turnover luck that the baseline regressed away."
        />
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {TEAMS.map((t) => {
            const edited = !!state.scenario.teams[t.id];
            return (
              <button
                key={t.id}
                onClick={() => setTeamId(t.id)}
                className="chip"
                style={
                  t.id === teamId
                    ? { borderColor: t.primary, color: 'var(--text-hi)' }
                    : edited
                      ? { borderColor: 'var(--accent)', color: 'var(--accent-hi)' }
                      : undefined
                }
              >
                <TeamMark team={t} size={8} /> {t.abbr}
              </button>
            );
          })}
        </div>
        <Divider />
        <div className="space-y-4 px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] font-bold" style={{ color: teamInk(team, mode) }}>{team.school}</span>
            <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-low)' }}>
              Rating {ratings[teamId].total.toFixed(1)}
              {Math.abs(ratings[teamId].total - baselineRatings[teamId].total) > 0.01 && (
                <span className="ml-1.5 font-semibold" style={{ color: ratings[teamId].total > baselineRatings[teamId].total ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                  {signed(ratings[teamId].total - baselineRatings[teamId].total)}
                </span>
              )}
            </span>
          </div>
          <Slider
            label="Offence"
            value={ov.offense ?? 0}
            min={-8} max={8} step={0.25} reset={0}
            onChange={(v) => dispatch({ type: 'teamDial', teamId, patch: { offense: v } })}
            format={(v) => `${signed(v)} pts`}
            hint="Points per game added to the offensive rating."
          />
          <Slider
            label="Defence"
            value={ov.defense ?? 0}
            min={-8} max={8} step={0.25} reset={0}
            onChange={(v) => dispatch({ type: 'teamDial', teamId, patch: { defense: v } })}
            format={(v) => `${signed(v)} pts`}
            hint="Points per game added to the defensive rating."
          />
          <Slider
            label="Tempo"
            value={ov.pace ?? 1}
            min={0.82} max={1.18} step={0.01} reset={1}
            onChange={(v) => dispatch({ type: 'teamDial', teamId, patch: { pace: v } })}
            format={(v) => `${(team.efficiency.playsPerGame * v).toFixed(1)} plays`}
            hint="Changes the total, not the margin — more snaps means more points for both sides."
          />
          <Slider
            label="Turnover luck"
            value={ov.turnoverLuck ?? 0}
            min={-5} max={5} step={0.25} reset={0}
            onChange={(v) => dispatch({ type: 'teamDial', teamId, patch: { turnoverLuck: v } })}
            format={(v) => `${signed(v)} pts`}
            hint={`2025 turnover margin was ${signed(team.efficiency.turnoverMargin, 2)} per game. The baseline already assumes most of that regresses.`}
          />
        </div>
      </Panel>

      <Panel>
        <PanelHead
          title="Turnover luck across the league"
          subtitle="2025 turnover margin per game. The largest positive figures are the strongest regression candidates — and the negatives are the likeliest to improve."
        />
        <div className="px-4 pb-4">
          <BarList
            min={-1}
            max={1}
            showZero
            labelWidth={92}
            valueWidth={56}
            height={19}
            format={(v) => signed(v, 2)}
            data={[...TEAMS]
              .sort((a, b) => b.efficiency.turnoverMargin - a.efficiency.turnoverMargin)
              .map((t) => ({
                key: t.id,
                label: (
                  <span className="flex items-center gap-1.5">
                    <TeamMark team={t} size={8} /> {t.abbr}
                  </span>
                ),
                value: t.efficiency.turnoverMargin,
                emphasis: t.id === teamId,
                detail: `${t.school}: ${signed(t.efficiency.turnoverMargin, 2)} turnovers per game in 2025`,
                onClick: () => setTeamId(t.id),
              }))}
          />
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ConditionsPanel() {
  const { state, dispatch } = useStore();
  const w = state.scenario.weather;

  return (
    <Panel>
      <PanelHead
        title="League-wide conditions"
        subtitle="These apply to every game at once. Useful for asking what the season looks like without home-field advantage, or in a year of bad weather."
      />
      <div className="grid gap-6 px-5 py-4 md:grid-cols-2">
        <div className="space-y-4">
          <Slider
            label="Home-field advantage"
            value={state.scenario.homeFieldMultiplier}
            min={0} max={2} step={0.05} reset={1}
            onChange={(v) => dispatch({ type: 'homeField', value: v })}
            format={(v) => (v === 0 ? 'Off — every game neutral' : `${Math.round(v * 100)}% of normal`)}
            hint="Venue values run from 2.2 points at FirstBank Stadium to 3.6 in Death Valley."
          />
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Label>Weather</Label>
              <InfoDot text="Weather scales the projected total and compresses margins toward zero, which slightly helps underdogs. It also widens the outcome distribution." />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {WEATHER_PRESETS.map((preset) => (
                <button
                  key={preset.kind}
                  onClick={() => dispatch({ type: 'weather', weather: preset })}
                  data-active={preset.kind === w.kind}
                  className="btn !py-1.5 !text-[11.5px]"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { l: 'Scoring', v: pct(w.scoring) },
                { l: 'Passing edge', v: pct(w.passing) },
                { l: 'Variance', v: `${w.variance.toFixed(2)}×` },
              ].map((x) => (
                <div key={x.l} className="rounded-[8px] px-3 py-2" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line-faint)' }}>
                  <Label>{x.l}</Label>
                  <div className="mt-0.5 text-[14px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label>Home-field advantage by venue</Label>
          <div className="mt-2.5">
            <BarList
              max={4}
              labelWidth={124}
              valueWidth={62}
              height={18}
              format={(v) => `${v.toFixed(1)} pts`}
              data={[...TEAMS]
                .sort((a, b) => b.venue.hfa - a.venue.hfa)
                .map((t) => ({
                  key: t.id,
                  label: (
                    <span className="flex items-center gap-1.5">
                      <TeamMark team={t} size={8} />
                      <span className="truncate">{t.venue.name.split(/[–-]/)[0].trim()}</span>
                    </span>
                  ),
                  value: t.venue.hfa * state.scenario.homeFieldMultiplier,
                  reference: t.venue.hfa,
                  color: 'var(--viz-seq-2)',
                  detail: `${t.venue.name} — ${t.venue.capacity.toLocaleString()} capacity`,
                }))}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */

function ForcedResultsPanel() {
  const { state, dispatch, projectionById, season, baselineSeason, go } = useStore();
  const mode = state.theme;
  const [week, setWeek] = useState<number | 'headline'>('headline');

  const games = useMemo(() => {
    const list = week === 'headline'
      ? CONFERENCE_GAMES.filter((g) => g.headline)
      : CONFERENCE_GAMES.filter((g) => g.week === week);
    return list.map((g) => ({ g, p: projectionById.get(g.id)! })).filter((x) => x.p);
  }, [week, projectionById]);

  const forced = Object.entries(state.scenario.forcedResults);

  return (
    <div className="space-y-4">
      <Panel>
        <PanelHead
          title="Force a result, see the consequences"
          subtitle="Lock in a winner and everything else still plays out. This is how you get conditional odds: if Georgia loses in Tuscaloosa, who benefits?"
          right={
            forced.length > 0 ? (
              <button
                className="btn !py-1 !text-[11px]"
                onClick={() => forced.forEach(([id]) => dispatch({ type: 'forceResult', gameId: id, winner: null }))}
              >
                <IconClose size={11} /> Clear {forced.length}
              </button>
            ) : undefined
          }
        />
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          <button onClick={() => setWeek('headline')} data-active={week === 'headline'} className="btn !py-1 !text-[11px]">
            Marquee games
          </button>
          {Array.from({ length: 13 }, (_, i) => i + 1).map((wk) => (
            <button key={wk} onClick={() => setWeek(wk)} data-active={week === wk} className="btn !px-2 !py-1 !text-[11px]">
              {wk}
            </button>
          ))}
        </div>
        <Divider />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fill, minmax(292px, 1fr))' }}>
          {games.map(({ g, p }) => {
            const home = TEAM_BY_ID[g.homeId];
            const away = TEAM_BY_ID[g.awayId];
            const current = state.scenario.forcedResults[g.id] ?? null;
            return (
              <div key={g.id} className="p-3.5" style={{ background: 'var(--bg-panel)' }}>
                <div className="flex items-center justify-between">
                  <span className="chip !text-[9.5px]">Week {g.week}</span>
                  {g.rivalry && (
                    <span className="truncate text-[10px]" style={{ color: 'var(--text-faint)' }} title={g.rivalry}>{g.rivalry}</span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {[
                    { t: away, side: 'away' as const, prob: p.awayWinProb },
                    { t: home, side: 'home' as const, prob: p.homeWinProb },
                  ].map((row) => (
                    <button
                      key={row.side}
                      onClick={() => dispatch({ type: 'forceResult', gameId: g.id, winner: current === row.side ? null : row.side })}
                      className="rounded-[9px] px-2.5 py-2 text-left transition-all"
                      style={{
                        border: `1px solid ${current === row.side ? row.t.primary : 'var(--line)'}`,
                        background: current === row.side ? 'var(--bg-raised)' : 'var(--bg-panel-2)',
                      }}
                      aria-pressed={current === row.side}
                    >
                      <span className="flex items-center gap-1.5">
                        <TeamMark team={row.t} size={9} />
                        <span className="truncate text-[12px] font-semibold" style={{ color: teamInk(row.t, mode) }}>{row.t.abbr}</span>
                      </span>
                      <span className="mt-1 block text-[11px] tabular-nums" style={{ color: current === row.side ? 'var(--accent-hi)' : 'var(--text-low)' }}>
                        {current === row.side ? 'Forced to win' : `${pct(row.prob)} to win`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {forced.length > 0 && (
        <Panel>
          <PanelHead
            title="Conditional title odds"
            subtitle={`Given ${forced.length} forced result${forced.length === 1 ? '' : 's'}, here is how the championship picture shifts against the baseline.`}
          />
          <div className="px-4 pb-4">
            <BarList
              labelWidth={84}
              valueWidth={110}
              format={(v) => pct(v, 1)}
              max={Math.max(...TEAMS.map((t) => Math.max(season.teams[t.id].pChampion, baselineSeason.teams[t.id].pChampion)))}
              data={[...TEAMS]
                .sort((a, b) => season.teams[b.id].pChampion - season.teams[a.id].pChampion)
                .slice(0, 10)
                .map((t) => ({
                  key: t.id,
                  label: (
                    <span className="flex items-center gap-1.5">
                      <TeamMark team={t} size={9} /> {t.abbr}
                    </span>
                  ),
                  value: season.teams[t.id].pChampion,
                  reference: baselineSeason.teams[t.id].pChampion,
                  color: 'var(--viz-seq-3)',
                  onClick: () => go('team', { teamId: t.id }),
                }))}
            />
            <p className="mt-2.5 flex items-center gap-1.5 text-[10.5px]" style={{ color: 'var(--text-faint)' }}>
              <span aria-hidden className="inline-block h-3 w-[2px]" style={{ background: 'var(--text-faint)' }} />
              Tick marks are the unconditional baseline.
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
