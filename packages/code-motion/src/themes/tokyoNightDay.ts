import { makeTheme } from "@/theming";

export const tokyoNightDay = makeTheme(
  "tokyoNightDay",
  "dark",
  {
    background: { background: "#e1e2e7" },
    foreground: { color: "#3760bf" },
    caret: { color: "#3760bf" },
    selection: { color: "#99a7df" },
    selectionMatch: { color: "#99a7df" },
    gutter: {
      background: "#e1e2e7",
      color: "#3760bf",
    },

    lineHighlight: { color: "#5f5faf11" },
    keyword: { color: "#007197" },
    "name,deleted,character,macroName": {
      color: "#3760bf",
    },
    propertyName: { color: "#3760bf" },
    "processingInstruction,string,inserted,stringSpecial":
      { color: "#587539" },
    variableNameFunction: { color: "#3760bf" },
    labelName: { color: "#3760bf" },
    "color,nameConstant,nameStandard": {
      color: "#3760bf",
    },
    "nameDefinition,separator": {
      color: "#3760bf",
    },
    className: { color: "#3760bf" },
    "number,changed,annotation,modifier,self,namespace":
      { color: "#b15c00" },
    typeName: {
      color: "#007197",
      fontStyle: "#007197",
    },
    operator: { color: "#007197" },
    "url,escape,regexp,link": {
      color: "#587539",
    },
    "meta,comment": { color: "#848cb5" },
    strong: { fontWeight: "bold" },
    emphasis: { fontStyle: "italic" },
    link: { textDecoration: "underline" },
    heading: {
      fontWeight: "bold",
      color: "#b15c00",
    },
    "atom,bool,variableNameSpecial": {
      color: "#3760bf",
    },
    invalid: { color: "#f52a65" },
    strikethrough: {
      textDecoration: "line-through",
    },
  }
);
