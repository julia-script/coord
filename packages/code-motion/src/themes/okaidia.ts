import { makeTheme } from "@/theming";

export const okaidia = makeTheme(
  "okaidia",
  "dark",
  {
    background: { background: "#272822" },
    foreground: { color: "#FFFFFF" },
    caret: { color: "#FFFFFF" },
    selection: { color: "#49483E" },
    selectionMatch: { color: "#49483E" },
    gutter: {
      background: "#272822",
      color: "#FFFFFF70",
    },
    lineHighlight: { color: "#00000059" },
    "comment,documentMeta": { color: "#8292a2" },
    "number,bool,null,atom": { color: "#ae81ff" },
    "attributeValue,className,name": {
      color: "#e6db74",
    },
    "propertyName,attributeName": {
      color: "#a6e22e",
    },
    variableName: { color: "#9effff" },
    squareBracket: { color: "#bababa" },
    "string,braceSpecial": { color: "#e6db74" },
    "regexp,className,typeName,typeNameDefinition":
      { color: "#66d9ef" },
    "variableNameDefinition,propertyNameDefinition,variableNameFunction":
      {
        color: "#fd971f",
      },
    "keyword,keywordDefinition,modifier,tagName,angleBracket":
      {
        color: "#f92672",
      },
  }
);
