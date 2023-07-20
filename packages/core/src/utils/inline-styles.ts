import { Nullable } from "@/types";
import { merge } from "lodash-es";
import { CSSProperties } from "react";

interface InlineStyles extends CSSProperties {
  [key: `--${string}`]: string | number;
}
export function inlined(
  ...args: Nullable<InlineStyles>[]
): CSSProperties {
  return Object.assign({}, ...args);
}
