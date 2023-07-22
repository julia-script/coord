import {
  Tag,
  tagHighlighter,
  tags,
} from "@lezer/highlight";
import React from "react";

type ThemeObject = {
  [key in
    | ThemeKeys
    | (string & {})]?: React.CSSProperties;
};

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

  linterError: {
    textDecorationColor: "#EF6262",
  },
  linterWarning: {
    textDecorationColor: "#F3AA60",
  },
} as const;

const THEME_STYLE_KEYS = [
  "background",
  "foreground",
  "caret",
  "selection",
  "selectionMatch",
  "gutter",
  "gutterActive",

  "lineHighlight",

  "highlight",
  "unhighlight",
  "linter",
  "linterError",
  "linterWarning",
] as const;

type Tags = typeof tags;

type ModifierKeys = {
  [key in keyof Tags]: Tags[key] extends (
    ...args: any[]
  ) => unknown
    ? key
    : never;
}[keyof Tags];

type TagKeys = Exclude<keyof Tags, ModifierKeys>;

type ThemeTagKeys =
  | TagKeys
  | `${TagKeys}${Capitalize<ModifierKeys>}`;

type ThemeKeys =
  | (typeof THEME_STYLE_KEYS)[number]
  | ThemeTagKeys;

const InvalidKeys = new Set<string>();

export const makeTheme = (
  name: string,
  variant: string,
  styles: ThemeObject
) => {
  const highlighterRules: {
    tag: Tag;
    class: string;
  }[] = [];
  const styleMap = new Map<
    string,
    React.CSSProperties
  >();
  for (const [key, value] of Object.entries({
    ...DEFAULT_THEME_STYLES,
    ...styles,
  })) {
    if (!value) continue;
    key.split(",").forEach((key) => {
      const themeKey = key.trim();
      if (
        THEME_STYLE_KEYS.includes(
          themeKey as (typeof THEME_STYLE_KEYS)[number]
        )
      ) {
        styleMap.set(themeKey, value);
        return;
      }
      styleMap.set(themeKey, value);
      let [rawKey, modifier] = themeKey.split(
        /(function|definition|constant|function|standard|local|special)/i
      );
      modifier = modifier?.toLowerCase();
      let tag = tags[rawKey as keyof typeof tags];
      if (!tag || typeof tag === "function") {
        InvalidKeys.add(themeKey);

        console.warn(
          `Invalid theme key "${themeKey}" on theme "${name}:${variant}"`
        );
        return;
      }

      if (modifier && modifier in tags) {
        const modifierFn =
          tags[modifier as keyof typeof tags];

        if (typeof modifierFn === "function") {
          tag = modifierFn(tag);
        }
      }
      highlighterRules.push({
        tag,
        class: themeKey,
      });
    });
  }

  return {
    name,
    variant,
    styles: styleMap,
    highlighter: tagHighlighter(highlighterRules),
    extend(
      stylesExtension: ThemeObject,
      name?: string,
      variant?: string
    ) {
      return makeTheme(
        name ?? this.name,
        variant ?? this.variant,
        {
          ...styles,
          ...stylesExtension,
        }
      );
    },
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
