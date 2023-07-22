import { makeTheme } from "@/theming";

export const androidstudio = makeTheme(
  "androidstudio",
  "dark",
  {
    background: { background: "#282b2e" },
    foreground: { color: "#a9b7c6" },
    caret: { color: "#00FF00" },
    selection: { color: "#343739" },
    selectionMatch: { color: "#343739" },
    lineHighlight: { color: "#343739" },
    "keyword,deleted,className": {
      color: "#cc7832",
    },
    "number,literal,derefOperator": {
      color: "#6897bb",
    },
    "link,variableName": { color: "#629755" },
    "comment,quote": { color: "grey" },
    "meta,documentMeta": { color: "#bbb529" },
    "string,propertyName,attributeValue": {
      color: "#6a8759",
    },
    "heading,typeName": { color: "#ffc66d" },
    attributeName: { color: "#a9b7c6" },
    emphasis: { fontStyle: "italic" },
  }
);
