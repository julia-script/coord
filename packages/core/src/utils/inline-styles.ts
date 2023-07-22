import { Nullable } from "@/types";
import { CSSProperties } from "react";

interface InlineStyles extends CSSProperties {
  [key: `--${string}`]: string | number;
}
export function inlined(
  ...args: Nullable<InlineStyles>[]
): CSSProperties {
  return Object.assign({}, ...args);
}
