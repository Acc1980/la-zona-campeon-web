import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf9e7",
          100: "#faf0c0",
          200: "#f5e08a",
          300: "#eecb54",
          400: "#e6b82a",
          500: "#C8AA32",
          600: "#a88a28",
          700: "#866c1f",
          800: "#655218",
          900: "#4a3c11",
        },
        dark: {
          50: "#f0f0f5",
          100: "#d8d8e8",
          200: "#b0b0d0",
          300: "#8888b8",
          400: "#6060a0",
          500: "#3e3e70",
          600: "#2e2e58",
          700: "#242440",
          800: "#1E1E2D",
          900: "#14141e",
        },
        rojo: {
          400: "#e05040",
          500: "#C0392B",
          600: "#9e2d22",
        },
      },
      fontFamily: {
        sans: ["var(--font-opensans)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
