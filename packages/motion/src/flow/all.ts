import { isRequest } from "@/motion";
import { InferThread, Threadish, normalizeThreadsSet } from "@/utils";
import { YieldedType } from "@coord/core";

export function* all<TThread extends Threadish[]>(...threads: TThread) {
  const iterables = normalizeThreadsSet(threads);
  while (true) {
    for (const iterable of iterables) {
      while (true) {
        const { done, value } = iterable.next();
        if (isRequest(value)) {
          yield value as YieldedType<InferThread<TThread[number]>>;
          continue;
        }
        if (done) {
          iterables.delete(iterable);
        }
        break;
      }
    }
    if (!iterables.size) break;
    /* TODO: passTime */
    yield;
  }
}
