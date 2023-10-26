/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pt-yellow": {
          100: "#FFD737",
        },
        "pt-black": {
          100: "#2E2D2E",
          200: "#111111",
          300: "#424042",
          400: "#424142",
          500: "#939393",
          600: "#979797",
        },
        "pt-pink": {
          100: "#6B37B8",
          200: "#3d2b4f",
        },
      },
    },
  },
  plugins: [],
};
