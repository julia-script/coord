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
import { Control, makeControlUtility } from "./control";

const isNumber = (value: unknown): value is number => typeof value === "number";

const isFinite = (value: unknown): value is number => Number.isFinite(value);

export class NumberControl extends Control<number> {
  assertType(value: unknown): asserts value is number {
    if (!isNumber(value)) {
      throw new Error(`Expected  number, got ${typeof value}`);
    }
    if (!isFinite(value)) {
      throw new Error(`Expected finite number, got ${value}`);
    }
  }

  private *tweenNumber<TState extends MotionState>(
    value: number,
    duration: number,
    easing?: EasingOptions
  ) {
    let initialValue: number;

    yield* tween<TState>(
      duration,
      (t) => {
        if (!initialValue) {
          initialValue = this.get();
          this.assertType(initialValue);
        }
        this.set(lerp(initialValue, value, t));
      },
      easing
    );
  }

  in<TState extends MotionState>(duration: number, easing?: EasingOptions) {
    const next = this.nextTarget;
    this._nextTarget = null;
    return this.tweenNumber<TState>(next, duration, easing);
  }

  spring<TState extends MotionState>(parameters?: SpringParameters) {
    const next = this.nextTarget;
    this._nextTarget = null;
    return spring<number, TState>(this.get, next, this.set, parameters);
  }
}

const createNumberControl = (
  context: MotionContext<MotionState>,
  key: string
) => new NumberControl(context, key);

export const controlNumber = makeControlUtility<
  number,
  typeof createNumberControl
>(createNumberControl);
