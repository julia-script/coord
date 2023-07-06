import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const sublime = makeTheme(
  "dark",
  {
    background: { background: "#303841" },
    foreground: { color: "#FFFFFF" },
    caret: { color: "#FBAC52" },
    selection: { color: "#4C5964" },
    selectionMatch: { color: "#3A546E" },
    gutterBackground: { color: "#303841" },
    gutterForeground: { color: "#FFFFFF70" },
    lineHighlight: { color: "#00000059" },
  },
  [
    {
      tag: [t.meta, t.comment],
      color: "#A2A9B5",
    },
    {
      tag: [t.attributeName, t.keyword],
      color: "#B78FBA",
    },
    {
      tag: t.function(t.variableName),
      color: "#5AB0B0",
    },
    {
      tag: [t.string, t.regexp, t.attributeValue],
      color: "#99C592",
    },
    { tag: t.operator, color: "#f47954" },
    // { tag: t.moduleKeyword, color: 'red' },
    {
      tag: [t.tagName, t.modifier],
      color: "#E35F63",
    },
    {
      tag: [
        t.number,
        t.definition(t.tagName),
        t.className,
        t.definition(t.variableName),
      ],
      color: "#fbac52",
    },
    {
      tag: [
        t.atom,
        t.bool,
        t.special(t.variableName),
      ],
      color: "#E35F63",
    },
    { tag: t.variableName, color: "#539ac4" },
    {
      tag: [t.propertyName, t.typeName],
      color: "#629ccd",
    },
    { tag: t.propertyName, color: "#36b7b5" },
  ]
);
