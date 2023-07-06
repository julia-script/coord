import React, { ComponentProps } from "react";
import { point } from "@coord/core";
import {
  GraphElement,
  withGraphContext,
} from "@/utils";
import { ScalarPoint, Scalar } from "@/types";

export type RectProps = GraphElement<
  {
    position: ScalarPoint;
    size?: ScalarPoint;
    fillColor?: number | string;
    strokeColor?: number | string;
    rotation?: number;
    cornerRadius?: Scalar;
    strokeWidth?: Scalar;
    interactable?: boolean;
  },
  Omit<ComponentProps<"rect">, "fill">
>;

const Component = ({
  position,
  size = point(1, 1),
  strokeWidth = 2,
  fillColor = "none",
  strokeColor = 0,
  cornerRadius = 0,
  context,
  ...rest
}: RectProps) => {
  const {
    projectCoord,
    projectSize,
    projectAbsoluteSize,
    computeColor,
  } = context;
  const { x, y } = projectCoord(position);
  let radius = projectAbsoluteSize(
    cornerRadius,
    "viewspace"
  );
  if (String(cornerRadius).endsWith("cs")) {
    radius /= 2;
  }
  const { x: width, y: height } =
    projectSize(size);
  const fill = computeColor(fillColor);

  return (
    <rect
      rx={radius}
      x={Math.min(x, x + width)}
      y={Math.min(y, y + height)}
      width={Math.abs(width)}
      height={Math.abs(height)}
      fill={fill}
      strokeWidth={projectAbsoluteSize(
        strokeWidth,
        "viewspace"
      )}
      stroke={computeColor(strokeColor)}
      pointerEvents={"none"}
      {...rest}
    />
  );
};

export const Rect = withGraphContext(Component);
