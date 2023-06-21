import {
  MotionBuilder,
  MotionBuilderGenerator,
  MotionContext,
  MotionState,
  requestContext,
} from "@/context";

import {
  ExtractPathsOfType,
  KPaths,
  VPaths,
  getDeep,
  isFunction,
  setDeep,
} from "@coord/core";

export class Control<TState extends MotionState, TValue, TValueIn = TValue> {
  _deferred: ((current: TValue) => TValue)[] = [];

  assertType(value: unknown): asserts value is TValue {
    //not implemented
  }
  constructor(public context: MotionContext<MotionState>, public key: string) {}

  defer(fn: (current: TValue) => TValue) {
    this._deferred.push(fn);
  }
  getDeferred() {
    const deferred = this._deferred;
    this._deferred = [];
    return deferred;
  }
  applyDeferred(gen: (next: TValue) => MotionBuilderGenerator<TState>) {
    const deferred = this.getDeferred();
    const self = this;
    const applyDeferred = function* () {
      const next = self.computeDeferred(deferred);
      yield* gen(next);
    };
    return applyDeferred();
  }
  computeDeferred(deferred: ((current: TValue) => TValue)[]) {
    let current = this.get();
    for (const fn of deferred) {
      current = fn(current);
    }
    return current;
  }

  normalizeValue(value: TValueIn | TValue): TValue {
    this.assertType(value);
    return value;
  }
  get = () => {
    const value = getDeep(this.context._state, this.key);
    this.assertType(value);
    return value;
  };

  set = (value: TValueIn | TValue) => {
    if (this.key in this.context._state) {
      this.context.state({
        [this.key]: this.normalizeValue(value),
      });
      return;
    }

    this.context._state = setDeep(
      this.context._state,
      this.key,
      this.normalizeValue(value)
    );
  };

  *do() {
    const deferred = this.getDeferred();
    const next = this.computeDeferred(deferred);
    this.assertType(next);
    this.set(next);
  }
  *as(value: TValueIn | ((prev: TValue) => TValueIn)) {
    const v = isFunction(value) ? value(this.get()) : value;
    this.set(v);
  }

  from(value: TValueIn) {
    this.defer((v) => {
      this.set(this.normalizeValue(value));
      return v;
    });
    return this;
  }

  to(value: TValueIn) {
    this.defer(() => this.normalizeValue(value));
    return this;
  }
}

export function* control<
  TState extends MotionState,
  TKey extends KPaths<TState>
>(
  key: TKey & string,
  fn?: (
    control: Control<TState, VPaths<TState, TKey>>
  ) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey>
) {
  const context = yield* requestContext<TState>();
  const control = new Control<TState, VPaths<TState, TKey>>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
