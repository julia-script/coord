import React from "react";
import { useMemo } from "react";
import { GraphElement, renderNumber, withGraphContext } from "@/utils";
import { GraphPoint, Scalar } from "@/types";

export type PolyLineProps = {
  points: Readonly<GraphPoint[]>;
  strokeWidth?: Scalar;
  strokeColor?: number | string;
  strokeStyle?: "dotted" | "dashed" | "solid" | number[];
} & GraphElement &
  Omit<React.SVGProps<SVGPolylineElement>, "points">;

const Component = ({
  points,
  strokeWidth = 1,
  strokeColor = 1,
  context,
  style,
  ...rest
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
      pointerEvents={"none"}
      strokeLinejoin="round"
      {...rest}
    />
  );
};

export const PolyLine = withGraphContext(Component);
