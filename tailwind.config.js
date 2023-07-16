/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      transitionTimingFunction: {
        "default": "ease-out"
      }
    },
  },
  plugins: [],
}

