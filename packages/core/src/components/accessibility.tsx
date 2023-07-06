import React from "react";

export const screenReaderOnly: React.CSSProperties =
  {
    clip: "rect(1px, 1px, 1px, 1px)",
    overflow: "hidden",
    position: "absolute",
    width: 1,
    height: 1,
    whiteSpace: "nowrap",

    // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
  };

export function ScreenReaderOnly(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <div style={screenReaderOnly} {...props} />
  );
}
