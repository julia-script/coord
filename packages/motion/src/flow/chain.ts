import { MotionState, requestContext } from "@/context";
import { MotionBuilderish, asIterable } from "@/utils";

export function* chain<TState extends MotionState>(
  ...threads: MotionBuilderish<TState>[]
) {
  const context = yield* requestContext<TState>();

  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i]!;

    const threadIterable = asIterable<TState>(thread, context);
    yield* threadIterable;
  }
}
