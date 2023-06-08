import { isFunction } from "lodash-es";
import { useEffect, useRef, useState } from "react";

const noop = () => {
  // do nothing
};

export const isServerComponent = typeof useState === "undefined";

export const useSafeState: typeof useState = <S>(
  initialState?: S | (() => S)
) => {
  if (isServerComponent) {
    return [isFunction(initialState) ? initialState() : initialState, noop];
  }

  const [state, setState] = useState(initialState);

  return [state, setState];
};

export const useSafeEffect: typeof useEffect = (effect, deps) => {
  if (isServerComponent) {
    return;
  }

  useEffect(effect, deps);
};

export const useSafeLayoutEffect: typeof useEffect = (effect, deps) => {
  if (isServerComponent) {
    return;
  }

  useEffect(effect, deps);
};

export const useSafeRef: typeof useRef = <T>(initialValue?: T | null) => {
  if (isServerComponent) {
    return {
      current: initialValue,
    };
  }

  return useRef(initialValue);
};

// TODO: useSafeContext
