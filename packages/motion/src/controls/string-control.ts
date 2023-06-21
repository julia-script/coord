import { MotionBuilder, MotionState, requestContext } from "@/context";
import { tween } from "@/tweening";
import { EasingOptions, Random, KPaths, VPaths } from "@coord/core";
import { Control } from "./control";

export class StringControl<TState extends MotionState> extends Control<
  TState,
  string
> {
  assertType(value: unknown): asserts value is string {
    if (typeof value !== "string") {
      throw new Error(`Expected string, got ${typeof value}`);
    }
  }

  private *tweenString(
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
  append(text: string) {
    this.defer((v) => v + text);
    return this;
  }
  prepend(text: string) {
    this.defer((v) => text + v);
    return this;
  }

  clear(duration: number, easing?: EasingOptions) {
    return this.in(duration, "clear", easing);
  }
  in(
    duration: number,
    mode?: keyof typeof TextLerpModes,
    easing?: EasingOptions
  ) {
    const self = this;
    return this.applyDeferred((next) =>
      self.tweenString(next, duration, {
        easing,
        mode,
      })
    );
  }
}

export const lerpText = (a: string, b: string, t: number, splitter = "") => {
  let out = a.split(splitter);

  const length = Math.max(a.length, b.length) * t;

  for (let i = 0; i < length; i++) {
    out[i] = b[i] ?? " ";
  }
  return out.join(splitter);
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

export const shuffleCharacters = (a: string, b: string, t: number) => {
  const random = new Random(a + b);
  const length = Math.max(a.length, b.length);

  const out = a.split("");

  const chance = 2 * t;
  for (let i = 0; i < length; i++) {
    if (random.chance(chance)) {
      out[i] = b[i] ?? " ";
    }
  }
  return out.join("").trim();
};

const TextLerpModes = {
  overwrite: overwriteString,
  shuffle: shuffleCharacters,
  "word-overwrite": overwriteByWord,
  "char-overwrite": overwriteString,
  clear: clear,
  append: append,
  "clear-then-append": clearThenAppend,
};

export function* controlString<
  TState extends MotionState,
  TKey extends KPaths<TState, string>
>(
  key: TKey & string,
  fn?: (control: StringControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new StringControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
