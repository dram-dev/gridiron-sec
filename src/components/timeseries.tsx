import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { sequential, type Mode } from '../lib/viz';

/* ============================================================================
 * Time-series charts.
 *
 * These read a season as a path rather than an endpoint. The data is real: the
 * season simulation walks week by week, so cumulative wins, conference standing
 * and the effect of a single result are all recorded as they happen.
 *
 * Curves use a monotone cubic interpolation rather than a plain Catmull-Rom,
 * because an overshooting spline on an uncertainty band draws a p90 that dips
 * below its own p75 between knots — a visual claim the data never made.
 * ========================================================================== */

/* -------------------------------------------------------------------------- */
/* Responsive sizing                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Measure the container so charts can be drawn in real pixel coordinates.
 *
 * A fixed viewBox scaled with preserveAspectRatio letterboxes the chart inside
 * a wide panel and, with "none", stretches circular marks into ellipses and
 * distorts label metrics. Drawing 1:1 avoids both.
 */
function useWidth<T extends HTMLElement>(fallback = 720) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof ResizeObserver === 'undefined') {
      setWidth(el.clientWidth || fallback);
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth || fallback);
    return () => ro.disconnect();
  }, [fallback]);
  return [ref, width] as const;
}

/**
 * Push overlapping labels apart while keeping their order.
 *
 * Several teams routinely share a median final standing, which stacks their
 * end labels on top of one another. This spreads them by the minimum gap and
 * then re-centres the group so it stays anchored where the data put it.
 */
function declutter(values: number[], minGap: number, lo: number, hi: number): number[] {
  const order = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const out = new Array(values.length).fill(0);
  let last = -Infinity;
  for (const { v, i } of order) {
    const placed = Math.max(v, last + minGap);
    out[i] = placed;
    last = placed;
  }
  // Re-centre if the spread pushed the group past the bottom edge.
  const maxPlaced = Math.max(...out);
  if (maxPlaced > hi) {
    const shift = maxPlaced - hi;
    for (let i = 0; i < out.length; i++) out[i] = Math.max(lo, out[i] - shift);
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Path construction                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Fritsch–Carlson monotone cubic tangents. Guarantees the interpolant never
 * overshoots the data, which matters for stacked bands and for a quantity like
 * "wins so far" that can only ever go up.
 */
function monotoneTangents(xs: number[], ys: number[]): number[] {
  const n = xs.length;
  if (n < 2) return [0];
  const dx: number[] = [];
  const dy: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(xs[i + 1] - xs[i]);
    dy.push(ys[i + 1] - ys[i]);
    slope.push(dy[i] / (dx[i] || 1));
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) m.push(0);
    else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      m.push((w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]));
    }
  }
  m.push(slope[n - 2]);
  return m;
}

