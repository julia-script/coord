import { makeTheme } from "@/theming";

export const tokyoNightStorm = makeTheme(
  "tokyoNightStorm",
  "dark",
  {
    background: { background: "#1a1b26" },
    foreground: { color: "#787c99" },
    caret: { color: "#c0caf5" },
    selection: { color: "#515c7e40" },
    selectionMatch: { color: "#16161e" },
    gutter: {
      background: "#1a1b26",
      color: "#787c99",
    },
    lineHighlight: { color: "#1e202e" },
    keyword: { color: "#bb9af7" },
    "name,deleted,character,macroName": {
      color: "#c0caf5",
    },
    propertyName: { color: "#7aa2f7" },
    "processingInstruction,string,stringSpecial,inserted":
      { color: "#9ece6a" },
    variableNameFunction: { color: "#7aa2f7" },
    labelName: { color: "#7aa2f7" },
    "color,nameConstant,nameStandard": {
      color: "#bb9af7",
    },
    "nameDefinition,separator": {
      color: "#c0caf5",
    },
    className: { color: "#c0caf5" },
    "number,changed,annotation,modifier,self,namespace":
      { color: "#ff9e64" },
    typeName: { color: "#0db9d7" },
    operator: { color: "#bb9af7" },
    "url,escape,regexp,link": {
      color: "#b4f9f8",
    },
    "meta,comment": { color: "#444b6a" },
    strong: { fontWeight: "bold" },
    emphasis: { fontStyle: "italic" },
    link: { textDecoration: "underline" },
    heading: {
      fontWeight: "bold",
      color: "#89ddff",
    },
    "atom,bool,variableNameSpecial": {
      color: "#c0caf5",
    },
    invalid: { color: "#ff5370" },
    strikethrough: {
      textDecoration: "line-through",
    },
  }
);
