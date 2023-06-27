import { isObject } from "@coord/core";
import {
  MotionContext,
  MotionContextSettings,
  MotionState,
  createMotionContext,
} from "./create-motion-context";
import { MotionScene } from "..";

export type YieldedType<T extends (...args: any) => any> =
  ReturnType<T> extends Generator<infer U, any, any> ? U : never;

export type MotionBuilderRequest<T extends MotionState> =
  | YieldedType<typeof requestContext<T>>
  | YieldedType<typeof requestTransition>
  | YieldedType<typeof requestPassTime>
  | YieldedType<typeof makeState>;

export const isMotionBuilderRequest = (
  value: unknown
): value is MotionBuilderRequest<MotionState> => {
  return isObject(value) && "type" in value;
};

export type MotionBuilder<TState extends MotionState> = (
  context: MotionContext<TState>
) => MotionBuilderGenerator<TState>;

export type MotionBuilderGenerator<TState extends MotionState> = Generator<
  MotionBuilderRequest<TState> | undefined,
  unknown,
  unknown
>;

export function* motionRunner<TState extends MotionState>(
  context: MotionContext<TState>,
  builder: MotionBuilder<TState>
) {
  const bulderIterator = builder(context);

  while (true) {
    const currentIteration = bulderIterator.next();

    if (isMotionBuilderRequest(currentIteration.value)) {
      if (currentIteration.value.type === "REQUEST_CONTEXT") {
        currentIteration.value.context = context;
        continue;
      }
      if (currentIteration.value.type === "REQUEST_PASS_TIME") {
        context.passTime(currentIteration.value.time);
        continue;
      }
    }
    if (currentIteration.done) {
      break;
    }

    context.pushFrame();
    yield context;
  }
}

export function createMotion<TState extends MotionState>(
  scene: MotionScene<TState>,
  contextSettings?: Partial<MotionContextSettings>
) {
  const context = createMotionContext<TState>(scene, contextSettings);
  const runner = motionRunner(context, scene.builder);
  return [context, runner] as const;
}

export function runScene<TState extends MotionState>(
  scene: MotionScene<TState>,
  contextSettings?: Partial<MotionContextSettings>
) {
  const [context, runner] = createMotion(scene, contextSettings);
  context.meta = {
    ...context.meta,
    ...scene.meta,
  };
  while (!runner.next().done) {
    continue;
  }

  return context;
}

export function* requestContext<TState extends MotionState>() {
  const request: {
    type: "REQUEST_CONTEXT";
    context?: MotionContext<TState>;
  } = {
    type: "REQUEST_CONTEXT" as const,
  };
  yield request;
  if (!request.context) {
    throw new Error("Context is not provided");
  }
  return request.context;
}

export function* requestTransition(duration?: number) {
  yield {
    type: "REQUEST_TRANSITION" as const,
    duration,
  };
}

export function* requestPassTime(time: number) {
  yield {
    type: "REQUEST_PASS_TIME" as const,
    time,
  };
}

export function* makeState<TKey extends string, TValue>(
  key: TKey,
  initialState: TValue
) {
  yield {
    type: "MAKE_STATE" as const,
    key,
    initialState,
  };
}
