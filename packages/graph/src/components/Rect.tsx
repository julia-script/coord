import React from "react";
import { point } from "@coord/core";
import { GraphElement, withGraphContext } from "../utils";
import { Scalar } from "../types";
import { GraphPoint } from "@/types";

export type RectProps = {
  position: GraphPoint;
  size?: GraphPoint;
  fillColor?: number | string;
  strokeColor?: number | string;
  rotation?: number;
  cornerRadius?: Scalar;
  strokeWidth?: Scalar;
  interactable?: boolean;
} & GraphElement &
  Omit<React.SVGProps<SVGRectElement>, "fill">;

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
  const { projectCoord, projectSize, projectAbsoluteSize, computeColor } =
    context;
  const { x, y } = projectCoord(position);
  let radius = projectAbsoluteSize(cornerRadius, "viewspace");
  if (String(cornerRadius).endsWith("cs")) {
    radius /= 2;
  }
  const { x: width, y: height } = projectSize(size);
  const fill = computeColor(fillColor);

  return (
    <rect
      rx={radius}
      x={Math.min(x, x + width)}
      y={Math.min(y, y + height)}
      width={Math.abs(width)}
      height={Math.abs(height)}
      fill={fill}
      strokeWidth={projectAbsoluteSize(strokeWidth, "viewspace")}
      stroke={computeColor(strokeColor)}
      pointerEvents={"none"}
      {...rest}
    />
  );
};

export const Rect = withGraphContext(Component);
