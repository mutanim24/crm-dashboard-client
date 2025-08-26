/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#065f46', // Deep green
        secondary: '#10b981', // Emerald green
        primaryHover: '#047857', // Darker green for hover
        primaryFocus: '#064e3b', // Even darker green for focus
      },
    },
  },
  plugins: [],
}
