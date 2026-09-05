/* ============================================================================
 * Visualization roles.
 *
 * Every ramp here was checked with the palette validator against both chart
 * surfaces (dark #0d121b, light #ffffff): lightness band, chroma floor, CVD
 * separation, normal-vision floor and contrast. The CSS custom properties in
 * index.css carry the same values and are the preferred way to reference them;
 * these constants exist for the cases that must interpolate in JavaScript.
 *
 * Rules that are not negotiable here:
 *   · Categorical slots are assigned in fixed order and never cycled. Past
 *     eight series, fold into "Other" or facet.
 *   · Colour follows the entity, never its current rank.
 *   · Sequential is one hue, light to dark. Diverging is two hues plus a
 *     neutral gray midpoint — never a hue in the middle.
 *   · The light-mode categorical slots 3, 4 and 5 sit below 3:1 on white, so
 *     every chart using them ships visible direct labels or a table view.
 * ========================================================================== */

export type Mode = 'dark' | 'light';

export const CATEGORICAL: Record<Mode, string[]> = {
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
};

export const DIVERGING: Record<Mode, { pos: string; neg: string; mid: string }> = {
  dark: { pos: '#12a077', neg: '#dd7526', mid: '#6b7689' },
  light: { pos: '#0b8e6b', neg: '#d2611f', mid: '#8b95a8' },
};

/**
 * Sequential ramp, ordered low -> high. In both modes the high end is the step
 * furthest from the chart surface, so "more" always reads as "more prominent":
 * lighter on the dark surface, darker on the light one. Both orderings were
 * validated as ordinal ramps against their own surface.
 */
export const SEQUENTIAL: Record<Mode, string[]> = {
  dark: ['#0b8e6b', '#17b083', '#3bc99b', '#75dfba', '#aeedd4'],
  light: ['#45c99c', '#1eb187', '#109371', '#0a7053', '#063f31'],
};

/** Readable text colour on top of `sequential(t, mode)`. */
export function onSequential(t: number, mode: Mode): string {
  const strong = Math.max(0, Math.min(1, t)) > 0.45;
  if (mode === 'dark') return strong ? '#04140f' : '#eef4f1';
  return strong ? '#f4fbf8' : '#07231b';
}

/** Categorical slot by index. Throws past eight rather than inventing a hue. */
export function series(index: number, mode: Mode): string {
  const palette = CATEGORICAL[mode];
  if (index >= palette.length) {
    throw new Error(
      `Categorical palette has ${palette.length} slots; index ${index} would require a generated hue. Fold into "Other" or facet instead.`,
    );
  }
  return palette[index];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/**
 * Diverging colour for a value on a symmetric scale around zero.
 * `magnitude` is the value that saturates the ramp.
 */
export function diverging(value: number, magnitude: number, mode: Mode): string {
  const d = DIVERGING[mode];
  const t = Math.max(-1, Math.min(1, value / (magnitude || 1)));
  if (t >= 0) return mix(d.mid, d.pos, Math.pow(t, 0.75));
  return mix(d.mid, d.neg, Math.pow(-t, 0.75));
}

/** Sequential colour for a 0–1 magnitude. */
export function sequential(t: number, mode: Mode): string {
  const ramp = SEQUENTIAL[mode];
  const x = Math.max(0, Math.min(0.999, t)) * (ramp.length - 1);
  const i = Math.floor(x);
  return mix(ramp[i], ramp[Math.min(ramp.length - 1, i + 1)], x - i);
}

/** Ensure a team colour is legible on the current surface. */
export function teamInk(team: { onDark: string; onLight: string }, mode: Mode): string {
  return mode === 'dark' ? team.onDark : team.onLight;
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

export const pct = (v: number, digits = 0) => `${(v * 100).toFixed(digits)}%`;

export const signed = (v: number, digits = 1) =>
  `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits)}`;

export const signedInt = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}`;

/** Fixed-precision with a true minus sign, so a column of numbers reads consistently. */
export const num = (v: number, digits = 1) => v.toFixed(digits).replace('-', '\u2212');

export const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/** "Georgia by 6.5" style spread text from a home-perspective margin. */
export function spreadText(margin: number, homeAbbr: string, awayAbbr: string): string {
  if (Math.abs(margin) < 0.25) return 'Pick’em';
  const fav = margin > 0 ? homeAbbr : awayAbbr;
  return `${fav} −${(Math.abs(margin)).toFixed(1)}`;
}

/** Compact American-odds rendering of a probability, for the betting-literate. */
export function toAmericanOdds(p: number): string {
  if (p <= 0 || p >= 1) return '—';
  if (p >= 0.5) return `−${Math.round((p / (1 - p)) * 100)}`;
  return `+${Math.round(((1 - p) / p) * 100)}`;
}
