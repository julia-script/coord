import { isFunction, isGenerator } from "@coord/core";

export type Thread = Generator<any, any, any>;
export type Threadish =
  | (() => Generator<any, any, any>)
  | Generator<any, any, any>;

export type InferThread<TThread extends Threadish> = TThread extends () => any
  ? ReturnType<TThread>
  : TThread;

export function normalizeThread<TThread extends Thread>(
  thread: TThread | (() => TThread)
) {
  return isFunction(thread) ? thread() : thread;
}

export function normalizeThreadsSet<TThreads extends Threadish>(
  threads: TThreads[]
) {
  return new Set(threads.map(normalizeThread)) as Set<InferThread<TThreads>>;
}
