import { Threadish } from "@/utils";
import { all } from "./all";
import { delay } from "./delay";
import { EasingOptions, applyEasing } from "@coord/core";

export type OffsetConfig =
  | number
  | { duration: number; easing?: EasingOptions };
export function* sequence<TThread extends Threadish[]>(
  offset: OffsetConfig,
  ...threads: TThread
) {
  const { duration, easing = "linear" } =
    typeof offset === "number" ? { duration: offset * threads.length } : offset;

  const delayedThreads = threads.map((thread, i) => {
    const start = duration * applyEasing(easing, i / threads.length);
    return delay(start, thread);
  }) as TThread;

  yield* all(...delayedThreads);
}
