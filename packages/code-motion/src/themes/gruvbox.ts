/**
 * @name gruvbox-dark
 * @author morhetz
 * Name: Gruvbox
 * From github.com/codemirror/codemirror5/blob/master/theme/gruvbox-dark.css
 */

import { makeTheme } from "@/theming";
export const gruvboxDark = makeTheme(
  "gruvbox",
  "dark",
  {
    background: { background: "#282828" },
    foreground: { color: "#ebdbb2" },
    caret: { color: "#ebdbb2" },
    selection: { color: "#bdae93" },
    selectionMatch: { color: "#bdae93" },
    lineHighlight: { color: "#3c3836" },
    gutter: {
      background: "#282828",
      color: "#7c6f64",
    },
    keyword: { color: "#fb4934" },
    "name,deleted,character,propertyName,macroName":
      { color: "#8ec07c" },
    variableName: { color: "#83a598" },
    variableNameFunction: {
      color: "#b8bb26",
      fontStyle: "bold",
    },
    labelName: { color: "#ebdbb2" },
    "color,nameConstant,nameStandard": {
      color: "#d3869b",
    },
    "nameDefinition,separator": {
      color: "#ebdbb2",
    },
    brace: { color: "#ebdbb2" },
    annotation: { color: "#fb4934d" },
    "number,changed,annotation,modifier,self,namespace":
      { color: "#d3869b" },
    "typeName,className": { color: "#fabd2f" },
    "operator,operatorKeyword": {
      color: "#fb4934",
    },
    tagName: {
      color: "#8ec07c",
      fontStyle: "bold",
    },
    squareBracket: { color: "#fe8019" },
    angleBracket: { color: "#83a598" },
    attributeName: { color: "#8ec07c" },
    regexp: { color: "#8ec07c" },
    quote: { color: "#928374" },
    string: { color: "#ebdbb2" },
    link: {
      color: "#a89984",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    "url,escape,stringSpecial": {
      color: "#d3869b",
    },
    meta: { color: "#fabd2f" },
    comment: {
      color: "#928374",
      fontStyle: "italic",
    },
    strong: {
      fontWeight: "bold",
      color: "#fe8019",
    },
    emphasis: {
      fontStyle: "italic",
      color: "#b8bb26",
    },
    strikethrough: {
      textDecoration: "line-through",
    },
    heading: {
      fontWeight: "bold",
      color: "#b8bb26",
    },
    "heading1,heading2": {
      fontWeight: "bold",
      color: "#b8bb26",
    },
    "heading3,heading4": {
      fontWeight: "bold",
      color: "#fabd2f",
    },
    "heading5,heading6": { color: "#fabd2f" },
    "atom,bool,variableNameSpecial": {
      color: "#d3869b",
    },
    "processingInstruction,inserted": {
      color: "#83a598",
    },
    contentSeparator: { color: "#fb4934" },
    invalid: { color: "#fe8019" },
  }
);

export const gruvboxLight = makeTheme(
  "gruvbox",
  "light",
  {
    background: { background: "#fbf1c7" },
    foreground: { color: "#3c3836" },
    caret: { color: "#af3a03" },
    selection: { color: "#ebdbb2" },
    selectionMatch: { color: "#bdae93" },
    lineHighlight: { color: "#ebdbb2" },
    gutter: {
      background: "#ebdbb2",
      color: "#665c54",
    },
    keyword: { color: "#9d0006" },
    "name,deleted,character,propertyName,macroName":
      { color: "#427b58" },
    variableName: { color: "#076678" },
    variableNameFunction: {
      color: "#79740e",
      fontStyle: "bold",
    },
    labelName: { color: "#3c3836" },
    "color,nameConstant,nameStandard": {
      color: "#8f3f71",
    },
    "nameDefinition,separator": {
      color: "#3c3836",
    },
    brace: { color: "#3c3836" },
    annotation: { color: "#9d0006" },
    "number,changed,annotation,modifier,self,namespace":
      { color: "#8f3f71" },
    "typeName,className": { color: "#b57614" },
    "operator,operatorKeyword": {
      color: "#9d0006",
    },
    tagName: {
      color: "#427b58",
      fontStyle: "bold",
    },
    squareBracket: { color: "#af3a03" },
    angleBracket: { color: "#076678" },
    attributeName: { color: "#427b58" },
    regexp: { color: "#427b58" },
    quote: { color: "#928374" },
    string: { color: "#3c3836" },
    link: {
      color: "#7c6f64",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    "url,escape,stringSpecial": {
      color: "#8f3f71",
    },
    meta: { color: "#b57614" },
    comment: {
      color: "#928374",
      fontStyle: "italic",
    },
    strong: {
      fontWeight: "bold",
      color: "#af3a03",
    },
    emphasis: {
      fontStyle: "italic",
      color: "#79740e",
    },
    strikethrough: {
      textDecoration: "line-through",
    },
    heading: {
      fontWeight: "bold",
      color: "#79740e",
    },
    "heading1,heading2": {
      fontWeight: "bold",
      color: "#79740e",
    },
    "heading3,heading4": {
      fontWeight: "bold",
      color: "#b57614",
    },
    "heading5,heading6": { color: "#b57614" },
    "atom,bool,variableNameSpecial": {
      color: "#8f3f71",
    },
    "processingInstruction,inserted": {
      color: "#076678",
    },
    contentSeparator: { color: "#9d0006" },
    invalid: { color: "#af3a03" },
  }
);
