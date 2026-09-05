/* Minimal inline icon set — 20×20 grid, 1.6 stroke, currentColor. */

type P = { className?: string; size?: number };
const base = (size: number) => ({
  width: size, height: size, viewBox: '0 0 20 20', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, 'aria-hidden': true,
});

export const IconGauge = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3.2 14.5a8 8 0 1 1 13.6 0" /><path d="M10 10.8 13.4 7" /><circle cx="10" cy="11.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
export const IconShield = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M10 2.6 16 5v5.1c0 3.4-2.4 6.2-6 7.3-3.6-1.1-6-3.9-6-7.3V5l6-2.4Z" /><path d="M7.6 10.1 9.3 11.8l3.2-3.4" />
  </svg>
);
export const IconPerson = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="10" cy="6.6" r="3.1" /><path d="M3.8 16.8a6.2 6.2 0 0 1 12.4 0" />
  </svg>
);
export const IconSwords = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 3h3l8.4 8.4M17 3h-3L5.6 11.4" /><path d="M4.2 14.2 6.9 16.9M15.8 14.2 13.1 16.9" /><path d="M3.6 16.4 5.4 18.2M16.4 16.4 14.6 18.2" />
  </svg>
);
export const IconClipboard = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M7.4 3.6H6A1.5 1.5 0 0 0 4.5 5.1v11.3A1.5 1.5 0 0 0 6 17.9h8a1.5 1.5 0 0 0 1.5-1.5V5.1A1.5 1.5 0 0 0 14 3.6h-1.4" />
    <rect x="7.4" y="2.1" width="5.2" height="3" rx="1" /><path d="M7.8 9.2h4.4M7.8 12.4h3" />
  </svg>
);
export const IconSliders = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6.2h5.4M11.6 6.2H17M3 13.8h2.6M8.8 13.8H17" />
    <circle cx="10" cy="6.2" r="2" /><circle cx="7.2" cy="13.8" r="2" />
  </svg>
);
export const IconBook = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3.4 4.4A1.6 1.6 0 0 1 5 2.8h4.2v14.4H5a1.6 1.6 0 0 0-1.6 1.6V4.4Z" />
    <path d="M16.6 4.4A1.6 1.6 0 0 0 15 2.8h-4.2v14.4H15a1.6 1.6 0 0 1 1.6 1.6V4.4Z" />
  </svg>
);
export const IconSearch = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="8.8" cy="8.8" r="5.2" /><path d="m12.8 12.8 3.6 3.6" /></svg>
);
export const IconSun = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="10" cy="10" r="3.4" /><path d="M10 2.4v1.8M10 15.8v1.8M2.4 10h1.8M15.8 10h1.8M4.6 4.6l1.3 1.3M14.1 14.1l1.3 1.3M15.4 4.6l-1.3 1.3M5.9 14.1l-1.3 1.3" />
  </svg>
);
export const IconMoon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><path d="M16.2 12.3A6.8 6.8 0 0 1 7.7 3.8a6.9 6.9 0 1 0 8.5 8.5Z" /></svg>
);
export const IconReset = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3.4 10a6.6 6.6 0 1 0 1.9-4.6" /><path d="M3 3.2v3.4h3.4" /></svg>
);
export const IconArrow = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 10h11M11 6l4 4-4 4" /></svg>
);
export const IconClose = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 5l10 10M15 5 5 15" /></svg>
);
export const IconMenu = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 5.5h14M3 10h14M3 14.5h14" /></svg>
);
export const IconSpark = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><path d="M10 2.6 11.7 7.4 16.5 9 11.7 10.6 10 15.4 8.3 10.6 3.5 9l4.8-1.6L10 2.6Z" /></svg>
);

export const IconTrend = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M2.8 13.6 7 8.9l3.1 2.7 4.4-5.4" /><path d="M11.6 6.2h3.6v3.6" />
    <path d="M2.8 17.2h14.4" />
  </svg>
);
