import { useMemo, useState } from 'react';
import { BarList, Scatter, StackedBar } from '../components/charts';
import { GameCard } from '../components/GameCard';
import { IconArrow, IconSpark } from '../components/icons';
import {
  AnimatedNumber, Divider, InfoDot, Label, Panel, PanelHead, Segmented, Stat, Table, Td, Th, TeamMark,
} from '../components/ui';
import { COACH_BY_TEAM } from '../data/coaches';
import { ALL_PLAYERS, POSITION_SIDE } from '../data/players';
import { ALL_GAMES, CONFERENCE_GAMES, WEEKS } from '../data/schedule';
import { TEAM_BY_ID } from '../data/teams';
import { CONFERENCE_BY_ID, lensCount } from '../data/conferences';
import { ConferenceClash } from '../components/ConferenceClash';
import type { TeamId } from '../data/types';
import type { GameProjection } from '../engine/game';
import { pct, signed, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

type SortKey = 'rank' | 'rating' | 'offense' | 'defense' | 'wins' | 'title' | 'playoff' | 'sos';

export function CommandCenter() {
  const { ranked, lensTeams, lensRanked, season, baselineSeason, state, go, projectionById, editCount } = useStore();
  const confOf = (id: TeamId) => CONFERENCE_BY_ID[TEAM_BY_ID[id].conference];
  const mode = state.theme;
  const [sort, setSort] = useState<SortKey>('rank');
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');

  const rows = useMemo(() => {
    const data = lensRanked.map((r) => {
      const o = season.teams[r.teamId];
      return { r, o, coach: COACH_BY_TEAM[r.teamId] };
    });
    const get = (x: (typeof data)[number]) => {
      switch (sort) {
        case 'rating': return x.r.total;
        case 'offense': return x.r.offense;
        case 'defense': return x.r.defense;
        case 'wins': return x.o.meanWins;
        case 'title': return x.o.pChampion;
        case 'playoff': return x.o.pPlayoff;
        case 'sos': return x.o.strengthOfSchedule;
        default: return -x.r.rank;
      }
    };
    return data.sort((a, b) => (dir === 'asc' ? get(b) - get(a) : get(a) - get(b)));
  }, [lensRanked, season, sort, dir]);

  const toggle = (key: SortKey) => {
    if (sort === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(key); setDir('asc'); }
  };
  const sortProps = (key: SortKey) => ({
    sortable: true, active: sort === key, direction: dir, onClick: () => toggle(key),
  });

  /* ---- Headline numbers ------------------------------------------------ */

  const favourite = [...lensRanked].sort((a, b) => season.teams[b.teamId].pChampion - season.teams[a.teamId].pChampion)[0];
  const inLens = useMemo(() => new Set(lensTeams.map((t) => t.id as string)), [lensTeams]);
  const topPlayer = useMemo(
    () => ALL_PLAYERS.filter((p) => inLens.has(p.teamId)).sort((a, b) => b.par - a.par)[0],
    [inLens],
  );
  const firstYearCoaches = lensTeams.filter((t) => COACH_BY_TEAM[t.id]?.tenureYear === 1);

  /** Where the model most disagrees with the AP preseason poll. */
  const divergence = useMemo(() => {
    // Both ranks must come from the same pool. The AP position is a rank among
    // the teams it actually ranks, so the model's has to be too — comparing a
    // rank out of thirty-four against a rank out of thirteen invents a gap.
    const polled = lensTeams.filter((t) => t.apPreseason !== null);
    const polledIds = new Set(polled.map((t) => t.id as string));
    const modelOrder = ranked.filter((r) => polledIds.has(r.teamId)).map((r) => r.teamId);
    const nationalGuess = (id: TeamId) => modelOrder.indexOf(id) + 1;
    return polled
      .map((t) => {
        const apSecRank = polled
          .slice()
          .sort((a, b) => (a.apPreseason ?? 99) - (b.apPreseason ?? 99))
          .findIndex((x) => x.id === t.id) + 1;
        const modelSecRank = nationalGuess(t.id);
        return { team: t, apSecRank, modelSecRank, polled: polled.length, gap: apSecRank - modelSecRank };
      })
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
  }, [ranked, lensTeams]);

  const tightest = useMemo(() => {
    return CONFERENCE_GAMES
      .map((g) => ({ g, p: projectionById.get(g.id)! }))
      .filter((x) => x.p)
      .sort((a, b) => Math.abs(a.p.margin) - Math.abs(b.p.margin))[0];
  }, [projectionById]);

  const [boardScope, setBoardScope] = useState<'all' | 'skill' | 'defense'>('all');
  const valueBoard = useMemo(() => {
    const pool = ALL_PLAYERS.filter((p) => inLens.has(p.teamId)).filter((p) =>
      boardScope === 'all' ? true
      : boardScope === 'defense' ? POSITION_SIDE[p.position] === 'defense'
      : p.position !== 'QB' && POSITION_SIDE[p.position] === 'offense',
    );
    return [...pool].sort((a, b) => b.par - a.par).slice(0, 12);
  }, [boardScope, inLens]);

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* Pulse                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Panel className="overflow-hidden">
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          {[
            {
              label: 'Championship favourite',
              value: favourite.team.abbr,
              sub: `${pct(season.teams[favourite.teamId].pChampion, 1)} to win the ${confOf(favourite.teamId).name}`,
              tone: 'accent' as const,
              onClick: () => go('team', { teamId: favourite.teamId }),
            },
            {
              label: 'Most valuable player',
              value: topPlayer.name.split(' ').slice(-1)[0],
              sub: `${topPlayer.par.toFixed(1)} pts of team rating · ${TEAM_BY_ID[topPlayer.teamId].abbr}`,
              tone: 'default' as const,
              onClick: () => go('player', { playerId: topPlayer.id }),
            },
            {
              label: 'Biggest poll disagreement',
              value: divergence[0].team.abbr,
              sub: `Model has them ${Math.abs(divergence[0].gap)} spot${Math.abs(divergence[0].gap) === 1 ? '' : 's'} ${divergence[0].gap > 0 ? 'higher' : 'lower'} than the AP`,
              tone: 'default' as const,
              onClick: () => go('team', { teamId: divergence[0].team.id }),
            },
            {
              label: 'Closest game on the board',
              value: `${tightest.p.away.abbr} @ ${tightest.p.home.abbr}`,
              sub: `Week ${tightest.g.week} · margin ${Math.abs(tightest.p.margin).toFixed(1)}`,
              tone: 'default' as const,
              onClick: () => go('matchup', { gameId: tightest.g.id }),
            },
            {
              label: 'First-year staffs',
              value: String(firstYearCoaches.length),
              sub: `of ${lensCount(state.lens)}`,
              tone: 'default' as const,
              onClick: () => go('coach'),
            },
          ].map((s) => (
            <button
              key={s.label}
              onClick={s.onClick}
              className="group px-4 py-3.5 text-left transition-colors"
              style={{ background: 'var(--bg-panel)' }}
            >
              <Stat label={s.label} value={s.value} sub={s.sub} tone={s.tone} size="md" />
              <span
                className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: 'var(--accent-hi)' }}
              >
                Open <IconArrow size={12} />
              </span>
            </button>
          ))}
        </div>
      </Panel>

      {/* ------------------------------------------------------------------ */}
      {/* Conference against conference — only when both are in view          */}
      {/* ------------------------------------------------------------------ */}
      {state.lens === 'ALL' && <ConferenceClash />}

      {/* ------------------------------------------------------------------ */}
      {/* Power ratings                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="Power ratings"
          subtitle="Points per game above an average FBS team on a neutral field. Projected records and odds come from the season simulation."
          right={
            <span className="chip">
              {season.iterations.toLocaleString()} seasons simulated
            </span>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th width={40} align="right" {...sortProps('rank')}>#</Th>
              <Th width={180}>Team</Th>
              <Th align="right" {...sortProps('rating')} title="Total rating, points above average">Rating</Th>
              <Th align="right" {...sortProps('offense')} title="Offensive points above average">Off</Th>
              <Th align="right" {...sortProps('defense')} title="Defensive points above average">Def</Th>
              <Th align="right" {...sortProps('wins')} title="Mean simulated wins">Proj</Th>
              <Th align="right" {...sortProps('title')} title="Probability of winning the conference championship">Title</Th>
              <Th align="right" {...sortProps('playoff')} title="Modelled playoff bid probability">CFP</Th>
              <Th align="right" {...sortProps('sos')} title="Average opponent rating">SOS</Th>
              <Th width={128}>Season shape</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ r, o }) => {
              const base = baselineSeason.teams[r.teamId];
              const t = r.team;
              return (
                <tr key={r.teamId} className="row-hover cursor-pointer" onClick={() => go('team', { teamId: r.teamId })}>
                  <Td align="right" style={{ color: 'var(--text-faint)', fontWeight: 600 }}>{r.rank}</Td>
                  <Td mono={false}>
                    <span className="flex items-center gap-2">
                      <TeamMark team={t} />
                      <span className="truncate font-semibold" style={{ color: teamInk(t, mode) }}>{t.school}</span>
                      {r.rankDelta !== 0 && (
                        <span
                          className="text-[10px] font-bold tabular-nums"
                          style={{ color: r.rankDelta > 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}
                          title={`Moved ${Math.abs(r.rankDelta)} from the baseline`}
                        >
                          {r.rankDelta > 0 ? '▲' : '▼'}{Math.abs(r.rankDelta)}
                        </span>
                      )}
                    </span>
                  </Td>
                  <Td align="right" className="font-bold" style={{ color: 'var(--text-hi)' }}>
                    <AnimatedNumber value={r.total} digits={1} />
                  </Td>
                  <Td align="right" style={{ color: 'var(--text-mid)' }}>{r.offense.toFixed(1)}</Td>
                  <Td align="right" style={{ color: 'var(--text-mid)' }}>{r.defense.toFixed(1)}</Td>
                  <Td align="right" style={{ color: 'var(--text)' }}>
                    {o.meanWins.toFixed(1)}–{(12 - o.meanWins).toFixed(1)}
                    {editCount > 0 && Math.abs(o.meanWins - base.meanWins) > 0.08 && (
                      <span
                        className="ml-1 text-[10px] font-bold"
                        style={{ color: o.meanWins > base.meanWins ? 'var(--viz-pos)' : 'var(--viz-neg)' }}
                      >
                        {signed(o.meanWins - base.meanWins)}
                      </span>
                    )}
                  </Td>
                  <Td align="right" style={{ color: o.pChampion > 0.08 ? 'var(--text-hi)' : 'var(--text-low)' }}>
                    {o.pChampion < 0.001 ? '—' : pct(o.pChampion, 1)}
                  </Td>
                  <Td align="right" style={{ color: o.pPlayoff > 0.2 ? 'var(--text-hi)' : 'var(--text-low)' }}>
                    {o.pPlayoff < 0.005 ? '—' : pct(o.pPlayoff)}
                  </Td>
                  <Td align="right" style={{ color: 'var(--text-low)' }}>{o.strengthOfSchedule.toFixed(1)}</Td>
                  <Td>
                    <StackedBar
                      height={9}
                      segments={[
                        { key: 'ten', value: o.pTenWins, color: 'var(--viz-seq-2)', label: '10+ wins' },
                        { key: 'bowl', value: Math.max(0, o.pBowlEligible - o.pTenWins), color: 'var(--viz-seq-4)', label: '6–9 wins' },
                        { key: 'miss', value: Math.max(0, 1 - o.pBowlEligible), color: 'var(--viz-neg)', label: 'Missed a bowl' },
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
            { c: 'var(--viz-seq-2)', l: '10+ wins' },
            { c: 'var(--viz-seq-4)', l: '6–9 wins' },
            { c: 'var(--viz-neg)', l: 'Missed a bowl' },
          ].map((k) => (
            <span key={k.l} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: k.c }} />{k.l}
            </span>
          ))}
        </div>
      </Panel>

      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Panel>
          <PanelHead
            title="Where the model parts company with the poll"
            subtitle="Conference rank in the AP preseason Top 25 against this model's conference rank. Bars to the right mean the model is higher on them than the voters are."
          />
          <div className="px-4 pb-4">
            <BarList
              min={-6}
              max={6}
              showZero
              labelWidth={92}
              valueWidth={64}
              format={(v) => (v === 0 ? 'level' : `${v > 0 ? '+' : '−'}${Math.abs(v)} ${Math.abs(v) === 1 ? 'spot' : 'spots'}`)}
              data={divergence.slice(0, 9).map((d) => ({
                key: d.team.id,
                label: (
                  <span className="flex items-center gap-1.5">
                    <TeamMark team={d.team} size={9} />
                    {d.team.abbr}
                  </span>
                ),
                value: d.gap,
                detail: `Among the ${d.polled} teams the AP ranks, it has ${d.team.school} ${d.apSecRank}; the model has them ${d.modelSecRank}.`,
                onClick: () => go('team', { teamId: d.team.id }),
              }))}
            />
            <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
              The largest gap is {divergence[0].team.school}: the AP ranks them {divergence[0].apSecRank} in the
              conference on the strength of last season, while the efficiency model has them {divergence[0].modelSecRank}
              {' '}after accounting for what left the roster.
            </p>
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Championship odds"
            subtitle={
              state.lens === 'ALL'
                ? 'Probability of winning a conference championship. Two titles are on the board, so these do not sum to one.'
                : `Probability of winning the ${CONFERENCE_BY_ID[state.lens].name} title game in ${CONFERENCE_BY_ID[state.lens].championship.city}.`
            }
            right={<InfoDot text="Derived from the season simulation: top two by conference winning percentage meet, with head-to-head as the first tiebreaker." />}
          />
          <div className="px-4 pb-4">
            <BarList
              labelWidth={78}
              valueWidth={52}
              format={(v) => pct(v, 1)}
              max={Math.max(...lensTeams.map((t) => season.teams[t.id].pChampion))}
              data={[...lensTeams]
                .sort((a, b) => season.teams[b.id].pChampion - season.teams[a.id].pChampion)
                .slice(0, 10)
                .map((t) => ({
                  key: t.id,
                  label: (
                    <span className="flex items-center gap-1.5">
                      <TeamMark team={t} size={9} />
                      {t.abbr}
                    </span>
                  ),
                  value: season.teams[t.id].pChampion,
                  color: 'var(--viz-seq-3)',
                  reference: editCount > 0 ? baselineSeason.teams[t.id].pChampion : undefined,
                  onClick: () => go('team', { teamId: t.id }),
                }))}
            />
            {editCount > 0 && (
              <p className="mt-2.5 flex items-center gap-1.5 text-[10.5px]" style={{ color: 'var(--text-faint)' }}>
                <span aria-hidden className="inline-block h-3 w-[2px]" style={{ background: 'var(--text-faint)' }} />
                Tick marks show the baseline before your scenario.
              </p>
            )}
          </div>
        </Panel>
      </div>

      {/* ------------------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="The shape of the league"
          subtitle="Offensive rating against defensive rating. Up and to the right is a complete team; the axes cross at the conference median."
        />
        <div className="px-5 pb-5">
          <Scatter
            height={380}
            xLabel="Offence (points above average)"
            yLabel="Defence (points above average)"
            points={ranked.map((r) => ({
              key: r.teamId,
              x: r.offense,
              y: r.defense,
              label: r.team.abbr,
              color: r.team.primary,
              emphasis: r.rank <= 6,
              onClick: () => go('team', { teamId: r.teamId }),
              detail: (
                <>
                  <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>{r.team.school}</div>
                  <div className="mt-1 tabular-nums">Offence {signed(r.offense)} · Defence {signed(r.defense)}</div>
                  <div className="tabular-nums" style={{ color: 'var(--text-low)' }}>
                    Rating {r.total.toFixed(1)} · projected {season.teams[r.teamId].meanWins.toFixed(1)} wins
                  </div>
                </>
              ),
            }))}
          />
        </div>
      </Panel>

      {/* ------------------------------------------------------------------ */}
      <SeasonSlate />

      {/* ------------------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="Value board"
          subtitle={
            boardScope === 'all'
              ? 'Points Above Replacement — how much team rating each player is worth across a full season, if the next man up had to play instead. Quarterbacks sweep the top because they genuinely are worth that much.'
              : boardScope === 'skill'
                ? 'The most valuable offensive players who are not quarterbacks.'
                : 'The most valuable defenders in the conference.'
          }
          right={
            <div className="flex items-center gap-2">
              <Segmented
                size="sm"
                ariaLabel="Value board scope"
                value={boardScope}
                onChange={setBoardScope}
                options={[
                  { value: 'all', label: 'All', title: 'Quarterbacks dominate raw PAR — that is the model working, not a bug' },
                  { value: 'skill', label: 'Non-QB offence' },
                  { value: 'defense', label: 'Defence' },
                ]}
              />
              <button className="btn !py-1 !text-[11px]" onClick={() => go('player')}>
                <IconSpark size={12} /> Full board
              </button>
            </div>
          }
        />
        <Divider />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fill, minmax(238px, 1fr))' }}>
          {valueBoard.map((p, i) => {
            const t = TEAM_BY_ID[p.teamId];
            return (
              <button
                key={p.id}
                onClick={() => go('player', { playerId: p.id })}
                className="flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--bg-hover)]"
                style={{ background: 'var(--bg-panel)' }}
              >
                <span className="w-4 shrink-0 text-[11px] font-bold tabular-nums" style={{ color: 'var(--text-faint)' }}>
                  {i + 1}
                </span>
                <TeamMark team={t} size={11} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                  <span className="block truncate text-[10.5px]" style={{ color: 'var(--text-low)' }}>
                    {p.position} · {t.abbr} · {p.classYear}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[13px] font-bold tabular-nums" style={{ color: 'var(--accent-hi)' }}>
                    {p.par.toFixed(1)}
                  </span>
                  <Label>PAR</Label>
                </span>
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* The full slate, week by week                                               */
/* -------------------------------------------------------------------------- */

function SeasonSlate() {
  const { projectionById } = useStore();
  const [week, setWeek] = useState<number | 'marquee'>('marquee');

  const games = useMemo(() => {
    const source =
      week === 'marquee'
        ? ALL_GAMES.filter((g) => g.headline)
        : ALL_GAMES.filter((g) => g.week === week);
    return source
      .map((g) => ({ g, p: projectionById.get(g.id) }))
      .filter((x): x is { g: (typeof ALL_GAMES)[number]; p: GameProjection } => !!x.p)
      .sort((a, b) => {
        if (a.g.conferenceGame !== b.g.conferenceGame) return a.g.conferenceGame ? -1 : 1;
        return Math.abs(a.p.margin) - Math.abs(b.p.margin);
      });
  }, [week, projectionById]);

  const label =
    week === 'marquee'
      ? 'The games with the largest effect on the title race, closest first.'
      : `${games.length} games in week ${week}, conference games first and closest first. ${WEEKS[week - 1]?.label ?? ''}`;

  return (
    <section>
      <div className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--text-hi)' }}>
            The slate
          </h2>
          <p className="text-[11.5px]" style={{ color: 'var(--text-low)' }}>{label}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setWeek('marquee')}
            data-active={week === 'marquee'}
            className="btn !px-2.5 !py-1 !text-[11px]"
          >
            Marquee
          </button>
          {WEEKS.map((w) => (
            <button
              key={w.week}
              onClick={() => setWeek(w.week)}
              data-active={week === w.week}
              className="btn !px-2 !py-1 !text-[11px]"
              title={w.label}
            >
              {w.week}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {games.map(({ g, p }) => (
          <GameCard key={g.id} game={g} projection={p} />
        ))}
      </div>
    </section>
  );
}
