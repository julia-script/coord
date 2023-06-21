import { MotionBuilder, MotionState, requestContext } from "@/context";
import { tween } from "@/tweening";
import { EasingOptions, KPaths, VPaths } from "@coord/core";
import { Control } from "./control";

type RectangularColorSpace =
  | "srgb"
  | "srgb-linear"
  | "lab"
  | "oklab"
  | "xyz"
  | "xyz-d50"
  | "xyz-d65";
type PolarColorSpace = "hsl" | "hwb" | "lch" | "oklch";

type ColorMixOptions = {
  method: RectangularColorSpace | PolarColorSpace;
  interpolationMethod?: "shorter" | "longer" | "increasing" | "decreasing";
};

const isPolarColorSpace = (value: string): value is PolarColorSpace =>
  ["hsl", "hwb", "lch", "oklch"].includes(value);

const colorMix = (
  a: string,
  b: string,
  t: number,
  config: Partial<ColorMixOptions> = {}
) => {
  let { method = "srgb", interpolationMethod = "shorter" } = config;
  if (t === 0) return a;
  if (t === 1) return b;
  const fullMethod = isPolarColorSpace(method)
    ? `${method} ${interpolationMethod} hue`
    : method;
  return `color-mix(in ${fullMethod}, ${a}, ${b} ${(t * 100).toFixed(2)}%)`;
};

type ColorTweeningOptions = {
  easing: EasingOptions;
} & ColorMixOptions;

export class ColorControl<TState extends MotionState> extends Control<
  TState,
  string
> {
  assertType(value: unknown): asserts value is string {
    if (typeof value !== "string") {
      throw new Error(`Expected a color string, got ${typeof value}`);
    }
  }

  private tweenColor(
    value: string,
    duration: number,
    config: Partial<ColorTweeningOptions> = {}
  ) {
    const { easing, ...colorMixOptions } = config;
    let initialValue: string;

    return tween<TState>(
      duration,
      (t) => {
        if (!initialValue) {
          initialValue = this.get();
          this.assertType(initialValue);
        }

        this.set(colorMix(initialValue, value, t, colorMixOptions));
      },
      easing
    );
  }

  in(duration: number, config?: Partial<ColorTweeningOptions>) {
    return this.applyDeferred((next) =>
      this.tweenColor(next, duration, config)
    );
  }
}

export function* controlColor<
  TState extends MotionState,
  TKey extends KPaths<TState, string>
>(
  key: TKey & string,
  fn?: (control: ColorControl<TState>) => ReturnType<MotionBuilder<TState>>,
  initialValue?: VPaths<TState, TKey, Array<any>>
) {
  const context = yield* requestContext<TState>();
  const control = new ColorControl<TState>(context, key);
  if (typeof initialValue !== "undefined") {
    control.set(initialValue);
  }
  if (fn) {
    yield* fn(control);
  }
  return control;
}
