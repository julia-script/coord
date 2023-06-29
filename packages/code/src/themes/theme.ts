import { LanguageSupport } from "@codemirror/language";
import { Tag, highlightTree, tagHighlighter } from "@lezer/highlight";
import { LRParser } from "@lezer/lr";
import { CSSProperties } from "react";

export type ThemeType = "light" | "dark";

export interface Styles {
  /** Editor background. */
  background: CSSProperties;
  /** Default text color. */
  foreground: CSSProperties;
  /** Caret color. */
  caret?: CSSProperties;
  /** Selection background. */
  selection?: CSSProperties;
  /** Selection match background. */
  selectionMatch?: CSSProperties;
  /** Background of highlighted lines. */
  lineHighlight?: CSSProperties;
  /** Gutter background. */
  gutterBackground?: CSSProperties;
  /** Text color inside gutter. */
  gutterForeground?: CSSProperties;
  /** Text active color inside gutter. */
  gutterActiveForeground?: CSSProperties;
  /** Gutter right border color. */
  gutterBorder?: CSSProperties;
  /** set editor font */
  fontFamily?: CSSProperties;

  [key: `s-${number}`]: CSSProperties;
}

type CodeStyle = CSSProperties & {
  start: number;
  end: number;
};

export function makeTheme(
  mode: ThemeType,
  styles: Styles,
  highlighterRules: readonly ({
    tag: Tag | readonly Tag[];
  } & CSSProperties)[]
) {
  let i = 0;
  styles = { ...styles };
  const rules: {
    tag: Tag | readonly Tag[];
    class: string;
  }[] = [];
  for (const { tag, ...rest } of highlighterRules) {
    const id = `s-${i++}`;
    Object.assign(styles, { [id]: rest });
    rules.push({ tag, class: id });
  }
  const highlighter = tagHighlighter(rules);
  const out = {
    mode,
    styles,
    highlight(code: string, language: LanguageSupport) {
      const tree = language.language.parser.parse(code);
      const styled: CodeStyle[] = [];
      let pos = 0;
      highlightTree(tree, highlighter, (from, to, id) => {
        const style = styles[id as keyof Styles];
        if (style) {
          if (pos < from) {
            styled.push({
              start: pos,
              end: from,
              ...styles.foreground,
            });
          }
          styled.push({
            start: from,
            end: to,
            ...style,
          });
          pos = to;
        }
      });
      if (pos < code.length) {
        styled.push({
          start: pos,
          end: code.length,
          ...styles.foreground,
        });
      }
      return styled;
    },
  } as const;
  return out;
}

export type Theme = ReturnType<typeof makeTheme>;
