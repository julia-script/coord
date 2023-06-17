import { MotionBuilder, MotionState } from "@/context";
import { SceneMetaish, generateMeta } from "@/utils";

export function makeScene<TState extends MotionState>(
  meta: SceneMetaish,
  initialState: TState,
  builder: MotionBuilder<TState>
) {
  return {
    meta: generateMeta(meta),
    builder,
    initialState,
  };
}

export type MotionScene<TState extends MotionState> = ReturnType<
  typeof makeScene<TState>
>;

const scene = makeScene("scene", { x: 0, y: 0 }, function* () {
  // yield { x: 100, y: 100 };
});
