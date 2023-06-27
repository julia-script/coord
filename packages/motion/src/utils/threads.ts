import { isGenerator } from "@coord/core";

export type Thread = Generator<unknown, unknown, unknown>;
export type Threadish =
  | Generator<unknown, unknown, unknown>
  | (() => Generator<unknown, unknown, unknown>);

export type InferThread<TThread extends Threadish> = TThread extends () => any
  ? ReturnType<TThread>
  : TThread;

export function normalizeThread<TThread extends Threadish>(thread: TThread) {
  const out = isGenerator(thread) ? thread : thread();
  return out;
}

export function normalizeThreadsSet<TThreads extends Threadish[]>(
  threads: TThreads
) {
  return new Set(threads.map(normalizeThread)) as Set<
    InferThread<TThreads[number]>
  >;
}
