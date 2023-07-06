import {
  MotionBuilder,
  MotionScene,
  isEndRequest,
  isRequest,
  makeState,
  requestContext,
  requestEnd,
  runMotion,
} from "@/motion";
import { InferThread, Thread } from "@/utils";
import { YieldedType, raise } from "@coord/core";

export function* scene<
  TKey extends string,
  TScene extends MotionScene<MotionBuilder>
>(key: TKey, scene: TScene, transition = 0) {
  const parentContext = yield* requestContext();

  const context = runMotion(scene, {
    ...parentContext.settings,
    transitionDuration: transition,
  });

  context.meta.start =
    parentContext.frames.length;
  parentContext.meta.scenes[key] = context.meta;
  const firstFrame = context.frames[0] ?? raise();
  const sceneState = yield* makeState<
    TKey,
    typeof firstFrame
  >(key, firstFrame);
  let hasRequestedNext = false;
  for (
    let i = 0;
    i < context.frames.length;
    i++
  ) {
    const frame = context.frames[i] ?? raise();

    if (!hasRequestedNext && frame.$done) {
      hasRequestedNext = true;
      yield* requestEnd();
    }

    yield sceneState.set(frame);
  }
  if (!hasRequestedNext) {
    yield* requestEnd();
  }
  sceneState.set((curr) => ({
    ...curr,
    $done: true,
  }));
}

export function movie<TThread extends Thread[]>(
  ...threads: TThread
) {
  return function* () {
    const activeScenes = new Set<
      TThread[number]
    >();
    const startNext = () => {
      const next = threads.shift();
      if (!next) return;
      activeScenes.add(next);
    };
    startNext();
    while (true) {
      for (const iterable of activeScenes) {
        while (true) {
          const { done, value } = iterable.next();
          if (isRequest(value)) {
            if (isEndRequest(value)) {
              startNext();
              continue;
            }
            yield value as YieldedType<
              InferThread<TThread[number]>
            >;
            continue;
          }
          if (done) {
            activeScenes.delete(iterable);
          }
          break;
        }
      }
      if (!activeScenes.size) break;

      yield;
    }
  };
}
