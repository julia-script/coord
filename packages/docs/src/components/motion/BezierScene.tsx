import { point } from "@coord/core/dist";
import {
  Graph,
  Grid,
  Marker,
  Plot,
  PolyLine,
} from "@coord/graph/dist";
import {
  BuilderState,
  MergeUnion,
  SceneState,
  Spring,
  all,
  delay,
  makeColorState,
  makeListState,
  makeMotion,
  makeNumberState,
  makeState,
  makeVec2State,
} from "@coord/motion/dist";
import {
  bezier,
  generateInterpolationLines,
  makeSpiral,
  springPath,
} from "./utils/bezier";

const quadratic = [
  point(-3, -3),
  point(0, 3),
  point(3, -3),
];
const cubic = [
  point(-4, 1),
  point(-2, -4),
  point(0, 0),
  point(4, -1),
];

const quartic = [
  point(-2, -3),
  point(-4, 0),
  point(0, 4),
  point(4, 0),
  point(2, -3),
];

const spiral = makeSpiral(32);

export const bezierScene = makeMotion(
  "BezierScene",
  function* () {
    const curve = yield* makeListState(
      "curve",
      quadratic
    );

    const color = yield* makeColorState(
      "color",
      "#FFEBEB"
    );

    const t = yield* makeNumberState("t", 0);

    const pathLerps = yield* makeListState(
      "pathLerps",
      generateInterpolationLines(quadratic, 0)
    );

    const pathLerpsOpacity =
      yield* makeNumberState(
        "pathLerpsOpacity",
        0
      );

    const pathLerpsStrength = yield* makeState(
      "pathLerpsStrength",
      2
    );
    const cursorPos = yield* makeVec2State(
      "cursorPos",
      [-6, -6]
    );

    const cursorAction = yield* makeState(
      "cursorAction",
      "enter" as "enter" | "grabbing" | "leave"
    );

    yield* all(
      t.to(1).in(2),
      pathLerps.tween(2, (t) =>
        generateInterpolationLines(quadratic, t)
      ),
      pathLerpsOpacity.to(1).in(0.3),
      delay(1.7, pathLerpsOpacity.to(0).in(0.3))
    );

    pathLerpsStrength.set(1);

    yield* delay(
      0.2,
      all(
        color.to("rgb(255, 51, 129)").in(0.5),
        springPath(curve, cubic),
        delay(
          0.3,
          cursorPos.to(cubic[2]).spring({
            ...Spring.Smooth,
            initialVelocity: point(50, 0),
            stiffness: 25,
            damping: 3,
            mass: 0.2,
            settleTolerance: 0.01,
          })
        )
      )
    );

    cursorAction.set("grabbing");

    yield* delay(
      0.5,
      all(
        cursorPos.to([2, 4]).in(0.8),
        curve.tweenAt(0.8, 2, (t, from) =>
          from!.lerp(point(2, 4), t)
        )
      )
    );

    cursorAction.set("leave");

    yield* all(
      cursorPos.to(point(10, 0)).in(1),
      pathLerps.tween(2, (t) =>
        generateInterpolationLines(curve.get(), t)
      ),
      pathLerpsOpacity.to(1).in(0.3),
      delay(2, pathLerpsOpacity.to(0).in(0.3))
    );

    yield* delay(
      0.3,
      all(
        color.to("rgb(51, 255, 201)").in(0.5),
        springPath(curve, quartic)
      )
    );
    yield* delay(
      0.5,
      all(
        color.to("rgb(51, 187, 255)").in(0.5),
        springPath(curve, spiral)
      )
    );

    pathLerpsStrength.set(0);
    const duration = 5;
    yield* all(
      cursorPos.to(point(10, 0)).in(1),
      t.to(0).in(duration, "easeInOutSine"),
      pathLerps.tween(
        duration,
        (t) =>
          generateInterpolationLines(
            curve.get(),
            1 - t
          ),
        "easeInOutSine"
      ),
      pathLerpsOpacity.to(1).in(0.5),
      delay(
        duration,
        pathLerpsOpacity.to(0).in(0.3)
      )
    );
  }
);

export function BezierScene({
  state,
}: {
  state: SceneState<typeof bezierScene>;
}) {
  return (
    <Graph
      width={"100%"}
      height={"100%"}
      coordBox={{
        horizontal: [-5, 5],
        vertical: [5, -5],
      }}
    >
      <Grid
        displayAxis={false}
        displayNumbers={false}
      />

      <PolyLine
        points={state.curve}
        strokeWidth={3}
        strokeColor={"#FFEBEB"}
        strokeDasharray={"10, 10"}
      />
      {state.pathLerps.map((line, i) => (
        <PolyLine
          key={i}
          points={line}
          strokeWidth={
            [1, 5, 10][state.pathLerpsStrength]!
          }
          strokeColor={"#B0DAFF"}
          opacity={state.pathLerpsOpacity}
        />
      ))}
      <Plot.Parametric
        strokeColor={state.color}
        domain={[0, state.t]}
        f={(t) => bezier(state.curve, t)}
        strokeWidth={20}
        strokeLinecap="round"
      />
      {state.curve.map((p, i) => (
        <Marker
          key={i}
          position={p}
          size={30}
          color="white"
          opacity={0.3}
        />
      ))}
      {state.pathLerpsStrength === 2 && (
        <Marker
          position={bezier(state.curve, state.t)}
          size={50}
          opacity={state.pathLerpsOpacity}
        />
      )}
      <Marker
        position={state.cursorPos.add(
          state.cursorAction === "grabbing"
            ? point(0.2, 0.03)
            : point(0, 0)
        )}
        size={120}
        label={
          state.cursorAction === "enter"
            ? "🤚"
            : state.cursorAction === "grabbing"
            ? "👌"
            : "🤙"
        }
        color="transparent"
      />
    </Graph>
  );
}
