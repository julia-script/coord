import {
  MotionBuilder,
  MotionBuilderRequest,
  MotionState,
  isMotionBuilderRequest,
  requestContext,
} from "@/context";
import { MotionBuilderish, asIterable } from "@/utils";
import { all } from "./all";
import { delay } from "./delay";
import { EasingOptions, applyEasing, isGeneratorFunction } from "@coord/core";

export function* sequence<TState extends MotionState>(
  offset:
    | number
    | {
        duration: number;
        easing?: EasingOptions;
      },
  ...threads: MotionBuilderish<TState>[]
): Generator<MotionBuilderRequest<TState> | undefined, void, unknown> {
  const { duration, easing = "linear" } =
    typeof offset === "number" ? { duration: offset * threads.length } : offset;

  yield* all<TState>(
    ...threads.map((thread, i) => {
      const start = duration * applyEasing(easing, i / threads.length);
      console.log(start);

      return delay(start, thread);
    })
  );
}
