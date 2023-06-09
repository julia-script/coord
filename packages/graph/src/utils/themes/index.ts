import { Theme } from "@/types";

export const darkTheme: Theme = {
  background: {
    fill: "#1c1e21",
  },

  body: "#ffffff",

  text: {
    fill: "#ffffff",
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "monospace",
  },

  gridMaxStepSize: 100,

  gridStep: {
    stroke: "#2c2e31",
    strokeWidth: 1,
  },

  gridAxis: {
    stroke: "#797e86",
    strokeWidth: 3,
  },

  gridLabels: {
    fill: "#ffffff",
    fontSize: 12,
    fontFamily: "monospace",
  },

  palette: [
    "#FFB84C",
    "#5cb7b6",
    "#F16767",
    "#f1fa8c",
    "#50fa7b",
    "#bd93f9",
    "#8be9fd",
    "#ff79c6",
    "#ffb86c",
    "#ff5555",
    "#5af78e",
    "#94e1ea",
    "#a384e0",
    "#dfb267",
  ],
};

export const lightTheme: Theme = {
  background: {
    fill: "#f5f5f5",
  },
  text: {
    fill: "#1c1e21",
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "monospace",
  },

  gridMaxStepSize: 100,

  gridStep: {
    stroke: "#d3d3d3",
    strokeWidth: 1,
  },

  gridAxis: {
    stroke: "#797e86",
    strokeWidth: 3,
  },

  gridLabels: {
    fill: "#1c1e21",
    fontSize: 12,
    fontFamily: "monospace",
  },

  palette: [
    "#FFB84C",
    "#5cb7b6",
    "#F16767",
    "#f1fa8c",
    "#50fa7b",
    "#bd93f9",
    "#8be9fd",
    "#ff79c6",
    "#ffb86c",
    "#ff5555",
    "#5af78e",
    "#94e1ea",
    "#a384e0",
    "#dfb267",
  ],

  body: "#1c1e21",
};

export const draculaTheme: Theme = {
  background: {
    fill: "#282a36",
  },

  text: {
    fill: "#f8f8f2",
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "monospace",
  },

  gridMaxStepSize: 100,

  gridStep: {
    stroke: "#44475a",
    strokeWidth: 1,
  },

  gridAxis: {
    stroke: "#6272a4",
    strokeWidth: 3,
  },

  gridLabels: {
    fill: "#f8f8f2",
    fontSize: 12,
    fontFamily: "monospace",
  },

  palette: [
    "#f1fa8c",
    "#50fa7b",
    "#bd93f9",
    "#8be9fd",
    "#ff79c6",
    "#ffb86c",
    "#ff5555",
    "#44475a",
    "#5af78e",
    "#94e1ea",
    "#a384e0",
    "#dfb267",
  ],

  body: "#f8f8f2",
};

export const threeBlueOneBrownTheme: Theme = {
  background: {
    fill: "#000000",
  },

  text: {
    fill: "#FFFFFF",
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "serif",
  },

  gridMaxStepSize: 100,

  gridStep: {
    stroke: "#1C758A",
    strokeWidth: 3,
  },

  gridAxis: {
    stroke: "#ffffff",
    strokeWidth: 3,
  },

  gridLabels: {
    fill: "#ffffff",
    fontSize: 14,
    fontFamily: "serif",
    fontStyle: "italic",
  },

  palette: ["#FF8080", "#FFFF00", "#77B05D"],

  body: "#FFFFFF",
};

export const defaultThemes = {
  dark: darkTheme,
  light: lightTheme,
  dracula: draculaTheme,
  "3b1b": threeBlueOneBrownTheme,
} as const;
