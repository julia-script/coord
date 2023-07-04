import {
  Graph,
  Grid,
  Marker,
} from "@coord/graph";
import {
  BuilderState,
  all,
  chain,
  makeColorState,
  makeMotion,
  makeVec2State,
  sequence,
  wait,
} from "@coord/motion";

/**
 * the scene builder
 */
export function* builder() {
  const a = yield* makeVec2State("a", [-3, 3]);
  const b = yield* makeVec2State("b", [0, 3]);
  const c = yield* makeVec2State("c", [3, 3]);
  const color = yield* makeColorState(
    "color",
    "hsl(164 100.00% 60%)"
  );

  /**
   * Keyframes example
   */
  // yield;
  // yield color.set("red");
  // yield color.set("blue");
  // yield color.set("green");

  /**
   * Tweeening example
   */
  // yield* color.to("red").in(1);
  // yield* color.to("blue").in(1);
  // yield* color.to("green").in(1);

  /**
   * Tweening position example
   */

  // yield* a.to(({ x }) => [x, -3]).in(1);
  // yield* b.to(({ x }) => [x, -3]).in(1);
  // yield* c.to(({ x }) => [x, -3]).in(1);

  /**
   * Controlling flow 1
   */
  // yield* chain(
  //   a.to(({ x }) => [x, -3]).in(1),
  //   b.to(({ x }) => [x, -3]).in(1),
  //   c.to(({ x }) => [x, -3]).in(1)
  // );

  /**
   * Controlling flow 2
   */
  // yield* all(
  //   a.to(({ x }) => [x, -3]).in(1),
  //   b.to(({ x }) => [x, -3]).in(1),
  //   c.to(({ x }) => [x, -3]).in(1)
  // );

  /**
   * Controlling flow 3
   */
  // yield* sequence(
  //   0.3,
  //   a.to(({ x }) => [x, -3]).in(1),
  //   b.to(({ x }) => [x, -3]).in(1),
  //   c.to(({ x }) => [x, -3]).in(1)
  // );

  /**
   * Composing flows, wait and spring
   */
  yield* chain(
    all(
      color.to("hsl(200 100.00% 60%)").in(1),
      sequence(
        0.3,
        a.to(({ x }) => [x, -3]).in(1),
        b.to(({ x }) => [x, -3]).in(1),
        c.to(({ x }) => [x, -3]).in(1)
      )
    ),
    wait(1),
    all(
      color.to("hsl(337 100.00% 60%)").in(1),
      sequence(
        0.3,
        a.to(({ x }) => [x, 3]).spring(),
        b.to(({ x }) => [x, 3]).spring(),
        c.to(({ x }) => [x, 3]).spring()
      )
    )
  );
}

export const scene = makeMotion("Flow", builder);

/**
 * The scene component
 */
export function Scene({
  state,
}: {
  state: BuilderState<typeof builder>;
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

      <Marker
        position={state.a}
        size={150}
        color={state.color}
      />
      <Marker
        position={state.b}
        size={150}
        color={state.color}
      />
      <Marker
        position={state.c}
        size={150}
        color={state.color}
      />
    </Graph>
  );
}
