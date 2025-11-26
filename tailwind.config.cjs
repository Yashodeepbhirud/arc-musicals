/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcdark: "#0A0A0A",
        arcdeep: "#1A1A1A",
        arcgold: "#F4D03F",
        arcsoftgold: "#FFEFA1",
        arcmuted: "#C7C7C7",
      },
      backgroundImage: {
        "arc-gold-gradient": "linear-gradient(to right, #F4D03F, #FFB703, #FF8C00)",
        "arc-dark-gradient": "linear-gradient(to bottom, #0A0A0A, #1A1A1A, #000000)",
        "arc-card-gradient": "linear-gradient(to bottom, #222222, #1A1A1A, #000000)",
      },
      boxShadow: {
        "arc-gold-glow": "0 0 20px #F4D03F55",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
