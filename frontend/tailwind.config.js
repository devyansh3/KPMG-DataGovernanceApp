/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");


export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
    addVariablesForColors,
    function ({ matchUtilities, theme }) {
      matchUtilities({
        "bg-grid": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-grid-small": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-dot": (value) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
          )}")`,
        }),
      }, { values: flattenColorPalette(theme("backgroundColor")), type: "color" });
    },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'soft-yellow-gradient': 'linear-gradient(135deg, #fffde7, #fff9c4, #ffecb3)',
      },
      colors: {
        primary: {
          "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe",
          "300": "#c4b5fd", "400": "#a78bfa", "500": "#8b5cf6",
          "600": "#7c3aed", "700": "#6d28d9", "800": "#5b21b6",
          "900": "#4c1d95", "950": "#2e1065"
        },
      },
      animation: {
        scroll:
          "scroll var(--animation-duration) linear infinite",
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scrollReverse: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
    fontFamily: {
      'body': [
        'Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
        'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue',
        'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
      ],
      'sans': [
        'Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
        'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue',
        'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
      ],
      inter: ['Inter', 'sans-serif'],
    },
  },
};

function addVariablesForColors({ addBase, theme }) {
  const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ":root": newVars,
  });
}
