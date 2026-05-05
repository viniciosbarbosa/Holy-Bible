/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bible: {
          gold: "#C9A84C",
          "gold-light": "#E8C97A",
          dark: "#090807",
          paper: "#F4F1EA",
          parchment: "#D4C9A8",
          muted: "#8A7D5A",
        }
      },
      fontFamily: {
        serif: ['EB Garamond', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
