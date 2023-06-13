import { MotionBuilder, MotionContext, MotionState } from "@/context";

export type MotionBuilderish<TState extends MotionState> =
  | MotionBuilder<TState>
  | ReturnType<MotionBuilder<TState>>;

export function asIterable<TState extends MotionState>(
  iterable: MotionBuilderish<TState>,
  context: MotionContext<TState>
) {
  if (Symbol.iterator in iterable) {
    return iterable;
  }
  return iterable(context);
}
