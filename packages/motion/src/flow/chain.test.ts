import { makeState, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { wait } from "./wait";

describe("chain", async () => {
  test("should run threads in sequence", async () => {
    const scene = makeMotion("Test", function* () {
      const a = yield* makeState("a", "Waiting");
      yield a.set("First");
      yield a.set("Second");
      yield a.set("Third");
      yield* wait(1);
    });
    const executed = runMotion(scene, {
      fps: 3,
      transitionDuration: 1,
    });

    expect(executed.frames).toEqual([
      [
        {
          a: "First",
          $frame: 0,
          $transition: 0.3333333333333333,
        },
        {
          a: "Second",
          $frame: 1,
          $transition: 0.6666666666666666,
        },
        {
          a: "Third",
          $frame: 2,
          $transition: 1,
        },
        {
          a: "Third",
          $frame: 3,
          $transition: 1,
        },
        {
          a: "Third",
          $frame: 4,
          $transition: 1,
        },
        {
          a: "Third",
          $frame: 5,
          $transition: 1,
        },
      ],
    ]);
  });
});
