import { MotionState, requestContext } from "@/context";
import { EasingOptions, easingsFunctions } from "@coord/core";

export function* tween<TState extends MotionState>(
  duration: number,
  fn: (t: number) => void,
  easing: EasingOptions = "easeInOutCubic"
) {
  const easingFn =
    typeof easing === "function" ? easing : easingsFunctions[easing];
  const context = yield* requestContext<TState>();
  const { fps } = context.settings;
  const frames = Math.round(fps * duration);

  for (let i = 1; i <= frames; i++) {
    fn(easingFn(i / frames));
    yield;
  }
}
