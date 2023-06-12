import React from "react";
import { withGraphContext } from "@/utils";
import { Scalar, ScalarPoint } from "@/types";
import { Text } from "./Text";
import { point } from "@coord/core";
import { PolyLine, PolyLineProps } from "./PolyLine";

export type RulerProps = {
  from?: ScalarPoint;
  to: ScalarPoint;
  offset?: Scalar;
  children?: string;
  alwaysOnTop?: boolean;
  labelPosition?: "top" | "bottom" | "auto";
} & Omit<PolyLineProps, "offset" | "from" | "points">;

const Component = ({
  from = point(0, 0),
  to,
  offset = 25,
  context,
  strokeColor = 1,
  children,
  labelPosition = "top",

  ...rest
}: RulerProps) => {
  const {
    unprojectCoord,
    projectCoord,
    unprojectSize,
    projectSize,
    computeColor,
  } = context;

  const fromCoord = unprojectCoord(from, "coordspace");
  const toCoord = unprojectCoord(to, "coordspace");

  let offsetVec = toCoord
    .sub(fromCoord)
    .normalize()
    .normal()
    .scale(unprojectSize(offset, "viewspace"));

  let projectedOffsetVec = projectSize(offsetVec);
  let multiplier = 1;

  if (labelPosition !== "auto") {
    if (labelPosition === "top" && projectedOffsetVec.y > 0) {
      multiplier = -1;
    }

    if (labelPosition === "bottom" && projectedOffsetVec.y <= 0) {
      multiplier = -1;
    }
    offsetVec = offsetVec.scale(multiplier);
    projectedOffsetVec = projectedOffsetVec.scale(multiplier);
  }

  const rulerFrom = fromCoord.add(offsetVec);
  const rulerTo = toCoord.add(offsetVec);
  const rulerCenter = rulerFrom.add(rulerTo).scale(0.5);
  let rotation = Math.atan2(toCoord.y - fromCoord.y, toCoord.x - fromCoord.x);

  // Adjust rotation of the labe so text is never upside down
  if (rotation >= Math.PI / 2 || rotation <= -Math.PI / 2) {
    rotation += Math.PI;
  }

  const projectedCenter = projectCoord(rulerCenter);

  return (
    <g>
      <PolyLine
        points={[fromCoord, rulerFrom, rulerTo, toCoord]}
        context={context}
        strokeDasharray={"5 5"}
        strokeColor={strokeColor}
        {...rest}
      />
      <Text
        position={rulerCenter}
        context={context}
        color={computeColor(strokeColor)}
        dy={`${projectedOffsetVec.y > 0 ? 1 : -1}em`}
        transform={`rotate(${(-rotation * 180) / Math.PI} ${
          projectedCenter.x
        } ${projectedCenter.y})`}
      >
        {children}
      </Text>
    </g>
  );
};

export const Ruler = withGraphContext(Component);
