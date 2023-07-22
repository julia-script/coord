import { makeTheme } from "@/theming";

export const bbedit = makeTheme(
  "bbedit",
  "light",
  {
    background: { background: "#FFFFFF" },
    foreground: { color: "#000000" },
    caret: { color: "#FBAC52" },
    selection: { color: "#FFD420" },
    selectionMatch: { color: "#FFD420" },

    gutter: {
      background: "#f5f5f5",
      color: "#4D4D4C",
    },
    lineHighlight: { color: "#00000012" },
    "meta,comment": { color: "#804000" },
    "keyword,strong": { color: "#0000FF" },
    number: { color: "#FF0080" },
    string: { color: "#FF0080" },
    variableName: { color: "#006600" },
    escape: { color: "#33CC33" },
    tagName: { color: "#1C02FF" },
    heading: { color: "#0C07FF" },
    quote: { color: "#000000" },
    list: { color: "#B90690" },
    documentMeta: { color: "#888888" },
    variableNameFunction: { color: "#0000A2" },
    "typeNameDefinition,typeName": {
      color: "#6D79DE",
    },
  }
);
