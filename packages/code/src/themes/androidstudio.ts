import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const androidstudio = makeTheme(
  "dark",
  {
    background: { background: "#282b2e" },
    foreground: { color: "#a9b7c6" },
    caret: { color: "#00FF00" },
    selection: { color: "#343739" },
    selectionMatch: { color: "#343739" },
    lineHighlight: { color: "#343739" },
  },
  [
    { tag: [t.keyword, t.deleted, t.className], color: "#cc7832" },
    { tag: [t.number, t.literal, t.derefOperator], color: "#6897bb" },
    { tag: [t.link, t.variableName], color: "#629755" },
    { tag: [t.comment, t.quote], color: "grey" },
    { tag: [t.meta, t.documentMeta], color: "#bbb529" },
    { tag: [t.string, t.propertyName, t.attributeValue], color: "#6a8759" },
    { tag: [t.heading, t.typeName], color: "#ffc66d" },
    { tag: [t.attributeName], color: "#a9b7c6" },
    { tag: [t.emphasis], fontStyle: "italic" },
  ]
);
