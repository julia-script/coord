import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";

import { all } from "@/flow";
import { point } from "@coord/core";
import { controlPoint } from "./point-control";

describe("point control", async () => {
  test("tweens to a value", async () => {
    let executed = runMotion(
      {
        point: point(0, 0),
      },
      function* () {
        yield* all(controlPoint("point", (t) => t.tweenTo([10, 10], 1)));
      }
    );

    expect(executed.frames.length).toBe(60);
    expect(executed.frames.at(-1)).toEqual({
      $frame: 59,
      $transitionIn: 1,
      point: point(10, 10),
    });
  });
});
