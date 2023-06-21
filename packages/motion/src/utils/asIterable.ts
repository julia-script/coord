import {
  MotionBuilder,
  MotionBuilderGenerator,
  MotionContext,
  MotionState,
} from "@/context";
import { isGenerator } from "@coord/core/dist";

export type MotionBuilderish<TState extends MotionState> =
  | MotionBuilder<TState>
  | MotionBuilderGenerator<TState>;

export function asIterable<TState extends MotionState>(
  iterable: MotionBuilderish<TState>,
  context: MotionContext<TState>
) {
  if (isGenerator(iterable)) {
    return iterable;
  }
  return iterable(context);
}
