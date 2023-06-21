import {
  MotionBuilder,
  MotionContext,
  MotionState,
  requestContext,
} from "@/context";
import { tween } from "@/tweening";
import {
  getDeep,
  setDeep,
  EasingOptions,
  Transform,
  Vec2ish,
  Vec2,
  KPaths,
  VPaths,
} from "@coord/core";
import { Control } from "./control";

export class TransformControl<TState extends MotionState> extends Control<
  TState,
  Transform
> {
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

  positionTo = (pos: Vec2ish) => {
    this.defer((next) => next.setPosition(Vec2.of(pos)));
    return this;
  };
  scaleTo = (scale: Vec2ish | number) => {
    this.defer((next) =>
      next.setScale(typeof scale === "number" ? scale : Vec2.of(scale))
    );
    return this;
  };

  rotateTo = (angle: number) => {
    this.defer((next) => next.rotate(angle));
    return this;
  };

  translate = (pos: Vec2ish) => {
    this.defer((next) => next.translate(Vec2.of(pos)));
    return this;
  };
  scale = (scale: Vec2ish | number) => {
    this.defer((next) =>
      next.scale(typeof scale === "number" ? scale : Vec2.of(scale))
    );
    return this;
  };

  rotate = (angle: number) => {
    this.defer((next) => next.rotate(angle));
    return this;
  };

  in = (duration: number, easing?: EasingOptions) => {
    return this.applyDeferred((next) => this.tweenTo(next, duration, easing));
  };
}
export function* controlTransform<
  TState extends MotionState,
  TKey extends KPaths<TState, Transform>
>(
  key: TKey & string,
  fn?: (control: TransformControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new TransformControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
