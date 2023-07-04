"use client";

import {
  MotionPlayer,
  useMotion,
} from "@coord/motion-react";

import { Scene, scene } from "./Scene";

export default function Page() {
  const [state, controls] = useMotion(scene);
  return (
    <MotionPlayer
      controls={controls}
      className="mx-auto w-full max-w-7xl"
      autoplay
      repeat
    >
      <Scene state={state} />
    </MotionPlayer>
  );
}
