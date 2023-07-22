import { makeTheme } from "@/theming";
export const solarizedLight = makeTheme(
  "solarized",
  "light",
  {
    background: { background: "#fdf6e3" },
    foreground: { color: "#657b83" },
    caret: { color: "#586e75" },
    selection: { color: "#dfd9c8" },
    selectionMatch: { color: "#dfd9c8" },
    gutter: {
      background: "#00000010",
      color: "#657b83",
    },
    lineHighlight: { color: "#dfd9c8" },
    keyword: { color: "#859900" },
    "name,deleted,character,propertyName,macroName":
      { color: "#2aa198" },
    variableName: { color: "#268bd2" },
    variableNameFunction: { color: "#268bd2" },
    labelName: { color: "#d33682" },
    "color,nameConstant,nameStandard": {
      color: "#b58900",
    },
    "nameDefinition,separator": {
      color: "#2aa198",
    },
    brace: { color: "#d33682" },
    annotation: { color: "#d30102" },
    "number,changed,annotation,modifier,self,namespace":
      {
        color: "#d33682",
      },
    "typeName,className": { color: "#cb4b16" },
    operator: { color: "#6c71c4" },
    tagName: { color: "#268bd2" },
    squareBracket: { color: "#dc322f" },
    angleBracket: { color: "#073642" },
    attributeName: { color: "#93a1a1" },
    regexp: { color: "#d30102" },
    quote: { color: "#859900" },
    string: { color: "#b58900" },
    link: {
      color: "#2aa198",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    "url,escape,stringSpecial": {
      color: "#b58900",
    },
    meta: { color: "#dc322f" },
    comment: {
      color: "#586e75",
      fontStyle: "italic",
    },
    strong: {
      fontWeight: "bold",
      color: "#586e75",
    },
    emphasis: {
      fontStyle: "italic",
      color: "#859900",
    },
    strikethrough: {
      textDecoration: "line-through",
    },
    heading: {
      fontWeight: "bold",
      color: "#b58900",
    },
    heading1: {
      fontWeight: "bold",
      color: "#002b36",
    },
    "heading2,heading3,heading4": {
      fontWeight: "bold",
      color: "#002b36",
    },
    "heading5,heading6": {
      color: "#002b36",
    },
    "atom,bool,variableNameSpecial": {
      color: "#d33682",
    },
    "processingInstruction,inserted,contentSeparator":
      {
        color: "#dc322f",
      },
    invalid: {
      color: "#073642",
      borderBottom: `1px dotted #dc322f`,
    },
  }
);

export const solarizedDark = makeTheme(
  "solarized",
  "dark",
  {
    background: { background: "#002b36" },
    foreground: { color: "#93a1a1" },
    caret: { color: "#839496" },
    selection: { color: "#173541" },
    selectionMatch: { color: "#aafe661a" },
    gutter: {
      background: "#00252f",
      color: "#839496",
    },
    lineHighlight: { color: "#173541" },
    keyword: { color: "#859900" },
    "name,deleted,character,propertyName,macroName":
      { color: "#2aa198" },
    variableName: { color: "#93a1a1" },
    variableNameFunction: { color: "#268bd2" },
    labelName: { color: "#d33682" },
    "color,nameConstant,nameStandard": {
      color: "#b58900",
    },
    "nameDefinition,separator": {
      color: "#2aa198",
    },
    brace: { color: "#d33682" },
    annotation: { color: "#d30102" },
    "number,changed,annotation,modifier,self,namespace":
      {
        color: "#d33682",
      },
    "typeName,className": { color: "#cb4b16" },
    operator: { color: "#6c71c4" },
    tagName: { color: "#268bd2" },
    squareBracket: { color: "#dc322f" },
    angleBracket: { color: "#586e75" },
    attributeName: { color: "#93a1a1" },
    regexp: { color: "#d30102" },
    quote: { color: "#859900" },
    string: { color: "#b58900" },
    link: {
      color: "#2aa198",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    "url,escape,stringSpecial": {
      color: "#b58900",
    },
    meta: { color: "#dc322f" },
    comment: {
      color: "#586e75",
      fontStyle: "italic",
    },
    strong: {
      fontWeight: "bold",
      color: "#eee8d5",
    },
    emphasis: {
      fontStyle: "italic",
      color: "#859900",
    },
    strikethrough: {
      textDecoration: "line-through",
    },
    heading: {
      fontWeight: "bold",
      color: "#b58900",
    },
    heading1: {
      fontWeight: "bold",
      color: "#fdf6e3",
    },
    "heading2,heading3,heading4": {
      fontWeight: "bold",
      color: "#eee8d5",
    },
    "heading5,heading6": {
      color: "#eee8d5",
    },
    "atom,bool,variableNameSpecial": {
      color: "#d33682",
    },
    "processingInstruction,inserted,contentSeparator":
      {
        color: "#dc322f",
      },
    invalid: {
      color: "#586e75",
      borderBottom: `1px dotted #dc322f`,
    },
  }
);
