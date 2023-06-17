import { MotionContext, MotionState } from "@/context";
import { tween } from "@/tweening";
import { EasingOptions } from "@coord/core";
import { Control, makeControlUtility } from "./control";

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

export class ColorControl extends Control<string> {
  assertType(value: unknown): asserts value is string {
    if (typeof value !== "string") {
      throw new Error(`Expected a color string, got ${typeof value}`);
    }
  }

  private *tweenColor<TState extends MotionState>(
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

  in<TState extends MotionState>(
    duration: number,
    config: Partial<ColorTweeningOptions>
  ) {
    const next = this.nextTarget;
    this._nextTarget = null;
    return this.tweenColor<TState>(next, duration, config);
  }
}
const createColorControl = (context: MotionContext<MotionState>, key: string) =>
  new ColorControl(context, key);

export const controlColor = makeControlUtility<
  string,
  typeof createColorControl
>(createColorControl);
