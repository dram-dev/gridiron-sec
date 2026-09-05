import { TEAM_BY_ID } from '../data/teams';
import type { Game } from '../data/types';
import type { GameProjection } from '../engine/game';
import { useStore } from '../state/store';
import { teamInk } from '../lib/viz';
import { ProbabilityBar, TeamMark } from './ui';

/** One scheduled game, with the projection attached. Clicking opens the simulator. */
export function GameCard({
  game, projection, compact = false,
}: { game: Game; projection: GameProjection; compact?: boolean }) {
  const { go, dispatch, state } = useStore();
  const home = TEAM_BY_ID[game.homeId];
  const away = TEAM_BY_ID[game.awayId];
  const mode = state.theme;

  const homeName = home?.abbr ?? projection.home.name;
  const awayName = away?.abbr ?? projection.away.name;
  const favHome = projection.margin > 0;

  const open = () => {
    if (home) dispatch({ type: 'selectTeam', teamId: home.id });
    if (away) dispatch({ type: 'comparisonTeam', teamId: away.id });
    go('matchup', { gameId: game.id });
  };

  return (
    <button
      onClick={open}
      className="panel-flat group w-full p-3 text-left transition-all duration-200 hover:border-[var(--line-strong)] hover:shadow-lift"
      style={{ background: 'var(--bg-panel)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="chip !text-[9.5px]">Week {game.week}</span>
        {game.rivalry && !compact && (
          <span className="truncate text-[10px] font-medium" style={{ color: 'var(--text-faint)' }} title={game.rivalry}>
            {game.rivalry}
          </span>
        )}
        {game.neutralSite && compact && <span className="chip !text-[9.5px]">Neutral</span>}
      </div>

      <div className="mt-2.5 space-y-1.5">
        {[
          { t: away, name: awayName, pts: projection.awayPoints, fav: !favHome, at: true },
          { t: home, name: homeName, pts: projection.homePoints, fav: favHome, at: false },
        ].map((row) => (
          <div key={row.name} className="flex items-center gap-2">
            {row.t ? <TeamMark team={row.t} size={11} /> : <span className="h-[11px] w-[11px] rounded-[3px]" style={{ background: 'var(--line-strong)' }} />}
            <span
              className="min-w-0 flex-1 truncate text-[13px] font-semibold"
              style={{ color: row.t ? teamInk(row.t, mode) : 'var(--text-mid)' }}
            >
              {row.t ? row.t.school : row.name}
              {row.at && <span className="ml-1 text-[10px] font-normal" style={{ color: 'var(--text-faint)' }}>at</span>}
            </span>
            <span
              className="shrink-0 text-[13px] font-bold tabular-nums"
              style={{ color: row.fav ? 'var(--text-hi)' : 'var(--text-low)' }}
            >
              {row.pts.toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2.5">
        <ProbabilityBar
          leftLabel={awayName}
          rightLabel={homeName}
          leftProbability={projection.awayWinProb}
          height={7}
          compact
        />
      </div>

      <div className="mt-2 flex items-baseline justify-between text-[11px]">
        <span className="font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
          {Math.abs(projection.margin) < 0.25
            ? 'Pick’em'
            : `${favHome ? homeName : awayName} −${Math.abs(projection.margin).toFixed(1)}`}
        </span>
        <span className="tabular-nums" style={{ color: 'var(--text-low)' }}>
          O/U {projection.total.toFixed(1)}
        </span>
      </div>
    </button>
  );
}
