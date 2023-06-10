import React from "react";
import { BBox, BBoxish } from "@/types";
import { normalizeBBox } from "@/utils";
import { UserHandlers, useGesture } from "@use-gesture/react";
import { Vec2, point } from "@coord/core";
import { withGraphContext, GraphElement } from "../utils";
import { useSafeRef } from "..";

const MAX_AXIS_SIZE = 10000;

const MIN_AXIS_SIZE = 0.025;

const scaleBBoxAroundOrigin = (
  bbox: BBox,
  { x, y }: Vec2,
  scale: number,
  { x: offsetX, y: offsetY }: Vec2 = point(0, 0)
) => {
  let { x: hMin, y: hMax } = bbox.horizontal;
  let { x: vMin, y: vMax } = bbox.vertical;
  hMin += offsetX;
  hMax += offsetX;

  vMin += offsetY;
  vMax += offsetY;
  return {
    horizontal: point(
      hMin * scale - x * scale + x,
      hMax * scale - x * scale + x
    ),
    vertical: point(vMin * scale - y * scale + y, vMax * scale - y * scale + y),
  };
};

type GestureProps<T extends keyof UserHandlers, TMemo = unknown> = {
  memo?: TMemo;
} & Omit<Parameters<UserHandlers[T]>[0], "memo">;

const Component = ({
  context,
  rawCoordBox,
  onCoordBoxChange,
}: GraphElement<{
  rawCoordBox: BBoxish;
  onCoordBoxChange: (coordBox: BBox) => void;
}>) => {
  const ref = useSafeRef<SVGRectElement>(null);
  const normalizedCoordBox = normalizeBBox(rawCoordBox);

  useGesture(
    {
      onDrag: ({
        down,
        movement,
        memo,
        first,
      }: GestureProps<"onDrag", BBox>) => {
        if (!down) return;
        if (first) {
          return normalizedCoordBox;
        }
        if (!memo) return;
        const { x, y } = context.unprojectSize(movement, "viewspace");

        onCoordBoxChange({
          horizontal: memo.horizontal.sub(point(x, x)),
          vertical: memo.vertical.sub(point(y, y)),
        });
      },
      onPinch: ({
        event,
        first,
        origin,
        movement: [s],
        memo,
      }: GestureProps<
        "onPinch",
        {
          scaleOrigin: Vec2;
          coordBox: BBox;
          position: Vec2;
        }
      >) => {
        if (!ref.current) return;
        event.preventDefault();
        if (first) {
          const { x, y } = ref.current.getBoundingClientRect();
          const scaleOrigin = context.unprojectCoord([
            origin[0] - x,
            origin[1] - y,
          ]);

          memo = {
            scaleOrigin,
            coordBox: normalizedCoordBox,
            position: point(...origin),
          };
        }
        if (!memo) return;
        const sensitivityFactor = 0.5;

        onCoordBoxChange(
          scaleBBoxAroundOrigin(
            memo.coordBox,
            memo.scaleOrigin,
            1 / s,
            context.unprojectSize(memo.position.sub(point(...origin)))
          )
        );
        return memo;
      },
    },
    {
      target: ref,
      drag: {
        enabled: !!onCoordBoxChange,
      },
      pinch: {
        enabled: !!onCoordBoxChange,
        pinchOnWheel: true,
        preventDefault: true,
        eventOptions: { passive: false },
        scaleBounds: (state) => {
          const { horizontal, vertical } = normalizedCoordBox;
          const s = state?.offset[0] || 1;
          const hSize = Math.abs(horizontal.x - horizontal.y) * s;
          const vSize = Math.abs(vertical.x - vertical.y) * s;

          return {
            max: Math.min(MAX_AXIS_SIZE / hSize, MAX_AXIS_SIZE / vSize),
            min: Math.max(MIN_AXIS_SIZE / hSize, MIN_AXIS_SIZE / vSize),
          };
        },
      },
    }
  );

  return (
    <rect
      ref={ref}
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={"transparent"}
      style={{
        touchAction: "none",
      }}
    />
  );
};

export const Navigation = withGraphContext(Component);
