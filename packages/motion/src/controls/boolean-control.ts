import { MotionBuilder, MotionState, requestContext } from "@/context";
import { Control } from "./control";
import { KPaths, VPaths } from "@coord/core";

export class BooleanControl<TState extends MotionState> extends Control<
  TState,
  boolean
> {
  assertType(value: unknown): asserts value is boolean {
    // do nothing
  }
  normalizeValue(value: unknown) {
    return Boolean(value);
  }
  on = () => this.as(true);
  off = () => this.as(false);
  toggle = () => this.as((v) => !v);
}

export function* controlBool<
  TState extends MotionState,
  TKey extends KPaths<TState, boolean>
>(
  key: TKey & string,
  fn?: (control: BooleanControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new BooleanControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
