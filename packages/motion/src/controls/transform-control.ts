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
  Transform,
  Vec2ish,
  Vec2,
  ExtractPathsOfType,
} from "@coord/core";

export function* controlTransform<
  TState extends MotionState,
  TKey extends ExtractPathsOfType<TState, Transform>
>(
  key: TKey & string,
  fn?: (control: TransformControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: Transform
) {
  const context = yield* requestContext<TState>();
  const control = new TransformControl<TState>(context, key);
  if (fn) {
    yield* fn(control);
  }
  return control;
}

export class TransformControl<TState extends MotionState> {
  _nextTarget: Transform = Transform.identity();

  constructor(
    public context: MotionContext<MotionState>,
    public key: string,
    private _initialValue = Transform.identity()
  ) {
    this._initialValue = this._initialValue;
    this._nextTarget = this.get().copy();
  }

  get() {
    const value = getDeep(this.context._state, this.key);
    if (value instanceof Transform) {
      return value;
    }
    this.set(this._initialValue);

    return this._initialValue;
  }
  set(value: Transform) {
    this.context._state = setDeep(this.context._state, this.key, value);
  }

  tweenTo = (target: Transform, duration: number, easing?: EasingOptions) => {
    const initialValue = this.get();

    return tween<TState>(
      duration,
      (t) => {
        this.set(initialValue.lerp(target, t));
      },
      easing
    );
  };

  from(target: Transform) {
    this.set(target.copy());
    return this;
  }

  positionTo = (pos: Vec2ish) => {
    this._nextTarget.setPositionSelf(Vec2.of(pos));
    return this;
  };
  scaleTo = (scale: Vec2ish | number) => {
    this._nextTarget.setScaleSelf(scale);
    return this;
  };

  rotateTo = (angle: number) => {
    this._nextTarget.setRotationSelf(angle);
    return this;
  };

  translate = (pos: Vec2ish) => {
    this._nextTarget.translateSelf(Vec2.of(pos));
    return this;
  };
  scale = (scale: Vec2ish | number) => {
    this._nextTarget.scaleSelf(scale);
    return this;
  };

  rotate = (angle: number) => {
    this._nextTarget.rotateSelf(angle);
    return this;
  };

  in = (duration: number, easing?: EasingOptions) => {
    return this.tweenTo(this._nextTarget, duration, easing);
  };
}
