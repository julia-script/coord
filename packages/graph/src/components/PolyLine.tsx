import React from "react";
import { useMemo } from "react";
import { WithGraphContext, renderNumber, withGraphContext } from "../utils";
import { Scalar } from "../types";
import { GraphPoint } from "@/types";

export type PolyLineProps = {
  points: GraphPoint[];
  strokeWidth?: Scalar;
  strokeColor?: number | string;
  strokeStyle?: "dotted" | "dashed" | "solid" | number[];
  style?: React.CSSProperties;
} & WithGraphContext;

const Component = ({
  points,
  strokeWidth = 1,
  strokeColor = 1,
  context,
  strokeStyle,
  style,
}: PolyLineProps) => {
  const { computeColor, projectCoord, projectAbsoluteSize } = context;

  const pathPoints = useMemo(
    () =>
      points.reduce((acc, point) => {
        const { x, y } = projectCoord(point);
        acc += `${renderNumber(x)},${renderNumber(y)} `;
        return acc;
      }, ""),
    [points, projectCoord]
  );

  return (
    <polyline
      style={style}
      points={pathPoints}
      stroke={computeColor(strokeColor)}
      strokeWidth={projectAbsoluteSize(strokeWidth, "viewspace")}
      fill="none"
      strokeDasharray={
        Array.isArray(strokeStyle) ? strokeStyle.join(" ") : undefined
      }
    />
  );
};

export const PolyLine = withGraphContext(Component);
