import React from "react";
import { BBox, BBoxish, normalizeBBox } from "@/types";
import { useGesture } from "@use-gesture/react";
import { point } from "@coord/core";
import { withGraphContext, GraphElement } from "../utils";

const Component = ({
  context,
  rawCoordBox,
  onCoordBoxChange,
}: GraphElement<{
  rawCoordBox: BBoxish;
  onCoordBoxChange: (coordBox: BBox) => void;
}>) => {
  const bind = useGesture(
    {
      onDrag: ({ down, movement, memo, first }) => {
        if (!down) return;
        if (first) {
          return normalizeBBox(rawCoordBox);
        }
        if (!memo) return;
        const { x, y } = context.unprojectSize(movement, "viewspace");

        onCoordBoxChange({
          horizontal: memo.horizontal.sub(point(x, x)),
          vertical: memo.vertical.sub(point(y, y)),
        });
      },
    },
    {
      drag: {
        enabled: !!onCoordBoxChange,
      },
    }
  );

  return (
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={"transparent"}
      style={{
        touchAction: "none",
      }}
      {...bind()}
    />
  );
};

export const Navigation = withGraphContext(Component);
