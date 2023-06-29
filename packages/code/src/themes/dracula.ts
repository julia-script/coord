import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const dracula = makeTheme(
  "dark",
  {
    background: { background: "#282a36" },
    foreground: { color: "#f8f8f2" },
    caret: { color: "#f8f8f0" },
    selection: { color: "rgba(255, 255, 255, 0.1)" },
    selectionMatch: { color: "rgba(255, 255, 255, 0.2)" },
    gutterBackground: { color: "#282a36" },
    gutterForeground: { color: "#6D8A88" },
    gutterBorder: { color: "transparent" },
    lineHighlight: { color: "rgba(255, 255, 255, 0.1)" },
  },
  [
    { tag: t.comment, color: "#6272a4" },
    { tag: t.string, color: "#f1fa8c" },
    { tag: t.atom, color: "#bd93f9" },
    { tag: t.meta, color: "#f8f8f2" },
    { tag: [t.keyword, t.operator, t.tagName], color: "#ff79c6" },
    { tag: [t.function(t.propertyName), t.propertyName], color: "#66d9ef" },
    {
      tag: [
        t.definition(t.variableName),
        t.function(t.variableName),
        t.className,
        t.attributeName,
      ],
      color: "#50fa7b",
    },
    { tag: t.atom, color: "#bd93f9" },
  ]
);
