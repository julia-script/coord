/**
 * @name abcdef
 * @author codemirror.net
 * https://codemirror.net/5/theme/abcdef.css
 */
import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";

export const abcdef = makeTheme(
  "dark",
  {
    background: { background: "#0f0f0f" },
    foreground: { color: "#defdef" },
    caret: { color: "#00FF00" },
    selection: { color: "#515151" },
    selectionMatch: { color: "#515151" },
    gutterBackground: { color: "#555" },
    gutterForeground: { color: "#FFFFFF" },
    lineHighlight: { color: "#314151" },
  },
  [
    { tag: t.keyword, color: "darkgoldenrod", fontWeight: "bold" },
    { tag: t.atom, color: "#77F" },
    { tag: t.comment, color: "#7a7b7c", fontStyle: "italic" },
    { tag: t.number, color: "violet" },
    { tag: t.definition(t.variableName), color: "#fffabc" },
    { tag: t.variableName, color: "#abcdef" },
    { tag: t.function(t.variableName), color: "#fffabc" },
    { tag: t.typeName, color: "#FFDD44" },
    { tag: t.tagName, color: "#def" },
    { tag: t.string, color: "#2b4" },
    { tag: t.meta, color: "#C9F" },
    { tag: t.bracket, color: "#8a8a8a" },
    { tag: t.attributeName, color: "#DDFF00" },
    { tag: t.heading, color: "aquamarine", fontWeight: "bold" },
    { tag: t.link, color: "blueviolet", fontWeight: "bold" },
  ]
);
