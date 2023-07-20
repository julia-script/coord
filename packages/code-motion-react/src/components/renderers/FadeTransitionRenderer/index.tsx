import React, {
  CSSProperties,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import {
  fadeTransitionPast,
  fadeTransition,
  fadeTransitionControlled,
  fadeTransitionAuto,
} from "./styles.module.css";
import {
  Theme,
  Token,
  computeStyles,
} from "@coord/code-motion";
import { LineRenderer } from "../Line";
import { TokenRenderer } from "../Token";
import cn from "clsx";
import { makeId } from "@coord/core";

const mapTokensInLine = <
  TTokenIn extends Token,
  TLine,
  TToken
>(
  tokens: TTokenIn[],
  fnToken: (line: TTokenIn, i: number) => TToken,
  fnLine: (line: TToken[], i: number) => TLine
) => {
  const lines: TLine[] = [];
  let currentLine: TToken[] = [];
  let tokenI = 0;
  for (const token of tokens) {
    currentLine.push(fnToken(token, tokenI));
    tokenI++;

    for (let i = 0; i < token.skipLines; i++) {
      lines.push(
        fnLine(currentLine, lines.length)
      );
      currentLine = [];
    }
  }
  lines.push(fnLine(currentLine, lines.length));
  return lines;
};

const splitPastAndFuture = (tokens: Token[]) => {
  const past: (Token & { id: string })[] = [];
  const future: (Token & { id: string })[] = [];

  for (let token of tokens) {
    const idToken = {
      id: makeId("t-"),
      ...token,
    };
    if (token.type !== "deletion") {
      future.push(idToken);
    }
    if (token.type !== "insertion") {
      past.push(idToken);
    }
  }
  return [past, future] as const;
};

const mapStaticStyles = (
  token: Token,
  theme: Theme,
  fromTheme: Theme
) => {
  const { color, opacity } = computeStyles(
    theme,
    ["foreground", ...token.styles]
  );
  const {
    color: pastColor,
    opacity: fromOpacity,
  } = computeStyles(fromTheme, [
    "foreground",
    ...token.pastStyles,
  ]);
  return {
    "--cm-token-color": color,
    "--cm-token-from-color": pastColor,

    "--cm-token-opacity": opacity,
    "--cm-token-from-opacity": fromOpacity,
  } as CSSProperties;
};

type FadeTransitionRendererProps = {
  tokens: Token[];
  theme: Theme;
  fromTheme?: Theme;
  controlled?: boolean;
};

export const FadeTransitionRenderer = memo(
  ({
    tokens,
    theme,
    fromTheme = theme,
    controlled,
  }: FadeTransitionRendererProps) => {
    const positionMap = useRef<
      Map<Token, HTMLSpanElement>
    >(new Map());
    const [past, future] = useMemo(
      () => splitPastAndFuture(tokens),
      [tokens]
    );

    const ref = useRef<HTMLElement>(null);
    const pastElementRef =
      useRef<HTMLDivElement>(null);

    const [sizeTransition, setSizeTransition] =
      React.useState<{
        from: [number, number];
        to: [number, number];
      } | null>(null);

    useEffect(() => {
      return () => {
        positionMap.current.clear();
      };
    }, [tokens]);
    useLayoutEffect(() => {
      if (!ref.current) return;
      if (!pastElementRef.current) return;

      ref.current.style.animation = "none";

      setSizeTransition({
        from: [
          pastElementRef.current.offsetWidth,
          pastElementRef.current.offsetHeight,
        ],
        to: [
          ref.current.offsetWidth,
          ref.current.offsetHeight,
        ],
      });
      ref.current.style.animation = "";
    }, [tokens]);

    return (
      <code
        ref={ref}
        className={cn(
          fadeTransition,
          controlled
            ? fadeTransitionControlled
            : fadeTransitionAuto
        )}
        style={
          sizeTransition
            ? ({
                "--cm-from-width": `${sizeTransition.from[0]}px`,
                "--cm-from-height": `${sizeTransition.from[1]}px`,
                "--cm-width": `${sizeTransition.to[0]}px`,
                "--cm-height": `${sizeTransition.to[1]}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <div
          className={fadeTransitionPast}
          ref={pastElementRef}
        >
          {past.map((token, i) => {
            return (
              <TokenRenderer
                renderNewLines
                ref={(el) => {
                  if (token.type !== "static")
                    return;
                  if (!el) return;

                  positionMap.current.set(
                    token,
                    el
                  );
                }}
                style={
                  token.type === "deletion"
                    ? computeStyles(fromTheme, [
                        "foreground",
                        ...token.pastStyles,
                      ])
                    : undefined
                }
                token={token}
                key={token.id}
              />
            );
          })}
        </div>
        <div>
          {mapTokensInLine(
            future,
            (token, i) => {
              return (
                <TokenRenderer
                  ref={(el) => {
                    const pastEl =
                      positionMap.current.get(
                        token
                      );
                    if (!el) return;
                    if (!pastEl) return;

                    const dx =
                      pastEl.offsetLeft -
                      el.offsetLeft;
                    const dy =
                      pastEl.offsetTop -
                      el.offsetTop;

                    el.style.setProperty(
                      "--cm-token-from-dx",
                      `${dx}px`
                    );
                    el.style.setProperty(
                      "--cm-token-from-dy",
                      `${dy}px`
                    );
                  }}
                  token={token}
                  style={mapStaticStyles(
                    token,
                    theme,
                    fromTheme
                  )}
                  key={token.id}
                />
              );
            },
            (line, i) => (
              <LineRenderer key={i}>
                {line}
              </LineRenderer>
            )
          )}
        </div>
      </code>
    );
  }
);
