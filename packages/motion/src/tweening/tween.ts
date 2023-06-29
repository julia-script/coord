import { requestContext } from "@/motion";
import { countFrames } from "@/utils/countFrames";
import { EasingOptions, easingsFunctions, inverseLerp } from "@coord/core";

export function* tween(
  duration: number,
  fn: (t: number) => void,
  easing: EasingOptions = "easeInOutCubic"
) {
  const easingFn =
    typeof easing === "function" ? easing : easingsFunctions[easing];
  const context = yield* requestContext();
  const { fps } = context.settings;

  const [frames, remainder] = countFrames(context.time, fps, duration);
  const startTime = context.time;
  const endTime = startTime + duration;
  let time = context.time;

  for (let i = 1; i <= frames; i++) {
    time = startTime + (i / frames) * duration;
    fn(easingFn(inverseLerp(startTime, endTime, time)));
    yield;
  }

  // if (remainder > 0) {
  //   fn(easingFn(1));
  //   yield* requestPassTime(remainder);
  // }
}
