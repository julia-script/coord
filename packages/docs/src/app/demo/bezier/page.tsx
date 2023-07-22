"use client";
import {
  MotionPlayer,
  useMotion,
} from "@coord/motion-react";

import {
  BezierScene,
  bezierScene,
} from "./BezierScene";

export default function Page() {
  const [state, controls] =
    useMotion(bezierScene);
  return (
    <MotionPlayer
      controls={controls}
      className="mx-auto w-full max-w-7xl"
    >
      <BezierScene state={state} />
    </MotionPlayer>
  );
}
