import { TEAM_BY_ID } from '../data/teams';
import { PLAYER_BY_ID } from '../data/players';
import type { TeamId } from '../data/types';

/* ============================================================================
 * Hash routing.
 *
 * The app is a single page with no server, so the URL is a hash. Every view is
 * addressable, and the two views that hold a selection carry it in the path so
 * a link opens on the thing that was being looked at:
 *
 *   #/                     Command Center
 *   #/how-it-works         How this works
 *   #/team/UGA             Team Lab, Georgia
 *   #/player/miss-trinidad-chambliss
 *   #/matchup/UGA/ALA
 * ========================================================================== */

export type ViewId =
  | 'command' | 'team' | 'trajectory' | 'player' | 'matchup' | 'coach' | 'scenario'
  | 'model' | 'method' | 'how';

export const VIEW_SLUG: Record<ViewId, string> = {
  command: '',
  how: 'how-it-works',
  team: 'team',
  trajectory: 'trajectory',
  player: 'player',
  matchup: 'matchup',
  coach: 'coach',
  scenario: 'scenario',
  model: 'model',
  method: 'method',
};

const SLUG_VIEW = Object.fromEntries(
  (Object.entries(VIEW_SLUG) as [ViewId, string][]).map(([v, s]) => [s, v]),
) as Record<string, ViewId>;

export interface Route {
  view: ViewId;
  teamId?: TeamId;
  comparisonTeam?: TeamId;
  playerId?: string;
}

export function parseHash(hash: string): Route | null {
  const raw = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  const [slug = '', a, b] = raw.split('/');
  const view = SLUG_VIEW[slug];
  if (!view) return null;

  const route: Route = { view };
  if (view === 'team' || view === 'coach' || view === 'trajectory') {
    if (a && TEAM_BY_ID[a.toUpperCase()]) route.teamId = a.toUpperCase() as TeamId;
  } else if (view === 'player') {
    if (a && PLAYER_BY_ID[a]) route.playerId = a;
  } else if (view === 'matchup') {
    if (a && TEAM_BY_ID[a.toUpperCase()]) route.teamId = a.toUpperCase() as TeamId;
    if (b && TEAM_BY_ID[b.toUpperCase()]) route.comparisonTeam = b.toUpperCase() as TeamId;
  }
  return route;
}

export function buildHash(route: Route): string {
  const slug = VIEW_SLUG[route.view];
  const parts = [slug];
  if (route.view === 'team' || route.view === 'coach' || route.view === 'trajectory') {
    if (route.teamId) parts.push(route.teamId);
  } else if (route.view === 'player') {
    if (route.playerId) parts.push(route.playerId);
  } else if (route.view === 'matchup') {
    if (route.teamId) parts.push(route.teamId);
    if (route.comparisonTeam) parts.push(route.comparisonTeam);
  }
  return `#/${parts.filter(Boolean).join('/')}`;
}
