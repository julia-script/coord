import { tween } from "@/tweening";
import { Thread } from "@/utils";
import {
  EasingOptions,
  isFunction,
} from "@coord/core";

export type Dispatcher<
  TValue,
  TValueIn = TValue
> = TValueIn | ((prev: TValue) => TValueIn);
export class Control<TValue, TValueIn = TValue> {
  private _deferred: Dispatcher<
    TValue,
    TValueIn
  >[] = [];

  protected _computeDeferred(
    deferred: Dispatcher<TValue, TValueIn>[]
  ) {
    for (const value of deferred) {
      this.set(value);
    }

    return this.get();
  }
  protected _applyDeferred<
    TThread extends Thread
  >(
    fn: (next: () => TValue) => TThread
  ): TThread {
    const deferred = this._deferred;
    this._deferred = [];
    return fn(() =>
      this._computeDeferred(deferred)
    );
  }

  protected _defer(
    value: Dispatcher<TValue, TValueIn>
  ) {
    this._deferred.push(value);
  }

  constructor(
    public _get: () => TValue,
    public _set: (value: TValueIn) => void
  ) {}
  get = () => this._get();

  set = (value: Dispatcher<TValue, TValueIn>) => {
    this._set(
      isFunction(value)
        ? value(this.get())
        : value
    );
  };
  *as(value: Dispatcher<TValue, TValueIn>) {
    this.set(value);
    yield;
  }

  tween(
    duration: number,
    fn: (
      t: number,
      initialValue: TValue
    ) => TValueIn,
    easing?: EasingOptions
  ) {
    const self = this;
    function* gen(next: () => TValue) {
      const from = next();
      yield* tween(
        duration,
        (t) => self.set(fn(t, from)),
        easing
      );
    }
    return this._applyDeferred(gen);
  }
}

export function control<TValue>(
  getter: () => TValue,
  setter: (value: TValue) => void
) {
  return new Control<TValue>(getter, setter);
}
