import { MotionBuilder, MotionState, requestContext } from "@/context";
import { tween } from "@/tweening";
import {
  EasingOptions,
  KPaths,
  VPaths,
  isFunction,
  isGenerator,
  isUndefined,
} from "@coord/core";
import { Control } from "./control";
import { MotionBuilderish, all, sequence } from "..";

type Factory<TState extends MotionState, TValue> =
  | ((
      index: number,
      control: Control<TState, TValue>
    ) => MotionBuilderish<TState>)
  | ((index: number, control: Control<TState, TValue>) => TValue)
  | TValue;

export class ListControl<TState extends MotionState, TValue> extends Control<
  TState,
  Array<TValue>
> {
  assertType(value: unknown): asserts value is number {
    if (!Array.isArray(value)) {
      throw new Error(`Expected  array, got ${typeof value}`);
    }
  }

  *tweenAt(
    index: number,
    fn: (t: number, initialValue: TValue) => TValue,
    duration: number,
    easing?: EasingOptions
  ) {
    const initialValue = this.get()[index];
    if (initialValue === undefined) {
      return;
    }

    yield* tween<TState>(
      duration,
      (t) => {
        const list = this.get();
        const next = [...list];
        next[index] = fn(t, initialValue);
        this.set(next);
      },
      easing
    );
  }
  setAt(index: number, value: TValue) {
    this.defer((v) => {
      const next = [...v];
      next[index] = value;
      return next;
    });
    return this;
  }
  append(...values: TValue[]) {
    this.defer((v) => [...v, ...values]);
    return this;
  }
  prepend(...values: TValue[]) {
    this.defer((v) => [...values, ...v]);
    return this;
  }
  clear() {
    this.defer(() => []);
    return this;
  }
  removeAt(index: number) {
    this.defer((v) => {
      const next = [...v];
      next.splice(index, 1);
      return next;
    });
    return this;
  }
  map(fn: (value: TValue, index: number) => TValue) {
    this.defer((v) => v.map(fn));
    return this;
  }
  fill(value: TValue, n: number, overwrite = false) {
    this.defer((next) => {
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
    this.defer((v) => [...v, ...new Array(n).fill(value)]);
    return this;
  }

  *tweenLast(
    fn: (t: number, initialValue: TValue) => TValue,
    duration: number,
    easing?: EasingOptions
  ) {
    const lastIndex = this.get().length - 1;
    yield* this.tweenAt(lastIndex, fn, duration, easing);
  }

  // *tweenAppend(
  //   value: TValue,
  //   fn: (t: number, initialValue: TValue) => TValue,
  //   duration: number,
  //   easing?: EasingOptions
  // ) {
  //   this.append(value);

  //   this.set([...this.get(), value]);

  //   const index = this.get().length - 1;

  //   yield* tween<TState>(
  //     duration,
  //     (t) => {
  //       const list = this.get();
  //       const next = [...list];
  //       next[index] = fn(t, value);
  //       this.set(next);
  //     },
  //     easing
  //   );
  // }

  private getGens(
    start: number,
    end: number,
    factory: Factory<TState, TValue>
  ) {
    const gen: MotionBuilderish<TState>[] = [];
    for (let i = start; i < end; i++) {
      const value = isFunction(factory)
        ? factory(
            i,
            new Control<TState, TValue>(this.context, this.key + `.${i}`)
          )
        : factory;

      if (isFunction(value) || isGenerator(value)) {
        const builder = value;
        gen.push(builder);
      } else {
        const self = this;
        gen.push(function* () {
          self.setAt(i, value);
          yield* self.do();
        });
      }
    }
    return gen;
  }

  /**
   *
   * list.sequenceAppend(3, 1, (i) => ({ v: i }))
   * list.sequenceAppend(3, 1, { v: 1})
   * list.sequenceAppend(3, 1, () => chain(wait(2), list.as({ v: 1})))
   */
  *tweenAppend(
    n: number,
    duration: number,
    factory: Factory<TState, TValue>,
    easing?: EasingOptions
  ) {
    const length = this.get().length;

    yield* sequence<TState>(
      {
        duration,
        easing,
      },
      ...this.getGens(length, length + n, factory)
    );
  }
  *tweenEach(
    duration: number,
    fn: (t: number, value: TValue, index: number) => TValue,
    easing?: EasingOptions
  ) {
    const initialValue = this.get();
    const length = initialValue.length;
    const gen: MotionBuilderish<TState>[] = [];
    for (let i = 0; i < length; i++) {
      gen.push(
        tween<TState>(
          duration,
          (t) => {
            const list = this.get();
            const next = [...list];
            next[i] = fn(t, initialValue[i]!, i);
            this.set(next);
          },
          easing
        )
      );
    }
    yield* all<TState>(...gen);
  }
  *tweenMap(
    duration: number,
    factory: Factory<TState, TValue>,
    easing?: EasingOptions
  ) {
    const length = this.get().length;

    yield* sequence<TState>(
      {
        duration,
        easing,
      },
      ...this.getGens(0, length, factory)
    );
  }
}

type ArrayValue<T> = T extends Array<infer U> ? U : never;

export function* controlList<
  TState extends MotionState,
  TKey extends KPaths<TState, Array<any>>
>(
  key: TKey & string,
  fn?: (
    control: ListControl<TState, ArrayValue<VPaths<TState, TKey, Array<any>>>>
  ) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  type TValue = ArrayValue<VPaths<TState, TKey, Array<any>>>;
  const context = yield* requestContext<TState>();
  const control = new ListControl<TState, TValue>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
