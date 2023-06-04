import { Point, point } from "@curves/core";
import { useMemo, useState, useCallback } from "react";
import { GraphContext, WithPointerEvents } from "../utils";

export type UseDraggableOptions = {
  onDragStart?: (e: DragEvent, context: GraphContext) => void;
  onDrag?: (e: DragEvent, context: GraphContext) => void;
  onDragEnd?: (e: DragEvent, context: GraphContext) => void;
};

export type DragEvent = {
  pointerEvent: React.PointerEvent;
  graph: GraphContext;
  startCoord: Point;
  coordMovement: Point;
  currentCoord: Point;
  clientPosition: Point;
};
export const useDraggable = ({
  onDragStart,
  onDrag,
  onDragEnd,
}: UseDraggableOptions = {}): WithPointerEvents => {
  const [dragEvent, setDragEvent] = useState<DragEvent | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, graph: GraphContext) => {
      (e.target as Element).setPointerCapture(e.pointerId);

      if (!graph.ref?.current) return;

      const { x, y } = graph.ref.current.getBoundingClientRect();

      const startCoord = graph.unprojectCoord(
        point(e.clientX - x, e.clientY - y)
      );
      const dragEvent = {
        pointerEvent: e,
        graph,
        startCoord,
        coordMovement: point(0, 0),
        currentCoord: startCoord,
        clientPosition: point(e.clientX, e.clientY),
      };
      setDragEvent(dragEvent);
      if (onDragStart) {
        onDragStart(dragEvent, graph);
      }
    },
    [onDragStart, setDragEvent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent, graph: GraphContext) => {
      if (!dragEvent) return;
      const unitVectorSize = graph.projectSize(point(1, 1));
      const coordMovement = point(
        e.clientX - dragEvent.clientPosition.x,
        e.clientY - dragEvent.clientPosition.y
      ).div(unitVectorSize);

      /**
       * I know, I know, we should never mutate state directly, unless..
       *
       * Kidding, we want to reuse the same event object kinda like synthetic events do.
       * but not necessarily when it moves, we leave that to be handled by the hook consumer
       *
       * Why not use a ref you ask?
       * Because we want to trigger rerender when drag starts and ends.
       * We could also leave that to be handled by the hook consumer too,
       * but I think it's more convenient to have it here, despite the unsafe pattern.
       *
       */
      dragEvent.coordMovement = coordMovement;
      dragEvent.clientPosition = point(e.clientX, e.clientY);
      dragEvent.currentCoord = point(
        dragEvent.currentCoord.x + coordMovement.x,
        dragEvent.currentCoord.y + coordMovement.y
      );
      dragEvent.pointerEvent = e;

      if (onDrag) {
        onDrag(dragEvent, graph);
      }
    },
    [onDrag, dragEvent]
  );

  const onPointerUp = useCallback(
    (_: React.PointerEvent, graph: GraphContext) => {
      if (!dragEvent) return;
      if (onDragEnd) {
        onDragEnd(dragEvent, graph);
      }
      setDragEvent(null);
    },
    [onDragEnd, setDragEvent, dragEvent]
  );

  return useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      isDragging: !!dragEvent,
      interactable: true,
    }),
    [onPointerDown, onPointerMove, onPointerUp, dragEvent]
  );
};
