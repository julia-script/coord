import React, { ComponentProps } from "react";
import {
  Token,
  computeStyles,
} from "@coord/code-motion";
import { line } from "./styles.module.css";

export type LineRendererProps =
  {} & ComponentProps<"span">;

export function LineRenderer({
  ...props
}: LineRendererProps) {
  return (
    <span className={line} {...props}></span>
  );
}
