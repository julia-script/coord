"use client";
import { makeListState, makeMotion } from "@coord/motion";
import { useMotion } from "@coord/motion-react";

const scene = makeMotion("Hello World", function* () {
  const path = yield* makeListState("path", [] as [number, number][]);
  yield* path.tweenAppend(2, 10, [0, 0]);
  yield;
});

export function Example2() {
  const [state, controls] = useMotion(scene);
  return (
    <div>
      hi
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
