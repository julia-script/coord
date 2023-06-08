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
          50: "#f7f7f7",
          100: "#efefef",
          200: "#d7d7d7",
        },
        dark: {
          50: "#EFF5F4",
          100: "#E0EBEA",
          200: "#B7D2CE",
          300: "#8BB6B0",
          400: "#598D85",
          500: "#223633",
          600: "#223532",
          700: "#1A2926",
          800: "#121C1B",
          900: "#121C1B",
          950: "#000000",
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
