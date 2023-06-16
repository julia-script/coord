import { test, describe, expect } from "vitest";

import { runScene } from "@/context";

import { controlNumber } from "./number-control";
import { all } from "@/flow";
import { makeScene } from "@/movie";

describe("number control", async () => {
  test("tweens to a value", async () => {
    const scene = makeScene(
      "test",
      {
        t: 0,
        b: [0, 2],
      },
      function* () {
        const t = yield* controlNumber("t");
        yield* all(
          t.tweenTo(10, 1),
          controlNumber("b.0", (t) => t.tweenTo(10, 1))
        );
      }
    );
    let executed = runScene(scene);

    expect(executed.frames.length).toBe(60);

    expect(executed.frames.at(-1)).toEqual({
      $frame: 59,
      $transitionIn: 1,
      t: 10,
      b: [10, 2],
    });
  });
});
