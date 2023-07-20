import React, {
  CSSProperties,
  ComponentProps,
} from "react";
import { PositionedToken, Theme } from "..";
import {
  TokenElement,
  TokenProps,
} from "./Token/TokenElement";
import { LineElement } from "./LineElement";

export type TokensRendererProp = {
  tokens: PositionedToken[];
  renderPast?: boolean;
  theme: Theme;
  displayLineNumbers?: boolean;
  width?: number | string;
  height?: number | string;
  mapTokenProps?: (
    props: TokenProps
  ) => TokenProps;
} & ComponentProps<"code">;

export function TokensRenderer({
  style = {},
  tokens,
  renderPast = true,
  theme,
  displayLineNumbers = false,
  mapTokenProps = (props) => props,
  ...props
}: TokensRendererProp) {
  const past: React.ReactElement[] = [];
  let currentLine: React.ReactElement[] = [];
  const lines: React.ReactElement[] = [];
  const { color } =
    theme.styles.get("foreground") ?? {};
  let maxColumn = 0;
  tokens.forEach((token) => {
    if (token.type === "deletion" && renderPast) {
      past.push(
        <TokenElement
          key={token.id}
          {...mapTokenProps({
            token,
            theme,
          })}
        />
      );
      return;
    }
    maxColumn = Math.max(
      maxColumn,
      token.position.column + token.content.length
    );
    currentLine.push(
      <TokenElement
        key={token.id}
        {...mapTokenProps({
          token,
          theme,
        })}
      />
    );
    for (let i = 0; i < token.skipLines; i++) {
      lines.push(
        <LineElement
          key={lines.length}
          number={lines.length}
          theme={theme}
        >
          {currentLine}
        </LineElement>
      );
      currentLine = [];
    }
  });
  lines.push(
    <LineElement
      key={lines.length}
      number={lines.length}
      theme={theme}
    >
      {currentLine}
    </LineElement>
  );
  return (
    <code
      style={
        {
          position: "relative",
          "--cm-display-line-number":
            displayLineNumbers
              ? "inline-block"
              : "none",
          "--cm-foreground-color":
            color ?? "inherit",

          width: `${maxColumn}ch`,
          height: `calc(var(--tkn-line-height, 1lh) * ${lines.length})`,

          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <style>{STYLES}</style>
      {past}
      {lines}
    </code>
  );
}

const STYLES = `
.cm-tkn {
  display: inline-block;
  color: var(--tkn-color, --cm-foreground-color);
  opacity: var(--tkn-opacity, 1);
  transform: translate(calc(1ch * var(--tkn-dx, 0)), calc(100% * var(--tkn-dy, 0)));
}
.cm-line {
  min-height: var(--tkn-line-height, 1lh);
  display: block;
  width: 100%;
}
.cm-line::before {
  display: var(--cm-display-line-number, none);
  counter-increment: line;
  content: counter(line);
  text-align: right;
  min-width: 4.5ch;
  padding-right: 1ch;
  opacity: 0.6;
  color: var(--cm-foreground-color);
}
`;
