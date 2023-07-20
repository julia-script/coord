/**
 * @name Atom One
 * Atom One dark syntax theme
 *
 * https://github.com/atom/one-dark-syntax
 */
import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const atomone = makeTheme(
  "dark",
  {
    background: { background: "#272C35" },
    foreground: { color: "#9d9b97" },
    caret: { color: "#797977" },
    selection: { color: "#ffffff30" },
    selectionMatch: { color: "#2B323D" },
    gutterBackground: { color: "#272C35" },
    gutterForeground: { color: "#465063" },
    gutterBorder: { color: "transparent" },
    lineHighlight: { color: "#2B323D" },
  },
  [
    {
      tag: [
        t.function(t.variableName),
        t.function(t.propertyName),
        t.url,
        t.processingInstruction,
      ],
      color: "hsl(207, 82%, 66%)",
    },
    {
      tag: [t.tagName, t.heading],
      color: "#e06c75",
    },
    { tag: t.comment, color: "#54636D" },
    {
      tag: [t.propertyName],
      color: "hsl(220, 14%, 71%)",
    },
    {
      tag: [t.attributeName, t.number],
      color: "hsl( 29, 54%, 61%)",
    },
    {
      tag: t.className,
      color: "hsl( 39, 67%, 69%)",
    },
    {
      tag: t.keyword,
      color: "hsl(286, 60%, 67%)",
    },
    {
      tag: [
        t.string,
        t.regexp,
        t.special(t.propertyName),
      ],
      color: "#98c379",
    },
  ]
);
