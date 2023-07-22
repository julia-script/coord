import React from "react";

import {
  GraphElement,
  withGraphContext,
} from "@/utils";
import { ScalarPoint, Scalar } from "@/types";

export type CircleProps = GraphElement<
  {
    position: ScalarPoint;
    radius?: Scalar;
    fillColor?: number | string;
    strokeColor?: number | string;
    rotation?: number;
    cornerRadius?: Scalar;
    strokeWidth?: Scalar;
  },
  Omit<
    React.SVGProps<SVGCircleElement>,
    "fill" | "radius"
  >
>;

const Component = ({
  position,
  radius = 1,
  strokeWidth = 2,
  fillColor = "none",
  strokeColor = 0,
  context,
  ...rest
}: CircleProps) => {
  const {
    projectCoord,
    projectAbsoluteSize,
    computeColor,
  } = context;
  const { x, y } = projectCoord(position);
  const projectedRadius = projectAbsoluteSize(
    radius,
    "coordspace"
  );

  const fill = computeColor(fillColor);

  return (
    <circle
      r={projectedRadius}
      cx={x}
      cy={y}
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

export const Circle = withGraphContext(Component);
