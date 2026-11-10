/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
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
        cyan: { DEFAULT: '#1D4ED8', 50:'#EFF6FF', 100:'#DBEAFE', 200:'#BFDBFE', 300:'#93C5FD', 400:'#2563EB', 500:'#1D4ED8', 600:'#1E40AF', 700:'#1E3A8A', 800:'#172554', 900:'#0F172A' },
        purple: { DEFAULT: '#1D4ED8', 50:'#EFF6FF', 100:'#DBEAFE', 200:'#BFDBFE', 300:'#93C5FD', 400:'#3B82F6', 500:'#2563EB', 600:'#1D4ED8', 700:'#1E40AF', 800:'#1E3A8A', 900:'#172554' },
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
        'grid': 'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(29,78,216,0.07) 0%, rgba(29,78,216,0.03) 50%, transparent 80%)',
      },
      backgroundSize: { 'grid': '32px 32px' },
    },
  },
  plugins: [],
}
