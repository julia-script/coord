import { MotionState, YieldedType, makeState } from "@/context";
import { SceneMetaish, generateMeta } from "@/utils";

export function makeScene<TBuilder extends MotionBuilder>(
  meta: SceneMetaish,
  builder: TBuilder
) {
  return {
    meta: generateMeta(meta),
    builder,
  };
}

export type MotionScene<TState extends MotionState> = ReturnType<
  typeof makeScene<TState>
>;

const scene = makeScene("scene", function* () {
  yield* makeState("test", 2);
});

type ExtractStateFromBuilder<TBuilder extends MotionBuilder> = Extract<
  YieldedType<TBuilder>,
  YieldedType<typeof makeState>
>;

type StateFromBuilder<TBuilder extends MotionBuilder> = {
  [K in ExtractStateFromBuilder<TBuilder> as K["key"]]: K["initialState"];
};
type MotionBuilder = () => Generator;
type test = StateFromBuilder<typeof scene.builder>;
