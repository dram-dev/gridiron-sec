import { useMemo, useState } from 'react';
import { BumpChart, DivergingPairs, FanChart, Ridgeline, type FanMarker } from '../components/timeseries';
import { Divider, InfoDot, Panel, PanelHead, Segmented, Stat, TeamMark } from '../components/ui';
import { TEAMS, TEAM_BY_ID } from '../data/teams';
import { WEEKS } from '../data/schedule';
import type { TeamId } from '../data/types';
import { resolveRated } from '../engine/game';
import { teamSchedule } from '../engine/season';
import { CATEGORICAL, num, pct, teamInk } from '../lib/viz';
import { useStore } from '../state/store';

/* ============================================================================
 * Trajectory.
 *
 * The rest of the app reads the season as an endpoint. This view reads it as a
 * path: the simulation already walks week by week, so cumulative wins, the
 * conference table and the marginal effect of any single result are all
 * observable as they happen rather than only at the finish.
 * ========================================================================== */

type Lens = 'wins' | 'standing';

export function Trajectory() {
  const { state, dispatch, season, ratings, projectionById, go } = useStore();
  const mode = state.theme;
  const teamId = state.selectedTeam;
  const team = TEAM_BY_ID[teamId];
  const [lens, setLens] = useState<Lens>('wins');
  const [hoverTeam, setHoverTeam] = useState<string | null>(null);

  const traj = season.trajectories[teamId];
  const outlook = season.teams[teamId];

  /* ---- Opponent labels along the week axis ----------------------------- */
  const markers = useMemo<FanMarker[]>(() => {
    const games = teamSchedule(teamId);
    return WEEKS.map((w) => {
      const g = games.find((x) => x.week === w.week);
      if (!g) return { week: w.week, label: 'bye', muted: true };
      const isHome = g.homeId === teamId;
      const opp = resolveRated(isHome ? g.awayId : g.homeId, ratings);
      const p = projectionById.get(g.id);
      const wp = p ? (isHome ? p.homeWinProb : p.awayWinProb) : 0;
      return {
        week: w.week,
        label: `${isHome ? '' : '@'}${opp.abbr}`,
        muted: !g.conferenceGame,
        detail: `${isHome ? 'vs' : 'at'} ${opp.name} · ${pct(wp)} to win`,
      };
    });
  }, [teamId, ratings, projectionById]);

  /* ---- Standings race -------------------------------------------------- */
  const bumpSeries = useMemo(
    () =>
      TEAMS.map((t) => ({
        key: t.id,
        label: t.abbr,
        color: t.primary,
        values: season.trajectories[t.id].position.map((p) => p.p50),
      })),
    [season],
  );

  /* ---- Ridgeline of final win totals ----------------------------------- */
  const ridge = useMemo(
    () =>
      [...TEAMS]
        .sort((a, b) => season.teams[b.id].meanWins - season.teams[a.id].meanWins)
        .map((t) => {
          const o = season.teams[t.id];
          return {
            key: t.id,
            label: t.abbr,
            dist: o.regularWinDistribution,
            summary: `${o.meanWins.toFixed(1)} W`,
          };
        }),
    [season],
  );

  /* ---- Leverage -------------------------------------------------------- */
  const [leverageScope, setLeverageScope] = useState<'league' | 'team'>('league');
  const leverage = useMemo(() => {
    const rows = leverageScope === 'team'
      ? season.leverage.filter((g) => g.homeId === teamId || g.awayId === teamId)
      : season.leverage;
    return rows.slice(0, 12);
  }, [season.leverage, leverageScope, teamId]);

  const swingiest = season.leverage[0];

  return (
    <div className="space-y-4">
      {/* ---- Team picker --------------------------------------------------- */}
      <div className="flex flex-wrap gap-1.5">
        {[...TEAMS]
          .sort((a, b) => ratings[b.id].total - ratings[a.id].total)
          .map((t) => (
            <button
              key={t.id}
              onClick={() => dispatch({ type: 'selectTeam', teamId: t.id })}
              className="chip"
              style={t.id === teamId ? { borderColor: t.primary, color: 'var(--text-hi)' } : undefined}
            >
              <TeamMark team={t} size={9} />
              {t.abbr}
            </button>
          ))}
      </div>

      {/* ---- Fan chart ----------------------------------------------------- */}
      <Panel className="overflow-hidden">
        <div className="h-1" style={{ background: team.primary }} aria-hidden />
        <PanelHead
          title={
            <span className="flex items-center gap-2">
              <TeamMark team={team} size={11} />
              <span style={{ color: teamInk(team, mode) }}>{team.school}</span>
              <span style={{ color: 'var(--text-low)' }}>
                — {lens === 'wins' ? 'season trajectory' : 'conference standing'}
              </span>
            </span>
          }
          subtitle={
            lens === 'wins'
              ? `Cumulative wins as the season runs, across ${season.iterations.toLocaleString()} simulated seasons. The band is the season fanning out — narrow in September because almost nothing has happened yet, wide by late November because a great deal has.`
              : 'Conference standing week by week. The band shows how far the table realistically moves around the median position.'
          }
          right={
            <Segmented
              size="sm"
              ariaLabel="Trajectory measure"
              value={lens}
              onChange={setLens}
              options={[
                { value: 'wins', label: 'Wins' },
                { value: 'standing', label: 'Standing' },
              ]}
            />
          }
        />
        <div className="px-5 pb-4">
          {lens === 'wins' ? (
            <FanChart
              data={traj.wins}
              markers={markers}
              height={310}
              color={team.onDark === '#FFFFFF' ? 'var(--accent)' : team.primary}
              yLabel="Wins"
              yMin={0}
              valueFormat={(v) => v.toFixed(1)}
            />
          ) : (
            <FanChart
              data={traj.position}
              markers={markers}
              height={310}
              color={team.primary}
              yLabel="Standing"
              invert
              yMin={1}
              yMax={16}
              valueFormat={(v) => `${v.toFixed(0)}`}
            />
          )}
        </div>
        <Divider />
        <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: 'repeat(auto-fit, minmax(158px, 1fr))' }}>
          {[
            { l: 'Projected wins', v: outlook.meanWins.toFixed(1), s: `${traj.wins[12].p10.toFixed(0)}–${traj.wins[12].p90.toFixed(0)} in nine of ten seasons` },
            { l: 'Halfway point', v: traj.wins[6].p50.toFixed(0), s: `median wins through week 7` },
            { l: 'Widest week', v: `W${widestWeek(traj.wins)}`, s: 'where the season is least decided' },
            { l: 'Median finish', v: `${ordinalOf(traj.position[12].p50)}`, s: 'in the conference table' },
            { l: 'Title game', v: pct(outlook.pTitleGame, 1), s: `${pct(outlook.pChampion, 1)} to win it` },
          ].map((x) => (
            <div key={x.l} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
              <Stat label={x.l} value={x.v} sub={x.s} size="sm" />
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- Standings race ------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="The race"
          subtitle="Median conference standing for all sixteen, week by week. Hover any line to follow it; the selected team stays lit. Lines that cross are teams genuinely trading places across the simulation, not noise."
        />
        <div className="px-5 pb-5">
          <BumpChart
            series={bumpSeries}
            weeks={WEEKS.map((w) => w.week)}
            positions={16}
            height={400}
            highlight={hoverTeam ?? teamId}
            onHighlight={setHoverTeam}
          />
          <p className="mt-2 text-[11px]" style={{ color: 'var(--text-faint)' }}>
            Position 1 at the top. Week numbers along the bottom; final median position labelled at the right.
          </p>
        </div>
      </Panel>

      {/* ---- Leverage ------------------------------------------------------- */}
      <Panel>
        <PanelHead
          title="Which games actually decide it"
          subtitle="Each bar is a title probability swing, measured by conditioning: the simulations are split on that game's result and the two championship rates compared. Every other game still plays out on both sides, so this is the game's real marginal effect."
          right={
            <div className="flex items-center gap-2">
              <InfoDot text="A swing of 20 points means that team's championship probability is 20 percentage points higher in the seasons where it wins this game than in the seasons where it loses." />
              <Segmented
                size="sm"
                ariaLabel="Leverage scope"
                value={leverageScope}
                onChange={setLeverageScope}
                options={[
                  { value: 'league', label: 'League' },
                  { value: 'team', label: team.abbr },
                ]}
              />
            </div>
          }
        />
        <div className="px-5 pb-5">
          {leverage.length === 0 ? (
            <p className="py-8 text-center text-[12.5px]" style={{ color: 'var(--text-low)' }}>
              {team.school} has no game whose outcome measurably moves the title race.
            </p>
          ) : (
            <DivergingPairs
              leftColor={CATEGORICAL[mode][0]}
              rightColor={CATEGORICAL[mode][1]}
              leftLabel="Away team's title odds if it wins"
              rightLabel="Home team's title odds if it wins"
              format={(v) => `${(v * 100).toFixed(1)}`}
              onSelect={(gameId) => {
                const g = season.leverage.find((x) => x.gameId === gameId)!;
                dispatch({ type: 'selectTeam', teamId: g.homeId });
                dispatch({ type: 'comparisonTeam', teamId: g.awayId });
                go('matchup', { gameId });
              }}
              rows={leverage.map((g) => {
                const h = TEAM_BY_ID[g.homeId];
                const a = TEAM_BY_ID[g.awayId];
                return {
                  key: g.gameId,
                  left: Math.max(0, g.awaySwing),
                  right: Math.max(0, g.homeSwing),
                  detail: `Week ${g.week} · combined swing ${(g.leverage * 100).toFixed(1)} points`,
                  centre: (
                    <span className="inline-flex items-center gap-1.5">
                      <TeamMark team={a} size={8} />
                      <span style={{ color: 'var(--text)' }}>{a.abbr}</span>
                      <span style={{ color: 'var(--text-faint)' }}>@</span>
                      <TeamMark team={h} size={8} />
                      <span style={{ color: 'var(--text)' }}>{h.abbr}</span>
                      <span className="ml-1 text-[10px]" style={{ color: 'var(--text-faint)' }}>W{g.week}</span>
                    </span>
                  ),
                };
              })}
            />
          )}
          {swingiest && leverageScope === 'league' && (
            <p className="mt-4 text-[12px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
              The heaviest game on the board is{' '}
              <strong style={{ color: 'var(--text-hi)' }}>
                {TEAM_BY_ID[swingiest.awayId].school} at {TEAM_BY_ID[swingiest.homeId].school}
              </strong>{' '}
              in week {swingiest.week}, worth {(swingiest.leverage * 100).toFixed(0)} combined points
              of championship probability — more than any other single result in the season.
            </p>
          )}
        </div>
      </Panel>

      {/* ---- Ridgeline ------------------------------------------------------ */}
      <Panel>
        <PanelHead
          title="Sixteen seasons at once"
          subtitle="Every team's regular-season win distribution, ordered by projection. Height is how often a win total comes up; a wide, flat shape is a team the model genuinely cannot pin down."
        />
        <div className="px-5 pb-5">
          <Ridgeline
            rows={ridge}
            mode={mode}
            height={30}
            overlap={0.5}
            format={(i) => String(i)}
            selected={teamId}
            onSelect={(key) => dispatch({ type: 'selectTeam', teamId: key as TeamId })}
          />
          <p className="mt-2 text-[11px]" style={{ color: 'var(--text-faint)' }}>
            Regular-season wins along the bottom; mean at the right. Click a ridge to select that team.
          </p>
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** The week where the outcome is least settled — the widest 10–90 band. */
function widestWeek(points: { week: number; p10: number; p90: number }[]): number {
  let best = points[0];
  let bestSpread = -1;
  for (const p of points) {
    const spread = p.p90 - p.p10;
    if (spread > bestSpread) { bestSpread = spread; best = p; }
  }
  return best.week;
}

function ordinalOf(n: number): string {
  const v = Math.round(n);
  const s = ['th', 'st', 'nd', 'rd'];
  const m = v % 100;
  return v + (s[(m - 20) % 10] || s[m] || s[0]);
}

export { num };
