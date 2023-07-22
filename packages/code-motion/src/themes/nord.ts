import { makeTheme } from "@/theming";

// Colors from https://www.nordtheme.com/docs/colors-and-palettes
export const nord = makeTheme("nord", "dark", {
  background: { background: "#2e3440" },
  foreground: { color: "#FFFFFF" },
  caret: { color: "#FBAC52" },
  selection: { color: "#3b4252" },
  selectionMatch: { color: "#e5e9f0" },
  gutter: {
    background: "#2e3440",
    color: "#4c566a",
  },
  gutterActive: { color: "#d8dee9" },
  lineHighlight: { color: "#4c566a" },
  keyword: { color: "#5e81ac" },
  "name,deleted,character,propertyName,macroName":
    { color: "#88c0d0" },
  variableName: { color: "#8fbcbb" },
  variableNameFunction: { color: "#8fbcbb" },
  labelName: { color: "#81a1c1" },
  "color,nameConstant,nameStandardd": {
    color: "#5e81ac",
  },
  "nameDefinition,separator": {
    color: "#a3be8c",
  },
  brace: { color: "#8fbcbb" },
  annotation: { color: "#d30102" },
  "number,changed,annotation,modifier,self,namespace":
    { color: "#b48ead" },
  "typeName,className": { color: "#ebcb8b" },
  operator: { color: "#a3be8c" },
  tagName: { color: "#b48ead" },
  squareBracket: { color: "#bf616a" },
  angleBracket: { color: "#d08770" },
  attributeName: { color: "#ebcb8b" },
  regexp: { color: "#5e81ac" },
  quote: { color: "#b48ead" },
  string: { color: "#a3be8c" },
  link: {
    color: "#a3be8c",
    textDecoration: "underline",
    textUnderlinePosition: "under",
  },
  "url,escape,stringSpecial": {
    color: "#8fbcbb",
  },
  meta: { color: "#88c0d0" },
  monospace: {
    color: "#d8dee9",
    fontStyle: "italic",
  },
  comment: {
    color: "#4c566a",
    fontStyle: "italic",
  },
  strong: {
    fontWeight: "bold",
    color: "#5e81ac",
  },
  emphasis: {
    fontStyle: "italic",
    color: "#5e81ac",
  },
  strikethrough: {
    textDecoration: "line-through",
  },
  heading: {
    fontWeight: "bold",
    color: "#5e81ac",
  },
  heading1: {
    fontWeight: "bold",
    color: "#5e81ac",
  },
  "heading2,heading3,heading4": {
    fontWeight: "bold",
    color: "#5e81ac",
  },
  "heading5,heading6": { color: "#5e81ac" },
  "atom,bool,variableNameSpecial": {
    color: "#d08770",
  },
  "processingInstruction,inserted": {
    color: "#8fbcbb",
  },
  contentSeparator: { color: "#ebcb8b" },
  invalid: {
    color: "#434c5e",
    borderBottom: `1px dotted #d30102`,
  },
});
