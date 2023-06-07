import React from "react";

import { withGraphContext, GraphElement } from "../utils";
import { BBox, BBoxish, normalizeBBox } from "@/types";
import { useDrag } from "@/hooks/useDrag";
import { point } from "@coord/core/dist";

const Component = ({
  context,
  rawCoordBox,
  onCoordBoxChange,
}: GraphElement<{
  rawCoordBox: BBoxish;
  onCoordBoxChange: (coordBox: BBox) => void;
}>) => {
  const coordBoxRef = React.useRef<BBox>(normalizeBBox(rawCoordBox));
  const events = useDrag({
    context,
    onDrag: ({ coordMovement: { x, y } }) => {
      coordBoxRef.current = {
        horizontal: coordBoxRef.current.horizontal.sub(point(x, x)),
        vertical: coordBoxRef.current.vertical.sub(point(y, y)),
      };
      onCoordBoxChange(coordBoxRef.current);
    },
  });
  return (
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={"transparent"}
      {...events}
    />
  );
};

export const Navigation = withGraphContext(Component);
