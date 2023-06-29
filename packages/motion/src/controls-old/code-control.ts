import { MotionBuilder, MotionState, requestContext } from "@/context-old";
import { tween, spring, SpringParameters } from "@/tweening";
import { lerp, EasingOptions, KPaths, VPaths } from "@coord/core";
import { Control } from "./control";
import { CodeState, Code } from "@coord/code";

const isNumber = (value: unknown): value is number => typeof value === "number";

const isFinite = (value: unknown): value is number => Number.isFinite(value);

export class CodeControl<TState extends MotionState> extends Control<
  TState,
  CodeState
> {
  assertType(value: unknown): asserts value is CodeState {}

  private *tweenCode(
    value: CodeState,
    duration: number,
    easing: EasingOptions = "easeInOutSine"
  ) {
    this.assertType(value);
    yield* tween<TState>(
      duration,
      (t) => {
        this.set({
          ...value,
          transition: t,
        });
      },
      easing
    );
  }
  edit(code: Code) {
    this.defer(() => {
      return {
        code,
        transition: 0,
      };
    });
    return this;
  }

  in(duration: number, easing?: EasingOptions) {
    return this.applyDeferred((next) => this.tweenCode(next, duration, easing));
  }
}

export function* controlCode<
  TState extends MotionState,
  TKey extends KPaths<TState, CodeState>
>(
  key: TKey & string,
  fn?: (control: CodeControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new CodeControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
