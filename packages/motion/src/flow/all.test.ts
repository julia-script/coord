import { test, describe, expect } from "vitest";

import { runScene } from "@/context";
import { frameMaker } from "@/test-utils";

import { all } from "./all";
import { wait } from "./wait";
import { makeScene } from "@/movie";

describe("all", async () => {
  test("should run threads in parallel", async () => {
    const makeSceneFrame = frameMaker(
      {
        a: "Waiting",
        b: "Waiting",
        c: "Waiting",
      },
      0
    );
    const scene = makeScene(
      "Test",
      {
        a: "Waiting",
        b: "Waiting",
        c: "Waiting",
      },
      function* (context) {
        yield* all(
          function* A() {
            context.state({
              a: "A",
            });
            yield;
          },
          function* B() {
            context.state({
              b: "B",
            });
            yield;
          },
          function* C() {
            context.state({
              c: "C",
            });
            yield;
          },
          wait(1)
        );
      }
    );
    const executed = runScene(scene, {
      fps: 3,
    });

    expect(executed.frames).toEqual([
      makeSceneFrame({
        a: "A",
        b: "B",
        c: "C",
      }),
      makeSceneFrame(),
      makeSceneFrame(),
    ]);
  });
});
