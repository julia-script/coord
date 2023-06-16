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
  EasingOptions,
  Vec2ish,
  Vec2,
  ExtractPathsOfType,
} from "@coord/core";

export function* controlPoint<
  TState extends MotionState,
  TKey extends ExtractPathsOfType<TState, Vec2>
>(
  key: TKey & string,
  fn?: (control: PointControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: Vec2ish
) {
  const context = yield* requestContext<TState>();
  const control = new PointControl<TState>(
    context,
    key,
    initialValue ? Vec2.of(initialValue) : undefined
  );
  if (fn) {
    yield* fn(control);
  }
  return control;
}

export class PointControl<TState extends MotionState> {
  _targetValue: Vec2;
  constructor(
    public context: MotionContext<MotionState>,
    public key: string,
    private _initialValue = Vec2.of([0, 0])
  ) {
    this._targetValue = this.get();
  }

  get() {
    const value = getDeep(this.context._state, this.key);
    if (value instanceof Vec2) {
      return value;
    }
    this.set(this._initialValue);
    return this._initialValue;
  }
  set(value: Vec2ish) {
    this.context._state = setDeep(this.context._state, this.key, value);
  }

  tweenTo(value: Vec2ish, duration: number, easing?: EasingOptions) {
    const initialValue = Vec2.of(this.get());

    if (
      !(initialValue instanceof Vec2) ||
      (initialValue instanceof Vec2 && !initialValue.isFinite())
    ) {
      throw new Error(
        `Cannot tween to a non-finite value, got ${initialValue}`
      );
    }
    const target = Vec2.of(value);

    return tween<TState>(
      duration,
      (t) => {
        this.set(initialValue.lerp(target, t));
      },
      easing
    );
  }

  springTo(to: Vec2ish, parameters?: SpringParameters) {
    const initialValue = Vec2.of(this.get());

    if (
      !(initialValue instanceof Vec2) ||
      (initialValue instanceof Vec2 && !initialValue.isFinite())
    ) {
      throw new Error(
        `Cannot tween to a non-finite value, got ${initialValue.toString()}`
      );
    }
    const target = Vec2.of(to);

    return spring<Vec2, TState>(
      initialValue,
      target,
      (t) => {
        this.set(t);
      },
      parameters
    );
  }

  from(value: Vec2ish) {
    this.set(value);
    return this;
  }

  to(value: Vec2ish) {
    this._targetValue = Vec2.of(value);
    return this;
  }

  in(duration: number, easing?: EasingOptions) {
    return this.tweenTo(this._targetValue, duration, easing);
  }

  spring(parameters?: SpringParameters) {
    return this.springTo(this._targetValue, parameters);
  }
}
