import {
  EasingOptions,
  isFunction,
  isObject,
} from "@coord/core";
import { Control, Dispatcher } from "./control";
import {
  SpringParameters,
  spring,
  tween,
} from "@/tweening";
import { makeState } from "@/motion";

type RectangularColorSpace =
  | "srgb"
  | "srgb-linear"
  | "lab"
  | "oklab"
  | "xyz"
  | "xyz-d50"
  | "xyz-d65";
type PolarColorSpace =
  | "hsl"
  | "hwb"
  | "lch"
  | "oklch";

type ColorMixOptions = {
  method: RectangularColorSpace | PolarColorSpace;
  interpolationMethod?:
    | "shorter"
    | "longer"
    | "increasing"
    | "decreasing";
};

const isPolarColorSpace = (
  value: string
): value is PolarColorSpace =>
  ["hsl", "hwb", "lch", "oklch"].includes(value);

const colorMix = (
  a: string,
  b: string,
  t: number,
  config: Partial<ColorMixOptions> = {}
) => {
  let {
    method = "srgb",
    interpolationMethod = "shorter",
  } = config;
  if (t === 0) return a;
  if (t === 1) return b;
  const fullMethod = isPolarColorSpace(method)
    ? `${method} ${interpolationMethod} hue`
    : method;
  return `color-mix(in ${fullMethod}, ${a}, ${b} ${(
    t * 100
  ).toFixed(2)}%)`;
};

type ColorTweeningOptions = {
  easing: EasingOptions;
} & ColorMixOptions;

export class ColorControl extends Control<string> {
  to(value: Dispatcher<string>) {
    this._defer(value);
    return this;
  }
  in(
    duration: number,
    options:
      | EasingOptions
      | Partial<ColorTweeningOptions> = {}
  ) {
    const { easing, ...colorMixOptions } =
      isObject(options)
        ? options
        : { easing: options };

    const self = this;
    return this._applyDeferred(function* (next) {
      const from = self.get();
      const to = next();

      yield* tween(
        duration,
        (t) =>
          self.set(
            colorMix(from, to, t, colorMixOptions)
          ),
        easing
      );
    });
  }
}

export function controlColor(
  getter: () => string,
  setter: (value: string) => void
) {
  return new Control(getter, setter);
}

export function* makeColorState<
  TKey extends string
>(key: TKey, initialState: string) {
  const control = yield* makeState(
    key,
    initialState
  );

  return new ColorControl(
    control._get,
    control._set
  );
}
