import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const solarizedLight = makeTheme(
  "light",
  {
    background: { background: "#fdf6e3" },
    foreground: { color: "#657b83" },
    caret: { color: "#586e75" },
    selection: { color: "#dfd9c8" },
    selectionMatch: { color: "#dfd9c8" },
    gutterBackground: { color: "#00000010" },
    gutterForeground: { color: "#657b83" },
    lineHighlight: { color: "#dfd9c8" },
  },
  [
    { tag: t.keyword, color: "#859900" },
    {
      tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      color: "#2aa198",
    },
    { tag: [t.variableName], color: "#268bd2" },
    { tag: [t.function(t.variableName)], color: "#268bd2" },
    { tag: [t.labelName], color: "#d33682" },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: "#b58900",
    },
    { tag: [t.definition(t.name), t.separator], color: "#2aa198" },
    { tag: [t.brace], color: "#d33682" },
    {
      tag: [t.annotation],
      color: "#d30102",
    },
    {
      tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
      color: "#d33682",
    },
    {
      tag: [t.typeName, t.className],
      color: "#cb4b16",
    },
    {
      tag: [t.operator, t.operatorKeyword],
      color: "#6c71c4",
    },
    {
      tag: [t.tagName],
      color: "#268bd2",
    },
    {
      tag: [t.squareBracket],
      color: "#dc322f",
    },
    {
      tag: [t.angleBracket],
      color: "#073642",
    },
    {
      tag: [t.attributeName],
      color: "#93a1a1",
    },
    {
      tag: [t.regexp],
      color: "#d30102",
    },
    {
      tag: [t.quote],
      color: "#859900",
    },
    { tag: [t.string], color: "#b58900" },
    {
      tag: t.link,
      color: "#2aa198",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    {
      tag: [t.url, t.escape, t.special(t.string)],
      color: "#b58900",
    },
    { tag: [t.meta], color: "#dc322f" },
    { tag: [t.comment], color: "#586e75", fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold", color: "#586e75" },
    { tag: t.emphasis, fontStyle: "italic", color: "#859900" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.heading, fontWeight: "bold", color: "#b58900" },
    { tag: t.heading1, fontWeight: "bold", color: "#002b36" },
    {
      tag: [t.heading2, t.heading3, t.heading4],
      fontWeight: "bold",
      color: "#002b36",
    },
    {
      tag: [t.heading5, t.heading6],
      color: "#002b36",
    },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#d33682" },
    {
      tag: [t.processingInstruction, t.inserted, t.contentSeparator],
      color: "#dc322f",
    },
    {
      tag: [t.contentSeparator],
      color: "#b58900",
    },
    { tag: t.invalid, color: "#073642", borderBottom: `1px dotted #dc322f` },
  ]
);

export const solarizedDark = makeTheme(
  "dark",
  {
    background: { background: "#002b36" },
    foreground: { color: "#93a1a1" },
    caret: { color: "#839496" },
    selection: { color: "#173541" },
    selectionMatch: { color: "#aafe661a" },
    gutterBackground: { color: "#00252f" },
    gutterForeground: { color: "#839496" },
    lineHighlight: { color: "#173541" },
  },
  [
    { tag: t.keyword, color: "#859900" },
    {
      tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      color: "#2aa198",
    },
    { tag: [t.variableName], color: "#93a1a1" },
    { tag: [t.function(t.variableName)], color: "#268bd2" },
    { tag: [t.labelName], color: "#d33682" },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: "#b58900",
    },
    { tag: [t.definition(t.name), t.separator], color: "#2aa198" },
    { tag: [t.brace], color: "#d33682" },
    {
      tag: [t.annotation],
      color: "#d30102",
    },
    {
      tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
      color: "#d33682",
    },
    {
      tag: [t.typeName, t.className],
      color: "#cb4b16",
    },
    {
      tag: [t.operator, t.operatorKeyword],
      color: "#6c71c4",
    },
    {
      tag: [t.tagName],
      color: "#268bd2",
    },
    {
      tag: [t.squareBracket],
      color: "#dc322f",
    },
    {
      tag: [t.angleBracket],
      color: "#586e75",
    },
    {
      tag: [t.attributeName],
      color: "#93a1a1",
    },
    {
      tag: [t.regexp],
      color: "#d30102",
    },
    {
      tag: [t.quote],
      color: "#859900",
    },
    { tag: [t.string], color: "#b58900" },
    {
      tag: t.link,
      color: "#2aa198",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    {
      tag: [t.url, t.escape, t.special(t.string)],
      color: "#b58900",
    },
    { tag: [t.meta], color: "#dc322f" },
    { tag: [t.comment], color: "#586e75", fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold", color: "#eee8d5" },
    { tag: t.emphasis, fontStyle: "italic", color: "#859900" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.heading, fontWeight: "bold", color: "#b58900" },
    { tag: t.heading1, fontWeight: "bold", color: "#fdf6e3" },
    {
      tag: [t.heading2, t.heading3, t.heading4],
      fontWeight: "bold",
      color: "#eee8d5",
    },
    {
      tag: [t.heading5, t.heading6],
      color: "#eee8d5",
    },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#d33682" },
    {
      tag: [t.processingInstruction, t.inserted, t.contentSeparator],
      color: "#dc322f",
    },
    {
      tag: [t.contentSeparator],
      color: "#b58900",
    },
    { tag: t.invalid, color: "#586e75", borderBottom: `1px dotted #dc322f` },
  ]
);
