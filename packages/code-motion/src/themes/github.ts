/**
 * @name github
 */

import { makeTheme } from "@/theming";
export const githubLight = makeTheme(
  "github",
  "light",
  {
    background: { background: "#fff" },
    foreground: { color: "#24292e" },
    selection: { color: "#BBDFFF" },
    selectionMatch: { color: "#BBDFFF" },

    gutter: {
      background: "#fff",
      color: "#6e7781",
    },
    "tagNameStandard,tagName": {
      color: "#116329",
    },
    "comment,bracket": { color: "#6a737d" },
    "className,propertyName": {
      color: "#6f42c1",
    },
    "variableName,attributeName,number,operator":
      { color: "#005cc5" },
    "keyword,typeName,typeOperator,typeName": {
      color: "#d73a49",
    },
    "string,meta,regexp": { color: "#032f62" },
    "name,quote": { color: "#22863a" },
    heading: {
      color: "#24292e",
      fontWeight: "bold",
    },
    emphasis: {
      color: "#24292e",
      fontStyle: "italic",
    },
    deleted: {
      color: "#b31d28",
      backgroundColor: "ffeef0",
    },
    "atom,bool,variableNameSpecial": {
      color: "#e36209",
    },
    "url,escape,regexp,link": {
      color: "#032f62",
    },
    link: { textDecoration: "underline" },
    strikethrough: {
      textDecoration: "line-through",
    },
    invalid: { color: "#cb2431" },
  }
);

export const githubDark = makeTheme(
  "github",
  "dark",
  {
    background: { background: "#0d1117" },
    foreground: { color: "#c9d1d9" },
    caret: { color: "#c9d1d9" },
    selection: { color: "#003d73" },
    selectionMatch: { color: "#003d73" },
    lineHighlight: { color: "#36334280" },
    "tagNameStandard,tagName": {
      color: "#7ee787",
    },
    "comment,bracket": { color: "#8b949e" },
    "className,propertyName": {
      color: "#d2a8ff",
    },
    "variableName,attributeName,number,operator":
      { color: "#79c0ff" },
    "keyword,typeName,typeOperator,className": {
      color: "#ff7b72",
    },
    "string,meta,regexp": { color: "#a5d6ff" },
    "name,quote": { color: "#7ee787" },
    heading: {
      color: "#d2a8ff",
      fontWeight: "bold",
    },
    emphasis: {
      color: "#d2a8ff",
      fontStyle: "italic",
    },
    deleted: {
      color: "#ffdcd7",
      backgroundColor: "ffeef0",
    },
    "atom,bool,variableNameSpecial": {
      color: "#ffab70",
    },
    "url,escape,regexp,link": {
      color: "#032f62",
    },
    link: { textDecoration: "underline" },
    strikethrough: {
      textDecoration: "line-through",
    },
    invalid: { color: "#f97583" },
  }
);
