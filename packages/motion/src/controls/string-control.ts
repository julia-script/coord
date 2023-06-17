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
  ExtractPathsOfType,
} from "@coord/core";
import { Control, makeControlUtility } from "./control";
import { assertType } from "vitest";

// export function* controlString<
//   TState extends MotionState,
//   TKey extends ExtractPathsOfType<TState, string>
// >(
//   key: TKey & string,
//   fn?: (control: StringControl<TState>) => ReturnType<MotionBuilder<TState>>,
//   initialValue?: string
// ) {
//   const context = yield* requestContext<TState>();
//   const control = new StringControl<TState>(context, key);
//   if (typeof initialValue === "string") {
//     control.set(initialValue);
//   }
//   if (fn) {
//     yield* fn(control);
//   }
//   return control;
// }

export class StringControl extends Control<string> {
  assertType(value: unknown): asserts value is string {
    if (typeof value !== "string") {
      throw new Error(`Expected string, got ${typeof value}`);
    }
  }

  private *tweenString<TState extends MotionState>(
    to: string,
    duration: number,
    config: Partial<{
      easing: EasingOptions;
      mode: keyof typeof TextLerpModes;
    }> = {}
  ) {
    const { easing = "linear", mode = "char-overwrite" } = config;
    let fromValue: string;
    yield* tween<TState>(
      duration,
      (t) => {
        if (!fromValue) {
          fromValue = this.get();
        }
        this.set(TextLerpModes[mode](fromValue, to, t));
      },
      easing
    );
  }

  clear<TState extends MotionState>(duration: number, easing?: EasingOptions) {
    this._nextTarget = null;
    return this.in<TState>(duration, "clear", easing);
  }
  in<TState extends MotionState>(
    duration: number,
    mode?: keyof typeof TextLerpModes,
    easing?: EasingOptions
  ) {
    const next = this.nextTarget;
    this._nextTarget = null;
    return this.tweenString<TState>(next, duration, {
      easing,
      mode,
    });
  }
}

export const lerpText = (a: string, b: string, t: number, splitter = "") => {
  let out = a.split(splitter);

  const length = Math.max(a.length, b.length) * t;

  for (let i = 0; i < length; i++) {
    out[i] = b[i] ?? " ";
  }
  return out.join(splitter); //.trim();
};

export const overwriteString = (a: string, b: string, t: number) => {
  return lerpText(a, b, t);
};

export const overwriteByWord = (a: string, b: string, t: number) => {
  return lerpText(a, b, t, " ");
};

export const clear = (a: string, _: string, t: number) => {
  return a.slice(0, a.length * (1 - t));
};

export const append = (a: string, b: string, t: number) => {
  return a + b.slice(0, b.length * t);
};

export const clearThenAppend = (a: string, b: string, t: number) => {
  const splitT = a.length / (a.length + b.length);
  if (t <= splitT) {
    return clear(a, "", t / splitT);
  } else {
    return append("", b, (t - splitT) / (1 - splitT));
  }
};

const TextLerpModes = {
  overwrite: overwriteString,
  "word-overwrite": overwriteByWord,
  "char-overwrite": overwriteString,
  clear: clear,
  append: append,
  "clear-then-append": clearThenAppend,
};

const createStringControl = (
  context: MotionContext<MotionState>,
  key: string
) => new StringControl(context, key);

export const controlString = makeControlUtility<
  string,
  typeof createStringControl
>(createStringControl);
