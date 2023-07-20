import React from "react";
import { useMemo } from "react";
import { curves } from "@/themes/curves";
import {
  CodeBlockProps,
  highlightTokens,
  toPositionedTokens,
  tokenize,
} from "..";
import { TokensRenderer } from "./TokensRenderer";
import {
  applyRanges,
  queryRangeFromStyleMap,
} from "@/code/ranges";
import { pipe } from "fp-ts/function";
import { CodePre } from "./CodePre";
import { diffTokenizer } from "@/code/diffTokenizer";
import { useMorphingCSS } from "@/code/css-morphing";
import dedent from "ts-dedent";
import { mapTokenToCssMorphingStyle } from "./mapTokenToCssMorphingStyle";

export type UncontrolledCodeMorphProps =
  CodeBlockProps;
export function UncontrolledCodeMorph({
  style = {},
  code,
  theme = curves,
  language = "tsx",
  lineHeight,
  displayLineNumbers,
  displayBackground = true,
  highlight,
  selections,
  styleRanges = {},
  children,
  ...props
}: UncontrolledCodeMorphProps) {
  useMorphingCSS();
  const prevCode = usePrevious(code);

  const renderingState = useMemo(() => {
    const trimmedCode = dedent(code);
    let tokens =
      prevCode === null
        ? tokenize(trimmedCode)
        : diffTokenizer(prevCode, trimmedCode);

    const rangeStyles = [
      ...queryRangeFromStyleMap(trimmedCode, {
        highlight: highlight
          ? {
              query: highlight,
              outOfRangeStyles: "unhighlight",
            }
          : null,

        selection: selections,
        ...styleRanges,
      }),
    ];

    return {
      code: trimmedCode,
      language,
      theme,
      tokens,
      rangeStyles,
    };
  }, [code]);

  const prevRenderingState = usePrevious(
    renderingState
  );

  const tokens = useMemo(() => {
    let out = renderingState.tokens;

    if (prevRenderingState) {
      out = pipe(
        out,
        highlightTokens(
          prevRenderingState.language,
          "past"
        ),
        applyRanges(
          prevRenderingState.rangeStyles,
          "past"
        )
      );
    }

    return pipe(
      out,
      highlightTokens(
        renderingState.language,
        "future"
      ),
      applyRanges(
        renderingState.rangeStyles,
        "future"
      ),
      toPositionedTokens()
    );
  }, [renderingState]);

  const { width, height } = useMemo(() => {
    const lines = renderingState.code.split("\n");
    const width = Math.max(
      ...lines.map((line) => line.length)
    );
    const height = lines.length;
    return { width, height };
  }, [renderingState]);
  return (
    <CodePre
      displayBackground={displayBackground}
      theme={theme}
      lineHeight={lineHeight}
      {...props}
    >
      <TokensRenderer
        style={{
          position: "relative",
          transition: "1s",
          display: "block",
          whiteSpace: "pre",
        }}
        displayLineNumbers={displayLineNumbers}
        theme={theme}
        tokens={tokens}
        renderPast={true}
        mapTokenProps={
          prevRenderingState !== null
            ? (props) =>
                mapTokenToCssMorphingStyle(
                  props,
                  prevRenderingState?.theme ??
                    props.theme
                )
            : undefined
        }
      />
      {children}
    </CodePre>
  );
}
const usePrevious = <T extends unknown>(
  value: T
) => {
  const ref = React.useRef({
    value,
    prev: null as T | null,
  });

  if (ref.current.value !== value) {
    ref.current.prev = ref.current.value;
    ref.current.value = value;
  }
  return ref.current.prev;
};
