import React, {
  CSSProperties,
  ComponentProps,
} from "react";
import { Theme, computeStyles } from "..";

export const CodePre = ({
  style = {},
  theme,
  lineHeight = 1.7,
  displayBackground,
  children,

  ...props
}: {
  displayBackground: boolean;
  lineHeight?: number | string;
  theme: Theme;
} & ComponentProps<"pre">) => {
  let lh = style.lineHeight ?? lineHeight;
  if (typeof lh === "number") {
    lh = `${lh}em`;
  }
  return (
    <pre
      style={
        {
          ...(displayBackground
            ? computeStyles(theme, ["background"])
            : {}),
          lineHeight: lh,
          "--tkn-line-height": lh,
          counterReset: "line",
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </pre>
  );
};
