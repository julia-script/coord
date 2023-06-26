import { Tag, tagHighlighter } from "@lezer/highlight";

export type ThemeType = "light" | "dark";

export interface GlobalStyles {
  /** Editor background. */
  background: string;
  /** Default text color. */
  foreground: string;
  /** Caret color. */
  caret?: string;
  /** Selection background. */
  selection?: string;
  /** Selection match background. */
  selectionMatch?: string;
  /** Background of highlighted lines. */
  lineHighlight?: string;
  /** Gutter background. */
  gutterBackground?: string;
  /** Text color inside gutter. */
  gutterForeground?: string;
  /** Text active color inside gutter. */
  gutterActiveForeground?: string;
  /** Gutter right border color. */
  gutterBorder?: string;
  /** set editor font */
  fontFamily?: string;
}

export function makeTheme(
  theme: ThemeType,
  themeStyles: GlobalStyles,
  highlighterRules: readonly {
    tag: Tag | readonly Tag[];
    color: string;
  }[]
) {
  return {
    theme,
    themeStyles,
    highlighter: tagHighlighter(
      highlighterRules.map(({ tag, color }) => ({ tag, class: color }))
    ),
  };
}

export type Theme = ReturnType<typeof makeTheme>;
