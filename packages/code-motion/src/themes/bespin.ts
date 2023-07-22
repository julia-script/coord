/**
 * @name Bespin
 * @author Mozilla / Jan T. Sott
 *
 * CodeMirror template by Jan T. Sott (https://github.com/idleberg/base16-codemirror)
 * Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)
 */

import { makeTheme } from "@/theming";

export const bespin = makeTheme(
  "bespin",
  "dark",
  {
    background: { background: "#28211c" },
    foreground: { color: "#9d9b97" },
    caret: { color: "#797977" },
    selection: { color: "#36312e" },
    selectionMatch: { color: "#4f382b" },
    gutter: {
      background: "#28211c",
      color: "#666666",
    },
    lineHighlight: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    "atom,number,link,bool": {
      color: "#9b859d",
    },
    comment: { color: "#937121" },
    "keyword,tagName": {
      color: "#cf6a4c",
    },
    string: { color: "#f9ee98" },
    bracket: { color: "#9d9b97" },
    "variableName,propertyName,attributeName": {
      color: "#5ea6ea",
    },
    variableNameDefinition: {
      color: "#cf7d34",
    },
    "variableNameFunction,className": {
      color: "#cf7d34",
    },
    "propertyName,attributeName": {
      color: "#54be0d",
    },
  }
);
