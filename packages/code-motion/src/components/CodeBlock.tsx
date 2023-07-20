import React, { ComponentProps } from "react";
import { useMemo } from "react";
import { curves } from "@/themes/curves";
import {
  Language,
  Theme,
  highlightTokens,
  toPositionedTokens,
  tokenize,
} from "..";
import { TokensRenderer } from "./TokensRenderer";
import {
  RangeStyleMap,
  Rangeish,
  applyRanges,
  queryRangeFromStyleMap,
} from "@/code/ranges";
import { pipe } from "fp-ts/function";

import { CodePre } from "./CodePre";
import dedent from "ts-dedent";

export type CodeBlockProps = {
  code: string;
  theme?: Theme;
  language?: Language;
  lineHeight?: number | string;
  highlight?: Rangeish;
  selections?: Rangeish;
  styleRanges?: RangeStyleMap;
  displayBackground?: boolean;
  displayLineNumbers?: boolean;
} & ComponentProps<"pre">;

export function CodeBlock({
  code,
  theme = curves,
  language = "tsx",
  children,
  lineHeight,

  displayLineNumbers,
  displayBackground = true,
  highlight,
  selections,
  styleRanges = {},
  ...props
}: CodeBlockProps) {
  const tokens = useMemo(() => {
    const trimmedCode = dedent(code);

    const rangeStyles = queryRangeFromStyleMap(
      trimmedCode,
      {
        highlight: highlight
          ? {
              query: highlight,
              outOfRangeStyles: "unhighlight",
            }
          : null,
        ...styleRanges,
        selection: selections,
      }
    );
    return pipe(
      tokenize(trimmedCode),
      highlightTokens(language, "future"),
      applyRanges(rangeStyles, "future"),
      toPositionedTokens()
    );
  }, [code]);
  return (
    <CodePre
      displayBackground={displayBackground}
      theme={theme}
      lineHeight={lineHeight}
      {...props}
    >
      <TokensRenderer
        theme={theme}
        tokens={tokens}
        renderPast={false}
      />

      {children}
    </CodePre>
  );
}
