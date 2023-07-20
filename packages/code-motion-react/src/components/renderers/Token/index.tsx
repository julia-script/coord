import React, { ComponentProps } from "react";
import { Token } from "@coord/code-motion";
import cn from "clsx";

export type TokenRendererProps = {
  token: Token;
  renderNewLines?: boolean;
} & ComponentProps<"span">;

function TokenRendererComponent(
  {
    token,
    renderNewLines,
    style = {},
    ...props
  }: TokenRendererProps,
  ref: React.Ref<HTMLSpanElement>
) {
  return (
    <>
      <span
        ref={ref}
        className={cn(
          "cm-token",
          `cm-token--${token.type}`
        )}
        style={{
          display: "inline-block",
          ...style,
        }}
        {...props}
      >
        {" ".repeat(token.indent) + token.content}
      </span>
      {renderNewLines &&
        new Array(token.skipLines)
          .fill(null)
          .map((_, i) => <br key={i} />)}
    </>
  );
}

export const TokenRenderer = React.forwardRef(
  TokenRendererComponent
);
