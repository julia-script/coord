import { SceneMetaish, generateMeta } from "@/utils";
import { MotionBuilder } from "./types";

export function makeMotion<TBuilder extends MotionBuilder>(
  meta: SceneMetaish,
  builder: TBuilder
) {
  return {
    meta: generateMeta(meta),
    builder,
  };
}
