import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";
import { chain } from "./chain";
import { wait } from "./wait";

describe("chain", async () => {
  test("should run threads in sequence", async () => {
    const makeSceneFrame = frameMaker(
      {
        a: "Waiting",
      },
      0
    );

    const executed = runMotion(
      {
        a: "Waiting",
      },
      function* (context) {
        yield* chain(
          function* () {
            context.state({
              a: "First",
            });
            yield;
          },
          function* () {
            context.state({
              a: "Second",
            });
            yield;
          },
          function* () {
            context.state({
              a: "Third",
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

    expect(executed.frames.length).toBe(6);
    expect(executed.frames).toEqual([
      makeSceneFrame({
        a: "First",
      }),
      makeSceneFrame({
        a: "Second",
      }),
      makeSceneFrame({
        a: "Third",
      }),
      makeSceneFrame(),
      makeSceneFrame(),
      makeSceneFrame(),
    ]);
  });
});
