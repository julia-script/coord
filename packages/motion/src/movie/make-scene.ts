import { MotionBuilder, MotionState } from "@/context";
import { SceneMetaish, generateMeta } from "@/utils";

export function makeScene<
  TMeta extends SceneMetaish,
  TState extends MotionState
>(meta: TMeta, initialState: TState, builder: MotionBuilder<TState>) {
  return {
    meta: generateMeta<TMeta>(meta),
    builder,
    initialState,
  };
}

export type Scene<
  TMeta extends SceneMetaish,
  TState extends MotionState
> = ReturnType<typeof makeScene<TMeta, TState>>;
