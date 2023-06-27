import { requestContext, requestPassTime } from "@/context";
import { countFrames } from "@/utils";

export function* wait(duration: number) {
  const context = yield* requestContext();
  const fps = context.settings.fps;
  const [frames, remainder] = countFrames(context.time, fps, duration);

  for (let i = 0; i < frames; i++) {
    yield;
  }

  yield* requestPassTime(remainder);
}
