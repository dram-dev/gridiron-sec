import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_PLAYERS } from '../data/players';
import { TEAMS } from '../data/teams';
import { CONFERENCE_GAMES } from '../data/schedule';
import { useStore, type ViewId } from '../state/store';
import { IconSearch } from './icons';
import { TeamMark } from './ui';

/* A single keyboard entry point to everything: teams, players, games, views.
 * Opens on ⌘K / Ctrl-K or "/" and is fully navigable with the arrow keys. */

interface Entry {
  id: string;
  kind: 'View' | 'Team' | 'Player' | 'Game';
  label: string;
  sub: string;
  swatch?: string;
  run: () => void;
}

const VIEWS: { id: ViewId; label: string; sub: string }[] = [
  { id: 'command', label: 'Command Center', sub: 'League overview and power ratings' },
  { id: 'team', label: 'Team Lab', sub: 'Team-level forecasting' },
  { id: 'player', label: 'Player Lab', sub: 'Player projections and value board' },
  { id: 'matchup', label: 'Matchup Simulator', sub: 'Head-to-head simulation' },
  { id: 'coach', label: 'Coach Intelligence', sub: 'Staff tendencies and archetypes' },
  { id: 'scenario', label: 'Scenario Studio', sub: 'What-if planning' },
  { id: 'how', label: 'How this works', sub: 'The projection engine and the design, explained' },
  { id: 'method', label: 'Methodology', sub: 'Constants, sources and limitations' },
];

export function CommandPalette() {
  const { go, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const entries = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    for (const v of VIEWS) {
      out.push({ id: `view-${v.id}`, kind: 'View', label: v.label, sub: v.sub, run: () => go(v.id) });
    }
    for (const t of TEAMS) {
      out.push({
        id: `team-${t.id}`, kind: 'Team', label: t.school, sub: `${t.mascot} · ${t.location}`,
        swatch: t.primary, run: () => go('team', { teamId: t.id }),
      });
    }
    for (const p of ALL_PLAYERS) {
      const t = TEAMS.find((x) => x.id === p.teamId)!;
      out.push({
        id: `player-${p.id}`, kind: 'Player', label: p.name, sub: `${p.position} · ${t.school}`,
        swatch: t.primary, run: () => go('player', { playerId: p.id }),
      });
    }
    for (const g of CONFERENCE_GAMES) {
      const h = TEAMS.find((x) => x.id === g.homeId)!;
      const a = TEAMS.find((x) => x.id === g.awayId)!;
      out.push({
        id: `game-${g.id}`, kind: 'Game', label: `${a.school} at ${h.school}`,
        sub: `Week ${g.week}${g.rivalry ? ` · ${g.rivalry}` : ''}`,
        swatch: h.primary,
        run: () => {
          dispatch({ type: 'selectTeam', teamId: h.id });
          dispatch({ type: 'comparisonTeam', teamId: a.id });
          go('matchup', { gameId: g.id });
        },
      });
    }
    return out;
  }, [go, dispatch]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.filter((e) => e.kind === 'View').concat(entries.filter((e) => e.kind === 'Team').slice(0, 6));
    const scored = entries
      .map((e) => {
        const label = e.label.toLowerCase();
        const sub = e.sub.toLowerCase();
        let score = -1;
        if (label.startsWith(q)) score = 0;
        else if (label.includes(q)) score = 1;
        else if (sub.includes(q)) score = 2;
        return { e, score };
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score || a.e.label.localeCompare(b.e.label));
    return scored.slice(0, 40).map((x) => x.e);
  }, [entries, query]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (!open) return null;

  const commit = (entry: Entry | undefined) => {
    if (!entry) return;
    entry.run();
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] animate-fade-in"
      style={{ background: 'rgb(0 0 0 / .55)', backdropFilter: 'blur(3px)' }}
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-[14px] shadow-lift animate-fade-up"
        style={{ background: 'var(--bg-panel)', border: '1px solid var(--line-strong)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-3.5" style={{ borderBottom: '1px solid var(--line)' }}>
          <IconSearch size={16} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(results.length - 1, c + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
              if (e.key === 'Enter') { e.preventDefault(); commit(results[cursor]); }
            }}
            placeholder="Search teams, players, games…"
            className="w-full bg-transparent py-3.5 text-[14px] outline-none"
            style={{ color: 'var(--text-hi)' }}
            aria-label="Search"
          />
          <kbd className="chip !text-[10px]">esc</kbd>
        </div>
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-1.5">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-[12.5px]" style={{ color: 'var(--text-low)' }}>
              Nothing matches “{query}”.
            </p>
          )}
          {results.map((e, i) => (
            <button
              key={e.id}
              data-active={i === cursor}
              onMouseEnter={() => setCursor(i)}
              onClick={() => commit(e)}
              className="flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-left transition-colors"
              style={{ background: i === cursor ? 'var(--bg-hover)' : 'transparent' }}
            >
              {e.swatch ? (
                <TeamMark team={{ primary: e.swatch, secondary: '#00000000', abbr: '' }} size={11} />
              ) : (
                <span className="h-[11px] w-[11px] rounded-[3px]" style={{ background: 'var(--line-strong)' }} />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium" style={{ color: 'var(--text-hi)' }}>{e.label}</span>
                <span className="block truncate text-[11px]" style={{ color: 'var(--text-low)' }}>{e.sub}</span>
              </span>
              <span className="chip !text-[9.5px] shrink-0">{e.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
