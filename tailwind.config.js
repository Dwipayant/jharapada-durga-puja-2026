/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          crimson: '#8B0000',
          red: '#C0392B',
          gold: '#D4AF37',
          brightGold: '#FFD700',
          amber: '#F39C12',
          indigo: '#0B0C10',
          darkBg: '#0E0914',
          cardBg: 'rgba(25, 15, 35, 0.85)',
          cream: '#FFFDD0',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
        odia: ['Noto Sans Odia', 'Baloo Bhaina 2', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.4), 0 0 10px rgba(212, 175, 55, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 35px rgba(139, 0, 0, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
