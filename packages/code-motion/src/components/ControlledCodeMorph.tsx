import { Token } from "@/code/types";
import { CodeBlockProps } from "./CodeBlock";
import { useMemo } from "react";
import { pipe } from "fp-ts/function";
import {
  Theme,
  curves,
  toPositionedTokens,
} from "..";
import { CodePre } from "./CodePre";
import React from "react";
import { TokensRenderer } from "./TokensRenderer";
import { mapTokenToCssMorphingStyle } from "./mapTokenToCssMorphingStyle";

export type ControlledCodeMorphProps = Omit<
  CodeBlockProps,
  | "code"
  | "styleRanges"
  | "selections"
  | "highlight"
  | "language"
> & {
  tokens: Token[];
  transition: number;
  previousTheme?: Theme;
};

export function ControlledCodeMorph({
  theme = curves,
  tokens,
  transition,
  displayBackground = true,
  lineHeight,
  previousTheme = theme,
  ...props
}: ControlledCodeMorphProps) {
  const positionedTokens = useMemo(() => {
    return pipe(tokens, toPositionedTokens());
  }, [tokens]);
  return (
    <CodePre
      displayBackground={displayBackground}
      lineHeight={lineHeight}
      theme={theme}
      {...props}
    >
      <TokensRenderer
        style={
          {
            "--cm-insertion-t": transition,
            "--cm-deletion-t": transition,
            "--cm-static-t": transition,
          } as React.CSSProperties
        }
        tokens={positionedTokens}
        theme={theme}
        mapTokenProps={(props) =>
          mapTokenToCssMorphingStyle(
            props,
            previousTheme
          )
        }
      />
      <style>{STYLES}</style>
    </CodePre>
  );
}

const cssLerp = (
  a: string,
  b: string,
  t: string
) =>
  `calc(var(${a}) + (var(${b}) - var(${a})) * var(${t}))`;
const STYLES = `
.cm-tkn-insertion {
  opacity: ${cssLerp(
    "--tkn-from-opacity, 0",
    "--tkn-opacity, 1",
    "--cm-insertion-t, 1"
  )};
}
.cm-tkn-deletion {
  opacity: ${cssLerp(
    "--tkn-opacity, 1",
    "--tkn-from-opacity, 0",
    "--cm-deletion-t, 1"
  )};
}
.cm-tkn-static {
  opacity: ${cssLerp(
    "--tkn-from-opacity, 1",
    "--tkn-opacity, 1",
    "--cm-static-t, 1"
  )};
  color: color-mix(in srgb, var(--tkn-from-color), var(--tkn-color) calc(100% * var(--cm-static-t, 1) ) );
  transform: translate(
    calc(1ch * var(--tkn-from-dx, 0) * (1 - var(--cm-static-t, 1))), 
    calc(100% * var(--tkn-from-dy, 0) * (1 - var(--cm-static-t, 1)))
  );
`;
