import {
  EasingOptions,
  isFunction,
} from "@coord/core";
import { Control, Dispatcher } from "./control";
import {
  SpringParameters,
  spring,
  tween,
} from "@/tweening";
import { makeState } from "@/motion";

export class NumberControl extends Control<number> {
  to(value: Dispatcher<number>) {
    this._defer(value);
    return this;
  }
  in(duration: number, easing?: EasingOptions) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = self.get();
      const to = next();

      yield* tween(
        duration,
        (t) => self.set(from + (to - from) * t),
        easing
      );
    });
  }
  spring(parameters?: SpringParameters) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = self.get();
      const to = next();
      yield* spring(
        from,
        to,
        self.set,
        parameters
      );
    });
  }
}

export function controlNumber(
  getter: () => number,
  setter: (value: number) => void
) {
  return new NumberControl(getter, setter);
}

export function* makeNumberState<
  TKey extends string
>(key: TKey, initialState: number) {
  const control = yield* makeState(
    key,
    initialState
  );

  return new NumberControl(
    control._get,
    control._set
  );
}
