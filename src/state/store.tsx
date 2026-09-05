import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
  type ReactNode,
} from 'react';
import { PLAYER_BY_ID } from '../data/players';
import type { Availability, TeamId } from '../data/types';
import { rateAll, rankRatings, type RankedRating, type RatingTable } from '../engine/ratings';
import { projectAllGames, simulateSeason, type SeasonResult } from '../engine/season';
import type { GameProjection } from '../engine/game';
import {
  makeBaselineScenario, scenarioEditCount, WEATHER_PRESETS,
  type Scenario, type TeamOverride, type Weather,
} from '../engine/scenario';
import SeasonWorker from '../workers/season.worker?worker&inline';
import { buildHash, parseHash, type ViewId } from '../lib/routing';
import type { Mode } from '../lib/viz';

/* ============================================================================
 * Application state.
 *
 * One reducer holds the scenario; everything else in the app is derived from
 * it. The baseline is computed once and kept, so every view can show what the
 * scenario changed rather than only what it produced.
 * ========================================================================== */

export type { ViewId } from '../lib/routing';

interface State {
  view: ViewId;
  scenario: Scenario;
  selectedTeam: TeamId;
  comparisonTeam: TeamId;
  selectedPlayerId: string | null;
  comparePlayerIds: string[];
  selectedGameId: string | null;
  theme: Mode;
  precision: 'fast' | 'high';
}

type Action =
  | { type: 'view'; view: ViewId }
  | { type: 'selectTeam'; teamId: TeamId }
  | { type: 'comparisonTeam'; teamId: TeamId }
  | { type: 'selectPlayer'; playerId: string | null }
  | { type: 'toggleComparePlayer'; playerId: string }
  | { type: 'clearComparePlayers' }
  | { type: 'selectGame'; gameId: string | null }
  | { type: 'theme'; theme: Mode }
  | { type: 'precision'; precision: 'fast' | 'high' }
  | { type: 'playerStatus'; playerId: string; status: Availability }
  | { type: 'teamDial'; teamId: TeamId; patch: Partial<TeamOverride> }
  | { type: 'homeField'; value: number }
  | { type: 'weather'; weather: Weather }
  | { type: 'forceResult'; gameId: string; winner: 'home' | 'away' | null }
  | { type: 'seed'; seed: number }
  | { type: 'resetScenario' }
  | { type: 'loadScenario'; scenario: Scenario };

const ITERATIONS = { fast: 6000, high: 30000 } as const;

