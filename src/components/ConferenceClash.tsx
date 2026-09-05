import { useMemo } from 'react';
import { CONFERENCES } from '../data/conferences';
import { TEAM_BY_ID } from '../data/teams';
import { NON_CONFERENCE_GAMES } from '../data/schedule';
import type { Team } from '../data/types';
import { useStore } from '../state/store';
import { Panel, PanelHead, InfoDot, TeamMark } from './ui';
import { teamInk } from '../lib/viz';

/* ============================================================================
 * SEC against the Big Ten.
 *
 * With two conferences in one projection the obvious question is which is
 * better, and the honest answer has two halves that disagree in interesting
 * ways. The anchors say what the results said last season. The strip says how
 * the two are shaped — one can sit lower on average and still hold more of the
 * very top. And the fixtures are the only part that will actually settle it.
 * ========================================================================== */

/** Where a rating sits on the shared axis, as a 0–1 fraction. */
function useAxis(teams: Team[][]) {
  const { ratings } = useStore();
  return useMemo(() => {
    const all = teams.flat().map((t) => ratings[t.id].total);
    const lo = Math.floor(Math.min(...all) - 2);
    const hi = Math.ceil(Math.max(...all) + 2);
    return { lo, hi, at: (v: number) => (v - lo) / (hi - lo) };
  }, [teams, ratings]);
}

