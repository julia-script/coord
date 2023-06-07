import { Point, point } from "@coord/core";
import { useMemo, useState, useCallback, useRef } from "react";
import { GraphContext, WithPointerEvents } from "../utils";
import { useSafeRef } from "./safe-server-hooks";

export type UseDraggableOptions = {
  context: GraphContext;
  onDragStart?: (e: DragEvent) => void;
  onDrag?: (e: DragEvent) => void;
  onDragEnd?: (e: DragEvent) => void;
};

export type DragEvent = {
  pointerEvent: React.PointerEvent;

  startCoord: Point;
  coordMovement: Point;
  currentCoord: Point;
  clientPosition: Point;
};
export const useDrag = ({
  context,
  onDragStart,
  onDrag,
  onDragEnd,
}: UseDraggableOptions) => {
  const dragEvent = useSafeRef<DragEvent | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as Element).setPointerCapture(e.pointerId);

      if (!context.ref?.current) return;

      const { x, y } = context.ref.current.getBoundingClientRect();

      const startCoord = context.unprojectCoord(
        point(e.clientX - x, e.clientY - y)
      );

      dragEvent.current = {
        pointerEvent: e,

        startCoord,
        coordMovement: point(0, 0),
        currentCoord: startCoord,
        clientPosition: point(e.clientX, e.clientY),
      };

      if (onDragStart) {
        onDragStart(dragEvent.current);
      }
    },
    [onDragStart]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragEvent.current) return;
      const unitVectorSize = context.projectSize(point(1, 1));
      const coordMovement = point(
        e.clientX - dragEvent.current.clientPosition.x,
        e.clientY - dragEvent.current.clientPosition.y
      ).div(unitVectorSize);

      dragEvent.current.coordMovement = coordMovement;
      dragEvent.current.clientPosition = point(e.clientX, e.clientY);
      dragEvent.current.currentCoord = point(
        dragEvent.current.currentCoord.x + coordMovement.x,
        dragEvent.current.currentCoord.y + coordMovement.y
      );
      dragEvent.current.pointerEvent = e;

      if (onDrag) {
        onDrag(dragEvent.current);
      }
    },
    [onDrag, dragEvent]
  );

  const onPointerUp = useCallback(
    (_: React.PointerEvent) => {
      if (!dragEvent.current) return;
      if (onDragEnd) {
        onDragEnd(dragEvent.current);
      }
      dragEvent.current = null;
    },
    [onDragEnd, dragEvent]
  );

  return { onPointerDown, onPointerMove, onPointerUp };
};
