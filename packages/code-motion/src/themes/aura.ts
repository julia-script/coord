import { makeTheme } from "@/theming";

export const aura = makeTheme("aura", "dark", {
  background: { background: "#21202e" },
  foreground: { color: "#edecee" },
  caret: { color: "#a277ff" },
  selection: { color: "#3d375e7f" },
  selectionMatch: { color: "#3d375e7f" },
  gutter: {
    background: "#21202e",
    color: "#edecee",
  },
  lineHighlight: { color: "#a394f033" },
  keyword: { color: "#a277ff" },
  "name,deleted,character,macroName": {
    color: "#edecee",
  },
  propertyName: { color: "#ffca85" },
  "processingInstruction,string,inserted,stringSpecial":
    { color: "#61ffca" },
  "variableNameFunction,labelName": {
    color: "#ffca85",
  },
  "color,nameConstant,nameStandard": {
    color: "#61ffca",
  },
  "nameDefinition,separator": {
    color: "#edecee",
  },
  className: { color: "#82e2ff" },
  "number,changed,annotation,modifier,self,namespace":
    { color: "#61ffca" },
  typeName: { color: "#82e2ff" },
  "operator,operatorKeyword": {
    color: "#a277ff",
  },
  "url,escape,regexp,link": { color: "#61ffca" },
  "meta,comment": { color: "#6d6d6d" },
  strong: { fontWeight: "bold" },
  emphasis: { fontStyle: "italic" },
  link: { textDecoration: "underline" },
  heading: {
    fontWeight: "bold",
    color: "#a277ff",
  },
  "atom,bool,variableNameSpecial": {
    color: "#edecee",
  },
  invalid: { color: "#ff6767" },
  strikethrough: {
    textDecoration: "line-through",
  },
});
