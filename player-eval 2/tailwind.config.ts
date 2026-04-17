import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1D9E75",
          "green-light": "#E1F5EE",
          "green-mid": "#9FE1CB",
          "green-dark": "#085041",
          amber: "#BA7517",
          "amber-light": "#FAEEDA",
          blue: "#185FA5",
          "blue-light": "#E6F1FB",
          coral: "#D85A30",
          "coral-light": "#FAECE7",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
