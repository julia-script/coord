import { makeTheme } from "@/theming";

export const noctisLilac = makeTheme(
  "noctisLilac",
  "light",
  {
    background: { background: "#f2f1f8" },
    foreground: { color: "#0c006b" },
    caret: { color: "#5c49e9" },
    selection: { color: "#d5d1f2" },
    selectionMatch: { color: "#d5d1f2" },
    gutter: {
      background: "#f2f1f8",
      color: "#0c006b70",
    },
    lineHighlight: { color: "#e1def3" },
    comment: { color: "#9995b7" },
    keyword: {
      color: "#ff5792",
      fontWeight: "bold",
    },
    "keywordDefinition,modifier": {
      color: "#ff5792",
    },
    "className,tagName,typeNameDefinition": {
      color: "#0094f0",
    },
    "number,bool,null,braceSpecial": {
      color: "#5842ff",
    },
    "propertyNameDefinition,variableNameFunction":
      { color: "#0095a8" },
    typeName: { color: "#b3694d" },
    "propertyName,variableName": {
      color: "#fa8900",
    },
    operator: { color: "#ff5792" },
    self: { color: "#e64100" },
    "string,regexp": { color: "#00b368" },
    "paren,bracket": { color: "#0431fa" },
    labelName: { color: "#00bdd6" },
    attributeName: { color: "#e64100" },
    angleBracket: { color: "#9995b7" },
  }
);
