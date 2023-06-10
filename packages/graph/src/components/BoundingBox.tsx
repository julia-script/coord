import React from "react";
import { withGraphContext } from "@/utils";
import { BBoxish } from "@/types";
import { normalizeBBox } from "@/utils";
import { Rect, RectProps } from "./Rect";

export type BoundingBoxProps = {
  bbox: BBoxish;
} & Omit<RectProps, "position" | "size" | "bbox">;

const Component = ({ bbox, ...rest }: BoundingBoxProps) => {
  const { horizontal, vertical } = normalizeBBox(bbox);
  const { x: left, y: right } = horizontal;
  const { x: top, y: bottom } = vertical;
  return (
    <Rect
      size={[right - left, bottom - top]}
      position={[left, top]}
      {...rest}
    />
  );
};

export const BoundingBox = withGraphContext(Component);
