"use client";
import {
  makeScene,
  controlString,
  chain,
  wait,
  controlList,
  tween,
} from "@coord/motion";
import { useMotionController, MotionPlayer } from "@coord/motion-react";

const scene = makeScene(
  "Hello World",
  {
    text: "",
    list: [] as number[],
  },
  function* () {
    const text = yield* controlString("text");
    const list = yield* controlList("list");
    yield* list.tweenAppend(10, 1, (i) => i);
    // return;
    yield* chain(
      wait(0.2),
      text.to("Hello World!").in(1),
      wait(1),
      text.append(' I\'m "@coord/motion"').in(1),
      wait(1),
      text.clear(0.5)
    );
  }
);

export default function MyAnimation() {
  const controls = useMotionController(scene);

  const { state } = controls;

  return (
    <div className="w-full">
      <MotionPlayer controls={controls} autoplay repeat>
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="font-mono text-6xl font-bold">{state.text}</h1>
          <h1 className="font-mono text-6xl font-bold">
            {state.list.map((n) => n.toFixed(1)).join(", ")}
          </h1>
        </div>
      </MotionPlayer>
    </div>
  );
}
