/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#252525',
        },
        accent: {
          primary: '#6366F1',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          xp: '#FBBF24',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1A1',
          tertiary: '#6B6B6B',
        },
        category: {
          health: '#22C55E',
          productivity: '#3B82F6',
          learning: '#8B5CF6',
          wellness: '#EC4899',
          custom: '#6366F1',
        }
      },
    },
  },
  plugins: [],
}
