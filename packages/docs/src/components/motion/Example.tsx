"use client";
import { point } from "@coord/core";
import {
  chain,
  makeListState,
  makeMotion,
} from "@coord/motion";
import {
  MotionPlayer,
  useMotion,
} from "@coord/motion-react";
import {
  BezierScene,
  bezierScene,
} from "./BezierScene";

const scene = makeMotion(
  "Hello World",
  function* () {
    const scale = yield* makeListState(
      "scales",
      [] as number[]
    );

    yield* chain(
      scale.fill(0, 10).tweenMap(2, (t) => t),
      scale.sequence(
        2,
        (control) =>
          control.tween(2, (t) => 1 + 5 * t) //
      ),
      scale.sequence(
        2,
        (control) =>
          control.tween(
            2,
            (t, initial) => initial * (1 - t)
          ) //
      )
    );
  }
);
function* test() {
  yield;
}

export function Example2() {
  const [state, controls] = useMotion(scene);

  return (
    <div>
      <MotionPlayer controls={controls}>
        <svg className="w-full">
          {state.scales.map((scale, i) => {
            return (
              <circle
                key={i}
                cx={100 + i * 190}
                cy={"50%"}
                r={20 * scale}
                className="fill-current text-blue-500"
                // fill=""
                // transform={`scale(${scale})`}
              />
            );
          })}
        </svg>
      </MotionPlayer>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export function Example() {
  const [state, controls] =
    useMotion(bezierScene);

  return (
    <div>
      <MotionPlayer controls={controls}>
        <BezierScene state={state} />
      </MotionPlayer>
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </div>
  );
}
