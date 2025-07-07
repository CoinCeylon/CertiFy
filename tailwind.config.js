/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'secondary': '#051730',
        'primary': '#022f63',
        'primary-light': '#01133d',
      },
    },
  },
  plugins: [],
};