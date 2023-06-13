import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";

import { all } from "./all";
import { wait } from "./wait";

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

    const executed = runMotion(
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
      },
      {
        fps: 3,
      }
    );

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
