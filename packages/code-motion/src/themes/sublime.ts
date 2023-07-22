import { makeTheme } from "@/theming";

export const sublime = makeTheme(
  "sublime",
  "dark",
  {
    background: { background: "#303841" },
    foreground: { color: "#FFFFFF" },
    caret: { color: "#FBAC52" },
    selection: { color: "#4C5964" },
    selectionMatch: { color: "#3A546E" },
    gutter: {
      background: "#303841",
      color: "#FFFFFF70",
    },
    lineHighlight: { color: "#00000059" },
    "meta,comment": { color: "#A2A9B5" },
    "attributeName,keyword": { color: "#B78FBA" },
    variableNameFunction: { color: "#5AB0B0" },
    "string,stringSpecial,regexp,attributeValue":
      {
        color: "#99C592",
      },
    operator: { color: "#f47954" },
    "tagName,modifier": { color: "#E35F63" },
    "number,tagNameDefinition,className,variableNameDefinition":
      {
        color: "#fbac52",
      },
    "atom,bool,variableNameSpecial": {
      color: "#E35F63",
    },
    variableName: { color: "#539ac4" },
    "propertyName,typeName": { color: "#629ccd" },
    propertyNameDefinition: {
      color: "#36b7b5",
    },
  }
);
