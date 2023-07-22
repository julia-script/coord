/**
 * https://github.com/uiwjs/react-codemirror/issues/409
 */

import { makeTheme } from "@/theming";

export const vscodeDark = makeTheme(
  "vscode",
  "dark",
  {
    background: { background: "#1e1e1e" },
    foreground: { color: "#9cdcfe" },
    caret: { color: "#c6c6c6" },
    selection: { color: "#6199ff2f" },
    selectionMatch: { color: "#72a1ff59" },
    lineHighlight: { color: "#ffffff0f" },
    gutter: {
      background: "#1e1e1e",
      color: "#838383",
    },
    gutterActive: { color: "#fff" },

    "keyword,operatorKeyword,modifier,color,nameConstant,nameStandard,nameStandardTag,braceSpecial,atom,bool,variableNameSpecial":
      { color: "#569cd6" },
    "controlKeyword,moduleKeyword": {
      color: "#c586c0",
    },
    "name,deleted,character,macroName,propertyName,variableName,labelName,nameDefinition":
      { color: "#9cdcfe" },
    heading: {
      fontWeight: "bold",
      color: "#9cdcfe",
    },
    "typeName,className,tagName,number,changed,annotation,self,namespace":
      { color: "#4ec9b0" },
    "variableNameFunction,propertyNameFunction": {
      color: "#dcdcaa",
    },
    number: { color: "#b5cea8" },
    "operator,punctuation,separator,url,escape,regexp":
      { color: "#d4d4d4" },
    regexp: { color: "#d16969" },
    "stringSpecial,processingInstruction,string,inserted":
      { color: "#ce9178" },
    angleBracket: { color: "#808080" },
    strong: { fontWeight: "bold" },
    emphasis: { fontStyle: "italic" },
    strikethrough: {
      textDecoration: "line-through",
    },
    "meta,comment": { color: "#6a9955" },
    link: {
      color: "#6a9955",
      textDecoration: "underline",
    },
    invalid: { color: "#ff0000" },
  }
);
