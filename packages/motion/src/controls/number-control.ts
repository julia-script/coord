import { MotionBuilder, MotionState, requestContext } from "@/context";
import { tween, spring, SpringParameters } from "@/tweening";
import { lerp, EasingOptions, KPaths, VPaths } from "@coord/core";
import { Control } from "./control";

const isNumber = (value: unknown): value is number => typeof value === "number";

const isFinite = (value: unknown): value is number => Number.isFinite(value);

export class NumberControl<TState extends MotionState> extends Control<
  TState,
  number
> {
  assertType(value: unknown): asserts value is number {
    if (!isNumber(value)) {
      throw new Error(`Expected  number, got ${typeof value}`);
    }
    if (!isFinite(value)) {
      throw new Error(`Expected finite number, got ${value}`);
    }
  }

  private *tweenNumber(
    value: number,
    duration: number,
    easing?: EasingOptions
  ) {
    const initialValue = this.get();
    this.assertType(initialValue);
    yield* tween<TState>(
      duration,
      (t) => {
        this.set(lerp(initialValue, value, t));
      },
      easing
    );
  }

  in(duration: number, easing?: EasingOptions) {
    return this.applyDeferred((next) =>
      this.tweenNumber(next, duration, easing)
    );
  }

  spring(parameters?: SpringParameters) {
    return this.applyDeferred((next) =>
      spring<number, TState>(this.get, next, this.set, parameters)
    );
  }
}

export function* controlNumber<
  TState extends MotionState,
  TKey extends KPaths<TState, number>
>(
  key: TKey & string,
  fn?: (control: NumberControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new NumberControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
