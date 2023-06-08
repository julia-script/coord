/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-graph": {
          50: "#FEF1F1",
          100: "#FCE3E3",
          200: "#FAC7C7",
          300: "#F69D9D",
          400: "#F16767",
          500: "#EF4E4E",
          600: "#EC2D2D",
          700: "#D71414",
          800: "#B11010",
          900: "#830C0C",
          950: "#540808",
        },
        dark: {
          50: "#F2F7F8",
          100: "#E1ECEF",
          200: "#C4D9DE",
          300: "#9DC0C8",
          400: "#6FA2AF",
          500: "#46737E",
          600: "#3E666F",
          700: "#375A62",
          800: "#2E4B52",
          900: "#1F3338",
          950: "#192A2E",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography(theme) {
        return {
          DEFAULT: {
            css: {
              "code::before": {
                content: "none", // don’t generate the pseudo-element
                //                content: '""', // this is an alternative: generate pseudo element using an empty string
              },
              "code::after": {
                content: "none",
              },

              code: {
                backgroundColor: theme("colors.stone.800"),
                fontFamily: theme("fontFamily.mono"),
                fontWeight: theme("fontWeight.normal"),
                borderRadius: theme("borderRadius.DEFAULT"),
                paddingLeft: theme("spacing[1.5]"),
                paddingRight: theme("spacing[1.5]"),
                paddingTop: theme("spacing.1"),
                paddingBottom: theme("spacing.1"),
              },
            },
          },
        };
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
