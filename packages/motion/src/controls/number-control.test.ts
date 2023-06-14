import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";
import { controlNumber } from "./number-control";
import { all, chain } from "@/flow";

describe("number control", async () => {
  test("tweens to a value", async () => {
    let executed = runMotion(
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

    expect(executed.frames.length).toBe(60);

    expect(executed.frames.at(-1)).toEqual({
      $frame: 59,
      $transitionIn: 1,
      t: 10,
      b: [10, 2],
    });
  });
});
