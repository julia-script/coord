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
  InferPathValueTree,
  EasingOptions,
} from "@coord/core";

type OnlyKeysOfType<T, TType> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends TType ? never : K;
  }[keyof T]
>;

export function* controlColor<
  TState extends MotionState,
  TTree extends OnlyKeysOfType<InferPathValueTree<TState>, string | undefined>,
  TKey extends keyof TTree,
  TControl extends ColorControl<TState, TTree[TKey]>
>(
  key: TKey & string,
  fn?: (control: TControl) => ReturnType<MotionBuilder<TState>>
) {
  const context = yield* requestContext<TState>();
  const control = new ColorControl(context, key) as TControl;
  if (fn) {
    yield* fn(control);
  }
  return control;
}

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

export class ColorControl<TState extends MotionState, TType = string> {
  chain: ReturnType<MotionBuilder<TState>>[] = [];
  constructor(public context: MotionContext<MotionState>, public key: string) {}

  get() {
    return getDeep(this.context._state, this.key) as TType;
  }
  set(value: string) {
    this.context._state = setDeep(this.context._state, this.key, value);
  }

  tweenTo(
    value: string,
    duration: number,
    config: Partial<ColorTweeningOptions> = {}
  ) {
    const { easing, ...colorMixOptions } = config;
    const initialValue = this.get() ?? "#ffffff";

    if (typeof initialValue !== "string") {
      throw new Error(
        `Cannot tween to a non-string value, got ${initialValue}`
      );
    }

    return tween<TState>(
      duration,
      (t) => {
        this.set(colorMix(initialValue, value, t, colorMixOptions));
      },
      easing
    );
  }
}
