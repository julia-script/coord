import { Threadish } from "@/utils";
import { wait } from "./wait";
import { chain } from "./chain";

export function* delay<TThread extends Threadish>(
  time: number,
  ...threads: TThread[]
) {
  const delayedThreads = [wait(time), ...threads];
  yield* chain(...delayedThreads);
}
