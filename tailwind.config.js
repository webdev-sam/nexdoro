module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink': {
          500: '#ec4899',
        },
        'purple': {
          400: '#c084fc',
          500: '#a855f7',
        },
      },
      boxShadow: {
        'neon-pink': '0 0 10px rgba(236,72,153,0.5)',
        'neon-purple': '0 0 10px rgba(168,85,247,0.5)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
