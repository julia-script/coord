import { tween } from "@/tweening";
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

  normalizeValue(value: TValueIn): TValue {
    return value as any;
  }
  protected _computeDeferred(
    deferred: Dispatcher<TValue, TValueIn>[]
  ) {
    let next = this.get();
    for (const value of deferred) {
      next = this.normalizeValue(
        isFunction(value) ? value(next) : value
      );
    }

    return next;
  }
  protected _applyDeferred<
    T extends (next: () => TValue) => any
  >(fn: T): ReturnType<T> {
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
    public _set: (value: TValue) => void
  ) {}
  get = () => this._get();

  set = (value: Dispatcher<TValue, TValueIn>) => {
    this._set(
      this.normalizeValue(
        isFunction(value)
          ? value(this.get())
          : value
      )
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
    return this._applyDeferred(function* (next) {
      const from = next();
      yield* tween(
        duration,
        (t) => self.set(fn(t, from)),
        easing
      );
    });
  }
}

export function control<TValue>(
  getter: () => TValue,
  setter: (value: TValue) => void
) {
  return new Control<TValue>(getter, setter);
}
