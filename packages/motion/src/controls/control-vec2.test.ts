import { runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { makeVec2State } from "./control-vec2";

describe("Vec2Control", async () => {
  test("tweening", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeVec2State(
          "a",
          [10, 10]
        );
        yield* a.to([30, 15]).in(1);
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames.length).toBe(60);
    expect(executed.frames).toMatchSnapshot();
  });
  test("spring", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeVec2State(
          "a",
          [10, 10]
        );

        yield* a.to([30, 30]).spring();
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames).toMatchSnapshot();
  });
});
