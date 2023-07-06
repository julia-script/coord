import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const tokyoNightDay = makeTheme(
  "dark",
  {
    background: { background: "#e1e2e7" },
    foreground: { color: "#3760bf" },
    caret: { color: "#3760bf" },
    selection: { color: "#99a7df" },
    selectionMatch: { color: "#99a7df" },
    gutterBackground: { color: "#e1e2e7" },
    gutterForeground: { color: "#3760bf" },
    gutterBorder: { color: "transparent" },
    lineHighlight: { color: "#5f5faf11" },
  },
  [
    { tag: t.keyword, color: "#007197" },
    {
      tag: [
        t.name,
        t.deleted,
        t.character,
        t.macroName,
      ],
      color: "#3760bf",
    },
    { tag: [t.propertyName], color: "#3760bf" },
    {
      tag: [
        t.processingInstruction,
        t.string,
        t.inserted,
        t.special(t.string),
      ],
      color: "#587539",
    },
    {
      tag: [
        t.function(t.variableName),
        t.labelName,
      ],
      color: "#3760bf",
    },
    {
      tag: [
        t.color,
        t.constant(t.name),
        t.standard(t.name),
      ],
      color: "#3760bf",
    },
    {
      tag: [t.definition(t.name), t.separator],
      color: "#3760bf",
    },
    { tag: [t.className], color: "#3760bf" },
    {
      tag: [
        t.number,
        t.changed,
        t.annotation,
        t.modifier,
        t.self,
        t.namespace,
      ],
      color: "#b15c00",
    },
    {
      tag: [t.typeName],
      color: "#007197",
      fontStyle: "#007197",
    },
    {
      tag: [t.operator, t.operatorKeyword],
      color: "#007197",
    },
    {
      tag: [t.url, t.escape, t.regexp, t.link],
      color: "#587539",
    },
    {
      tag: [t.meta, t.comment],
      color: "#848cb5",
    },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.link, textDecoration: "underline" },
    {
      tag: t.heading,
      fontWeight: "bold",
      color: "#b15c00",
    },
    {
      tag: [
        t.atom,
        t.bool,
        t.special(t.variableName),
      ],
      color: "#3760bf",
    },
    { tag: t.invalid, color: "#f52a65" },
    {
      tag: t.strikethrough,
      textDecoration: "line-through",
    },
  ]
);
