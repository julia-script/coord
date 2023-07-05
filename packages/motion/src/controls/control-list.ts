import {
  EasingOptions,
  isFunction,
  isGenerator,
  isUndefined,
} from "@coord/core";
import { Control, Dispatcher } from "./control";
import {
  SpringParameters,
  spring,
  tween,
} from "@/tweening";
import { makeState } from "@/motion";
import {
  OffsetConfig,
  Threadish,
  sequence,
} from "..";

export class ControlList<TValue> extends Control<
  TValue[]
> {
  setAt(index: number, value: TValue) {
    this._defer((v) => {
      const next = [...v];
      next[index] = value;
      return next;
    });
    return this;
  }
  append(...values: TValue[]) {
    this._defer((v) => [...v, ...values]);
    return this;
  }
  prepend(...values: TValue[]) {
    this._defer((v) => [...values, ...v]);
    return this;
  }
  clear() {
    this._defer(() => []);
    return this;
  }
  removeAt(index: number) {
    this._defer((v) => {
      const next = [...v];
      next.splice(index, 1);
      return next;
    });
    return this;
  }

  map(
    fn: (value: TValue, index: number) => TValue
  ) {
    this._defer((v) => v.map(fn));
    return this;
  }
  fill(
    value: TValue,
    n: number,
    overwrite = false
  ) {
    this._defer((next) => {
      next = [...next];
      for (let i = 0; i < n; i++) {
        if (isUndefined(next[i]) || overwrite) {
          next[i] = value;
        }
      }
      return next;
    });
    return this;
  }
  appendFill(value: TValue, n: number) {
    this._defer((v) => [
      ...v,
      ...new Array(n).fill(value),
    ]);
    return this;
  }

  tweenAt(
    duration: number,
    index: number | ((list: TValue[]) => number),
    fn: (
      t: number,
      initialValue?: TValue
    ) => TValue,
    easing?: EasingOptions
  ) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = next();
      const i = isFunction(index)
        ? index(from)
        : index;
      const initialValue = from[i];

      yield* tween(
        duration,
        (t) => {
          const list = self.get();
          const next = [...list];
          next[i] = fn(t, initialValue);
          self.set(next);
        },
        easing
      );
    });
  }
  tweenLast(
    duration: number,
    fn: (
      t: number,
      initialValue?: TValue
    ) => TValue,
    easing?: EasingOptions
  ) {
    return this.tweenAt(
      duration,
      (list) => list.length - 1,
      fn,
      easing
    );
  }
  tweenFirst(
    duration: number,
    fn: (
      t: number,
      initialValue?: TValue
    ) => TValue,
    easing?: EasingOptions
  ) {
    return this.tweenAt(duration, 0, fn, easing);
  }

  // sequence(
  //   offset: OffsetConfig,
  //   factory:
  //     | TValue
  //     | ((index: number) => TValue)
  //     |
  // ) {
  //   // sequence()
  //   const self = this;
  // }
  tweenAppend(
    duration: number,
    n: number,
    factory: TValue | ((index: number) => TValue),
    easing?: EasingOptions
  ) {
    let last = -1;
    return this.tween(
      duration,
      (t, initialState) => {
        const from = initialState.length;
        const list = this.get();
        const i = Math.floor(from + n * t);
        if (i <= last) return list;
        const next = [...list];
        last = i;
        next[i] = isFunction(factory)
          ? factory(i)
          : factory;
        return next;
      },
      easing
    );
  }

  tweenMap(
    duration: number,
    fn: (
      t: number,
      initialValue: TValue,
      list: TValue[]
    ) => TValue,
    easing?: EasingOptions
  ) {
    return this.tween(
      duration,
      (t, from) =>
        from.map((v) => fn(t, v, from)),
      easing
    );
  }

  sequence<TThread extends Threadish>(
    duration: number,
    factory: (
      control: Control<TValue, TValue>,
      initialValue: TValue,
      index: number
    ) => TThread,
    easing?: EasingOptions
  ) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = next();
      self.set(from);
      yield* sequence<TThread[]>(
        {
          duration,
          easing: easing,
        },
        ...self
          .get()
          .map((initialValue, index) => {
            const control = new Control(
              () => self.get()[index] as TValue,
              (value) => {
                const next = [...self.get()];
                next[index] = value;
                self.set(next);
              }
            );

            return factory(
              control,
              initialValue,
              index
            );
          })
      );
    });
  }

  // to(value: Dispatcher<TValue>) {
  //   this._defer(value);
  //   return this;
  // }
  // in(duration: number, easing?: EasingOptions) {
  //   const self = this;
  //   return this._applyDeferred(function* (next) {
  //     const from = self.get();
  //     const to = next();
  //     yield* tween(duration, (t) => self.set(from + (to - from) * t), easing);
  //   });
  // }
  // spring(parameters?: SpringParameters) {
  //   const self = this;
  //   return this._applyDeferred(function* (next) {
  //     const from = self.get();
  //     const to = next();
  //     yield* spring(from, to, self.set, parameters);
  //   });
  // }
}

export function controlList<TValue>(
  getter: () => TValue[],
  setter: (value: TValue[]) => void
) {
  return new ControlList(getter, setter);
}

export function* makeListState<
  TValue,
  TKey extends string
>(key: TKey, initialState: TValue[]) {
  const control = yield* makeState<
    TKey,
    TValue[]
  >(key, initialState);

  return new ControlList<TValue>(
    control._get,
    control._set
  );
}