function initial(): State {
  // Precedence: an explicit stamp already on the document (set either by the
  // pre-paint script or by an embedding host), then the OS preference.
  const stamped = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
  const prefersLight =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches;
  let theme: Mode = stamped === 'light' || stamped === 'dark' ? stamped : prefersLight ? 'light' : 'dark';
  try {
    const stored = localStorage.getItem('gridiron-theme');
    if (stored === 'light' || stored === 'dark') theme = stored;
  } catch {
    /* storage can throw in private modes; the resolved default stands */
  }
  const route = typeof window !== 'undefined' ? parseHash(window.location.hash) : null;
  const routedPlayer = route?.playerId ? PLAYER_BY_ID[route.playerId] : undefined;

  return {
    view: route?.view ?? 'command',
    scenario: makeBaselineScenario(),
    // A player link also selects that player's team, so the rest of the app is
    // pointed somewhere sensible when the reader navigates away.
    selectedTeam: route?.teamId ?? routedPlayer?.teamId ?? 'UGA',
    comparisonTeam: route?.comparisonTeam ?? 'ALA',
    selectedPlayerId: route?.playerId ?? null,
    comparePlayerIds: [],
    selectedGameId: null,
    theme,
    precision: 'fast',
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'view':
      return { ...state, view: action.view };
    case 'selectTeam':
      return { ...state, selectedTeam: action.teamId };
    case 'comparisonTeam':
      return { ...state, comparisonTeam: action.teamId };
    case 'selectPlayer':
      return { ...state, selectedPlayerId: action.playerId };
    case 'toggleComparePlayer': {
      const has = state.comparePlayerIds.includes(action.playerId);
      const next = has
        ? state.comparePlayerIds.filter((p) => p !== action.playerId)
        : [...state.comparePlayerIds, action.playerId].slice(-3);
      return { ...state, comparePlayerIds: next };
    }
    case 'clearComparePlayers':
      return { ...state, comparePlayerIds: [] };
    case 'selectGame':
      return { ...state, selectedGameId: action.gameId };
    case 'theme':
      return { ...state, theme: action.theme };
    case 'precision':
      return {
        ...state,
        precision: action.precision,
        scenario: { ...state.scenario, iterations: ITERATIONS[action.precision] },
      };
    case 'playerStatus': {
      const players = { ...state.scenario.players };
      if (action.status === 'active') delete players[action.playerId];
      else players[action.playerId] = action.status;
      return { ...state, scenario: { ...state.scenario, players } };
    }
    case 'teamDial': {
      const teams = { ...state.scenario.teams };
      const merged = { ...(teams[action.teamId] ?? {}), ...action.patch };
      const isEmpty =
        (merged.offense ?? 0) === 0 &&
        (merged.defense ?? 0) === 0 &&
        (merged.pace ?? 1) === 1 &&
        (merged.turnoverLuck ?? 0) === 0;
      if (isEmpty) delete teams[action.teamId];
      else teams[action.teamId] = merged;
      return { ...state, scenario: { ...state.scenario, teams } };
    }
    case 'homeField':
      return { ...state, scenario: { ...state.scenario, homeFieldMultiplier: action.value } };
    case 'weather':
      return { ...state, scenario: { ...state.scenario, weather: action.weather } };
    case 'forceResult': {
      const forcedResults = { ...state.scenario.forcedResults };
      if (action.winner === null) delete forcedResults[action.gameId];
      else forcedResults[action.gameId] = action.winner;
      return { ...state, scenario: { ...state.scenario, forcedResults } };
    }
    case 'seed':
      return { ...state, scenario: { ...state.scenario, seed: action.seed } };
    case 'resetScenario':
      return {
        ...state,
        scenario: { ...makeBaselineScenario(), iterations: ITERATIONS[state.precision] },
      };
    case 'loadScenario':
      return { ...state, scenario: action.scenario };
    default:
      return state;
  }
}

interface Derived {
  ratings: RatingTable;
  baselineRatings: RatingTable;
  ranked: RankedRating[];
  projections: GameProjection[];
  baselineProjections: GameProjection[];
  season: SeasonResult;
  baselineSeason: SeasonResult;
  simulating: boolean;
  editCount: number;
}

interface Store extends Derived {
  state: State;
  dispatch: React.Dispatch<Action>;
  projectionById: Map<string, GameProjection>;
  baselineProjectionById: Map<string, GameProjection>;
  go: (view: ViewId, opts?: { teamId?: TeamId; playerId?: string; gameId?: string }) => void;
}

const Ctx = createContext<Store | null>(null);