export function ConferenceClash() {
  const { state, ratings, projectionById, go } = useStore();
  const mode = state.theme;

  const groups = CONFERENCES.map((c) => ({
    ...c,
    sorted: [...c.teams].sort((a, b) => ratings[b.id].total - ratings[a.id].total),
  }));
  const axis = useAxis(groups.map((g) => g.teams));

  /** Only the games that actually put one conference against the other. */
  const fixtures = useMemo(
    () =>
      NON_CONFERENCE_GAMES
        .filter((g) => TEAM_BY_ID[g.homeId] && TEAM_BY_ID[g.awayId])
        .map((g) => ({ g, p: projectionById.get(g.id) }))
        .filter((x) => x.p)
        .sort((a, b) => a.g.week - b.g.week),
    [projectionById],
  );

  const summary = groups.map((g) => {
    const vals = g.sorted.map((t) => ratings[t.id].total);
    const median = vals[Math.floor(vals.length / 2)];
    return {
      id: g.id,
      name: g.name,
      anchor: g.anchor,
      median,
      top: vals[0],
      // How many of the pool's ten best belong to this conference — the "depth
      // at the top" question a mean cannot answer.
      inTopTen: g.sorted.filter((t) => {
        const rank = [...groups.flatMap((x) => x.teams)]
          .sort((a, b) => ratings[b.id].total - ratings[a.id].total)
          .findIndex((x) => x.id === t.id);
        return rank < 10;
      }).length,
    };
  });

  return (
    <Panel>
      <PanelHead
        title="SEC against the Big Ten"
        subtitle="Two conferences on one scale — points of scoring margin against an average FBS team."
        right={
          <InfoDot text="Each conference's anchor is fitted from scoring margins across every FBS game, with home advantage solved alongside team strength. It is the only thing separating the two leagues on an absolute scale; nothing inside a conference depends on it." />
        }
      />

      {/* ---- The two anchors, side by side -------------------------------- */}
      <div className="grid gap-px" style={{ background: 'var(--line-faint)', gridTemplateColumns: '1fr 1fr' }}>
        {summary.map((s) => (
          <div key={s.id} className="px-4 py-3" style={{ background: 'var(--bg-panel)' }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.07em]" style={{ color: 'var(--text-faint)' }}>
              {s.name}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold leading-none tabular-nums" style={{ color: 'var(--text-hi)' }}>
                +{s.anchor.toFixed(2)}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-low)' }}>measured anchor</span>
            </div>
            <div className="mt-1.5 text-[11px] tabular-nums" style={{ color: 'var(--text-low)' }}>
              median {s.median.toFixed(1)} · best {s.top.toFixed(1)} · {s.inTopTen} of the top ten
            </div>
          </div>
        ))}
      </div>

      {/* ---- Every team on one axis --------------------------------------- */}
      <div className="px-4 pt-4 pb-1">
        {groups.map((g) => (
          <div key={g.id} className="mb-3 last:mb-1">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-mid)' }}>{g.name}</span>
              <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-faint)' }}>
                {g.teams.length} teams
              </span>
            </div>
            <div
              className="relative h-[34px] rounded-[7px]"
              style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line-faint)' }}
              role="img"
              aria-label={`${g.name} team ratings from ${axis.lo} to ${axis.hi} points`}
            >
              {/* An average FBS team, so the axis has a fixed reference point. */}
              <div
                className="absolute top-0 bottom-0 w-px"
                style={{ left: `${axis.at(0) * 100}%`, background: 'var(--line)' }}
                aria-hidden
              />
              {/* The conference's own anchor, as a line through its teams. */}
              <div
                className="absolute top-0 bottom-0 w-px"
                style={{ left: `${axis.at(g.anchor) * 100}%`, background: 'var(--accent)', opacity: 0.55 }}
                aria-hidden
              />
              {g.sorted.map((t) => (
                <button
                  key={t.id}
                  onClick={() => go('team', { teamId: t.id })}
                  title={`${t.school} — ${ratings[t.id].total.toFixed(1)}`}
                  className="absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150"
                  style={{
                    left: `${axis.at(ratings[t.id].total) * 100}%`,
                    background: t.primary,
                    border: '1.5px solid var(--bg-panel-2)',
                  }}
                >
                  <span className="sr-only">{t.school}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {/* Labels sit at the values they name, not spaced evenly — zero is not
            in the middle of this axis and must not look as though it is. */}
        <div className="relative h-[13px] text-[9.5px] tabular-nums" style={{ color: 'var(--text-faint)' }}>
          <span className="absolute left-0">{axis.lo} pts</span>
          <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${axis.at(0) * 100}%` }}>
            average FBS
          </span>
          <span className="absolute right-0">+{axis.hi}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[9.5px]" style={{ color: 'var(--text-faint)' }}>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2.5 w-px" style={{ background: 'var(--accent)' }} />
            conference anchor
          </span>
          <span>each dot is a team — click to open it</span>
        </div>
      </div>

      {/* ---- The games that settle it ------------------------------------- */}
      {fixtures.length > 0 && (
        <div className="mt-1 border-t px-4 py-3" style={{ borderColor: 'var(--line-faint)' }}>
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.07em]" style={{ color: 'var(--text-faint)' }}>
            {fixtures.length} head-to-head {fixtures.length === 1 ? 'fixture' : 'fixtures'} on the 2026 slate
          </div>
          <div className="space-y-1">
            {fixtures.map(({ g, p }) => {
              const home = TEAM_BY_ID[g.homeId];
              const away = TEAM_BY_ID[g.awayId];
              const favouriteHome = p!.margin > 0;
              return (
                <button
                  key={g.id}
                  onClick={() => go('matchup', { gameId: g.id })}
                  className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-hover)]"
                >
                  <span className="w-[46px] shrink-0 text-[10px] tabular-nums" style={{ color: 'var(--text-faint)' }}>
                    Wk {g.week}
                  </span>
                  <TeamMark team={away} size={9} />
                  <span className="text-[12px] font-medium" style={{ color: teamInk(away, mode) }}>{away.abbr}</span>
                  <span className="text-[10.5px]" style={{ color: 'var(--text-faint)' }}>at</span>
                  <TeamMark team={home} size={9} />
                  <span className="text-[12px] font-medium" style={{ color: teamInk(home, mode) }}>{home.abbr}</span>
                  <span className="ml-auto text-[11px] tabular-nums" style={{ color: 'var(--text-mid)' }}>
                    {g.completed
                      ? `${g.awayPoints}–${g.homePoints} final`
                      : `${(favouriteHome ? home : away).abbr} by ${Math.abs(p!.margin).toFixed(1)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Panel>
  );
}
