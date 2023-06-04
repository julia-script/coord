import { GraphContext } from "./graphContext";

type Handler = (e: React.PointerEvent, context: GraphContext) => void;

export type PointerEvents = {
  onPointerMove?: Handler;
  onPointerDown?: Handler;
  onPointerUp?: Handler;
};
export type WithPointerEvents = {
  interactable?: boolean;
  isDragging?: boolean;
} & PointerEvents;

export const mapPointerEvent =
  (graph: GraphContext, handler?: Handler) => (e: React.PointerEvent) => {
    if (handler) {
      handler(e, graph);
    }
  };
