import { MotionBuilder, MotionState, requestContext } from "@/context";
import { tween, spring, SpringParameters } from "@/tweening";
import { EasingOptions, Vec2ish, Vec2, KPaths, VPaths } from "@coord/core";
import { Control } from "./control";

export class PointControl<TState extends MotionState> extends Control<
  TState,
  Vec2,
  Vec2ish
> {
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

  private *tweenPoint(value: Vec2, duration: number, easing?: EasingOptions) {
    const initialValue = this.get();
    this.assertType(initialValue);
    yield* tween<TState>(
      duration,
      (t) => {
        this.set(initialValue.lerp(value, t));
      },
      easing
    );
  }

  in(duration: number, easing?: EasingOptions) {
    return this.applyDeferred((next) =>
      this.tweenPoint(next, duration, easing)
    );
  }

  spring(parameters?: SpringParameters) {
    return this.applyDeferred((next) =>
      spring<Vec2, TState>(this.get, next, this.set, parameters)
    );
  }
}

export function* controlPoint<
  TState extends MotionState,
  TKey extends KPaths<TState, Vec2>
>(
  key: TKey & string,
  fn?: (control: PointControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new PointControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
