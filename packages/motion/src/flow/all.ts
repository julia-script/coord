import {
  MotionBuilder,
  MotionBuilderRequest,
  MotionState,
  isMotionBuilderRequest,
  requestContext,
} from "@/context";
import { MotionBuilderish, asIterable } from "@/utils";

export function* all<TState extends MotionState>(
  ...threads: MotionBuilderish<TState>[]
) {
  const context = yield* requestContext<TState>();

  let threadIterables: (ReturnType<MotionBuilder<TState>> | null)[] =
    threads.map((thread) => asIterable<TState>(thread, context));
  while (true) {
    for (let i = 0; i < threadIterables.length; i++) {
      const thread = threadIterables[i];
      if (!thread) continue;
      while (true) {
        const { done, value } = thread.next();
        if (isMotionBuilderRequest(value)) {
          yield value as MotionBuilderRequest<TState>;
          continue;
        }
        if (done) {
          threadIterables[i] = null;
        }
        break;
      }
    }

    threadIterables = threadIterables.filter((x) => x !== null);
    if (!threadIterables.length) break;
    yield;
  }
  return;
}
