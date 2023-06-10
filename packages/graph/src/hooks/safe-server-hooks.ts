import { isFunction, uniqueId } from "lodash-es";
import React from "react";

const noop = () => {
  // do nothing
};

export const isServerComponent = typeof React.useState === "undefined";

export const useSafeState: typeof React.useState = <S>(
  initialState?: S | (() => S)
) => {
  if (isServerComponent) {
    return [isFunction(initialState) ? initialState() : initialState, noop];
  }

  const [state, setState] = React.useState(initialState);

  return [state, setState];
};

export const useSafeEffect: typeof React.useEffect = (effect, deps) => {
  if (isServerComponent) {
    return;
  }

  React.useEffect(effect, deps);
};

export const useSafeLayoutEffect: typeof React.useEffect = (effect, deps) => {
  if (isServerComponent) {
    return;
  }

  React.useEffect(effect, deps);
};

export const useSafeRef: typeof React.useRef = <T>(initialValue?: T | null) => {
  if (isServerComponent) {
    return {
      current: initialValue,
    };
  }

  return React.useRef(initialValue);
};

export const useSafeMemo: typeof React.useMemo = (factory, deps) => {
  if (isServerComponent) {
    return factory();
  }

  return React.useMemo(factory, deps);
};

export const useSafeCallback: typeof React.useCallback = (callback, deps) => {
  if (isServerComponent) {
    return callback;
  }

  return React.useCallback(callback, deps);
};

export const useSafeId = (prefix: string) => {
  if (isServerComponent) {
    return `${prefix}-${uniqueId()}`;
  }
  return `${prefix}-${React.useId()}`;
};
// TODO: useSafeContext
