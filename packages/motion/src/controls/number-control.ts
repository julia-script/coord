import {
  MotionBuilder,
  MotionContext,
  MotionState,
  requestContext,
} from "@/context";
import { tween, spring, SpringParameters } from "@/tweening";
import {
  getDeep,
  setDeep,
  InferPathValueTree,
  lerp,
  EasingOptions,
  InferPath,
  InferPathValue,
  InferPathValueImplementation,
  ExtractPathsOfType,
} from "@coord/core";

const isNumber = (value: unknown): value is number => typeof value === "number";

export function* controlNumber<
  TState extends MotionState,
  TKey extends ExtractPathsOfType<TState, number>
>(
  key: TKey,
  fn?: (control: NumberControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: number
) {
  const context = yield* requestContext<TState>();
  const control = new NumberControl<TState>(context, key, initialValue);
  if (fn) {
    yield* fn(control);
  }
  return control;
}

const isFinite = (value: unknown): value is number => Number.isFinite(value);

export class NumberControl<TState extends MotionState> {
  _targetValue: number;

  constructor(
    public context: MotionContext<MotionState>,
    public key: string,
    private _initialValue = 0
  ) {
    this._targetValue = this.get() ?? 0;
  }

  get(): number {
    let value = getDeep(this.context._state, this.key);
    if (!isNumber(value)) {
      this.set(this._initialValue);
      return this._initialValue;
    }
    return value;
  }
  set(value: number) {
    this.context._state = setDeep(this.context._state, this.key, value);
  }

  tweenTo(value: number, duration: number, easing?: EasingOptions) {
    const initialValue = this.get() ?? 0;
    if (!isFinite(initialValue)) {
      throw new Error(
        `Cannot tween to a non-finite value, got ${initialValue}`
      );
    }

    return tween<TState>(
      duration,
      (t) => {
        this.set(lerp(initialValue, value, t));
      },
      easing
    );
  }

  springTo(to: number, parameters?: SpringParameters) {
    const initialValue = this.get() ?? 0;
    if (!isFinite(initialValue)) {
      throw new Error(
        `Cannot spring to a non-finite value, got ${initialValue}`
      );
    }

    return spring<number, TState>(
      initialValue,
      to,
      (t) => {
        this.set(t);
      },
      parameters
    );
  }

  from(value: number) {
    this.set(value);
    return this;
  }

  to(value: number) {
    this._targetValue = value;
    return this;
  }

  in(duration: number, easing?: EasingOptions) {
    return this.tweenTo(this._targetValue, duration, easing);
  }

  spring(parameters?: SpringParameters) {
    return this.springTo(this._targetValue, parameters);
  }
}
