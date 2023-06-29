import {
  InferThread,
  Threadish,
  normalizeThread,
  normalizeThreadsSet,
} from "@/utils";
import { YieldedType, isFunction } from "@coord/core/dist";
import { wait } from "./wait";

export function* chain<TThreads extends Threadish[]>(
  ...threads: TThreads
): Generator<YieldedType<TThreads[number]> | undefined> {
  for (const thread of normalizeThreadsSet(threads)) {
    yield* thread;
  }
}
