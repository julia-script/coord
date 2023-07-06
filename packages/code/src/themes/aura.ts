import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const aura = makeTheme(
  "dark",
  {
    background: { background: "#21202e" },
    foreground: { color: "#edecee" },
    caret: { color: "#a277ff" },
    selection: { color: "#3d375e7f" },
    selectionMatch: { color: "#3d375e7f" },
    gutterBackground: { color: "#21202e" },
    gutterForeground: { color: "#edecee" },
    gutterBorder: { color: "transparent" },
    lineHighlight: { color: "#a394f033" },
  },
  [
    { tag: t.keyword, color: "#a277ff" },
    {
      tag: [
        t.name,
        t.deleted,
        t.character,
        t.macroName,
      ],
      color: "#edecee",
    },
    { tag: [t.propertyName], color: "#ffca85" },
    {
      tag: [
        t.processingInstruction,
        t.string,
        t.inserted,
        t.special(t.string),
      ],
      color: "#61ffca",
    },
    {
      tag: [
        t.function(t.variableName),
        t.labelName,
      ],
      color: "#ffca85",
    },
    {
      tag: [
        t.color,
        t.constant(t.name),
        t.standard(t.name),
      ],
      color: "#61ffca",
    },
    {
      tag: [t.definition(t.name), t.separator],
      color: "#edecee",
    },
    { tag: [t.className], color: "#82e2ff" },
    {
      tag: [
        t.number,
        t.changed,
        t.annotation,
        t.modifier,
        t.self,
        t.namespace,
      ],
      color: "#61ffca",
    },
    { tag: [t.typeName], color: "#82e2ff" },
    {
      tag: [t.operator, t.operatorKeyword],
      color: "#a277ff",
    },
    {
      tag: [t.url, t.escape, t.regexp, t.link],
      color: "#61ffca",
    },
    {
      tag: [t.meta, t.comment],
      color: "#6d6d6d",
    },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.link, textDecoration: "underline" },
    {
      tag: t.heading,
      fontWeight: "bold",
      color: "#a277ff",
    },
    {
      tag: [
        t.atom,
        t.bool,
        t.special(t.variableName),
      ],
      color: "#edecee",
    },
    { tag: t.invalid, color: "#ff6767" },
    {
      tag: t.strikethrough,
      textDecoration: "line-through",
    },
  ]
);
