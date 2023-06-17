import { test, describe, expect } from "vitest";

import { runScene } from "@/context";

import { all } from "@/flow";
import { point } from "@coord/core";
import { controlPoint } from "./point-control";
import { makeScene } from "@/movie";

describe("point control", async () => {
  test("tweens to a value", async () => {
    const scene = makeScene(
      "Test",
      {
        point: point(0, 0),
      },
      function* () {
        yield* all(controlPoint("point", (t) => t.to([10, 10]).in(1)));
      }
    );
    let executed = runScene(scene);

    expect(executed.frames.length).toBe(60);
    expect(executed.frames.at(-1)).toEqual({
      $frame: 59,
      $transitionIn: 1,
      point: point(10, 10),
    });
  });
});
