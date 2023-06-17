import { MotionContext, MotionState } from "@/context";
import { tween, spring, SpringParameters } from "@/tweening";
import { EasingOptions, Vec2ish, Vec2 } from "@coord/core";
import { Control, makeControlUtility } from "./control";

export class PointControl extends Control<Vec2, Vec2ish> {
  assertType(value: unknown): asserts value is Vec2 {
    if (!(value instanceof Vec2)) {
      throw new Error(`Expected Vec2, got ${typeof value}`);
    }
    if (!value.isFinite()) {
      throw new Error(`Expected finite Vec2, got ${value}`);
    }
  }
  normalizeValue(value: Vec2ish) {
    return Vec2.of(value);
  }

  private *tweenPoint<TState extends MotionState>(
    value: Vec2,
    duration: number,
    easing?: EasingOptions
  ) {
    let initialValue: Vec2;

    yield* tween<TState>(
      duration,
      (t) => {
        if (!initialValue) {
          initialValue = this.get();
          this.assertType(initialValue);
        }
        this.set(initialValue.lerp(value, t));
      },
      easing
    );
  }

  in<TState extends MotionState>(duration: number, easing?: EasingOptions) {
    const next = this.nextTarget;
    this._nextTarget = null;
    return this.tweenPoint<TState>(next, duration, easing);
  }

  spring<TState extends MotionState>(parameters?: SpringParameters) {
    const next = this.nextTarget;
    this._nextTarget = null;
    return spring<Vec2, TState>(this.get, next, this.set, parameters);
  }
}

const createPointControl = (context: MotionContext<MotionState>, key: string) =>
  new PointControl(context, key);

export const controlPoint = makeControlUtility<Vec2, typeof createPointControl>(
  createPointControl
);
