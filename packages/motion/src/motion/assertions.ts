import {
  YieldedType,
  isObject,
} from "@coord/core";
import {
  ContextRequest,
  EndRequest,
  MakeStateRequest,
  MotionRequest,
  MotionState,
} from "./types";

export const isRequest = (
  value: unknown
): value is MotionRequest => {
  return isObject(value) && "type" in value;
};

export const isContextRequest = <
  TState extends MotionState
>(
  value: unknown
): value is YieldedType<
  ContextRequest<TState>
> => {
  return (
    isRequest(value) &&
    value.type === "REQUEST_CONTEXT"
  );
};

export const isMakeStateRequest = <
  TKey extends string,
  TValue
>(
  value: unknown
): value is MakeStateRequest<TKey, TValue> => {
  return (
    isRequest(value) &&
    value.type === "MAKE_STATE" &&
    "state" in value &&
    isObject(value.state) &&
    "key" in value.state &&
    "initialState" in value.state
  );
};

export const isEndRequest = (
  value: unknown
): value is EndRequest => {
  return (
    isRequest(value) &&
    value.type === "REQUEST_END"
  );
};
