import { Point, Pointish } from "@coord/core";
import { useState, useCallback } from "react";
import { WithPointerEvents } from "../utils";
import { useDraggable, DragEvent } from "./useDraggable";

export const useCoord = (
  initial: Pointish
): WithPointerEvents & { position: Point } => {
  const [point, setPoint] = useState(Point.fromPointish(initial));

  const events = useDraggable({
    onDrag: useCallback(
      (e: DragEvent) => {
        const movement = e.coordMovement;

        setPoint((prev) => prev.add(movement));
      },
      [setPoint]
    ),
  });

  return {
    position: point,
    ...events,
  };
};
