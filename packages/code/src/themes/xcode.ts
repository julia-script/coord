/**
 * @name Xcode
 */
import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const xcodeLight = makeTheme(
  "light",
  {
    background: { background: "#fff" },
    foreground: { color: "#3D3D3D" },
    selection: { color: "#BBDFFF" },
    selectionMatch: { color: "#BBDFFF" },
    gutterBackground: { color: "#fff" },
    gutterForeground: { color: "#AFAFAF" },
    lineHighlight: { color: "#EDF4FF" },
  },
  [
    { tag: [t.comment, t.quote], color: "#707F8D" },
    { tag: [t.typeName, t.typeOperator], color: "#aa0d91" },
    { tag: [t.keyword], color: "#aa0d91", fontWeight: "bold" },
    { tag: [t.string, t.meta], color: "#D23423" },
    { tag: [t.name], color: "#032f62" },
    { tag: [t.typeName], color: "#522BB2" },
    { tag: [t.variableName], color: "#23575C" },
    { tag: [t.definition(t.variableName)], color: "#327A9E" },
    { tag: [t.regexp, t.link], color: "#0e0eff" },
  ]
);

export const xcodeDark = makeTheme(
  "dark",
  {
    background: { background: "#292A30" },
    foreground: { color: "#CECFD0" },
    caret: { color: "#fff" },
    selection: { color: "#727377" },
    selectionMatch: { color: "#727377" },
    lineHighlight: { color: "#2F3239" },
  },
  [
    { tag: [t.comment, t.quote], color: "#7F8C98" },
    { tag: [t.keyword], color: "#FF7AB2", fontWeight: "bold" },
    { tag: [t.string, t.meta], color: "#FF8170" },
    { tag: [t.typeName], color: "#DABAFF" },
    { tag: [t.definition(t.variableName)], color: "#6BDFFF" },
    { tag: [t.name], color: "#6BAA9F" },
    { tag: [t.variableName], color: "#ACF2E4" },
    { tag: [t.regexp, t.link], color: "#FF8170" },
  ]
);
