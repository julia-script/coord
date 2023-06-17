import {
  MotionBuilder,
  MotionContext,
  MotionState,
  requestContext,
} from "@/context";
import { ExtractPathsOfType, getDeep, setDeep } from "@coord/core";

export abstract class Control<TValue, TValueIn = TValue> {
  _nextTarget: TValue | null = null;

  constructor(public context: MotionContext<MotionState>, public key: string) {}

  get nextTarget() {
    if (this._nextTarget === null) {
      const curr = this.get();

      this._nextTarget = curr;
      return curr;
    }
    return this._nextTarget;
  }

  set nextTarget(value: TValue) {
    this._nextTarget = value;
  }

  assertType(value: unknown): asserts value is TValue {
    throw new Error(
      `Type assertion for ${this.constructor.name} not implemented`
    );
  }

  normalizeValue(value: TValueIn): TValue {
    this.assertType(value);
    return value;
  }
  get = () => {
    const value = getDeep(this.context._state, this.key);
    this.assertType(value);
    return value;
  };

  set = (value: TValueIn) => {
    this.context._state = setDeep(
      this.context._state,
      this.key,
      this.normalizeValue(value)
    );
  };

  *as(value: TValueIn) {
    this._nextTarget = null;
    this.set(value);
    yield;
  }

  from(value: TValueIn) {
    this.nextTarget = this.normalizeValue(value);
    return this;
  }

  to(value: TValueIn) {
    this.nextTarget = this.normalizeValue(value);
    return this;
  }
}

function hasSet<T>(value: unknown): value is { set: (value: T) => void } {
  return typeof value === "object" && value !== null && "set" in value;
}
export function makeControlUtility<
  TType,
  TFactory extends (context: MotionContext<MotionState>, key: string) => any
>(factory: TFactory) {
  return function* controlUtility<TState extends MotionState>(
    key: ExtractPathsOfType<TState, TType>,
    fn?: (control: ReturnType<TFactory>) => ReturnType<MotionBuilder<TState>>,
    initialValue?: TType
  ) {
    const context = yield* requestContext<TState>();
    const control = factory(context, key);
    if (initialValue !== undefined && hasSet<TType>(control)) {
      control.set(initialValue);
    }
    if (fn) {
      yield* fn(control);
    }
    return control as ReturnType<TFactory>;
  };
}
