/**
 * @name Xcode
 */

import { makeTheme } from "@/theming";
export const xcodeLight = makeTheme(
  "xcode",
  "light",
  {
    background: { background: "#fff" },
    foreground: { color: "#3D3D3D" },
    selection: { color: "#BBDFFF" },
    selectionMatch: { color: "#BBDFFF" },
    gutter: {
      background: "#fff",
      color: "#AFAFAF",
    },
    lineHighlight: { color: "#EDF4FF" },
    "comment,quote": { color: "#707F8D" },
    "typeName,typeOperator": { color: "#aa0d91" },
    keyword: {
      color: "#aa0d91",
      fontWeight: "bold",
    },
    "string,meta": { color: "#D23423" },
    name: { color: "#032f62" },
    typeName: { color: "#522BB2" },
    variableName: { color: "#23575C" },
    variableNameDefinition: { color: "#327A9E" },
    "regexp,link": { color: "#0e0eff" },
  }
);

export const xcodeDark = makeTheme(
  "xcode",
  "dark",
  {
    background: { background: "#292A30" },
    foreground: { color: "#CECFD0" },
    caret: { color: "#fff" },
    selection: { color: "#727377" },
    selectionMatch: { color: "#727377" },
    lineHighlight: { color: "#2F3239" },
    "comment,quote": { color: "#7F8C98" },
    keyword: {
      color: "#FF7AB2",
      fontWeight: "bold",
    },
    "string,meta": { color: "#FF8170" },
    typeName: { color: "#DABAFF" },
    variableNameDefinition: { color: "#6BDFFF" },
    name: { color: "#6BAA9F" },
    variableName: { color: "#ACF2E4" },
    "regexp,link": { color: "#FF8170" },
  }
);
