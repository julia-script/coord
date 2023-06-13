import { MotionState } from "@/context";
import { chain } from "./chain";
import { wait } from "./wait";
import { MotionBuilderish } from "@/utils";

export function* delay<TState extends MotionState>(
  time: number,
  ...threads: MotionBuilderish<TState>[]
) {
  yield* chain<TState>(wait(time), ...threads);
}
