import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0B0F11",
          900: "#0F1417",
          800: "#141B1F",
          700: "#1B2328",
          600: "#262F35",
          500: "#3A454C",
        },
        ink: {
          100: "#E8ECEE",
          300: "#B7C0C4",
          500: "#8B98A0",
          700: "#5C686E",
        },
        signal: {
          teal: "#3DD9C4",
          tealDim: "#25453F",
          amber: "#E5A93D",
          amberDim: "#4A3B20",
          red: "#E5484D",
          redDim: "#452224",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "5px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
