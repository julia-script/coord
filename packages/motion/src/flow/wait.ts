import { MotionState, requestContext, requestPassTime } from "@/context";
import { countFrames } from "@/utils/countFrames";
export function* wait<TState extends MotionState>(duration: number) {
  const context = yield* requestContext<TState>();
  const fps = context.settings.fps;
  const [frames, remainder] = countFrames(context.time, fps, duration);
  // const time = context.time;
  // const expectedFinishTime = time + duration;
  // const finishFrame = Math.floor(expectedFinishTime * fps);
  // let frames = Math.max(finishFrame - context.frames.length, 0);
  // const remainder = duration - frames / fps;
  // if (remainder >= 1 / fps) {
  //   frames++;
  // }
  for (let i = 0; i < frames; i++) {
    yield;
  }

  yield* requestPassTime(remainder);
}
