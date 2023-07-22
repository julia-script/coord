const makeColor =
  (h, s) =>
  (l) =>
  ({ opacityValue }) => {
    const color =
      typeof s === "number"
        ? `${h} ${(s * 100).toFixed(2)}% ${l}%`
        : `${h} ${l}%`;
    if (opacityValue === undefined) {
      return `hsl(${color})`;
    }
    return `hsl(${color} / ${opacityValue})`;
  };

const dark = makeColor(196, 0.6);
const graph = makeColor(337, 1);
const motion = makeColor(164, 1);
const editor = makeColor(200, 1);

const accent = makeColor("var(--accent-color)");

const makePalette = (
  color,
  center = 50,
  step = 5
) => {
  return {
    DEFAULT: color(center),
    50: color(center + step * 4),
    100: color(center + step * 3),
    200: color(center + step * 2),
    300: color(center + step),
    400: color(center),
    500: color(center - step),
    600: color(center - step * 2),
    700: color(center - step * 3),
    750: color(center - step * 4),
    800: color(center - step * 5),
    900: color(center - step * 6),
  };
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono, monospace)"],
      },
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
          DEFAULT: dark(5),
          50: dark(10),
          100: dark(9),
          200: dark(8),
          300: dark(7),
          400: dark(6),
          500: dark(5),
          600: dark(4),
          700: dark(5),
          750: dark(3),
          800: dark(2),
          900: dark(1),
        },
        graph: makePalette(graph, 60, 7),
        motion: makePalette(motion, 60, 7),
        editor: makePalette(editor, 60, 7),
        accent: makePalette(accent, 60, 7),
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(var(--tw-gradient-stops))",
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
                backgroundColor: theme(
                  "colors.dark.400"
                ),
                fontFamily: theme(
                  "fontFamily.mono"
                ),
                fontWeight: theme(
                  "fontWeight.normal"
                ),
                borderRadius: theme(
                  "borderRadius.DEFAULT"
                ),
                paddingLeft: theme(
                  "spacing[1.5]"
                ),
                paddingRight: theme(
                  "spacing[1.5]"
                ),
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
  darkMode: ["class", 'html[class~="dark"]'],
};
