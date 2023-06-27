import { MotionContext } from "./context";
import { MotionBuilder, MotionScene, MotionSettings } from "./types";

export function runMotion<TScene extends MotionScene<MotionBuilder>>(
  scene: TScene,
  settings?: Partial<MotionSettings> & { transitionDuration?: number }
) {
  const context = MotionContext.from(scene, settings);

  return {
    _context: context,
    frames: context.frames,
    meta: context.meta,
    settings: context.settings,
  };
}
