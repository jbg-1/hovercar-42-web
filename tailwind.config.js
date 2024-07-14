/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

/* Adding personalised Tailwind Color Classes */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "fft-yellow": "#efaf02",
        "fft-light-yellow": "#e9bc40",
        "toggleOn-yellow": "#F0AF00",
        "cubestate-grey": "#D9D9D980",
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: colors.red,
        green: colors.green,
      },

      /* Adding personalised Tailwind Font Classes */

      fontFamily: {
        sourceserif: ["Source Serif Pro", "serif"],
        antonio: ["Antonio", "sans-serif"],
        sourceCodePro: ["Source Code Pro", "monospace"],
        martin: ["martin", "regular"],
        sourceSansPro: ["sourceSansPro", "regular"],
      },
    },
  },
  plugins: [],
};
