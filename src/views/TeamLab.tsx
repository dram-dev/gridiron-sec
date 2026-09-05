import { useMemo } from 'react';
import { BarList, Distribution, ProbabilityStrip, StackedBar, Waterfall } from '../components/charts';
import { IconArrow } from '../components/icons';
import {
  AnimatedNumber, Divider, InfoDot, Label, Panel, PanelHead, ProvenanceTag, Stat,
  Table, Td, Th, TeamMark,
} from '../components/ui';
import { COACH_BY_TEAM } from '../data/coaches';
import { ROSTERS } from '../data/players';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import { CONFERENCE_BY_ID } from '../data/conferences';
import type { TeamId } from '../data/types';
import { resolveRated } from '../engine/game';
import { rosterValue } from '../engine/players';
import { teamSchedule } from '../engine/season';
import { num, pct, signed, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

/** Efficiency metrics compared against the conference median. */
const EFFICIENCY_ROWS: {
  key: string; label: string; get: (e: any) => number; better: 'high' | 'low'; format: (v: number) => string; hint: string;
}[] = [
  { key: 'offEpa', label: 'Offence EPA/play', get: (e) => e.offEpa, better: 'high', format: (v) => v.toFixed(3), hint: 'Expected points added per offensive snap.' },
  { key: 'defEpa', label: 'Defence EPA/play', get: (e) => e.defEpa, better: 'low', format: (v) => v.toFixed(3), hint: 'Expected points allowed per opponent snap. Lower is better.' },
  { key: 'offSuccess', label: 'Success rate', get: (e) => e.offSuccess, better: 'high', format: (v) => pct(v, 1), hint: 'Share of plays gaining enough yardage to stay on schedule.' },
  { key: 'defSuccess', label: 'Success allowed', get: (e) => e.defSuccess, better: 'low', format: (v) => pct(v, 1), hint: 'Opponent success rate. Lower is better.' },
  { key: 'offExplosive', label: 'Explosiveness', get: (e) => e.offExplosive, better: 'high', format: (v) => v.toFixed(2), hint: 'Average EPA on successful plays — the big-play dimension.' },
  { key: 'havoc', label: 'Havoc rate', get: (e) => e.havoc, better: 'high', format: (v) => pct(v, 1), hint: 'Share of plays ending in a tackle for loss, forced fumble, interception or breakup.' },
  { key: 'lineYards', label: 'Line yards', get: (e) => e.lineYards, better: 'high', format: (v) => v.toFixed(2), hint: 'Yards per rush credited to the offensive line.' },
  { key: 'sackRateAllowed', label: 'Sack rate allowed', get: (e) => e.sackRateAllowed, better: 'low', format: (v) => pct(v, 1), hint: 'Share of dropbacks ending in a sack. Lower is better.' },
  { key: 'finishing', label: 'Finishing drives', get: (e) => e.finishing, better: 'high', format: (v) => v.toFixed(2), hint: 'Points per scoring opportunity — first down inside the opponent 40.' },
  { key: 'turnoverMargin', label: 'Turnover margin', get: (e) => e.turnoverMargin, better: 'high', format: (v) => signed(v, 2), hint: 'Per game. Regresses hard year to year.' },
  { key: 'playsPerGame', label: 'Plays per game', get: (e) => e.playsPerGame, better: 'high', format: (v) => v.toFixed(1), hint: 'Tempo. Affects totals far more than margins.' },
  { key: 'fourthDownGoRate', label: 'Fourth-down go rate', get: (e) => e.fourthDownGoRate, better: 'high', format: (v) => pct(v, 0), hint: 'Share of realistic fourth downs the staff goes for.' },
];

export function TeamLab() {
  const { state, dispatch, ratings, baselineRatings, ranked, season, baselineSeason, projectionById, go, editCount } = useStore();
  const teamId = state.selectedTeam;
  const team = TEAM_BY_ID[teamId];
  const rating = ratings[teamId];
  const rank = ranked.find((r) => r.teamId === teamId)!;
  const conference = CONFERENCE_BY_ID[TEAM_BY_ID[teamId].conference];
  const confRank = ranked.filter((r) => TEAM_BY_ID[r.teamId].conference === conference.id)
    .findIndex((r) => r.teamId === teamId) + 1;
  const outlook = season.teams[teamId];
  const baseOutlook = baselineSeason.teams[teamId];
  const coach = COACH_BY_TEAM[teamId];
  const mode = state.theme;

  const schedule = useMemo(() => teamSchedule(teamId), [teamId]);
  const value = useMemo(() => rosterValue(teamId), [teamId]);

  /*
   * Compare a team against its own conference, not the pool.
   *
   * "Above the median" has to mean above the teams this one actually plays.
   * Measuring an SEC team against a thirty-four-team median would quietly
   * flatter or punish it for the company it keeps rather than how it played.
   */
  const peers = useMemo(
    () => TEAMS.filter((t) => t.conference === team.conference),
    [team.conference],
  );
  const medians = useMemo(() => {
    const out: Record<string, number> = {};
    for (const row of EFFICIENCY_ROWS) {
      const vals = peers.map((t) => row.get(t.efficiency)).sort((a, b) => a - b);
      out[row.key] = vals[Math.floor(vals.length / 2)];
    }
    return out;
  }, [peers]);

  const winBins = outlook.winDistribution
    .map((p, i) => ({ x: i, p }))
    .filter((b) => b.p > 0.0008);

  return (
    <div className="space-y-4">
      {/* Team picker */}
      <div className="flex flex-wrap gap-1.5">
        {ranked.map((r) => (
          <button
            key={r.teamId}
            onClick={() => dispatch({ type: 'selectTeam', teamId: r.teamId })}
            className="chip transition-colors"
            style={
              r.teamId === teamId
                ? { borderColor: r.team.primary, background: 'var(--bg-raised)', color: 'var(--text-hi)' }
                : undefined
            }
          >
            <TeamMark team={r.team} size={9} />
            {r.team.abbr}
          </button>
        ))}
      </div>

      {/* ---- Identity ------------------------------------------------------ */}
      <Panel className="overflow-hidden">
        <div
          className="h-1"
          style={{ background: `linear-gradient(90deg, ${team.primary}, ${team.secondary === '#FFFFFF' ? team.primary : team.secondary})` }}
          aria-hidden
        />
        <div className="flex flex-wrap items-start justify-between gap-5 px-5 pt-4 pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <TeamMark team={team} size={22} />
              <h2 className="text-[24px] font-bold leading-none tracking-[-0.02em]" style={{ color: teamInk(team, mode) }}>
                {team.school}
              </h2>
              <span className="chip">{team.mascot}</span>
              <ProvenanceTag value={team.provenance} />
            </div>
            <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
              {team.outlook}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px]" style={{ color: 'var(--text-low)' }}>
              <span>{team.venue.name} · {team.venue.capacity.toLocaleString()}</span>
              <span>Home field worth {num(team.venue.hfa)} pts</span>
              <span>2025: {team.record2025.wins}–{team.record2025.losses} ({team.record2025.confWins}–{team.record2025.confLosses} {conference.short})</span>
              {team.apPreseason && <span>AP preseason #{team.apPreseason}</span>}
              {team.spPlusRank && <span>SP+ #{team.spPlusRank}</span>}
            </div>
          </div>

          <button
            onClick={() => go('coach', { teamId })}
            className="panel-flat group flex min-w-[204px] items-center gap-3 px-3 py-2.5 text-left transition-colors hover:border-[var(--line-strong)]"
          >
            <div className="min-w-0 flex-1">
              <Label>Head coach · year {coach.tenureYear}</Label>
              <div className="mt-1 truncate text-[14px] font-bold" style={{ color: 'var(--text-hi)' }}>{coach.name}</div>
              <div className="truncate text-[11px]" style={{ color: 'var(--text-low)' }}>
                {coach.archetype} · {coach.career.wins}–{coach.career.losses} career
              </div>
            </div>
            <IconArrow size={14} />
          </button>
        </div>

        <Divider />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {[
            { label: 'Team rating', value: <AnimatedNumber value={rating.total} digits={1} />, sub: `#${rank.rank} of ${TEAMS.length} · #${confRank} in the ${conference.name}`, delta: rating.total - baselineRatings[teamId].total, tone: 'accent' as const },
            { label: 'Projected record', value: `${outlook.meanWins.toFixed(1)}–${(12 - outlook.meanWins).toFixed(1)}`, sub: `${outlook.meanConfWins.toFixed(1)}–${(9 - outlook.meanConfWins).toFixed(1)} in conference`, delta: outlook.meanWins - baseOutlook.meanWins },
            { label: `${conference.short} title`, value: pct(outlook.pChampion, 1), sub: `${pct(outlook.pTitleGame, 1)} reach ${conference.championship.city.split(',')[0]}`, delta: undefined },
            { label: 'Playoff bid', value: pct(outlook.pPlayoff), sub: `${pct(outlook.pTenWins)} win ten or more`, delta: undefined },
            { label: 'Schedule strength', value: num(outlook.strengthOfSchedule), sub: `${num(outlook.conferenceSos)} in conference`, delta: undefined },
            { label: 'Returning production', value: pct(team.returning.overall), sub: `${pct(team.returning.offense)} off · ${pct(team.returning.defense)} def`, delta: undefined },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
              <Stat label={s.label} value={s.value} sub={s.sub} delta={editCount > 0 ? s.delta : undefined} tone={s.tone} size="sm" />
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- Rating decomposition + season shape --------------------------- */}
      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Panel>
          <PanelHead
            title="How the rating is built"
            subtitle="Each bar is one component of the projection, stacked to the team's total. This is the whole model for this team — there is nothing else behind it."
            right={<InfoDot text="Components are calibrated so the total lands on a projection consistent with published preseason ratings, while each part stays individually interpretable." />}
          />
          <div className="px-5 pb-4">
            <Waterfall parts={rating.parts} total={rating.total} height={190} />
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Win-total distribution"
            subtitle={`Across ${season.iterations.toLocaleString()} simulated seasons. The spread, not the average, is the honest answer.`}
          />
          <div className="px-5 pb-2">
            <Distribution
              bins={winBins}
              height={140}
              format={(x) => `${x} wins`}
              ariaLabel="Distribution of simulated season win totals"
              highlight={(x) => x === Math.round(outlook.meanWins)}
              colorFor={(x) => (x >= 10 ? 'var(--viz-seq-2)' : x >= 6 ? 'var(--viz-seq-4)' : 'var(--viz-neg)')}
            />
            <div className="mt-1 flex justify-between text-[10px]" style={{ color: 'var(--text-faint)' }}>
              <span>{winBins[0]?.x ?? 0} wins</span>
              <span>{winBins[winBins.length - 1]?.x ?? 12} wins</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px px-0 pb-0" style={{ background: 'var(--line-faint)', borderTop: '1px solid var(--line-faint)' }}>
            {[
              { l: 'Bowl eligible', v: pct(outlook.pBowlEligible) },
              { l: 'Ten wins or more', v: pct(outlook.pTenWins) },
              { l: 'Undefeated', v: outlook.pUndefeated < 0.001 ? '—' : pct(outlook.pUndefeated, 1) },
            ].map((x) => (
              <div key={x.l} className="px-3.5 py-2.5" style={{ background: 'var(--bg-panel)' }}>
                <Label>{x.l}</Label>
                <div className="mt-1 text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>{x.v}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ---- Schedule ------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="Schedule"
          subtitle="Win probability for every game. Darker is more likely; click any game to open it in the simulator."
          right={
            <span className="chip">
              {schedule.filter((g) => g.conferenceGame).length} conference · {schedule.length} total
            </span>
          }
        />
        <div className="px-5 pb-3">
          <ProbabilityStrip
            mode={mode}
            onSelect={(gameId) => {
              const g = schedule.find((x) => x.id === gameId)!;
              const oppId = g.homeId === teamId ? g.awayId : g.homeId;
              dispatch({ type: 'selectTeam', teamId: g.homeId as TeamId });
              if (TEAM_BY_ID[oppId]) dispatch({ type: 'comparisonTeam', teamId: (g.homeId === teamId ? g.awayId : g.homeId) as TeamId });
              go('matchup', { gameId });
            }}
            cells={schedule.map((g) => {
              const p = projectionById.get(g.id)!;
              const isHome = g.homeId === teamId;
              const prob = isHome ? p.homeWinProb : p.awayWinProb;
              const opp = resolveRated(isHome ? g.awayId : g.homeId, ratings);
              return {
                key: g.id,
                probability: prob,
                label: `${isHome ? '' : '@'}${opp.abbr}`,
                muted: !g.conferenceGame,
                detail: (
                  <>
                    <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>
                      {isHome ? 'vs' : 'at'} {opp.name}
                    </div>
                    <div className="mt-0.5 tabular-nums">Week {g.week} · {pct(prob, 1)} to win</div>
                    <div className="tabular-nums" style={{ color: 'var(--text-low)' }}>
                      Projected {(isHome ? p.homePoints : p.awayPoints).toFixed(0)}–{(isHome ? p.awayPoints : p.homePoints).toFixed(0)}
                    </div>
                    {g.neutralSite && <div style={{ color: 'var(--text-faint)' }}>{g.neutralSite}</div>}
                  </>
                ),
              };
            })}
          />
        </div>
        <Table>
          <thead>
            <tr>
              <Th width={44} align="right">Wk</Th>
              <Th>Opponent</Th>
              <Th align="center" width={60}>Site</Th>
              <Th align="right" width={70}>Opp rating</Th>
              <Th align="right" width={80}>Projection</Th>
              <Th align="right" width={70}>Win prob</Th>
              <Th width={112}>Confidence</Th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((g) => {
              const p = projectionById.get(g.id)!;
              const isHome = g.homeId === teamId;
              const prob = isHome ? p.homeWinProb : p.awayWinProb;
              const opp = resolveRated(isHome ? g.awayId : g.homeId, ratings);
              const oppTeam = TEAM_BY_ID[isHome ? g.awayId : g.homeId];
              return (
                <tr
                  key={g.id}
                  className="row-hover cursor-pointer"
                  onClick={() => {
                    if (oppTeam) dispatch({ type: 'comparisonTeam', teamId: oppTeam.id });
                    dispatch({ type: 'selectTeam', teamId });
                    go('matchup', { gameId: g.id });
                  }}
                >
                  <Td align="right" style={{ color: 'var(--text-faint)' }}>{g.week}</Td>
                  <Td mono={false}>
                    <span className="flex items-center gap-2">
                      {oppTeam ? <TeamMark team={oppTeam} size={10} /> : <span className="h-[10px] w-[10px] rounded-[3px]" style={{ background: 'var(--line-strong)' }} />}
                      <span className="truncate font-medium" style={{ color: 'var(--text-hi)' }}>{opp.name}</span>
                      {g.rivalry && (
                        <span className="hidden truncate text-[10px] md:inline" style={{ color: 'var(--text-faint)' }}>{g.rivalry}</span>
                      )}
                      {!g.conferenceGame && <span className="chip !text-[9px] !py-0">Non-conf</span>}
                    </span>
                  </Td>
                  <Td align="center" style={{ color: 'var(--text-low)' }}>
                    {g.neutralSite ? 'N' : isHome ? 'H' : 'A'}
                  </Td>
                  <Td align="right" style={{ color: 'var(--text-mid)' }}>{signed(opp.total)}</Td>
                  <Td align="right" style={{ color: 'var(--text)' }}>
                    {(isHome ? p.homePoints : p.awayPoints).toFixed(0)}–{(isHome ? p.awayPoints : p.homePoints).toFixed(0)}
                  </Td>
                  <Td align="right" className="font-semibold" style={{ color: prob >= 0.5 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}>
                    {pct(prob)}
                  </Td>
                  <Td>
                    <StackedBar
                      height={8}
                      segments={[
                        { key: 'w', value: prob, color: 'var(--viz-pos)', label: 'Win' },
                        { key: 'l', value: 1 - prob, color: 'var(--bg-active)', label: 'Loss' },
                      ]}
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Panel>

      {/* ---- Efficiency + roster ------------------------------------------- */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            title="Efficiency profile"
            subtitle={`2025 per-play performance against the ${conference.name} median. Bars right of centre are better than a median ${conference.short} team, whichever direction the metric runs.`}
          />
          <Table>
            <thead>
              <tr>
                <Th>Metric</Th>
                <Th align="right" width={78}>{team.abbr}</Th>
                <Th align="right" width={78}>{conference.short} median</Th>
                <Th width={140}>vs median</Th>
              </tr>
            </thead>
            <tbody>
              {EFFICIENCY_ROWS.map((row) => {
                const v = row.get(team.efficiency);
                const med = medians[row.key];
                const all = peers.map((t) => row.get(t.efficiency));
                const spread = Math.max(...all) - Math.min(...all) || 1;
                const raw = (v - med) / spread;
                const edge = row.better === 'high' ? raw : -raw;
                return (
                  <tr key={row.key} className="row-hover">
                    <Td mono={false}>
                      <span className="flex items-center gap-1.5">
                        <span style={{ color: 'var(--text)' }}>{row.label}</span>
                        <InfoDot text={row.hint} />
                      </span>
                    </Td>
                    <Td align="right" className="font-semibold" style={{ color: 'var(--text-hi)' }}>{row.format(v)}</Td>
                    <Td align="right" style={{ color: 'var(--text-faint)' }}>{row.format(med)}</Td>
                    <Td>
                      <div className="relative h-2.5">
                        <span aria-hidden className="absolute inset-y-0 left-1/2 w-px" style={{ background: 'var(--grid-line)' }} />
                        <span
                          className="absolute top-1/2 h-[7px] -translate-y-1/2 rounded-[4px]"
                          style={{
                            left: edge >= 0 ? '50%' : `${50 + edge * 100}%`,
                            width: `${Math.min(48, Math.abs(edge) * 100)}%`,
                            background: edge >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)',
                          }}
                        />
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHead
              title="Where the value sits"
              subtitle={`${value.totalPar.toFixed(1)} points of Points Above Replacement across the tracked roster. Concentration is ${pct(value.concentration)} in the top three players.`}
            />
            <div className="px-4 pb-4">
              <BarList
                labelWidth={110}
                valueWidth={64}
                format={(v) => `${v.toFixed(1)} pts`}
                data={value.byGroup.map((gp) => ({
                  key: gp.group,
                  label: gp.group,
                  value: gp.par,
                  color: 'var(--viz-seq-2)',
                  detail: `${gp.players} tracked player${gp.players === 1 ? '' : 's'}`,
                }))}
              />
            </div>
            <Divider />
            <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {value.topPlayers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => go('player', { playerId: p.id })}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ background: 'var(--bg-panel)' }}
                >
                  <span className="chip !text-[9.5px] !px-1.5 shrink-0">{p.position}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                  <span className="shrink-0 text-[12px] font-bold tabular-nums" style={{ color: 'var(--accent-hi)' }}>{p.par.toFixed(1)}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead title="The case for and against" />
            <div className="grid gap-4 px-5 pb-4 sm:grid-cols-2">
              <div>
                <Label>Strengths</Label>
                <ul className="mt-2 space-y-1.5">
                  {team.strengths.map((s) => (
                    <li key={s} className="flex gap-2 text-[12px] leading-snug" style={{ color: 'var(--text)' }}>
                      <span aria-hidden className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--viz-pos)' }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Concerns</Label>
                <ul className="mt-2 space-y-1.5">
                  {team.concerns.map((s) => (
                    <li key={s} className="flex gap-2 text-[12px] leading-snug" style={{ color: 'var(--text)' }}>
                      <span aria-hidden className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--viz-neg)' }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-px sm:grid-cols-4" style={{ background: 'var(--line-faint)' }}>
              {[
                { l: 'Blue-chip ratio', v: pct(team.talent.blueChipRatio) },
                { l: 'Recruiting class', v: `#${team.talent.recruitClassRank}` },
                { l: 'Portal class', v: `#${team.talent.portalClassRank}` },
                { l: 'Returning OL starts', v: String(team.returning.olStarts) },
              ].map((x) => (
                <div key={x.l} className="px-3.5 py-2.5" style={{ background: 'var(--bg-panel)' }}>
                  <Label>{x.l}</Label>
                  <div className="mt-1 text-[14px] font-semibold tabular-nums" style={{ color: 'var(--text-hi)' }}>{x.v}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ---- Roster -------------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Roster"
          subtitle={`${ROSTERS[teamId].length} tracked contributors. PAR is the points of team rating lost across a season if the next man up had to play instead.`}
          right={<button className="btn !py-1 !text-[11px]" onClick={() => go('player')}>Open Player Lab</button>}
        />
        <Table>
          <thead>
            <tr>
              <Th width={54}>Pos</Th>
              <Th>Player</Th>
              <Th align="center" width={54}>Class</Th>
              <Th align="center" width={86}>Origin</Th>
              <Th align="right" width={60}>Grade</Th>
              <Th align="right" width={56}>PAR</Th>
              <Th align="right" width={78}>Breakout</Th>
              <Th width={84}>Source</Th>
            </tr>
          </thead>
          <tbody>
            {[...ROSTERS[teamId]].sort((a, b) => b.par - a.par).map((p) => (
              <tr key={p.id} className="row-hover cursor-pointer" onClick={() => go('player', { playerId: p.id })}>
                <Td><span className="chip !text-[9.5px] !px-1.5">{p.position}</span></Td>
                <Td mono={false}>
                  <span className="font-medium" style={{ color: 'var(--text-hi)' }}>{p.name}</span>
                  {p.accolades.length > 0 && (
                    <span className="ml-2 text-[10px]" style={{ color: 'var(--accent-hi)' }}>{p.accolades[0]}</span>
                  )}
                </Td>
                <Td align="center" style={{ color: 'var(--text-low)' }}>{p.classYear}</Td>
                <Td align="center" mono={false} style={{ color: 'var(--text-low)' }}>
                  {p.origin === 'transfer' ? `via ${p.from}` : p.origin === 'freshman' ? 'Freshman' : 'Returning'}
                </Td>
                <Td align="right" style={{ color: 'var(--text)' }}>{p.grade}</Td>
                <Td align="right" className="font-semibold" style={{ color: 'var(--accent-hi)' }}>{p.par.toFixed(1)}</Td>
                <Td align="right" style={{ color: 'var(--text-low)' }}>{pct(p.breakoutOdds)}</Td>
                <Td><ProvenanceTag value={p.provenance} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </div>
  );
}
