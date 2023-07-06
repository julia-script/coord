/**
 * @name darcula
 * @author darcula
 * Name: IntelliJ IDEA darcula theme
 * From IntelliJ IDEA by JetBrains
 */
import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const darcula = makeTheme(
  "dark",
  {
    background: { background: "#2B2B2B" },
    foreground: { color: "#f8f8f2" },
    caret: { color: "#FFFFFF" },
    selection: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    selectionMatch: {
      color: "rgba(255, 255, 255, 0.2)",
    },
    gutterBackground: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    gutterForeground: { color: "#999" },
    gutterBorder: { color: "transparent" },
    lineHighlight: {
      color: "rgba(255, 255, 255, 0.1)",
    },
  },
  [
    { tag: [t.atom, t.number], color: "#bd93f9" },
    { tag: [t.comment], color: "#61A151" },
    { tag: [t.string], color: "#6A8759" },
    {
      tag: [t.variableName, t.operator],
      color: "#A9B7C6",
    },
    {
      tag: [t.meta, t.className],
      color: "#A9B7C6",
    },
    { tag: [t.propertyName], color: "#FFC66D" },
    { tag: [t.keyword], color: "#CC7832" },
    { tag: [t.tagName], color: "#ff79c6" },
    { tag: [t.typeName], color: "#ffb86c" },
  ]
);
