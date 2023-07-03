import { useLayoutEffect, useState } from "react";
import { MotionController, MotionScene, MotionSettings } from "@coord/motion";

export function useMotion<TScene extends MotionScene>(
  scene: TScene,
  contextSettings?: Partial<MotionSettings>
) {
  const [motionPlayer] = useState<MotionController<TScene>>(() =>
    MotionController.from<TScene>(scene, contextSettings)
  );

  const [frame, setFrame] = useState(motionPlayer.currentFrame);
  const [playing, setPlaying] = useState(motionPlayer.playing);
  const [repeat, setRepeat] = useState(motionPlayer.repeat);
  const [playRange, setPlayRange] = useState(motionPlayer.playRange);

  useLayoutEffect(() => {
    motionPlayer.on("frame-changed", () => {
      setFrame(motionPlayer.currentFrame);
    });
    motionPlayer.on("play-range-changed", () => {
      setPlayRange(motionPlayer.playRange);
    });
    motionPlayer.on("play-status-changed", () => {
      setPlaying(motionPlayer.playing);
    });
    motionPlayer.on("repeat-changed", () => {
      setRepeat(motionPlayer.repeat);
    });

    return () => {
      motionPlayer.disconnect();
    };
  }, [motionPlayer]);

  return [
    motionPlayer.state,
    {
      motionPlayer,

      play: motionPlayer.play,
      pause: motionPlayer.pause,
      stop: motionPlayer.stop,
      setPlayRange: motionPlayer.setPlayRange,
      setRepeat: motionPlayer.setRepeat,
      setTime: motionPlayer.setTime,
      setFrame: motionPlayer.setFrame,

      frames: motionPlayer.motion.frames,
      state: motionPlayer.state,
      duration: motionPlayer.duration,
      durationInFrames: motionPlayer.durationInFrames,
      fps: motionPlayer.fps,
      currentTime: motionPlayer.currentTime,
      meta: motionPlayer.motion.meta,

      frame,
      playing,
      repeat,
      playRange,
    },
  ] as const;
}

export type MotionControls<TScene extends MotionScene = MotionScene> =
  ReturnType<typeof useMotion<TScene>>[1];
