import {
  YieldedType,
  isFunction,
} from "@coord/core";

export type Thread = Generator<
  unknown,
  unknown,
  unknown
>;
export type Threadish =
  | (() => Generator<unknown, unknown, unknown>)
  | Generator<unknown, unknown, unknown>;

export type InferThread<
  TThread extends Threadish
> = TThread extends () => unknown
  ? ReturnType<TThread>
  : TThread;

export type ThreadOf<
  T extends Threadish,
  TReturn = undefined
> = Generator<
  YieldedType<InferThread<T>>,
  TReturn,
  unknown
>;

export function normalizeThread<
  TThread extends Threadish
>(thread: TThread | (() => TThread)) {
  return (
    isFunction(thread) ? thread() : thread
  ) as ThreadOf<TThread>;
}

export function normalizeThreadsSet<
  TThreads extends Threadish
>(threads: TThreads[]) {
  return new Set(
    threads.map(normalizeThread)
  ) as Set<ThreadOf<TThreads>>;
}
