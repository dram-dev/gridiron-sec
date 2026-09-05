import { useEffect, useState } from 'react';
import { MEASURED_META } from './data/measured';
import { CommandPalette } from './components/CommandPalette';
import {
  IconBook, IconClipboard, IconGauge, IconMenu, IconMoon, IconPerson, IconReset,
  IconSearch, IconShield, IconSliders, IconSpark, IconSun, IconSwords, IconTrend,
} from './components/icons';
import { useStore, type ViewId } from './state/store';
import { CommandCenter } from './views/CommandCenter';
import { TeamLab } from './views/TeamLab';
import { PlayerLab } from './views/PlayerLab';
import { MatchupLab } from './views/MatchupLab';
import { CoachIntel } from './views/CoachIntel';
import { ScenarioStudio } from './views/ScenarioStudio';
import { Methodology } from './views/Methodology';
import { HowItWorks } from './views/HowItWorks';
import { ModelLab } from './views/ModelLab';
import { Trajectory } from './views/Trajectory';

const NAV: { id: ViewId; label: string; icon: typeof IconGauge; hint: string }[] = [
  { id: 'command', label: 'Command Center', icon: IconGauge, hint: 'League overview' },
  { id: 'team', label: 'Team Lab', icon: IconShield, hint: 'Team forecasting' },
  { id: 'trajectory', label: 'Trajectory', icon: IconTrend, hint: 'The season as a path' },
  { id: 'player', label: 'Player Lab', icon: IconPerson, hint: 'Player projections' },
  { id: 'matchup', label: 'Matchup', icon: IconSwords, hint: 'Head-to-head' },
  { id: 'coach', label: 'Coach Intel', icon: IconClipboard, hint: 'Staff tendencies' },
  { id: 'scenario', label: 'Scenario Studio', icon: IconSliders, hint: 'What-if planning' },
  { id: 'model', label: 'Model Lab', icon: IconGauge, hint: 'Tune the coefficients' },
  { id: 'how', label: 'How this works', icon: IconSpark, hint: 'The model, explained' },
  { id: 'method', label: 'Methodology', icon: IconBook, hint: 'Constants and sources' },
];

const TITLES: Record<ViewId, { title: string; blurb: string }> = {
  command: { title: 'Command Center', blurb: 'Where the sixteen stand, and what the model disagrees with' },
  team: { title: 'Team Lab', blurb: 'One roster, decomposed to the point where you can argue with it' },
  trajectory: { title: 'Trajectory', blurb: 'Win paths, the standings race, and which games actually decide it' },
  player: { title: 'Player Lab', blurb: 'Usage, efficiency and what each player is worth in points' },
  matchup: { title: 'Matchup Simulator', blurb: 'Any two teams, simulated drive by drive' },
  coach: { title: 'Coach Intelligence', blurb: 'The part of a program that survives roster turnover' },
  scenario: { title: 'Scenario Studio', blurb: 'Change an assumption and watch the season move' },
  model: { title: 'Model Lab', blurb: 'Twelve coefficients, checked against rankings the model was never fitted to' },
  how: { title: 'How this works', blurb: 'The projection engine and the design, explained end to end' },
  method: { title: 'Methodology', blurb: 'Every constant, every source, every limitation' },
};

