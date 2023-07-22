import { makeTheme } from "@/theming";
export const dracula = makeTheme(
  "dracula",
  "dark",
  {
    background: { background: "#282a36" },
    foreground: { color: "#f8f8f2" },
    caret: { color: "#f8f8f0" },
    selection: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    selectionMatch: {
      color: "rgba(255, 255, 255, 0.2)",
    },
    gutter: {
      background: "#282a36",
      color: "#6D8A88",
    },
    lineHighlight: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    comment: { color: "#6272a4" },
    string: { color: "#f1fa8c" },
    atom: { color: "#bd93f9" },
    meta: { color: "#f8f8f2" },
    "keyword,operator,tagName": {
      color: "#ff79c6",
    },
    propertyNameFunction: { color: "#66d9ef" },
    "variableNameDefinition,variableNameFunction,className,attributeName":
      { color: "#50fa7b" },
    atomDefinition: { color: "#bd93f9" },
  }
);
