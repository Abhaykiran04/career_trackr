/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 👈 THIS is the fix
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
      },
    },
  },
  plugins: [],
}
