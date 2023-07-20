import React from "react";

type ThemeObject = {
  [key in
    | ThemeKeys
    | (string & {})]?: React.CSSProperties;
};
type ThemeKeys =
  | "foreground"
  | "background"
  | "caret"
  | "selection"
  | "selectionMatch"
  | "gutterBackground"
  | "gutterForeground"
  | "lineHighlight"
  | "font"
  | "specialString"
  | "string"
  | "variableNameLocal"
  | "variableNameFunction"
  | "variableNameDefinition"
  | "specialVariableName"
  | "propertyNameDefinition"
  | "link"
  | "heading"
  | "emphasis"
  | "strong"
  | "keyword"
  | "atom"
  | "bool"
  | "url"
  | "labelName"
  | "inserted"
  | "deleted"
  | "literal"
  | "string"
  | "number"
  | "regexp"
  | "escape"
  | "attributeName"
  | "typeName"
  | "namespace"
  | "className"
  | "macroname"
  | "propertyName"
  | "operator"
  | "comment"
  | "meta"
  | "invalid"
  | "punctuation"
  | "angleBracket"
  | "tagName"
  | "content";

const DEFAULT_THEME_STYLES: ThemeObject = {
  highlight: {
    opacity: 1,
  },
  unhighlight: {
    opacity: 0.5,
  },
  linter: {
    textDecoration: "underline",
    textDecorationStyle: "wavy",
    textUnderlineOffset: "0.25em",
    textDecorationThickness: "0.075em",
  },
  lineNumber: {
    opacity: 0.5,
    width: "3ch",
    userSelect: "none",
  },
  comment: {
    color: "#5C6370",
    opacity: 0.3,
  },
  error: {
    textDecorationColor: "#EF6262",
  },
  warning: {
    textDecorationColor: "#F3AA60",
  },
};

export const makeTheme = (
  name: string,
  variant: string,
  styles: ThemeObject
) => {
  const styleMap = new Map<
    string,
    React.CSSProperties
  >(
    Object.entries({
      ...DEFAULT_THEME_STYLES,
      ...styles,
    }).flatMap(([keys, value]) => {
      if (!value) return [];
      return keys
        .split(",")
        .map((key) => [key.trim(), value]);
    })
  );
  return {
    name,
    variant,
    styles: styleMap,
  };
};

export const extendTheme = (
  theme: Theme,
  styles: ThemeObject,
  name?: string,
  variant?: string
) => {
  const styleMap = new Map<
    string,
    React.CSSProperties
  >(
    Object.entries(styles).flatMap(
      ([keys, value]) => {
        if (!value) return [];
        return keys
          .split(",")
          .map((key) => [key.trim(), value]);
      }
    )
  );
  return {
    name: name ?? theme.name,
    variant: variant ?? theme.variant,
    styles: new Map([
      ...theme.styles,
      ...styleMap,
    ]),
  };
};

export type Theme = ReturnType<typeof makeTheme>;

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export function computeStyles(
  theme: Theme,
  styles: string[]
) {
  const out: React.CSSProperties = {};
  for (const style of styles) {
    const styleValue = theme.styles.get(style);
    if (styleValue) {
      Object.assign(out, styleValue);
    }
  }

  return out;
}
export const toCss = (
  styles: React.CSSProperties
) => {
  return Object.entries(styles).reduce(
    (acc, [key, value]) => {
      if (typeof value !== "undefined") {
        acc += `${toKebabCase(key)}:${value};`;
      }
      return acc;
    },
    ""
  );
};
