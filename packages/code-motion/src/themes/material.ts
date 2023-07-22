import { makeTheme } from "@/theming";

export const materialDark = makeTheme(
  "material",
  "dark",
  {
    background: { background: "#2e3235" },
    foreground: { color: "#bdbdbd" },
    caret: { color: "#a0a4ae" },
    selection: { color: "#d7d4f0" },
    selectionMatch: { color: "#d7d4f0" },
    gutterActive: {
      color: "#4f5b66",
    },
    gutter: {
      background: "#2e3235",
      color: "#999",
    },
    lineHighlight: { color: "#545b61" },
    keyword: { color: "#cf6edf" },
    "name,deleted,character,macroName": {
      color: "#56c8d8",
    },
    propertyName: { color: "#facf4e" },
    variableName: { color: "#bdbdbd" },
    variableNameFunction: { color: "#56c8d8" },
    labelName: { color: "#cf6edf" },
    "color,nameConstant,nameStandard": {
      color: "#facf4e",
    },
    "nameDefinition,separator": {
      color: "#fa5788",
    },
    brace: { color: "#cf6edf" },
    annotation: { color: "#ff5f52" },
    "number,changed,annotation,modifier,self,namespace":
      { color: "#ffad42" },
    "typeName,className": { color: "#ffad42" },
    "operator,operatorKeyword": {
      color: "#7186f0",
    },
    tagName: { color: "#99d066" },
    squareBracket: { color: "#ff5f52" },
    angleBracket: { color: "#606f7a" },
    attributeName: { color: "#bdbdbd" },
    regexp: { color: "#ff5f52" },
    quote: { color: "#6abf69" },
    string: { color: "#99d066" },
    "url,escape,stringSpecial": {
      color: "#facf4e",
    },
    meta: { color: "#707d8b" },
    "atom,bool,variableNameSpecial": {
      color: "#56c8d8",
    },
    "processingInstruction,inserted": {
      color: "#ff5f52",
    },
    contentSeparator: { color: "#56c8d8" },
    invalid: {
      color: "#606f7a",
      borderBottom: `1px dotted #ff5f52`,
    },
  }
);

export const materialLight = makeTheme(
  "material",
  "light",
  {
    background: { background: "#FAFAFA" },
    foreground: { color: "#90A4AE" },
    caret: { color: "#272727" },
    selection: { color: "#80CBC440" },
    selectionMatch: { color: "#FAFAFA" },
    gutter: {
      background: "#FAFAFA",
      color: "#90A4AE",
    },
    lineHighlight: { color: "#CCD7DA50" },
    keyword: { color: "#39ADB5" },
    "name,deleted,character,macroName": {
      color: "#90A4AE",
    },
    propertyName: { color: "#6182B8" },
    "processingInstruction,string,inserted,stringSpecial":
      { color: "#91B859" },
    "variableNameFunction,labelName": {
      color: "#6182B8",
    },
    "color,nameConstant,nameStandard": {
      color: "#39ADB5",
    },
    "nameDefinition,separator": {
      color: "#90A4AE",
    },
    className: { color: "#E2931D" },
    "number,changed,annotation,modifier,self,namespace":
      { color: "#F76D47" },
    typeName: { color: "#E2931D" },
    "operator,operatorKeyword": {
      color: "#39ADB5",
    },
    "url,escape,regexp,link": {
      color: "#91B859",
    },
    "meta,comment": { color: "#90A4AE" },
    strong: { fontWeight: "bold" },
    emphasis: { fontStyle: "italic" },
    link: { textDecoration: "underline" },
    heading: {
      fontWeight: "bold",
      color: "#39ADB5",
    },
    "atom,bool,variableNameSpecial": {
      color: "#90A4AE",
    },
    invalid: { color: "#E5393570" },
  }
);
