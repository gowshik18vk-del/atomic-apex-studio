/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#f4f4f5',
        studio: {
          950: '#060607',
          900: '#0a0a0c',
          850: '#101014',
          800: '#16161c',
          700: '#22222a',
          600: '#2e2e38',
          500: '#52525e',
          400: '#71717a',
          300: '#a1a1aa',
          200: '#e4e4e7',
          100: '#fafafa',
        },
        apex: {
          lime: '#ccff00',
          'lime-hover': '#b8e600',
          'lime-dim': 'rgba(204, 255, 0, 0.12)',
          cyan: '#00f0ff',
          'cyan-dim': 'rgba(0, 240, 255, 0.12)',
          purple: '#a855f7',
          'purple-dim': 'rgba(168, 85, 247, 0.12)',
          gold: '#C9A25E',
          'gold-hover': '#D4B375',
          'gold-dim': 'rgba(201, 162, 94, 0.15)',
        },
        card: {
          DEFAULT: '#111115',
          foreground: '#f4f4f5',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(201, 162, 94, 0.4)',
        'glow-lime': '0 0 25px -5px rgba(204, 255, 0, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'glow-subtle': '0 0 20px -2px rgba(204, 255, 0, 0.15)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-sweep': 'glowSweep 6s ease-in-out infinite',
      },
      keyframes: {
        glowSweep: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
