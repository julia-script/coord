/**
 * @name darcula
 * @author darcula
 * Name: IntelliJ IDEA darcula theme
 * From IntelliJ IDEA by JetBrains
 */

import { makeTheme } from "@/theming";

export const darcula = makeTheme(
  "darcula",
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
    gutter: {
      background: "#2B2B2B",
      color: "#999",
    },
    lineHighlight: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    "atom,number": { color: "#bd93f9" },
    comment: { color: "#61A151" },
    string: { color: "#6A8759" },
    "variableName,operator": { color: "#A9B7C6" },
    "meta,className": { color: "#A9B7C6" },
    propertyName: { color: "#FFC66D" },
    keyword: { color: "#CC7832" },
    tagName: { color: "#ff79c6" },
    typeName: { color: "#ffb86c" },
  }
);
