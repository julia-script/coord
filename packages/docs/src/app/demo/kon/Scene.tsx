import { CodeMotion } from "@coord/code";
import {
  BuilderState,
  chain,
  makeCodeState,
  makeMotion,
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

  yield* chain(
    codeState.to("var kon;").in(1),
    wait(1),
    codeState.to("const kon;").in(1),
    wait(1),
    codeState.to("const kon = true;").in(1),
    wait(1),
    codeState.to("const kon = () => {};").in(1),
    wait(1),
    codeState
      .to(
        'const kon = () => {\n  console.log("Oi, Kon")\n};'
      )
      .in(1),
    wait(1)
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
        className="m-auto p-28 text-3xl"
        noBg
        {...state.code}
      />
    </div>
  );
}
