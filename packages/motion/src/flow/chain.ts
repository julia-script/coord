import { Threadish, normalizeThreadsSet } from "@/utils";

export function* chain<TThread extends Threadish[]>(...threads: TThread) {
  const iterables = normalizeThreadsSet(threads);
  for (const iterable of iterables) {
    yield* iterable;
  }
}