export default function App() {
  const { state, dispatch, editCount, simulating } = useStore();
  const [navOpen, setNavOpen] = useState(false);
  const view = state.view;

  useEffect(() => {
    setNavOpen(false);
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="flex h-full" style={{ background: 'var(--bg-canvas)' }}>
      <CommandPalette />

      <a
        href="#main-scroll"
        className="sr-only fixed left-3 top-3 z-[200] rounded-lg px-3 py-2 text-[12.5px] font-semibold focus:not-sr-only"
        style={{ background: 'var(--accent)', color: '#03150f' }}
      >
        Skip to content
      </a>

      {/* Mobile scrim */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-fade-in"
          style={{ background: 'rgb(0 0 0 / .5)' }}
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Rail                                                             */}
      {/* ---------------------------------------------------------------- */}
      <nav
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-50 flex w-[236px] shrink-0 flex-col transition-transform duration-300 ease-smooth lg:static lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-sunken)', borderRight: '1px solid var(--line)' }}
      >
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] text-[13px] font-black"
              style={{ background: 'var(--accent)', color: '#03150f' }}
              aria-hidden
            >
              G
            </span>
            <div className="min-w-0">
              <div className="text-[13.5px] font-bold leading-tight tracking-[-0.01em]" style={{ color: 'var(--text-hi)' }}>
                Gridiron SEC
              </div>
              <div className="text-[10.5px] leading-tight" style={{ color: 'var(--text-low)' }}>
                {MEASURED_META.throughWeek > 0
                  ? `Updated through week ${MEASURED_META.throughWeek}`
                  : `${MEASURED_META.projectionSeason} preseason projection`}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex w-full items-center gap-2 rounded-[9px] px-2.5 py-2 text-[12px] transition-colors"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', color: 'var(--text-low)' }}
          >
            <IconSearch size={14} />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded px-1 py-px text-[9.5px] font-semibold" style={{ background: 'var(--bg-hover)', color: 'var(--text-faint)' }}>⌘K</kbd>
          </button>
        </div>

        <ul className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <li key={n.id}>
                <button
                  onClick={() => dispatch({ type: 'view', view: n.id })}
                  aria-current={active ? 'page' : undefined}
                  className="group flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left transition-colors"
                  style={{
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    color: active ? 'var(--accent-hi)' : 'var(--text-mid)',
                  }}
                >
                  <Icon size={17} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-semibold leading-tight">{n.label}</span>
                    <span
                      className="block truncate text-[10px] leading-tight transition-colors"
                      style={{ color: active ? 'var(--accent)' : 'var(--text-faint)' }}
                    >
                      {n.hint}
                    </span>
                  </span>
                  {n.id === 'scenario' && editCount > 0 && (
                    <span
                      className="grid h-[17px] min-w-[17px] shrink-0 place-items-center rounded-full px-1 text-[9.5px] font-bold"
                      style={{ background: 'var(--accent)', color: '#03150f' }}
                    >
                      {editCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-3 pb-4">
          <div className="rounded-[10px] p-2.5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)' }}>
            <div className="flex items-center justify-between">
              <span className="label">Scenario</span>
              {editCount > 0 && (
                <button
                  onClick={() => dispatch({ type: 'resetScenario' })}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold transition-colors hover:text-[var(--text)]"
                  style={{ color: 'var(--text-faint)' }}
                >
                  <IconReset size={11} /> Reset
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: editCount ? 'var(--accent-hi)' : 'var(--text-low)' }}>
              {editCount === 0
                ? 'Baseline — no overrides applied.'
                : `${editCount} override${editCount === 1 ? '' : 's'} active.`}
            </p>
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* Main                                                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 backdrop-blur-md lg:px-7"
          style={{ background: 'color-mix(in srgb, var(--bg-canvas) 88%, transparent)', borderBottom: '1px solid var(--line)' }}
        >
          <button
            className="btn !px-2 lg:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
          >
            <IconMenu />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-bold tracking-[-0.015em]" style={{ color: 'var(--text-hi)' }}>
              {TITLES[view].title}
            </h1>
            <p className="truncate text-[11.5px]" style={{ color: 'var(--text-low)' }}>{TITLES[view].blurb}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="hidden items-center gap-1.5 text-[10.5px] font-semibold sm:inline-flex"
              style={{ color: simulating ? 'var(--accent-hi)' : 'var(--text-faint)' }}
              aria-live="polite"
            >
              <span
                className="h-1.5 w-1.5 rounded-full transition-colors"
                style={{ background: simulating ? 'var(--accent)' : 'var(--viz-pos)' }}
              />
              {simulating ? 'Simulating…' : 'Model ready'}
            </span>
            <button
              className="btn !px-2"
              onClick={() => dispatch({ type: 'theme', theme: state.theme === 'dark' ? 'light' : 'dark' })}
              aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {state.theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </header>

        <main id="main-scroll" className="min-h-0 flex-1 overflow-y-auto">
          <div key={view} className="mx-auto max-w-[1360px] px-4 pb-16 pt-5 animate-fade-up lg:px-7">
            {view === 'command' && <CommandCenter />}
            {view === 'team' && <TeamLab />}
            {view === 'trajectory' && <Trajectory />}
            {view === 'player' && <PlayerLab />}
            {view === 'matchup' && <MatchupLab />}
            {view === 'coach' && <CoachIntel />}
            {view === 'scenario' && <ScenarioStudio />}
            {view === 'model' && <ModelLab />}
            {view === 'how' && <HowItWorks />}
            {view === 'method' && <Methodology />}
          </div>
        </main>
      </div>
    </div>
  );
}
