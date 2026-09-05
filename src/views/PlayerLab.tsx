import { useMemo, useState } from 'react';
import { BarList, Radar } from '../components/charts';
import { IconClose } from '../components/icons';
import {
  Divider, EmptyState, InfoDot, Label, Panel, PanelHead, ProvenanceTag, Segmented, Stat,
  Table, Td, Th, TeamMark,
} from '../components/ui';
import { ALL_PLAYERS, PLAYER_BY_ID, POSITION_SIDE } from '../data/players';
import { MEASURED_PLAYERS } from '../data/measuredPlayers';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import type { Player, Position } from '../data/types';
import { projectPlayerGame, projectPlayerSeason } from '../engine/players';
import { teamSchedule } from '../engine/season';
import { CATEGORICAL, pct, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

type SortKey = 'par' | 'grade' | 'breakout' | 'name';
const POSITION_FILTERS: (Position | 'ALL' | 'OFF' | 'DEF')[] = [
  'ALL', 'OFF', 'DEF', 'QB', 'RB', 'WR', 'TE', 'OT', 'IOL', 'EDGE', 'DL', 'LB', 'CB', 'S', 'K',
];

export function PlayerLab() {
  const { state, dispatch } = useStore();
  const mode = state.theme;
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<(typeof POSITION_FILTERS)[number]>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [sort, setSort] = useState<SortKey>('par');
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');

  const selected = state.selectedPlayerId ? PLAYER_BY_ID[state.selectedPlayerId] : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = ALL_PLAYERS.filter((p) => {
      if (teamFilter !== 'ALL' && p.teamId !== teamFilter) return false;
      if (position === 'OFF' && POSITION_SIDE[p.position] !== 'offense') return false;
      if (position === 'DEF' && POSITION_SIDE[p.position] !== 'defense') return false;
      if (position !== 'ALL' && position !== 'OFF' && position !== 'DEF' && p.position !== position) return false;
      if (q && !p.name.toLowerCase().includes(q) && !TEAM_BY_ID[p.teamId].school.toLowerCase().includes(q)) return false;
      return true;
    });
    const get = (p: Player) => {
      switch (sort) {
        case 'grade': return p.grade;
        case 'breakout': return p.breakoutOdds;
        case 'name': return 0;
        default: return p.par;
      }
    };
    list = list.slice().sort((a, b) =>
      sort === 'name'
        ? (dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
        : (dir === 'asc' ? get(b) - get(a) : get(a) - get(b)),
    );
    return list;
  }, [query, position, teamFilter, sort, dir]);

  const toggle = (key: SortKey) => {
    if (sort === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(key); setDir('asc'); }
  };
  const sortProps = (key: SortKey) => ({ sortable: true, active: sort === key, direction: dir, onClick: () => toggle(key) });

  const compare = state.comparePlayerIds.map((id) => PLAYER_BY_ID[id]).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Filters — one row above the data, as they should be */}
      <Panel>
        <div className="flex flex-wrap items-center gap-2.5 px-4 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players or schools…"
            className="field max-w-[240px]"
            aria-label="Search players"
          />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="field max-w-[176px]"
            aria-label="Filter by team"
          >
            <option value="ALL">All sixteen teams</option>
            {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.school}</option>)}
          </select>
          <div className="flex flex-wrap gap-1">
            {POSITION_FILTERS.map((p) => (
              <button
                key={p}
                onClick={() => setPosition(p)}
                data-active={position === p}
                className="btn !px-2 !py-1 !text-[11px]"
              >
                {p === 'ALL' ? 'All' : p === 'OFF' ? 'Offence' : p === 'DEF' ? 'Defence' : p}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[11.5px]" style={{ color: 'var(--text-low)' }}>
            {filtered.length} of {ALL_PLAYERS.length}
          </span>
        </div>
      </Panel>

      {selected && <PlayerDetail player={selected} />}

      {compare.length > 1 && <ComparePanel players={compare} />}

      <Panel>
        <PanelHead
          title="Value board"
          subtitle="Every tracked player, ranked by Points Above Replacement. Select up to three to compare."
          right={
            compare.length > 0 ? (
              <button className="btn !py-1 !text-[11px]" onClick={() => dispatch({ type: 'clearComparePlayers' })}>
                <IconClose size={11} /> Clear {compare.length} selected
              </button>
            ) : undefined
          }
        />
        {filtered.length === 0 ? (
          <EmptyState
            title="No players match those filters"
            body="Try clearing the search box or widening the position filter."
            action={<button className="btn" onClick={() => { setQuery(''); setPosition('ALL'); setTeamFilter('ALL'); }}>Reset filters</button>}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th width={36} />
                <Th width={54}>Pos</Th>
                <Th {...sortProps('name')}>Player</Th>
                <Th width={150}>Team</Th>
                <Th align="center" width={52}>Class</Th>
                <Th align="right" width={62} {...sortProps('grade')}>Grade</Th>
                <Th align="right" width={58} {...sortProps('par')}>PAR</Th>
                <Th align="right" width={76} {...sortProps('breakout')}>Breakout</Th>
                <Th align="right" width={68}>Injury risk</Th>
                <Th width={82}>Source</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 120).map((p) => {
                const t = TEAM_BY_ID[p.teamId];
                const picked = state.comparePlayerIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className="row-hover cursor-pointer"
                    onClick={() => dispatch({ type: 'selectPlayer', playerId: p.id })}
                    style={picked ? { background: 'var(--accent-dim)' } : undefined}
                  >
                    <Td align="center">
                      <input
                        type="checkbox"
                        checked={picked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => dispatch({ type: 'toggleComparePlayer', playerId: p.id })}
                        aria-label={`Compare ${p.name}`}
                        className="h-3.5 w-3.5 accent-[var(--accent)]"
                      />
                    </Td>
                    <Td><span className="chip !text-[9.5px] !px-1.5">{p.position}</span></Td>
                    <Td mono={false}>
                      <span className="font-medium" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                      {p.origin === 'transfer' && (
                        <span className="ml-2 text-[10px]" style={{ color: 'var(--text-faint)' }}>via {p.from}</span>
                      )}
                    </Td>
                    <Td mono={false}>
                      <span className="flex items-center gap-1.5">
                        <TeamMark team={t} size={9} />
                        <span className="truncate" style={{ color: teamInk(t, mode) }}>{t.school}</span>
                      </span>
                    </Td>
                    <Td align="center" style={{ color: 'var(--text-low)' }}>{p.classYear}</Td>
                    <Td align="right" style={{ color: 'var(--text)' }}>{p.grade}</Td>
                    <Td align="right" className="font-bold" style={{ color: 'var(--accent-hi)' }}>{p.par.toFixed(1)}</Td>
                    <Td align="right" style={{ color: 'var(--text-low)' }}>{pct(p.breakoutOdds)}</Td>
                    <Td align="right" style={{ color: p.durabilityRisk > 0.18 ? 'var(--viz-neg)' : 'var(--text-low)' }}>
                      {pct(p.durabilityRisk)}
                    </Td>
                    <Td><ProvenanceTag value={p.provenance} /></Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        {filtered.length > 120 && (
          <p className="px-4 py-2.5 text-[11px]" style={{ color: 'var(--text-faint)', borderTop: '1px solid var(--line-faint)' }}>
            Showing the top 120. Narrow the filters to see the rest.
          </p>
        )}
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PlayerDetail({ player }: { player: Player }) {
  const { state, dispatch, projectionById, go } = useStore();
  const team = TEAM_BY_ID[player.teamId];
  const status = state.scenario.players[player.id] ?? 'active';

  const games = useMemo(() => {
    return teamSchedule(player.teamId)
      .map((g) => {
        const projection = projectionById.get(g.id);
        if (!projection) return null;
        return { game: g, projection, isHome: g.homeId === player.teamId };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [player.teamId, projectionById]);

  const seasonProjection = useMemo(
    () => projectPlayerSeason(player, games, state.scenario),
    [player, games, state.scenario],
  );

  const perGame = useMemo(
    () => games.map((g) => ({ ...g, proj: projectPlayerGame(player, g.projection, g.isHome) })),
    [games, player],
  );

  const bestWorst = useMemo(() => {
    const sorted = [...perGame].sort((a, b) => b.proj.matchup - a.proj.matchup);
    return { best: sorted[0], worst: sorted[sorted.length - 1] };
  }, [perGame]);

  // The scale has to contain the schedule it is drawing. A fixed 0.8-1.2 window
  // works until a team opens against an FCS opponent, and then the bar runs off
  // its own track and takes its label with it.
  const matchupDomain = useMemo<[number, number]>(() => {
    const values = perGame.map((g) => g.proj.matchup);
    const lo = Math.min(0.8, ...values);
    const hi = Math.max(1.2, ...values);
    const pad = (hi - lo) * 0.04;
    return [lo - pad, hi + pad];
  }, [perGame]);

  const prod = player.production2025;
  const measured = MEASURED_PLAYERS[player.id];

  return (
    <Panel className="overflow-hidden">
      <div className="h-1" style={{ background: team.primary }} aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[22px] font-bold leading-none tracking-[-0.02em]" style={{ color: 'var(--text-hi)' }}>
              {player.name}
            </h2>
            <span className="chip">{player.position}</span>
            <span className="chip">{player.classYear}</span>
            <button className="chip !cursor-pointer" onClick={() => go('team', { teamId: team.id })}>
              <TeamMark team={team} size={9} /> {team.school}
            </button>
            <ProvenanceTag value={player.provenance} />
          </div>
          {player.accolades.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {player.accolades.map((a) => (
                <span key={a} className="chip" style={{ color: 'var(--accent-hi)', borderColor: 'var(--accent)' }}>{a}</span>
              ))}
            </div>
          )}
          <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>{player.note}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Label>Availability</Label>
            <InfoDot text="Ruling a player out removes their full PAR from the team rating. 'Limited' prices them at 40% of it. The change flows through every projection in the app." />
          </div>
          <Segmented
            ariaLabel="Player availability"
            value={status}
            onChange={(v) => dispatch({ type: 'playerStatus', playerId: player.id, status: v })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'limited', label: 'Limited' },
              { value: 'out', label: 'Out' },
            ]}
          />
          {status !== 'active' && (
            <p className="text-right text-[11px]" style={{ color: 'var(--viz-neg)' }}>
              {team.abbr} rating −{(status === 'out' ? player.par : player.par * 0.4).toFixed(1)} pts
            </p>
          )}
        </div>
      </div>

      <Divider />
      <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))' }}>
        {[
          { label: 'Points above replacement', value: player.par.toFixed(1), tone: 'accent' as const, sub: 'Full season, team rating' },
          { label: 'Projection grade', value: String(player.grade), sub: 'Out of 100' },
          { label: 'Breakout probability', value: pct(player.breakoutOdds), sub: 'Materially better than baseline' },
          { label: 'Availability risk', value: pct(player.durabilityRisk), sub: 'Season-long injury exposure' },
          { label: 'Expected games', value: seasonProjection.expectedGames.toFixed(1), sub: `of ${games.length}` },
          {
            label: 'Snap share',
            value: pct(player.usage.snapShare),
            sub: player.usage.targetShare
              ? `${pct(player.usage.targetShare)} target share`
              : player.usage.carryShare
                ? `${pct(player.usage.carryShare)} carry share`
                : player.usage.rushSnapShare
                  ? `${pct(player.usage.rushSnapShare)} of pass rushes`
                  : 'of position snaps',
          },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
            <Stat label={s.label} value={s.value} sub={s.sub} tone={s.tone} size="sm" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_1fr]">
        <div>
          <Label>2026 season projection</Label>
          <p className="mt-1 text-[11.5px]" style={{ color: 'var(--text-low)' }}>
            Bands are the 10th to 90th percentile across the season. Usage × efficiency, adjusted for each opponent and for game script.
          </p>
          <div className="mt-3 space-y-2.5">
            {seasonProjection.stats.map((s) => (
              <div key={s.key}>
                <div className="flex items-baseline justify-between text-[12px]">
                  <span style={{ color: 'var(--text)' }}>{s.label}</span>
                  <span className="font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>
                    {s.mean.toFixed(s.precision)}
                  </span>
                </div>
                <div className="relative mt-1 h-2 rounded-full" style={{ background: 'var(--bg-sunken)' }}>
                  <span
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: `${(s.p10 / (s.p90 || 1)) * 100 * 0.35}%`,
                      right: `${Math.max(0, 100 - (s.p90 / (s.p90 || 1)) * 100)}%`,
                      background: 'var(--viz-seq-3)',
                      opacity: 0.55,
                    }}
                  />
                  <span
                    className="absolute top-1/2 h-3.5 w-[3px] -translate-y-1/2 rounded-full"
                    style={{ left: `${(s.mean / (s.p90 || 1)) * 100 * 0.9}%`, background: 'var(--accent-hi)' }}
                  />
                </div>
                <div className="mt-0.5 flex justify-between text-[10px] tabular-nums" style={{ color: 'var(--text-faint)' }}>
                  <span>{s.p10.toFixed(s.precision)}</span>
                  <span>{s.p90.toFixed(s.precision)}</span>
                </div>
              </div>
            ))}
            {seasonProjection.stats.length === 0 && (
              <p className="text-[12px]" style={{ color: 'var(--text-low)' }}>
                No countable production is projected for this position — the value shows up in PAR and in the team's efficiency rating instead.
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>2025 production</Label>
          {prod ? (
            <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] sm:grid-cols-3" style={{ background: 'var(--line-faint)', border: '1px solid var(--line)' }}>
              {([
                ['Games', prod.games],
                ['Pass yards', prod.passYds],
                ['Pass TD', prod.passTd],
                ['Interceptions', prod.interceptions],
                ['Carries', prod.carries],
                ['Rush yards', prod.rushYds],
                ['Rush TD', prod.rushTd],
                ['Targets', prod.targets],
                ['Receptions', prod.receptions],
                ['Rec yards', prod.recYds],
                ['Rec TD', prod.recTd],
                ['Tackles', prod.tackles],
                ['TFL', prod.tfl],
                ['Sacks', prod.sacks],
                ['Pass breakups', prod.passBreakups],
                ['Takeaways', prod.takeaways],
                ['FG made', prod.fgMade],
                ['FG attempts', prod.fgAttempts],
                ['Longest FG', prod.fgLong],
                ['Punts', prod.punts],
                ['Punt average', prod.puntAvg],
              ] as [string, number | undefined][])
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => (
                  <div key={k} className="px-3 py-2" style={{ background: 'var(--bg-panel)' }}>
                    <Label>{k}</Label>
                    <div className="mt-0.5 text-[14px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>{v}</div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="mt-2 text-[12px]" style={{ color: 'var(--text-low)' }}>
              {player.position === 'OT' || player.position === 'IOL'
                ? 'Play-by-play never names offensive linemen, so no individual production line exists for this player. This line\u2019s work is measured collectively, in the team\u2019s line yards and sack rate allowed.'
                : 'No prior-season production is tracked for this player — either a newcomer, or a role the play-by-play only records when something happens.'}
            </p>
          )}
          {measured && (
            <p className="mt-2 text-[11px]" style={{ color: 'var(--text-low)' }}>
              Counted off {measured.plays.toLocaleString()} plays of 2025 play-by-play
              {measured.school2025 && !measured.school2025.startsWith(team.school)
                ? ` at ${measured.school2025}`
                : ''}
              {measured.usage.carryShare != null && `, ${pct(measured.usage.carryShare)} of the team's carries`}
              {measured.usage.targetShare != null && `, ${pct(measured.usage.targetShare)} of its targets`}
              {measured.usage.passAttemptShare != null && `, ${pct(measured.usage.passAttemptShare)} of its pass attempts`}
              .
            </p>
          )}

          <div className="mt-4">
            <Label>Matchup difficulty by week</Label>
            <p className="mt-1 text-[11.5px]" style={{ color: 'var(--text-low)' }}>
              Efficiency multiplier against each opponent's defence. Above 100% is a favourable matchup.
            </p>
            <div className="mt-2.5">
              <BarList
                min={matchupDomain[0]}
                max={matchupDomain[1]}
                height={16}
                labelWidth={72}
                valueWidth={48}
                format={(v) => pct(v)}
                data={perGame.map((g) => {
                  const opp = g.isHome ? g.projection.away : g.projection.home;
                  return {
                    key: g.game.id,
                    label: `W${g.game.week} ${g.isHome ? '' : '@'}${opp.abbr}`,
                    value: g.proj.matchup,
                    color: g.proj.matchup >= 1 ? 'var(--viz-pos)' : 'var(--viz-neg)',
                    onClick: () => go('matchup', { gameId: g.game.id }),
                  };
                })}
              />
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
              Best matchup: week {bestWorst.best.game.week} against{' '}
              {(bestWorst.best.isHome ? bestWorst.best.projection.away : bestWorst.best.projection.home).name}.
              Hardest: week {bestWorst.worst.game.week} against{' '}
              {(bestWorst.worst.isHome ? bestWorst.worst.projection.away : bestWorst.worst.projection.home).name}.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */

function ComparePanel({ players }: { players: Player[] }) {
  const { state } = useStore();
  const mode = state.theme;
  const palette = CATEGORICAL[mode];

  const axes = [
    { key: 'grade', label: 'Grade' },
    { key: 'par', label: 'Value' },
    { key: 'usage', label: 'Usage' },
    { key: 'breakout', label: 'Upside' },
    { key: 'durability', label: 'Durability' },
  ];

  const maxPar = Math.max(...players.map((p) => p.par), 1);

  const series = players.map((p, i) => ({
    key: p.id,
    label: `${p.name} (${TEAM_BY_ID[p.teamId].abbr})`,
    color: palette[i],
    values: [
      (p.grade - 60) / 40,
      p.par / maxPar,
      p.usage.snapShare,
      p.breakoutOdds / 0.5,
      1 - p.durabilityRisk / 0.3,
    ].map((v) => Math.max(0.03, Math.min(1, v))),
  }));

  return (
    <Panel>
      <PanelHead
        title="Head-to-head comparison"
        subtitle="Each axis is scaled across the selected players. Durability is inverted so further from the centre is always better."
      />
      <div className="grid gap-4 px-5 pb-5 md:grid-cols-[auto_1fr] md:items-center">
        <Radar axes={axes} series={series} size={252} />
        <Table>
          <thead>
            <tr>
              <Th>Metric</Th>
              {players.map((p, i) => (
                <Th key={p.id} align="right">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: palette[i] }} />
                    {p.name.split(' ').slice(-1)[0]}
                  </span>
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([
              ['Position', (p: Player) => p.position],
              ['Team', (p: Player) => TEAM_BY_ID[p.teamId].abbr],
              ['Class', (p: Player) => p.classYear],
              ['Grade', (p: Player) => String(p.grade)],
              ['PAR', (p: Player) => p.par.toFixed(1)],
              ['Snap share', (p: Player) => pct(p.usage.snapShare)],
              ['Breakout odds', (p: Player) => pct(p.breakoutOdds)],
              ['Injury risk', (p: Player) => pct(p.durabilityRisk)],
            ] as [string, (p: Player) => string][]).map(([label, get]) => (
              <tr key={label} className="row-hover">
                <Td mono={false} style={{ color: 'var(--text-low)' }}>{label}</Td>
                {players.map((p) => (
                  <Td key={p.id} align="right" style={{ color: 'var(--text-hi)' }}>{get(p)}</Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Panel>
  );
}
