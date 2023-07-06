import React, { useMemo } from "react";
import {
  passContextToChildren,
  projectRadOnRect,
  withGraphContext,
} from "@/utils";
import { point, useSafeMemo } from "@coord/core";
import { ScalarPoint, Scalar } from "@/types";
import { Rect, RectProps } from "./Rect";
import { Line } from "./Line";

const cardinalMap = {
  n: Math.PI / 2,
  ne: Math.PI / 4,
  e: 0,
  se: -Math.PI / 4,
  s: -Math.PI / 2,
  sw: -Math.PI * 0.75,
  w: Math.PI,
  nw: Math.PI * 0.75,
} as const;

export type LabelContainerProps = {
  position?: ScalarPoint;
  target: ScalarPoint;
  size?: ScalarPoint;
  backgroundColor?: number | string;
  strokeColor?: number | string;
  strokeWidth?: Scalar;
  rotation?: number;
  direction?: number | keyof typeof cardinalMap;
  distance?: Scalar;
  targetOffset?: Scalar;
  displayBox?: boolean;

  arrowColor?: number | string;
  arrowSize?: Scalar;
  arrowStartOffset?: Scalar;
} & Omit<
  RectProps,
  "position" | "size" | "target"
> &
  React.PropsWithChildren;

const Component = ({
  position,
  size = point(70, 30),
  target = point(0, 0),
  direction = "n",
  distance = 50,
  context,
  targetOffset = 20,
  cornerRadius = 5,
  backgroundColor = "background",
  strokeColor = "body",

  strokeWidth = 2,
  children,

  arrowColor,
  arrowSize,
  arrowStartOffset,
  strokeDasharray,

  displayBox = true,

  ...rest
}: LabelContainerProps) => {
  const {
    projectCoord,
    projectAbsoluteSize,
    computeColor,
  } = context;
  const { x: tx, y: ty } = projectCoord(target);

  const { x: width, y: height } =
    projectAbsoluteSize(size, "viewspace");

  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const dist = projectAbsoluteSize(
    distance,
    "viewspace"
  );
  const directionRad = useSafeMemo(() => {
    if (position)
      return -projectCoord(position)
        .sub(projectCoord(target))
        .angle();
    return typeof direction === "number"
      ? direction
      : cardinalMap[direction];
  }, [direction, position, target]);

  const connectionPoint = projectRadOnRect(
    -directionRad,
    point(width, height)
  );
  const { x: cx, y: cy } = useMemo(() => {
    if (position) return projectCoord(position);
    const [cos, sin] = [
      Math.cos(directionRad),
      Math.sin(directionRad),
    ];

    const { x: dx, y: dy } = connectionPoint;
    let [x, y] = [tx + dx, ty + dy];
    [x, y] = [x + dist * cos, y + dist * -sin];

    return point(x, y);
  }, [
    position,
    projectCoord,
    connectionPoint,
    tx,
    ty,
    dist,
  ]);

  const x = cx - halfWidth;
  const y = cy - halfHeight;

  const theming = {
    strokeWidth: projectAbsoluteSize(
      strokeWidth,
      "viewspace"
    ),
    cornerRadius,
    strokeColor: computeColor(strokeColor),
    backgroundColor: computeColor(
      backgroundColor
    ),
    arrowColor: computeColor(
      arrowColor ?? strokeColor
    ),
  };

  return (
    <g {...rest}>
      <Line
        context={context}
        from={[
          `${cx - connectionPoint.x}vs`,
          `${cy - connectionPoint.y}vs`,
        ]}
        to={target}
        endOffset={projectAbsoluteSize(
          targetOffset,
          "viewspace"
        )}
        strokeColor={theming.arrowColor}
        strokeWidth={theming.strokeWidth}
        arrowSize={arrowSize}
        startOffset={arrowStartOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        arrow
      />
      {displayBox && (
        <Rect
          context={context}
          position={[`${x}vs`, `${y}vs`]}
          size={[`${width}vs`, `${height}vs`]}
          cornerRadius={cornerRadius}
          strokeColor={theming.strokeColor}
          fillColor={theming.backgroundColor}
          strokeWidth={theming.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
        />
      )}
      <g transform={`translate(${x} ${y})`}>
        {passContextToChildren(children, context)}
      </g>
    </g>
  );
};

export const LabelContainer =
  withGraphContext(Component);
