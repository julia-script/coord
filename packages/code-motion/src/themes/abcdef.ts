/**
 * @name abcdef
 * @author codemirror.net
 * https://codemirror.net/5/theme/abcdef.css
 */
import { makeTheme } from "@/theming";

export const abcdef = makeTheme(
  "abcdef",
  "dark",
  {
    background: { background: "#0f0f0f" },
    foreground: { color: "#defdef" },
    caret: { color: "#00FF00" },
    selection: { color: "#515151" },
    selectionMatch: { color: "#515151" },
    gutter: {
      background: "#555",
      color: "#FFFFFF",
    },
    lineHighlight: { color: "#314151" },
    keyword: {
      color: "darkgoldenrod",
      fontWeight: "bold",
    },
    atom: { color: "#77F" },
    comment: {
      color: "#7a7b7c",
      fontStyle: "italic",
    },
    number: { color: "violet" },
    variableNameDefinition: { color: "#fffabc" },
    variableName: { color: "#abcdef" },
    variableNameFunction: { color: "#fffabc" },
    typeName: { color: "#FFDD44" },
    tagName: { color: "#def" },
    string: { color: "#2b4" },
    meta: { color: "#C9F" },
    bracket: { color: "#8a8a8a" },
    attributeName: { color: "#DDFF00" },
    heading: {
      color: "aquamarine",
      fontWeight: "bold",
    },
    link: {
      color: "blueviolet",
      fontWeight: "bold",
    },
  }
);
