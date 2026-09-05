import { useMemo, useRef, useState, type ReactNode } from 'react';
import { diverging, onSequential, sequential, type Mode } from '../lib/viz';

/* ============================================================================
 * Charts.
 *
 * Hand-built SVG rather than a charting library, so every mark obeys the same
 * spec: thin marks with 4px rounded data-ends anchored to the baseline, 2px
 * lines, markers no smaller than 8px, a 2px surface gap between adjacent
 * fills, recessive axes, selective direct labels, and a hover layer on
 * everything that plots. Text always wears text tokens; colour is carried by
 * the marks beside it.
 * ========================================================================== */

const AXIS = 'var(--grid-line)';
const TEXT_LOW = 'var(--text-low)';
const TEXT_FAINT = 'var(--text-faint)';

/* -------------------------------------------------------------------------- */
/* Hover tooltip shared by every chart                                        */
/* -------------------------------------------------------------------------- */

interface HoverState {
  x: number;
  y: number;
  content: ReactNode;
}

function useHover() {
  const [hover, setHover] = useState<HoverState | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const show = (e: React.MouseEvent, content: ReactNode) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    setHover({ x: e.clientX - box.left, y: e.clientY - box.top, content });
  };
  return { hover, setHover, ref, show };
}

function HoverCard({ hover, width }: { hover: HoverState | null; width: number }) {
  if (!hover) return null;
  const flip = hover.x > width * 0.62;
  return (
    <div
      className="pointer-events-none absolute z-30 w-max max-w-[240px] rounded-lg px-2.5 py-2 text-[11.5px] leading-snug shadow-lift"
      style={{
        left: hover.x,
        top: hover.y,
        transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
        background: 'var(--bg-raised)',
        border: '1px solid var(--line-strong)',
        color: 'var(--text)',
      }}
      role="tooltip"
    >
      {hover.content}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Horizontal bar list — the workhorse for rankings                           */
/* -------------------------------------------------------------------------- */

export interface BarDatum {
  key: string;
  label: ReactNode;
  value: number;
  /** Optional second value drawn as a ghost bar behind — used for baselines. */
  reference?: number;
  color?: string;
  detail?: ReactNode;
  onClick?: () => void;
  emphasis?: boolean;
}

export function BarList({
  data, max, min = 0, format, height = 22, labelWidth = 62, valueWidth = 52, showZero,
}: {
  data: BarDatum[];
  max?: number;
  min?: number;
  format: (v: number) => string;
  height?: number;
  labelWidth?: number;
  valueWidth?: number;
  showZero?: boolean;
}) {
  const hi = max ?? Math.max(...data.map((d) => Math.max(d.value, d.reference ?? -Infinity)), 0.001);
  const lo = Math.min(min, ...data.map((d) => Math.min(d.value, d.reference ?? Infinity)));
  const span = hi - lo || 1;
  const zeroPct = ((0 - lo) / span) * 100;
  const hasNegative = lo < 0;

  return (
    <div className="w-full">
      {data.map((d) => {
        const vPct = ((d.value - lo) / span) * 100;
        const left = hasNegative ? Math.min(vPct, zeroPct) : 0;
        const width = hasNegative ? Math.abs(vPct - zeroPct) : vPct;
        const color = d.color ?? (d.value >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)');
        const Row = d.onClick ? 'button' : 'div';
        return (
          <Row
            key={d.key}
            onClick={d.onClick}
            title={typeof d.detail === 'string' ? d.detail : undefined}
            className={`row-hover flex w-full items-center gap-2 rounded-[6px] px-1 ${d.onClick ? 'cursor-pointer text-left' : ''}`}
            style={{ height: height + 6 }}
          >
            <span
              className="shrink-0 truncate text-[11.5px] font-medium"
              style={{ width: labelWidth, color: d.emphasis ? 'var(--text-hi)' : 'var(--text)' }}
            >
              {d.label}
            </span>
            <span className="relative min-w-0 flex-1" style={{ height }}>
              {showZero && hasNegative && (
                <span
                  aria-hidden
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: `${zeroPct}%`, background: AXIS }}
                />
              )}
              {d.reference !== undefined && (
                <span
                  aria-hidden
                  className="absolute top-1/2 h-[2px] w-[2px] -translate-y-1/2 rounded-full"
                  style={{
                    left: `${((d.reference - lo) / span) * 100}%`,
                    height: height,
                    width: 2,
                    background: TEXT_FAINT,
                  }}
                />
              )}
              <span
                className="absolute top-1/2 -translate-y-1/2 rounded-[4px]"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 0.4)}%`,
                  height: height - 6,
                  background: color,
                  opacity: d.emphasis === false ? 0.45 : 1,
                  transition: 'width .4s cubic-bezier(0.22,1,0.36,1), left .4s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
            </span>
            <span
              className="shrink-0 text-right text-[11.5px] font-semibold tabular-nums"
              style={{ width: valueWidth, color: 'var(--text-hi)' }}
            >
              {format(d.value)}
            </span>
          </Row>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Waterfall — how a rating decomposes                                        */
/* -------------------------------------------------------------------------- */

export function Waterfall({
  parts, total, height = 200,
}: {
  parts: { key: string; label: string; value: number }[];
  total: number;
  height?: number;
}) {
  const { hover, setHover, ref, show } = useHover();
  const width = 100;
  const steps = useMemo(() => {
    let cursor = 0;
    return parts.map((p) => {
      const from = cursor;
      cursor += p.value;
      return { ...p, from, to: cursor };
    });
  }, [parts]);

  const values = [0, total, ...steps.flatMap((s) => [s.from, s.to])];
  const lo = Math.min(...values, 0);
  const hi = Math.max(...values, 0.001);
  const pad = (hi - lo) * 0.08;
  const scale = (v: number) => ((hi + pad - v) / (hi - lo + pad * 2)) * height;
  const colCount = steps.length + 1;
  const colW = width / colCount;
  const barW = colW * 0.56;

  return (
    <div ref={ref} className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Rating components, cumulative"
      >
        <line x1={0} x2={width} y1={scale(0)} y2={scale(0)} stroke={AXIS} strokeWidth={0.4} />
        {steps.map((s, i) => {
          if (i === steps.length - 1) return null;
          const x1 = i * colW + (colW - barW) / 2 + barW;
          const x2 = (i + 1) * colW + (colW - barW) / 2;
          return (
            <line
              key={`c-${s.key}`}
              x1={x1}
              x2={x2}
              y1={scale(s.to)}
              y2={scale(s.to)}
              stroke={AXIS}
              strokeWidth={0.5}
              strokeDasharray="1 1"
            />
          );
        })}
        {steps.map((s, i) => {
          const x = i * colW + (colW - barW) / 2;
          const y = scale(Math.max(s.from, s.to));
          const h = Math.max(Math.abs(scale(s.from) - scale(s.to)), 1.2);
          return (
            <rect
              key={s.key}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={1.2}
              fill={s.value >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)'}
              opacity={0.92}
              onMouseMove={(e) =>
                show(e, (
                  <>
                    <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>{s.label}</div>
                    <div className="mt-0.5 tabular-nums">
                      {s.value > 0 ? '+' : '−'}{Math.abs(s.value).toFixed(1)} pts · running {s.to.toFixed(1)}
                    </div>
                  </>
                ))
              }
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
        <rect
          x={steps.length * colW + (colW - barW) / 2}
          y={scale(Math.max(total, 0))}
          width={barW}
          height={Math.max(Math.abs(scale(0) - scale(total)), 1.2)}
          rx={1.2}
          fill="var(--accent)"
          onMouseMove={(e) =>
            show(e, (
              <>
                <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>Team rating</div>
                <div className="mt-0.5 tabular-nums">{total.toFixed(1)} points above an average FBS team</div>
              </>
            ))
          }
          onMouseLeave={() => setHover(null)}
        />
      </svg>
      <div className="mt-1.5 flex" style={{ gap: 0 }}>
        {[...steps, { key: '__total', label: 'Rating', value: total }].map((s) => (
          <div key={s.key} className="min-w-0 flex-1 px-0.5 text-center">
            <div className="truncate text-[9.5px] leading-tight" style={{ color: TEXT_LOW }} title={s.label}>
              {s.label}
            </div>
            <div
              className="text-[11px] font-semibold tabular-nums"
              style={{
                color: s.key === '__total' ? 'var(--accent-hi)' : s.value >= 0 ? 'var(--viz-pos)' : 'var(--viz-neg)',
              }}
            >
              {s.key === '__total' ? s.value.toFixed(1) : `${s.value > 0 ? '+' : s.value < 0 ? '−' : ''}${Math.abs(s.value).toFixed(1)}`}
            </div>
          </div>
        ))}
      </div>
      <HoverCard hover={hover} width={width} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Distribution histogram                                                     */
/* -------------------------------------------------------------------------- */

export function Distribution({
  bins, height = 130, format, highlight, colorFor, ariaLabel,
}: {
  bins: { x: number; p: number; label?: string }[];
  height?: number;
  format: (x: number) => string;
  highlight?: (x: number) => boolean;
  colorFor?: (x: number) => string;
  ariaLabel: string;
}) {
  const { hover, setHover, ref, show } = useHover();
  const maxP = Math.max(...bins.map((b) => b.p), 0.0001);
  const n = bins.length;
  const width = Math.max(n * 4, 100);
  const barW = (width / n) * 0.82;

  return (
    <div ref={ref} className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }} role="img" aria-label={ariaLabel}>
        {bins.map((b, i) => {
          const h = (b.p / maxP) * (height - 4);
          const x = (i * width) / n + ((width / n) - barW) / 2;
          const hot = highlight?.(b.x) ?? false;
          return (
            <rect
              key={b.x}
              x={x}
              y={height - h}
              width={barW}
              height={Math.max(h, 0.6)}
              rx={Math.min(1.5, barW / 2)}
              fill={colorFor ? colorFor(b.x) : hot ? 'var(--accent)' : 'var(--viz-seq-2)'}
              opacity={hot ? 1 : 0.82}
              onMouseMove={(e) =>
                show(e, (
                  <>
                    <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>{b.label ?? format(b.x)}</div>
                    <div className="mt-0.5 tabular-nums">{(b.p * 100).toFixed(1)}% of simulations</div>
                  </>
                ))
              }
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </svg>
      <HoverCard hover={hover} width={width} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scatter — the offence/defence quadrant                                     */
/* -------------------------------------------------------------------------- */

export interface ScatterPoint {
  key: string;
  x: number;
  y: number;
  label: string;
  color: string;
  emphasis?: boolean;
  detail: ReactNode;
  onClick?: () => void;
}

export function Scatter({
  points, xLabel, yLabel, height = 340, invertY = false,
}: {
  points: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  height?: number;
  invertY?: boolean;
}) {
  const { hover, setHover, ref, show } = useHover();
  const W = 100;
  const H = 100;
  const pad = 6;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const px = (v: number) => pad + ((v - x0) / (x1 - x0 || 1)) * (W - pad * 2);
  const py = (v: number) => {
    const t = (v - y0) / (y1 - y0 || 1);
    return pad + (invertY ? t : 1 - t) * (H - pad * 2);
  };
  const xMid = (x0 + x1) / 2;
  const yMid = (y0 + y1) / 2;

  return (
    <div className="w-full">
      <div ref={ref} className="relative w-full" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`${yLabel} against ${xLabel}`}>
          <line x1={px(xMid)} x2={px(xMid)} y1={0} y2={H} stroke={AXIS} strokeWidth={0.3} strokeDasharray="1.5 1.5" />
          <line x1={0} x2={W} y1={py(yMid)} y2={py(yMid)} stroke={AXIS} strokeWidth={0.3} strokeDasharray="1.5 1.5" />
        </svg>
        {points.map((p) => (
          <button
            key={p.key}
            onClick={p.onClick}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125"
            style={{
              left: `${px(p.x)}%`,
              top: `${py(p.y)}%`,
              width: p.emphasis ? 15 : 11,
              height: p.emphasis ? 15 : 11,
              background: p.color,
              boxShadow: '0 0 0 2px var(--bg-panel)',
              zIndex: p.emphasis ? 3 : 1,
            }}
            onMouseMove={(e) => show(e, p.detail)}
            onMouseLeave={() => setHover(null)}
            aria-label={p.label}
          />
        ))}
        {points.filter((p) => p.emphasis).map((p) => (
          <span
            key={`${p.key}-lbl`}
            className="pointer-events-none absolute -translate-x-1/2 text-[10px] font-semibold"
            style={{ left: `${px(p.x)}%`, top: `calc(${py(p.y)}% + 11px)`, color: 'var(--text-hi)', zIndex: 4 }}
          >
            {p.label}
          </span>
        ))}
        <HoverCard hover={hover} width={100} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10.5px]" style={{ color: TEXT_LOW }}>
        <span>{xLabel} →</span>
        <span>↑ {yLabel}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Radar — tendency profiles                                                  */
/* -------------------------------------------------------------------------- */

export function Radar({
  axes, series, size = 240,
}: {
  axes: { key: string; label: string }[];
  /** Values normalised to 0–1. */
  series: { key: string; label: string; color: string; values: number[] }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, v: number) => [
    cx + Math.cos(angle(i)) * r * v,
    cy + Math.sin(angle(i)) * r * v,
  ];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} role="img" aria-label="Tendency profile">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={axes.map((_, i) => point(i, ring).join(',')).join(' ')}
            fill="none"
            stroke={AXIS}
            strokeWidth={0.8}
          />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, 1);
          return <line key={a.key} x1={cx} y1={cy} x2={x} y2={y} stroke={AXIS} strokeWidth={0.6} />;
        })}
        {series.map((s) => (
          <g key={s.key}>
            <polygon
              points={s.values.map((v, i) => point(i, Math.max(0.04, v)).join(',')).join(' ')}
              fill={s.color}
              fillOpacity={0.16}
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {s.values.map((v, i) => {
              const [x, y] = point(i, Math.max(0.04, v));
              return <circle key={i} cx={x} cy={y} r={4} fill={s.color} stroke="var(--bg-panel)" strokeWidth={2} />;
            })}
          </g>
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, 1.19);
          return (
            <text
              key={a.key}
              x={x}
              y={y}
              textAnchor={Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end'}
              dominantBaseline="middle"
              fontSize={9.5}
              fill={TEXT_LOW}
              fontWeight={600}
            >
              {a.label}
            </text>
          );
        })}
      </svg>
      {series.length > 1 && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text)' }}>
              <span aria-hidden className="h-2.5 w-2.5 rounded-[2px]" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Schedule strip — one cell per game, coloured by win probability            */
/* -------------------------------------------------------------------------- */

export function ProbabilityStrip({
  cells, mode, onSelect,
}: {
  cells: { key: string; probability: number; label: string; detail: ReactNode; muted?: boolean }[];
  mode: Mode;
  onSelect?: (key: string) => void;
}) {
  const { hover, setHover, ref, show } = useHover();
  return (
    <div ref={ref} className="relative">
      <div className="flex gap-[3px]">
        {cells.map((c) => (
          <button
            key={c.key}
            onClick={() => onSelect?.(c.key)}
            onMouseMove={(e) => show(e, c.detail)}
            onMouseLeave={() => setHover(null)}
            className="group relative min-w-0 flex-1 rounded-[5px] transition-transform hover:z-10 hover:scale-[1.06]"
            style={{
              height: 40,
              background: sequential(c.probability, mode),
              opacity: c.muted ? 0.45 : 1,
            }}
            aria-label={`${c.label}: ${Math.round(c.probability * 100)} percent win probability`}
          >
            <span
              className="pointer-events-none absolute inset-x-0 bottom-1 text-[9.5px] font-bold tabular-nums"
              style={{ color: onSequential(c.probability, mode) }}
            >
              {Math.round(c.probability * 100)}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-1 flex gap-[3px]">
        {cells.map((c) => (
          <span key={c.key} className="min-w-0 flex-1 truncate text-center text-[9.5px]" style={{ color: TEXT_LOW }}>
            {c.label}
          </span>
        ))}
      </div>
      <HoverCard hover={hover} width={100} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stacked probability bar — finish-position or outcome shares                */
/* -------------------------------------------------------------------------- */

export function StackedBar({
  segments, height = 12, rounded = true,
}: {
  segments: { key: string; value: number; color: string; label: string }[];
  height?: number;
  rounded?: boolean;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div
      className={`flex w-full overflow-hidden ${rounded ? 'rounded-[4px]' : ''}`}
      style={{ height, background: 'var(--bg-sunken)' }}
      role="img"
      aria-label={segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(', ')}
    >
      {segments.map((s, i) => (
        <span
          key={s.key}
          title={`${s.label}: ${((s.value / total) * 100).toFixed(1)}%`}
          style={{
            width: `${(s.value / total) * 100}%`,
            background: s.color,
            marginLeft: i === 0 ? 0 : 2,
            transition: 'width .4s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sparkline — a coach's season-by-season arc                                 */
/* -------------------------------------------------------------------------- */

export function Sparkline({
  values, width = 130, height = 34, color = 'var(--accent-hi)', markers = true, baseline,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  markers?: boolean;
  baseline?: number;
}) {
  if (values.length === 0) return null;
  const lo = Math.min(...values, baseline ?? Infinity);
  const hi = Math.max(...values, baseline ?? -Infinity);
  const pad = 5;
  const x = (i: number) => pad + (i / Math.max(1, values.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - lo) / (hi - lo || 1)) * (height - pad * 2);
  const d = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
  return (
    <svg width={width} height={height} role="img" aria-label="Trend">
      {baseline !== undefined && (
        <line x1={0} x2={width} y1={y(baseline)} y2={y(baseline)} stroke={AXIS} strokeWidth={1} strokeDasharray="2 2" />
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {markers && (
        <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={4} fill={color} stroke="var(--bg-panel)" strokeWidth={2} />
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Diverging cell — for matrices                                              */
/* -------------------------------------------------------------------------- */

export function DivergingCell({
  value, magnitude, mode, children, title,
}: { value: number; magnitude: number; mode: Mode; children: ReactNode; title?: string }) {
  const bg = diverging(value, magnitude, mode);
  const strong = Math.abs(value) / magnitude > 0.45;
  return (
    <span
      title={title}
      className="inline-flex min-w-[42px] items-center justify-center rounded-[4px] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums"
      style={{ background: bg, color: strong ? (mode === 'dark' ? '#04140f' : '#ffffff') : 'var(--text-hi)' }}
    >
      {children}
    </span>
  );
}
