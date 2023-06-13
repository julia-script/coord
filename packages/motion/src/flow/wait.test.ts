import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";
import { wait } from "./wait";

describe("wait", async () => {
  test("waits the specified time before continuing", async () => {
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
        yield* wait(1);
        context.state({
          a: "One second later",
        });
        yield;
      },
      {
        fps: 3,
      }
    );

    expect(executed.frames.length).toBe(4);
    expect(executed.frames).toEqual([
      makeSceneFrame({
        a: "Waiting",
      }),
      makeSceneFrame({
        a: "Waiting",
      }),
      makeSceneFrame({
        a: "Waiting",
      }),
      makeSceneFrame({
        a: "One second later",
      }),
    ]);
  });
});
