import { test, describe, expect } from "vitest";

import { runScene } from "@/context";
import { frameMaker } from "@/test-utils";
import { delay } from "./delay";
import { makeScene } from "@/movie";

describe("delay", async () => {
  test("waits the specified time before continuing", async () => {
    const makeSceneFrame = frameMaker(
      {
        a: "Waiting",
      },
      0
    );
    const scene = makeScene(
      "Test",
      {
        a: "Waiting",
      },
      function* (context) {
        yield* delay(1, function* () {
          context.state({
            a: "One second later",
          });
          yield;
        });
      }
    );

    const executed = runScene(scene, {
      fps: 3,
    });

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
