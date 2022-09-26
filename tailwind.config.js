const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      mono: ["Menlo", "monospace"],
    },
    extend: {
      padding: {
        container: "var(--contain-pad-y) max(var(--contain-pad-x), calc(50vw - (var(--contain-width) / 2)))",
      },
      margin: {
        proseImgOffset: "calc(50% - max(50vw - var(--contain-pad-x), (var(--contain-width) / 2)))",
      },
      zIndex: {
        containBg: "2",
        aboveContainBg: "5",
      },
    },
  },
  variants: {},
  corePlugins: {
    container: false,
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};

module.exports = config;