function monotonePath(points: [number, number][]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0][0]},${points[0][1]}`;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const m = monotoneTangents(xs, ys);
  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const h = xs[i + 1] - xs[i];
    d += ` C${xs[i] + h / 3},${ys[i] + (m[i] * h) / 3} ${xs[i + 1] - h / 3},${ys[i + 1] - (m[i + 1] * h) / 3} ${xs[i + 1]},${ys[i + 1]}`;
  }
  return d;
}

/** A closed band between two series, drawn as one filled path. */
function bandPath(upper: [number, number][], lower: [number, number][]): string {
  const top = monotonePath(upper);
  const rev = [...lower].reverse();
  const bottom = monotonePath(rev).replace(/^M/, 'L');
  return `${top} ${bottom} Z`;
}

/* -------------------------------------------------------------------------- */
/* Fan chart                                                                  */
/* -------------------------------------------------------------------------- */

export interface FanPoint {
  week: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
}

export interface FanMarker {
  week: number;
  label: string;
  detail?: ReactNode;
  /** Dim the tick — used for byes and non-conference games. */
  muted?: boolean;
}

export function FanChart({
  data, markers, height = 300, color = 'var(--accent)', yLabel, valueFormat, invert = false, yMax, yMin,
}: {
  data: FanPoint[];
  markers?: FanMarker[];
  height?: number;
  color?: string;
  yLabel: string;
  valueFormat?: (v: number) => string;
  /** Draw the y-axis descending, for quantities where lower is better. */
  invert?: boolean;
  yMax?: number;
  yMin?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [wrap, W] = useWidth<HTMLDivElement>();

  const padL = 34;
  const padR = 16;
  const padT = 12;
  const padB = 30;
  const H = height;

  const lo = yMin ?? Math.min(...data.map((d) => d.p10));
  const hi = yMax ?? Math.max(...data.map((d) => d.p90));
  const span = hi - lo || 1;

  const x = (i: number) => padL + (i / Math.max(1, data.length - 1)) * (W - padL - padR);
  const y = (v: number) => {
    const t = (v - lo) / span;
    return padT + (invert ? t : 1 - t) * (H - padT - padB);
  };

  const pts = (get: (d: FanPoint) => number): [number, number][] =>
    data.map((d, i) => [x(i), y(get(d))]);

  const fmt = valueFormat ?? ((v: number) => v.toFixed(1));
  const ticks = useMemo(() => {
    const out: number[] = [];
    const step = span <= 6 ? 1 : span <= 14 ? 2 : 4;
    for (let v = Math.ceil(lo); v <= hi; v += step) out.push(v);
    return out;
  }, [lo, hi, span]);

  const active = hover !== null ? data[hover] : null;
  const activeMarker = hover !== null ? markers?.find((m) => m.week === data[hover].week) : null;

  return (
    <div ref={wrap} className="relative w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block' }}
        role="img"
        aria-label={`${yLabel} by week, with 10th to 90th percentile bands`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = e.clientX - box.left;
          const idx = Math.round(((px - padL) / (W - padL - padR)) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, idx)));
        }}
      >
        <defs>
          <linearGradient id="fan-outer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fan-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0.26} />
          </linearGradient>
        </defs>

        {/* Grid */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--grid-line)" strokeWidth={1} />
            <text x={padL - 7} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="var(--text-faint)">
              {t}
            </text>
          </g>
        ))}

        <path d={bandPath(pts((d) => d.p90), pts((d) => d.p10))} fill="url(#fan-outer)" />
        <path d={bandPath(pts((d) => d.p75), pts((d) => d.p25))} fill="url(#fan-inner)" />
        <path
          d={monotonePath(pts((d) => d.p50))}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Week ticks */}
        {data.map((d, i) => {
          const m = markers?.find((mk) => mk.week === d.week);
          return (
            <text
              key={d.week}
              x={x(i)}
              y={H - 12}
              textAnchor="middle"
              fontSize={9.5}
              fill={hover === i ? 'var(--text-hi)' : m?.muted ? 'var(--text-faint)' : 'var(--text-low)'}
              fontWeight={hover === i ? 700 : 500}
            >
              {m ? m.label : d.week}
            </text>
          );
        })}

        {hover !== null && active && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--line-strong)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(active.p50)} r={5} fill={color} stroke="var(--bg-panel)" strokeWidth={2.5} />
          </g>
        )}
      </svg>

      {hover !== null && active && (
        <div
          className="pointer-events-none absolute top-2 rounded-lg px-2.5 py-2 text-[11.5px] leading-snug shadow-lift"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: `translateX(${hover > data.length / 2 ? 'calc(-100% - 10px)' : '10px'})`,
            background: 'var(--bg-raised)',
            border: '1px solid var(--line-strong)',
            color: 'var(--text)',
            minWidth: 128,
          }}
          role="tooltip"
        >
          <div className="font-semibold" style={{ color: 'var(--text-hi)' }}>
            Week {active.week}{activeMarker ? ` · ${activeMarker.label}` : ''}
          </div>
          {activeMarker?.detail && (
            <div className="mt-0.5 text-[11px]" style={{ color: 'var(--text-low)' }}>{activeMarker.detail}</div>
          )}
          <div className="mt-1.5 tabular-nums">
            <span style={{ color: 'var(--text-hi)' }}>{fmt(active.p50)}</span>{' '}
            <span style={{ color: 'var(--text-low)' }}>median</span>
          </div>
          <div className="tabular-nums" style={{ color: 'var(--text-low)' }}>
            {fmt(active.p25)}–{fmt(active.p75)} likely
          </div>
          <div className="tabular-nums" style={{ color: 'var(--text-faint)' }}>
            {fmt(active.p10)}–{fmt(active.p90)} range
          </div>
        </div>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-4 text-[10.5px]" style={{ color: 'var(--text-low)' }}>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-[2.5px] w-4 rounded-full" style={{ background: color }} />
          Median {yLabel.toLowerCase()}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-4 rounded-[2px]" style={{ background: color, opacity: 0.38 }} />
          Middle half
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-4 rounded-[2px]" style={{ background: color, opacity: 0.16 }} />
          10th–90th percentile
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bump chart — standing over time                                            */
/* -------------------------------------------------------------------------- */

export interface BumpSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

export function BumpChart({
  series, weeks, height = 380, highlight, onHighlight, positions,
}: {
  series: BumpSeries[];
  weeks: number[];
  height?: number;
  highlight?: string | null;
  onHighlight?: (key: string | null) => void;
  positions: number;
}) {
  const [wrap, W] = useWidth<HTMLDivElement>(760);
  const padL = 26;
  const padR = 62;
  const padT = 14;
  const padB = 26;
  const H = height;

  const x = (i: number) => padL + (i / Math.max(1, weeks.length - 1)) * (W - padL - padR);
  const y = (pos: number) => padT + ((pos - 1) / Math.max(1, positions - 1)) * (H - padT - padB);

  // Draw the highlighted line last so it sits above every other stroke.
  const ordered = [...series].sort((a, b) =>
    (a.key === highlight ? 1 : 0) - (b.key === highlight ? 1 : 0));

  // End labels are placed on the de-cluttered ladder, not on the raw value,
  // so teams sharing a median position stay individually readable.
  const labelY = useMemo(() => {
    const raw = series.map((s) => y(s.values[s.values.length - 1]));
    const spread = declutter(raw, 12, padT, H - padB);
    return Object.fromEntries(series.map((s, i) => [s.key, spread[i]]));
  }, [series, W, H]);

  return (
    <div ref={wrap} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}
        role="img" aria-label="Projected conference standing by week">
        {Array.from({ length: positions }, (_, i) => i + 1)
          .filter((p) => p === 1 || p % 4 === 0)
          .map((p) => (
            <g key={p}>
              <line x1={padL} x2={W - padR} y1={y(p)} y2={y(p)} stroke="var(--grid-line)" strokeWidth={1} />
              <text x={padL - 6} y={y(p)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="var(--text-faint)">{p}</text>
            </g>
          ))}
        {weeks.map((w, i) => (
          <text key={w} x={x(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="var(--text-faint)">{w}</text>
        ))}

        {ordered.map((s) => {
          const isHot = highlight === s.key;
          const dim = highlight !== null && highlight !== undefined && !isHot;
          const points: [number, number][] = s.values.map((v, i) => [x(i), y(v)]);
          return (
            <g
              key={s.key}
              onMouseEnter={() => onHighlight?.(s.key)}
              onMouseLeave={() => onHighlight?.(null)}
              style={{ cursor: onHighlight ? 'pointer' : 'default' }}
            >
              <path
                d={monotonePath(points)}
                fill="none"
                stroke={isHot ? s.color : 'var(--text-faint)'}
                strokeWidth={isHot ? 3 : 1.5}
                strokeOpacity={dim ? 0.4 : isHot ? 1 : 0.55}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Fat invisible hit target so thin lines are still grabbable. */}
              <path d={monotonePath(points)} fill="none" stroke="transparent" strokeWidth={11} />
              {isHot && (
                <circle cx={x(points.length - 1)} cy={points[points.length - 1][1]} r={4.5}
                  fill={s.color} stroke="var(--bg-panel)" strokeWidth={2} />
              )}
              {/* Leader line from the series end to its de-cluttered label. */}
              {Math.abs(labelY[s.key] - points[points.length - 1][1]) > 1.5 && (
                <line
                  x1={x(points.length - 1)}
                  y1={points[points.length - 1][1]}
                  x2={W - padR + 3}
                  y2={labelY[s.key]}
                  stroke={isHot ? s.color : 'var(--text-faint)'}
                  strokeOpacity={dim ? 0.32 : 0.45}
                  strokeWidth={1}
                />
              )}
              <text
                x={W - padR + 7}
                y={labelY[s.key]}
                dominantBaseline="middle"
                fontSize={isHot ? 11 : 9.5}
                fontWeight={isHot ? 700 : 500}
                fill={isHot ? 'var(--text-hi)' : dim ? 'var(--text-faint)' : 'var(--text-low)'}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ridgeline — every team's outcome distribution at once                      */
/* -------------------------------------------------------------------------- */

export function Ridgeline({
  rows, mode, height = 26, overlap = 0.55, format, onSelect, selected,
}: {
  rows: { key: string; label: string; dist: number[]; summary: string }[];
  mode: Mode;
  height?: number;
  overlap?: number;
  format?: (i: number) => string;
  onSelect?: (key: string) => void;
  selected?: string | null;
}) {
  const n = rows[0]?.dist.length ?? 0;
  const step = height * (1 - overlap);
  const totalH = step * (rows.length - 1) + height + 16;
  const [wrap, W] = useWidth<HTMLDivElement>(560);
  const padL = 96;
  const padR = 62;

  const globalMax = Math.max(...rows.flatMap((r) => r.dist));
  const x = (i: number) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);

  return (
    <div ref={wrap} className="w-full">
      <svg width={W} height={totalH} viewBox={`0 0 ${W} ${totalH}`} style={{ display: 'block' }}
        role="img" aria-label="Win-total distribution for every team">
        {/* Rows are drawn bottom-up so nearer curves overlap those behind. */}
        {[...rows].reverse().map((r, ri) => {
          const idx = rows.length - 1 - ri;
          const baseY = 8 + idx * step + height;
          const isSel = selected === r.key;
          const pts: [number, number][] = r.dist.map((p, i) => [x(i), baseY - (p / globalMax) * height]);
          const area = `${monotonePath(pts)} L${x(n - 1)},${baseY} L${x(0)},${baseY} Z`;
          const t = 1 - idx / Math.max(1, rows.length - 1);
          const fill = sequential(0.25 + t * 0.7, mode);
          return (
            <g
              key={r.key}
              onClick={() => onSelect?.(r.key)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
              opacity={selected && !isSel ? 0.45 : 1}
            >
              <path d={area} fill={fill} fillOpacity={0.82} stroke="var(--bg-panel)" strokeWidth={1.1} />
              <path d={monotonePath(pts)} fill="none" stroke={fill} strokeWidth={1.6} />
              <text x={padL - 8} y={baseY - 3} textAnchor="end" fontSize={10.5}
                fontWeight={isSel ? 700 : 500}
                fill={isSel ? 'var(--text-hi)' : 'var(--text)'}>{r.label}</text>
              <text x={W - padR + 8} y={baseY - 3} fontSize={10} fill="var(--text-low)" className="tabular-nums">
                {r.summary}
              </text>
            </g>
          );
        })}
        {format && Array.from({ length: n }, (_, i) => i)
          .filter((i) => i % 2 === 0)
          .map((i) => (
            <text key={i} x={x(i)} y={totalH - 1} textAnchor="middle" fontSize={9} fill="var(--text-faint)">
              {format(i)}
            </text>
          ))}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Diverging paired bars — two outcomes of one event                          */
/* -------------------------------------------------------------------------- */

export function DivergingPairs({
  rows, leftColor, rightColor, leftLabel, rightLabel, format, onSelect,
}: {
  rows: {
    key: string;
    centre: ReactNode;
    left: number;
    right: number;
    detail?: string;
  }[];
  leftColor: string;
  rightColor: string;
  leftLabel: string;
  rightLabel: string;
  format: (v: number) => string;
  onSelect?: (key: string) => void;
}) {
  const max = Math.max(...rows.flatMap((r) => [r.left, r.right]), 0.01);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10.5px]" style={{ color: 'var(--text-low)' }}>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: leftColor }} />
          {leftLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {rightLabel}
          <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: rightColor }} />
        </span>
      </div>
      <div className="space-y-[3px]">
        {rows.map((r) => {
          const Row = onSelect ? 'button' : 'div';
          return (
            <Row
              key={r.key}
              onClick={() => onSelect?.(r.key)}
              title={r.detail}
              className={`grid w-full items-center gap-2 rounded-[6px] px-1 py-1 ${onSelect ? 'row-hover cursor-pointer text-left' : ''}`}
              style={{ gridTemplateColumns: '1fr 168px 1fr' }}
            >
              <span className="flex items-center justify-end gap-1.5">
                <span className="text-[10.5px] font-semibold tabular-nums" style={{ color: 'var(--text-mid)' }}>
                  {format(r.left)}
                </span>
                <span className="relative h-[13px] flex-1" style={{ maxWidth: '100%' }}>
                  <span
                    className="absolute right-0 top-0 h-full rounded-l-[4px]"
                    style={{ width: `${(r.left / max) * 100}%`, background: leftColor }}
                  />
                </span>
              </span>
              <span className="truncate text-center text-[11.5px]">{r.centre}</span>
              <span className="flex items-center gap-1.5">
                <span className="relative h-[13px] flex-1">
                  <span
                    className="absolute left-0 top-0 h-full rounded-r-[4px]"
                    style={{ width: `${(r.right / max) * 100}%`, background: rightColor }}
                  />
                </span>
                <span className="text-[10.5px] font-semibold tabular-nums" style={{ color: 'var(--text-mid)' }}>
                  {format(r.right)}
                </span>
              </span>
            </Row>
          );
        })}
      </div>
    </div>
  );
}
