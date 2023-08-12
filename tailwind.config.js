/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'charcoal': '#2C2F33',
        'cerulean': '#144884',
        'light-silver': '#CEDBDC',
        'soap': '#C8D3F1',
        'dodger-blue': '#1A91FA',
        'blue': '#1fb6ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
      }
    },
    daisyui: {
      themes: ["light", "dark"],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}