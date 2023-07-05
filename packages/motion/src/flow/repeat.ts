import { InferThread, Threadish, normalizeThread } from "@/utils";
import { wait } from "./wait";
import { YieldedType } from "@coord/core";

export function* repeat<TThread extends Threadish>(
  n: number,
  factory: (i: number) => TThread
): Generator<YieldedType<InferThread<TThread>>> {
  for (let i = 0; i < n; i++) {
    const thread = factory(i);

    yield* normalizeThread(thread);
  }
}

const test = repeat(3, (i) => wait(i));
