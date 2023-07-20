import React, {
  CSSProperties,
  ComponentProps,
} from "react";
import cn from "clsx";
import {
  PositionedToken,
  Theme,
  computeStyles,
} from "../..";

// const StyledToken = styled("span", teste);
export type TokenProps = {
  token: PositionedToken;
  theme: Theme;
} & ComponentProps<"span">;

export function TokenElement({
  token,
  children,
  className,
  theme,
  style,
  ...props
}: TokenProps) {
  const tokenStyles: CSSProperties =
    style ??
    computeStyles(
      theme,
      token.type === "deletion"
        ? ["foreground", ...token.pastStyles]
        : ["foreground", ...token.styles]
    );

  return (
    <span
      className={cn("cm-tkn", className)}
      style={tokenStyles}
      {...props}
    >
      {" ".repeat(token.indent) + token.content}
    </span>
  );
}
