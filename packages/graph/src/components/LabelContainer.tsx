import React, { useMemo } from "react";
import { Rect, RectProps } from "./Rect";
import { Line } from "./Line";
import {
  passContextToChildren,
  projectRadOnRect,
  withGraphContext,
} from "../utils";
import { point } from "@coord/core";

import { GraphPoint, Scalar } from "@/types";

const cardinalMap = {
  n: Math.PI / 2,
  ne: Math.PI / 4,
  e: 0,
  se: (3 * Math.PI) / 4,
  s: (3 * Math.PI) / 2,
  sw: (5 * Math.PI) / 4,
  w: Math.PI,
  nw: (7 * Math.PI) / 4,
};

export type LabelContainerProps = {
  position?: GraphPoint;
  target: GraphPoint;
  size?: GraphPoint;
  backgroundColor?: number | string;
  strokeColor?: number | string;
  strokeWidth?: Scalar;
  rotation?: number;
  direction?: number | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
  distance?: Scalar;
  targetOffset?: Scalar;

  arrowColor?: number | string;
  arrowSize?: Scalar;
  arrowStartOffset?: Scalar;
} & Omit<RectProps, "position" | "size" | "target"> &
  React.PropsWithChildren;

const Component = ({
  position,
  size = point(50, 100),
  target = point(0, 0),
  direction = "n",
  distance = 50,
  context,
  targetOffset = 10,
  cornerRadius = 5,
  backgroundColor = "background",
  strokeColor = "body",

  strokeWidth = 2,
  children,

  arrowColor,
  arrowSize,
  arrowStartOffset,

  ...rest
}: LabelContainerProps) => {
  const { projectCoord, projectAbsoluteSize, computeColor } = context;
  const { x: tx, y: ty } = projectCoord(target);

  let { x: width, y: height } = projectAbsoluteSize(size, "viewspace");

  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const dist = projectAbsoluteSize(distance, "viewspace");
  const directionRad =
    typeof direction === "number" ? direction : cardinalMap[direction];

  const connectionPoint = projectRadOnRect(-directionRad, point(width, height));
  const [cos, sin] = [Math.cos(directionRad), Math.sin(directionRad)];
  const { x: cx, y: cy } = useMemo(() => {
    if (position) return projectCoord(position);

    const { x: dx, y: dy } = connectionPoint;
    let [x, y] = [tx + dx, ty + dy];
    [x, y] = [x + dist * cos, y + dist * -sin];

    return point(x, y);
  }, [position, projectCoord, connectionPoint, tx, ty, dist, cos, sin]);

  const x = cx - halfWidth;
  const y = cy - halfHeight;

  const theming = {
    strokeWidth: projectAbsoluteSize(strokeWidth, "viewspace"),
    cornerRadius,
    strokeColor: computeColor(strokeColor),
    backgroundColor: computeColor(backgroundColor),
    arrowColor: computeColor(arrowColor ?? strokeColor),
  };

  return (
    <g>
      <Line
        context={context}
        from={[`${cx - connectionPoint.x}vs`, `${cy - connectionPoint.y}vs`]}
        to={target}
        endOffset={projectAbsoluteSize(targetOffset, "viewspace")}
        strokeColor={theming.arrowColor}
        strokeWidth={theming.strokeWidth}
        arrowSize={arrowSize}
        startOffset={arrowStartOffset}
        arrow
      />
      <Rect
        {...rest}
        context={context}
        position={[`${x}vs`, `${y}vs`]}
        size={[`${width}vs`, `${height}vs`]}
        cornerRadius={cornerRadius}
        strokeColor={theming.strokeColor}
        fillColor={theming.backgroundColor}
        strokeWidth={theming.strokeWidth}
      />
      <g transform={`translate(${x} ${y})`}>
        {passContextToChildren(children, context)}
      </g>
    </g>
  );
};

export const LabelContainer = withGraphContext(Component);
