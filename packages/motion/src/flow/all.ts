import { isRequest } from "@/motion";
import {
  ThreadOf,
  Threadish,
  normalizeThreadsSet,
} from "@/utils";
import { YieldedType } from "@coord/core";

export function* all<TThreads extends Threadish>(
  ...threads: TThreads[]
) {
  const iterables =
    normalizeThreadsSet<TThreads>(threads);
  while (true) {
    for (const iterable of iterables) {
      while (true) {
        const { done, value } = iterable.next();

        if (isRequest(value)) {
          yield value as YieldedType<
            ThreadOf<TThreads>
          >;
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
