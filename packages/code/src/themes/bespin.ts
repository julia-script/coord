/**
 * @name Bespin
 * @author Mozilla / Jan T. Sott
 *
 * CodeMirror template by Jan T. Sott (https://github.com/idleberg/base16-codemirror)
 * Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)
 */
import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const bespin = makeTheme(
  "dark",
  {
    background: { background: "#28211c" },
    foreground: { color: "#9d9b97" },
    caret: { color: "#797977" },
    selection: { color: "#36312e" },
    selectionMatch: { color: "#4f382b" },
    gutterBackground: { color: "#28211c" },
    gutterForeground: { color: "#666666" },
    lineHighlight: { color: "rgba(255, 255, 255, 0.1)" },
  },
  [
    { tag: [t.atom, t.number, t.link, t.bool], color: "#9b859d" },
    { tag: t.comment, color: "#937121" },
    { tag: [t.keyword, t.tagName], color: "#cf6a4c" },
    { tag: t.string, color: "#f9ee98" },
    { tag: t.bracket, color: "#9d9b97" },
    { tag: [t.variableName], color: "#5ea6ea" },
    { tag: t.definition(t.variableName), color: "#cf7d34" },
    { tag: [t.function(t.variableName), t.className], color: "#cf7d34" },
    { tag: [t.propertyName, t.attributeName], color: "#54be0d" },
  ]
);
