import { MotionState } from "@/context";

export function frameMaker<TState extends MotionState>(
  initialState: TState,
  expectedTransitionDurationInFrames: number
) {
  let currentState = initialState;
  let frame = -1;
  const out = function (stateUpdate: Partial<TState> = {}) {
    currentState = {
      ...currentState,
      ...stateUpdate,
    };
    frame++;
    return {
      ...currentState,
      $frame: frame,
      $transitionIn:
        expectedTransitionDurationInFrames === 0
          ? 1
          : Math.min((frame + 1) / expectedTransitionDurationInFrames, 1),
    };
  };
  out.initialState = {
    ...currentState,
    $transitionIn: 0,
    $frame: 0,
  };
  return out;
}
