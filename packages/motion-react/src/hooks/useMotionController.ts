import { useLayoutEffect, useState } from "react";
import {
  MotionController,
  MotionState,
  MotionContextSettings,
  MotionScene,
} from "@coord/motion";

export function useMotionController<TState extends MotionState>(
  scene: MotionScene<TState>,
  contextSettings?: Partial<MotionContextSettings>
) {
  const [motionPlayer] = useState(() =>
    MotionController.from(scene, contextSettings)
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

  return {
    motionPlayer,

    play: motionPlayer.play,
    pause: motionPlayer.pause,
    stop: motionPlayer.stop,
    setPlayRange: motionPlayer.setPlayRange,
    setRepeat: motionPlayer.setRepeat,
    setTime: motionPlayer.setTime,
    setFrame: motionPlayer.setFrame,

    state: motionPlayer.state,
    duration: motionPlayer.duration,
    durationInFrames: motionPlayer.durationInFrames,
    fps: motionPlayer.fps,
    currentTime: motionPlayer.currentTime,
    meta: motionPlayer.context.meta,

    frame,
    playing,
    repeat,
    playRange,
  } as const;
}

export type MotionControls<TState extends MotionState = MotionState> =
  ReturnType<typeof useMotionController<TState>>;
