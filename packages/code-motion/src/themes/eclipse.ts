import { makeTheme } from "@/theming";

export const eclipse = makeTheme(
  "eclipse",
  "light",
  {
    background: { background: "#fff" },
    foreground: { color: "#000" },
    caret: { color: "#FFFFFF" },
    selection: { color: "#d7d4f0" },
    selectionMatch: { color: "#d7d4f0" },
    gutter: {
      background: "#f7f7f7",
      color: "#999",
    },
    lineHighlight: { color: "#e8f2ff" },
    comment: { color: "#3F7F5F" },
    documentMeta: { color: "#FF1717" },
    keyword: {
      color: "#7F0055",
      fontWeight: "bold",
    },
    atom: { color: "#00f" },
    number: { color: "#164" },
    propertyName: { color: "#164" },
    variableNameDefinition: { color: "#0000C0" },
    variableNameFunction: { color: "#0000C0" },
    string: { color: "#2A00FF" },
    operator: { color: "black" },
    tagName: { color: "#170" },
    attributeName: { color: "#00c" },
    link: { color: "#219" },
  }
);
