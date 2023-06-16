"use client";
import { Graph, Grid, Marker, point, transform } from "@coord/graph";
import {
  controlColor,
  all,
  controlTransform,
  makeScene,
  makeMovie,
} from "@coord/motion";
import {
  useMotionController,
  MotionPlayerControls,
  MotionPlayer,
} from "@coord/motion-react";
import "@coord/motion-react/dist/index.css";
const sceneA = makeScene(
  "Scene A",
  {
    color: "blue",
    shape: transform(),
  },
  function* () {
    const color = yield* controlColor("color");
    const shape = yield* controlTransform("shape");

    yield* all(
      color.tweenTo("red", 1),
      shape.scale(2).positionTo([3, 3]).in(1)
    );

    yield* all(
      color.tweenTo("yellow", 1),
      shape
        .positionTo([5, 5])

        .scale(3)

        .in(1)
    );

    yield* all(
      color.tweenTo("blue", 1),
      shape
        .positionTo([0, 0])

        .scaleTo(1)
        .in(1)
    );
  }
);

const sceneB = makeScene(
  "Scene B: Scene with a really long name",
  {
    color: "blue",
    shape: transform(),
  },
  function* () {
    const color = yield* controlColor("color");
    const shape = yield* controlTransform("shape");

    yield* all(
      color.tweenTo("red", 1),
      shape.scale(2).positionTo([3, 3]).in(1)
    );

    yield* all(
      color.tweenTo("yellow", 1),
      shape
        .positionTo([5, 5])

        .scale(3)

        .in(1)
    );

    yield* all(
      color.tweenTo("blue", 1),
      shape
        .positionTo([0, 0])

        .scaleTo(1)
        .in(1)
    );
  }
);

export default function Page() {
  const controls = useMotionController(
    makeMovie("Finding the intersection of two lines", {
      sceneA: sceneA,
      sceneB: sceneB,
    }),
    {
      fps: 60,
    }
  );

  const { sceneA: state } = controls.state;

  return (
    <div className="flex flex-col">
      <div className="container mx-auto">
        <pre>{JSON.stringify(controls.meta, null, 2)}</pre>

        <MotionPlayer controls={controls} autoplay>
          <Graph width="100%">
            <Marker
              position={state.shape.getPosition()}
              size={state.shape.getScale().y * 20}
              label={"👀"}
              color={state.color}
            />
          </Graph>
        </MotionPlayer>
      </div>
    </div>
  );
}
