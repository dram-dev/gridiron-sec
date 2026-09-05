/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      colors: {
        ink: {
          950: '#07090d', 900: '#0b0f16', 850: '#10151f', 800: '#151b27',
          750: '#1b2230', 700: '#222b3b', 650: '#2b3547', 600: '#374255',
          500: '#4a566c', 400: '#68758d', 300: '#8d99ae', 200: '#b6c0d1',
          100: '#dbe1eb', 50: '#f2f5fa',
        },
        brand: {
          50: '#eefcf6', 100: '#d5f7e8', 200: '#aeedd4', 300: '#75dfba',
          400: '#3bc99b', 500: '#17b083', 600: '#0b8e6b', 700: '#0a7157',
          800: '#0b5a47', 900: '#0a4a3c', 950: '#032a22',
        },
        heat: {
          400: '#ff8f6b', 500: '#f9683f', 600: '#e14a26', 700: '#bb361a',
        },
        gold: { 400: '#f5c451', 500: '#e8ab24', 600: '#c48812' },
      },
      boxShadow: {
        panel: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 12px 32px -12px rgb(0 0 0 / 0.6)',
        lift: '0 18px 48px -18px rgb(0 0 0 / 0.75)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'none' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fade-up .32s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in .24s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}