const BASELINE_SCENARIO: Scenario = { ...makeBaselineScenario(), iterations: ITERATIONS.high };
const BASELINE_RATINGS = rateAll(BASELINE_SCENARIO);
const BASELINE_PROJECTIONS = projectAllGames(BASELINE_RATINGS, BASELINE_SCENARIO);
const BASELINE_SEASON = simulateSeason(BASELINE_RATINGS, BASELINE_SCENARIO, BASELINE_PROJECTIONS);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const { scenario } = state;

  const ratings = useMemo(() => rateAll(scenario), [scenario]);
  const projections = useMemo(() => projectAllGames(ratings, scenario), [ratings, scenario]);

  // The season simulation is the only genuinely expensive computation, so it
  // runs off the main thread. The first paint uses the precomputed baseline;
  // scenario edits stream in as the worker finishes them.
  const [season, setSeason] = useState<SeasonResult>(BASELINE_SEASON);
  const [simulating, setSimulating] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const requestRef = useRef(0);
  const latestRef = useRef(0);

  // The season simulation is the only genuinely expensive computation, so it runs
  // off the main thread. A worker can still fail to start — a strict embedding
  // policy, a stripped-down runtime — so failure has to leave the app working
  // rather than stuck on "Simulating…" forever.
  const runOnMainThread = useCallback((id: number, s: Scenario) => {
    if (latestRef.current !== id) return;
    setSeason(simulateSeason(rateAll(s), s));
    setSimulating(false);
  }, []);

  const pendingRef = useRef<{ id: number; scenario: Scenario } | null>(null);

  useEffect(() => {
    let worker: Worker | null = null;
    try {
      worker = new SeasonWorker();
      worker.onmessage = (e: MessageEvent<{ id: number; result: SeasonResult }>) => {
        if (e.data.id !== latestRef.current) return;
        pendingRef.current = null;
        setSeason(e.data.result);
        setSimulating(false);
      };
      worker.onerror = () => {
        worker?.terminate();
        workerRef.current = null;
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending) runOnMainThread(pending.id, pending.scenario);
      };
      workerRef.current = worker;
    } catch {
      workerRef.current = null;
    }
    return () => {
      worker?.terminate();
      workerRef.current = null;
    };
  }, [runOnMainThread]);

  useEffect(() => {
    const id = ++requestRef.current;
    latestRef.current = id;
    const worker = workerRef.current;
    setSimulating(true);
    if (worker) {
      pendingRef.current = { id, scenario };
      worker.postMessage({ id, scenario });
      return;
    }
    // Synchronous fallback, deferred a frame so the UI can paint first.
    const handle = setTimeout(() => runOnMainThread(id, scenario), 0);
    return () => clearTimeout(handle);
  }, [scenario, runOnMainThread]);

  // Keep the URL and the view in step, in both directions. `suppress` stops the
  // write-back from re-triggering the hashchange listener that produced it.
  const suppressHash = useRef(false);

  useEffect(() => {
    const onHashChange = () => {
      if (suppressHash.current) {
        suppressHash.current = false;
        return;
      }
      const route = parseHash(window.location.hash);
      if (!route) return;
      if (route.teamId) dispatch({ type: 'selectTeam', teamId: route.teamId });
      if (route.comparisonTeam) dispatch({ type: 'comparisonTeam', teamId: route.comparisonTeam });
      if (route.playerId) dispatch({ type: 'selectPlayer', playerId: route.playerId });
      dispatch({ type: 'view', view: route.view });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const next = buildHash({
      view: state.view,
      teamId: state.selectedTeam,
      comparisonTeam: state.comparisonTeam,
      playerId: state.selectedPlayerId ?? undefined,
    });
    if (window.location.hash !== next) {
      suppressHash.current = true;
      window.history.replaceState(null, '', next);
      // replaceState does not fire hashchange, so clear the guard immediately.
      suppressHash.current = false;
    }
  }, [state.view, state.selectedTeam, state.comparisonTeam, state.selectedPlayerId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    try {
      localStorage.setItem('gridiron-theme', state.theme);
    } catch {
      /* ignore */
    }
  }, [state.theme]);

  const ranked = useMemo(() => rankRatings(ratings, BASELINE_RATINGS), [ratings]);
  const projectionById = useMemo(
    () => new Map(projections.map((p) => [p.gameId, p])),
    [projections],
  );
  const baselineProjectionById = useMemo(
    () => new Map(BASELINE_PROJECTIONS.map((p) => [p.gameId, p])),
    [],
  );

  const go = useCallback<Store['go']>((view, opts) => {
    if (opts?.teamId) dispatch({ type: 'selectTeam', teamId: opts.teamId });
    if (opts?.playerId) dispatch({ type: 'selectPlayer', playerId: opts.playerId });
    if (opts?.gameId) dispatch({ type: 'selectGame', gameId: opts.gameId });
    dispatch({ type: 'view', view });
  }, []);

  const value: Store = {
    state,
    dispatch,
    ratings,
    baselineRatings: BASELINE_RATINGS,
    ranked,
    projections,
    baselineProjections: BASELINE_PROJECTIONS,
    season,
    baselineSeason: BASELINE_SEASON,
    simulating,
    editCount: scenarioEditCount(scenario),
    projectionById,
    baselineProjectionById,
    go,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export { WEATHER_PRESETS };
export type { State, Action };
