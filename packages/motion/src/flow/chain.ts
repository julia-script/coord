import {
  ThreadOf,
  Threadish,
  normalizeThreadsSet,
} from "@/utils";

export function* chain<
  TThreads extends Threadish
>(...threads: TThreads[]): ThreadOf<TThreads> {
  for (const thread of normalizeThreadsSet(
    threads
  )) {
    yield* thread;
  }
}
