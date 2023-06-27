import { test, describe, expect } from "vitest";
import { makeState, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { all } from "./all";

describe("all", async () => {
  test("should run threads in parallel", async () => {
    const scene = makeMotion("Test", function* () {
      const a = yield* makeState("a", 1);
      const b = yield* makeState("b", 1);
      const c = yield* makeState("c", 1);
      yield;
      yield* all(a.as(2), b.as(2), c.as(2));
      yield* all(a.as(3), b.as(3), c.as(3));
    });
    const executed = runMotion(scene, {
      fps: 3,
    });

    expect(executed.frames).toEqual([
      {
        a: 1,
        b: 1,
        c: 1,
        $frame: 0,
        $transition: 1,
      },
      {
        a: 2,
        b: 2,
        c: 2,
        $frame: 1,
        $transition: 1,
      },
      {
        a: 3,
        b: 3,
        c: 3,
        $frame: 2,
        $transition: 1,
      },
    ]);
  });
});
