/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#05080f',
        card: '#0b1120',
        el: '#101928',
        hov: '#162035',
        border: 'rgba(0,220,255,0.10)',
        borders: 'rgba(0,220,255,0.22)',
        cyan: '#00dcff',
        purple: '#7c3aed',
        green: '#10b981',
        yellow: '#f59e0b',
        red: '#ef4444',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        glow: { '0%': { boxShadow: '0 0 10px rgba(0,220,255,0.2)' }, '100%': { boxShadow: '0 0 24px rgba(0,220,255,0.5)' } },
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(0,220,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,0.02) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0,220,255,0.07) 0%, rgba(124,58,237,0.05) 50%, transparent 80%)',
      },
      backgroundSize: { 'grid': '32px 32px' },
    },
  },
  plugins: [],
}
