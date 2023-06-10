import React from "react";
import { useMemo } from "react";
import { GraphElement, renderNumber, withGraphContext } from "@/utils";
import { ScalarPoint, Scalar } from "@/types";
import { useSafeMemo } from "..";
import { clamp } from "lodash-es";

export type PolyLineProps = {
  points: Readonly<ScalarPoint[]>;
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
  ...rest
}: PolyLineProps) => {
  const { computeColor, projectCoord, projectAbsoluteSize } = context;

  const pathPoints = useSafeMemo(
    () =>
      points.reduce((acc, point) => {
        const { x, y } = projectCoord(point);
        acc += `${renderNumber(clamp(x, -5000, 5000))},${renderNumber(
          clamp(y, -5000, 5000)
        )} `;
        return acc;
      }, ""),
    [points, projectCoord]
  );

  return (
    <polyline
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
