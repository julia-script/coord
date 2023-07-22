import { isFunction } from "@coord/core";
import { MotionState } from "./types";
import type { MotionContext } from "./context";
import { control } from "@/controls/control";

export function* requestContext<
  TState extends MotionState
>() {
  const request: {
    type: "REQUEST_CONTEXT";
    context?: MotionContext<TState>;
  } = {
    type: "REQUEST_CONTEXT",
  };

  yield request;

  if (!request.context) {
    throw new Error("Context is not provided");
  }

  return request.context;
}

export function* requestEnd() {
  yield { type: "REQUEST_END" } as const;
}

export function* makeState<
  TKey extends string,
  TValue
>(key: TKey, initialState: TValue) {
  const context = yield* requestContext();
  yield {
    type: "MAKE_STATE",
    state: { key, initialState },
  } as const;

  const getter = () =>
    context._state[key] as TValue;
  const setter = (
    value: TValue | ((prev: TValue) => TValue)
  ) => {
    context._state[key] = isFunction(value)
      ? value(getter())
      : value;
  };
  return control(getter, setter);
}
