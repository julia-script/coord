import React from "react";
import { point } from "@coord/core";
import {
  GraphElement,
  withGraphContext,
} from "@/utils";
import { ScalarPoint, Scalar } from "@/types";

export type LineProps = GraphElement<
  {
    from?: ScalarPoint;
    to: ScalarPoint;
    strokeWidth?: Scalar;
    strokeColor?: number | string;
    arrow?: boolean;
    arrowSize?: Scalar;
    startOffset?: Scalar;
    endOffset?: Scalar;
  },
  Omit<
    React.SVGProps<SVGPathElement>,
    "from" | "to"
  >
>;

const Component = ({
  from = point(0, 0),
  to,
  strokeWidth = 2,
  strokeColor = 1,
  arrow = false,
  arrowSize = 10,
  context,
  startOffset = 0,
  endOffset = 0,
  ...rest
}: LineProps) => {
  const {
    projectCoord,
    projectAbsoluteSize,
    computeColor,
  } = context;

  let { x, y } = projectCoord(from);
  let { x: tx, y: ty } = projectCoord(to);
  const dir = Math.atan2(ty - y, tx - x);

  if (startOffset) {
    const offset = projectAbsoluteSize(
      startOffset,
      "viewspace"
    );

    x += Math.cos(dir) * offset;
    y += Math.sin(dir) * offset;
  }

  if (endOffset) {
    const offset = Math.abs(
      projectAbsoluteSize(endOffset, "viewspace")
    );

    tx -= Math.cos(dir) * offset;
    ty -= Math.sin(dir) * offset;
  }

  //check if line changed direction after adding offsets
  if (
    Math.abs(dir - Math.atan2(ty - y, tx - x)) >
    0.5
  ) {
    return null;
  }

  let d = `M ${x} ${y} L ${tx} ${ty}`;

  if (arrow) {
    let arrSize = projectAbsoluteSize(
      arrowSize,
      "viewspace"
    );
    if (String(arrowSize).endsWith("cs")) {
      arrSize *= 0.5;
    }

    const arrAngle = Math.PI / 4;
    const ax =
      tx - Math.cos(dir - arrAngle) * arrSize;
    const ay =
      ty - Math.sin(dir - arrAngle) * arrSize;

    const bx =
      tx - Math.cos(dir + arrAngle) * arrSize;
    const by =
      ty - Math.sin(dir + arrAngle) * arrSize;
    d += ` M${ax} ${ay} L ${tx} ${ty} L ${bx} ${by}`;
  }

  return (
    <path
      d={d}
      stroke={computeColor(strokeColor)}
      strokeWidth={projectAbsoluteSize(
        strokeWidth,
        "viewspace"
      )}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    />
  );
};

export const Line = withGraphContext(Component);
