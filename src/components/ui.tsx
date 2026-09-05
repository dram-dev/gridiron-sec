import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Provenance, Team } from '../data/types';
import { signed } from '../lib/viz';

/* ============================================================================
 * Interface primitives. Small, unopinionated, and consistent — the design
 * system lives in index.css tokens, these just apply it.
 * ========================================================================== */

export function Panel({
  children, className = '', as: As = 'section', ...rest
}: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' } & React.HTMLAttributes<HTMLElement>) {
  return (
    <As className={`panel ${className}`} {...rest}>
      {children}
    </As>
  );
}

export function PanelHead({
  title, subtitle, right, dense = false,
}: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode; dense?: boolean }) {
  return (
    <header
      className={`flex items-start justify-between gap-4 ${dense ? 'px-4 pt-3.5 pb-2.5' : 'px-5 pt-4 pb-3'}`}
    >
      <div className="min-w-0">
        <h2 className="text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--text-hi)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[11.5px] leading-relaxed" style={{ color: 'var(--text-low)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full ${className}`} style={{ background: 'var(--line-faint)' }} />;
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`label ${className}`}>{children}</div>;
}

/* -------------------------------------------------------------------------- */

export function Stat({
  label, value, sub, delta, tone = 'default', size = 'md', title,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  delta?: number;
  tone?: 'default' | 'positive' | 'negative' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}) {
  const color =
    tone === 'positive' ? 'var(--viz-pos)'
    : tone === 'negative' ? 'var(--viz-neg)'
    : tone === 'accent' ? 'var(--accent-hi)'
    : 'var(--text-hi)';
  const sizes = { sm: 'text-[17px]', md: 'text-[23px]', lg: 'text-[31px]' };
  return (
    <div title={title} className="min-w-0">
      <Label className="flex min-h-[22px] items-start">{label}</Label>
      <div
        className={`mt-1.5 font-semibold tabular-nums tracking-[-0.02em] ${sizes[size]} leading-none`}
        style={{ color }}
      >
        {value}
      </div>
      {(sub || delta !== undefined) && (
        <div className="mt-1.5 flex items-baseline gap-1.5 text-[11.5px]" style={{ color: 'var(--text-low)' }}>
          {delta !== undefined && Math.abs(delta) > 0.049 && (
            <span
              className="font-semibold tabular-nums"
              style={{ color: delta > 0 ? 'var(--viz-pos)' : 'var(--viz-neg)' }}
            >
              {signed(delta)}
            </span>
          )}
          {sub}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function TeamMark({
  team, size = 12, className = '',
}: { team: Pick<Team, 'primary' | 'secondary' | 'abbr'>; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-[3px] ${className}`}
      style={{
        width: size,
        height: size,
        background: team.primary,
        boxShadow: `inset 0 0 0 1.5px ${team.secondary === '#FFFFFF' ? 'rgba(255,255,255,.55)' : team.secondary}`,
      }}
    />
  );
}

export function TeamChip({
  team, onClick, active = false, size = 'md',
}: {
  team: Pick<Team, 'primary' | 'secondary' | 'abbr' | 'school'>;
  onClick?: () => void;
  active?: boolean;
  size?: 'sm' | 'md';
}) {
  const Cmp = onClick ? 'button' : 'span';
  return (
    <Cmp
      onClick={onClick}
      data-active={active}
      className={`chip ${onClick ? 'cursor-pointer transition-colors hover:border-[var(--line-strong)]' : ''} ${size === 'sm' ? '!text-[10.5px] !px-2 !py-0.5' : ''}`}
      style={active ? { borderColor: 'var(--accent)', color: 'var(--accent-hi)' } : undefined}
    >
      <TeamMark team={team} size={size === 'sm' ? 8 : 10} />
      {team.abbr}
    </Cmp>
  );
}

/* -------------------------------------------------------------------------- */

export function ProvenanceTag({ value, className = '' }: { value: Provenance; className?: string }) {
  const verified = value === 'verified';
  return (
    <span
      className={`chip !py-0 !px-1.5 !text-[9.5px] !gap-1 ${className}`}
      title={
        verified
          ? 'Sourced from public reporting while this dataset was compiled.'
          : 'Analyst estimate derived from the verified layer — a model input, not an observation.'
      }
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: verified ? 'var(--viz-pos)' : 'var(--text-faint)' }}
      />
      {verified ? 'Verified' : 'Modeled'}
    </span>
  );
}

/* -------------------------------------------------------------------------- */

export function Segmented<T extends string>({
  options, value, onChange, size = 'md', ariaLabel,
}: {
  options: { value: T; label: ReactNode; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-[10px] p-0.5"
      style={{ background: 'var(--bg-sunken)', border: '1px solid var(--line)' }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={`rounded-[8px] font-semibold transition-colors ${size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-[12px]'}`}
            style={{
              background: active ? 'var(--bg-raised)' : 'transparent',
              color: active ? 'var(--text-hi)' : 'var(--text-low)',
              boxShadow: active ? '0 1px 2px rgb(0 0 0 / .25)' : 'none',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Slider({
  label, value, min, max, step, onChange, format, hint, reset,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
  reset?: number;
}) {
  const id = useId();
  const changed = reset !== undefined && Math.abs(value - reset) > 1e-9;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] font-semibold tabular-nums"
            style={{ color: changed ? 'var(--accent-hi)' : 'var(--text-mid)' }}
          >
            {format ? format(value) : value}
          </span>
          {changed && (
            <button
              onClick={() => onChange(reset)}
              className="text-[10px] font-semibold uppercase tracking-wider transition-colors hover:text-[var(--text)]"
              style={{ color: 'var(--text-faint)' }}
              title="Reset to baseline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && (
        <p className="-mt-0.5 text-[10.5px] leading-snug" style={{ color: 'var(--text-faint)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A probability rendered as a labelled two-sided bar.
 *
 * The two sides deliberately use the validated categorical slots rather than
 * the two teams' own colours: half this conference wears near-identical
 * crimson, and Georgia-vs-Alabama in team colours is two indistinguishable
 * reds. Identity is carried by the direct labels and the team swatches beside
 * them, which is where it belongs anyway.
 */
export function ProbabilityBar({
  leftLabel, rightLabel, leftProbability, leftColor, rightColor, height = 26, compact = false,
}: {
  leftLabel: string;
  rightLabel: string;
  leftProbability: number;
  leftColor?: string;
  rightColor?: string;
  height?: number;
  compact?: boolean;
}) {
  const left = leftColor ?? 'var(--viz-c1)';
  const right = rightColor ?? 'var(--viz-c2)';
  const l = Math.max(0, Math.min(1, leftProbability));
  return (
    <div>
      <div
        className="flex w-full overflow-hidden rounded-[6px]"
        style={{ height, background: 'var(--bg-sunken)' }}
        role="img"
        aria-label={`${leftLabel} ${Math.round(l * 100)} percent, ${rightLabel} ${Math.round((1 - l) * 100)} percent`}
      >
        <div style={{ width: `${l * 100}%`, background: left, transition: 'width .35s cubic-bezier(0.22,1,0.36,1)' }} />
        <div style={{ width: '2px', background: 'var(--bg-panel)' }} />
        <div style={{ flex: 1, background: right, transition: 'width .35s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
      {!compact && (
        <div className="mt-1.5 flex items-baseline justify-between text-[11.5px] font-semibold tabular-nums">
          <span style={{ color: 'var(--text)' }}>
            {leftLabel} <span style={{ color: 'var(--text-mid)' }}>{Math.round(l * 100)}%</span>
          </span>
          <span style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--text-mid)' }}>{Math.round((1 - l) * 100)}%</span> {rightLabel}
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Tooltip({ children, content }: { children: ReactNode; content: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[280px] -translate-x-1/2 rounded-lg px-2.5 py-2 text-[11.5px] leading-snug shadow-lift animate-fade-in"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--line-strong)',
            color: 'var(--text)',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export function InfoDot({ text }: { text: string }) {
  return (
    <Tooltip content={text}>
      <span
        tabIndex={0}
        className="inline-flex h-[14px] w-[14px] cursor-help items-center justify-center rounded-full text-[9px] font-bold"
        style={{ border: '1px solid var(--line-strong)', color: 'var(--text-low)' }}
        aria-label={text}
      >
        i
      </span>
    </Tooltip>
  );
}

/* -------------------------------------------------------------------------- */

export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse text-[12.5px] ${className}`}>{children}</table>
    </div>
  );
}

export function Th({
  children, align = 'left', sortable, active, direction, onClick, title, width,
}: {
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  active?: boolean;
  direction?: 'asc' | 'desc';
  onClick?: () => void;
  title?: string;
  width?: number | string;
}) {
  const content = (
    <span className="inline-flex items-center gap-1">
      {children}
      {sortable && (
        <span
          aria-hidden
          className="text-[8px] leading-none transition-opacity"
          style={{ opacity: active ? 1 : 0.28, color: active ? 'var(--accent-hi)' : 'inherit' }}
        >
          {active && direction === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </span>
  );
  return (
    <th
      scope="col"
      title={title}
      style={{ textAlign: align, width, borderBottom: '1px solid var(--line)', background: 'var(--bg-panel)' }}
      className="label whitespace-nowrap px-2.5 py-2"
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}
    >
      {sortable ? (
        <button onClick={onClick} className="transition-colors hover:text-[var(--text)]">
          {content}
        </button>
      ) : (
        content
      )}
    </th>
  );
}

export function Td({
  children, align = 'left', className = '', mono = true, style,
}: {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  mono?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{ textAlign: align, borderBottom: '1px solid var(--line-faint)', ...style }}
      className={`px-2.5 py-[7px] ${mono ? 'tabular-nums' : ''} ${className}`}
    >
      {children}
    </td>
  );
}

/* -------------------------------------------------------------------------- */

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div
        className="mb-3 h-9 w-9 rounded-full"
        style={{ border: '1px dashed var(--line-strong)' }}
        aria-hidden
      />
      <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
      <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed" style={{ color: 'var(--text-low)' }}>{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Screen-reader-only text. */
export function SrOnly({ children }: { children: ReactNode }) {
  return <span className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]">{children}</span>;
}

/* -------------------------------------------------------------------------- */

/** Animates a number toward its target — makes scenario changes legible. */
export function AnimatedNumber({
  value, digits = 1, prefix = '', suffix = '',
}: { value: number; digits?: number; prefix?: string; suffix?: string }) {
  const [shown, setShown] = useState(value);
  const raf = useRef<number | undefined>(undefined);
  const from = useRef(value);
  const start = useRef(0);

  useEffect(() => {
    if (Math.abs(value - shown) < Math.pow(10, -digits) / 2) {
      setShown(value);
      return;
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(value);
      return;
    }
    from.current = shown;
    start.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start.current) / 420);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from.current + (value - from.current) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, digits]);

  return <>{prefix}{shown.toFixed(digits).replace('-', '\u2212')}{suffix}</>;
}
