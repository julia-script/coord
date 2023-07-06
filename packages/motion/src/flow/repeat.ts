import {
  ThreadOf,
  Threadish,
  normalizeThread,
} from "@/utils";

export function* repeat<
  TThread extends Threadish
>(
  n: number,
  factory: (i: number) => TThread
): ThreadOf<TThread> {
  for (let i = 0; i < n; i++) {
    const thread = factory(i);
    yield* normalizeThread<TThread>(thread);
  }
}
