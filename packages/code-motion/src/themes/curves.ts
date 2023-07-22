import { makeTheme } from "@/theming";

const motion = "hsl(164 100.00% 60%)";
const graph = "hsl(337 100.00% 60%)";
const graph2 = "hsl(337 50.00% 70%)";
const editor = "hsl(200 100.00% 60%)";

export const curves = makeTheme(
  "curves",
  "dark",
  {
    background: { background: "#051014" },
    foreground: { color: "#FFFFFF" },
    caret: { color: motion },
    selection: { background: "#4C5964" },
    selectionMatch: { background: "#3A546E" },
    gutter: {
      background: "#303841",
      color: "#FFFFFF70",
    },
    lineHighlight: { color: "#00000059" },

    "meta,comment": { color: "#A2A9B5" },
    "attributeName,keyword": { color: graph2 },
    variableNameFunction: { color: editor },
    "string,stringSpecial,regexp,attributeValue":
      {
        color: "#99C592",
      },
    operator: { color: "#f47954" },
    "tagName,modifier": { color: graph },
    "number,tagNameDefinition,className,variableNameDefinition":
      {
        color: motion,
      },
    "atom,bool,variableNameSpecial": {
      color: graph,
    },
    variableName: { color: editor },
    "propertyName,typeName": { color: "#629ccd" },
    propertyNameDefinition: {
      color: "#36b7b5",
    },
  }
);
