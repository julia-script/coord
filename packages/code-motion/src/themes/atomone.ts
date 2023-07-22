/**
 * @name Atom One
 * Atom One dark syntax theme
 *
 * https://github.com/atom/one-dark-syntax
 */
import { makeTheme } from "@/theming";

export const atomone = makeTheme(
  "atomone",
  "dark",
  {
    background: { background: "#272C35" },
    foreground: { color: "#9d9b97" },
    caret: { color: "#797977" },
    selection: { color: "#ffffff30" },
    selectionMatch: { color: "#2B323D" },

    gutter: {
      background: "#272C35",
      color: "#465063",
    },
    lineHighlight: { color: "#2B323D" },
    "variableNameFunction,propertyNameFunction,url,processingInstruction":
      { color: "hsl(207, 82%, 66%)" },
    "tagName,heading": { color: "#e06c75" },
    comment: { color: "#54636D" },
    propertyName: { color: "hsl(220, 14%, 71%)" },
    "attributeName,number": {
      color: "hsl( 29, 54%, 61%)",
    },
    className: { color: "hsl( 39, 67%, 69%)" },
    keyword: { color: "hsl(286, 60%, 67%)" },
    "string,regexp,propertyNameSpecial": {
      color: "#98c379",
    },
  }
);
