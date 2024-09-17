import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#333333",
        primary: {
          light: "#e0f2e9",
          DEFAULT: "#92c9a9",
          dark: "#5a9978",
        },
        secondary: {
          light: "#f0f7f4",
          DEFAULT: "#b8d8c7",
          dark: "#7fa98f",
        },
        accent: {
          light: "#fff8e6",
          DEFAULT: "#ffedb3",
          dark: "#ffd966",
        },
      },
    },
  },
  plugins: [],
};
export default config;
