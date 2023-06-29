import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const eclipse = makeTheme(
  "light",
  {
    background: { background: "#fff" },
    foreground: { color: "#000" },
    caret: { color: "#FFFFFF" },
    selection: { color: "#d7d4f0" },
    selectionMatch: { color: "#d7d4f0" },
    gutterBackground: { color: "#f7f7f7" },
    gutterForeground: { color: "#999" },
    lineHighlight: { color: "#e8f2ff" },
    gutterBorder: { color: "transparent" },
  },
  [
    { tag: [t.comment], color: "#3F7F5F" },
    { tag: [t.documentMeta], color: "#FF1717" },
    { tag: t.keyword, color: "#7F0055", fontWeight: "bold" },
    { tag: t.atom, color: "#00f" },
    { tag: t.number, color: "#164" },
    { tag: t.propertyName, color: "#164" },
    { tag: [t.variableName, t.definition(t.variableName)], color: "#0000C0" },
    { tag: t.function(t.variableName), color: "#0000C0" },
    { tag: t.string, color: "#2A00FF" },
    { tag: t.operator, color: "black" },
    { tag: t.tagName, color: "#170" },
    { tag: t.attributeName, color: "#00c" },
    { tag: t.link, color: "#219" },
  ]
);
