import { MotionState, requestContext } from "@/context";

export function* wait<TState extends MotionState>(time: number) {
  const context = yield* requestContext<TState>();
  const { fps } = context.settings;

  for (let i = 0; i < Math.round(fps * time); i++) {
    yield;
  }
}
