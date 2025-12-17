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
        background: "#050505", // Almost black, better for OLED
        surface: "#121212",
        primary: "#6366f1", // Indigo
      },
      animation: {
        meteor: "meteor 5s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        scroll: "scroll 40s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        scroll: {
          to: { transform: "translate(calc(-50% - 0.5rem))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
