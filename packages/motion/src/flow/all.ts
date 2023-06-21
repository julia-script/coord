import {
  MotionBuilder,
  MotionBuilderRequest,
  MotionState,
  isMotionBuilderRequest,
  requestContext,
  requestPassTime,
} from "@/context";
import { MotionBuilderish, asIterable } from "@/utils";

export function* all<TState extends MotionState>(
  ...threads: MotionBuilderish<TState>[]
) {
  const context = yield* requestContext<TState>();

  let threadIterables: (ReturnType<MotionBuilder<TState>> | null)[] =
    threads.map((thread) => asIterable<TState>(thread, context));
  while (true) {
    let passTime = 0;
    for (let i = 0; i < threadIterables.length; i++) {
      const thread = threadIterables[i];
      if (!thread) continue;
      while (true) {
        const { done, value } = thread.next();
        if (isMotionBuilderRequest(value)) {
          if (value.type === "REQUEST_PASS_TIME") {
            passTime = Math.max(passTime, value.time);
            continue;
          }
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
    if (passTime > 0) {
      yield* requestPassTime(passTime);
    }

    if (!threadIterables.length) break;
    yield;
  }
  return;
}
