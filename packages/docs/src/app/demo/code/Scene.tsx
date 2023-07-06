import { CodeMotion } from "@coord/code";
import {
  Graph,
  Grid,
  Marker,
} from "@coord/graph";
import {
  BuilderState,
  all,
  chain,
  makeCodeState,
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
  const codeState = yield* makeCodeState(
    "code",
    ""
  );

  const a = yield* makeVec2State("a", [-3, 3]);
  const b = yield* makeVec2State("b", [0, 3]);
  const c = yield* makeVec2State("c", [3, 3]);
  const color = yield* makeColorState(
    "color",
    "hsl(164 100.00% 60%)"
  );
  yield* codeState
    .to(
      `
        yield* chain(
          a.to(({ x, y}) => [x, y * -1]).in(1),
          b.to(({ x, y}) => [x, y * -1]).in(1),
          c.to(({ x, y}) => [x, y * -1]).in(1)
        );
      `
    )
    .in(1),
    yield* all(
      chain(
        a.to(({ x, y }) => [x, y * -1]).in(1),
        b.to(({ x, y }) => [x, y * -1]).in(1),
        c.to(({ x, y }) => [x, y * -1]).in(1)
      )
    );

  yield* codeState
    .to(
      `
      yield* all(
        a.to(({ x, y}) => [x, y * -1]).in(1),
        b.to(({ x, y}) => [x, y * -1]).in(1),
        c.to(({ x, y}) => [x, y * -1]).in(1)
      );
    `
    )
    .in(1),
    yield* all(
      all(
        a.to(({ x, y }) => [x, y * -1]).in(1),
        b.to(({ x, y }) => [x, y * -1]).in(1),
        c.to(({ x, y }) => [x, y * -1]).in(1)
      )
    );

  yield* codeState
    .to(
      `
        chain(
          all(
            color.to("hsl(200 100.00% 60%)").in(1),
            sequence(
              0.3,
              a.to(({ x, y}) => [x, y * -1]).in(1),
              b.to(({ x, y}) => [x, y * -1]).in(1),
              c.to(({ x, y}) => [x, y * -1]).in(1)
            )
          ),
          wait(1),
          all(
            color.to("hsl(337 100.00% 60%)").in(1),
            sequence(
              0.3,
              a.to(({ x, y}) => [x, y * -1).spring(),
              b.to(({ x, y}) => [x, y * -1).spring(),
              c.to(({ x, y}) => [x, y * -1).spring()
            )
          )
        );
      `
    )
    .in(1);
  yield* all(
    chain(
      all(
        color.to("hsl(200 100.00% 60%)").in(1),
        sequence(
          0.3,
          a.to(({ x, y }) => [x, y * -1]).in(1),
          b.to(({ x, y }) => [x, y * -1]).in(1),
          c.to(({ x, y }) => [x, y * -1]).in(1)
        )
      ),
      wait(1),
      all(
        color.to("hsl(337 100.00% 60%)").in(1),
        sequence(
          0.3,
          a
            .to(({ x, y }) => [x, y * -1])
            .spring(),
          b
            .to(({ x, y }) => [x, y * -1])
            .spring(),
          c.to(({ x, y }) => [x, y * -1]).spring()
        )
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
    <div className="relative flex h-full w-full items-center">
      <CodeMotion
        className="w-1/2 p-28 text-2xl"
        noBg
        {...state.code}
      />
      <Graph
        width={"50%"}
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
    </div>
  );
}
