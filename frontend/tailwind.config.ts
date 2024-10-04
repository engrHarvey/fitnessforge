import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6500",
        secondary: "#1E3E62",
        dark: "#0B192C",
        black: "#000000",
      },
    },
  },
  plugins: [],
};
export default config;
