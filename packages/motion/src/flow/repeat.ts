import { MotionState, requestContext } from "@/context";
import { MotionBuilderish, asIterable } from "@/utils";

export function* repeat<TState extends MotionState>(
  n: number,
  factory: (i: number) => MotionBuilderish<TState>
) {
  const context = yield* requestContext<TState>();

  for (let i = 0; i < n; i++) {
    yield* asIterable<TState>(factory(i), context);
  }
}
