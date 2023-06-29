import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const noctisLilac = makeTheme(
  "light",
  {
    background: { background: "#f2f1f8" },
    foreground: { color: "#0c006b" },
    caret: { color: "#5c49e9" },
    selection: { color: "#d5d1f2" },
    selectionMatch: { color: "#d5d1f2" },
    gutterBackground: { color: "#f2f1f8" },
    gutterForeground: { color: "#0c006b70" },
    lineHighlight: { color: "#e1def3" },
  },
  [
    {
      tag: t.comment,
      color: "#9995b7",
    },
    {
      tag: t.keyword,
      color: "#ff5792",
      fontWeight: "bold",
    },
    {
      tag: [t.definitionKeyword, t.modifier],
      color: "#ff5792",
    },
    {
      tag: [t.className, t.tagName, t.definition(t.typeName)],
      color: "#0094f0",
    },
    {
      tag: [t.number, t.bool, t.null, t.special(t.brace)],
      color: "#5842ff",
    },
    {
      tag: [t.definition(t.propertyName), t.function(t.variableName)],
      color: "#0095a8",
    },
    {
      tag: t.typeName,
      color: "#b3694d",
    },
    {
      tag: [t.propertyName, t.variableName],
      color: "#fa8900",
    },
    {
      tag: t.operator,
      color: "#ff5792",
    },
    {
      tag: t.self,
      color: "#e64100",
    },
    {
      tag: [t.string, t.regexp],
      color: "#00b368",
    },
    {
      tag: [t.paren, t.bracket],
      color: "#0431fa",
    },
    {
      tag: t.labelName,
      color: "#00bdd6",
    },
    {
      tag: t.attributeName,
      color: "#e64100",
    },
    {
      tag: t.angleBracket,
      color: "#9995b7",
    },
  ]
);
