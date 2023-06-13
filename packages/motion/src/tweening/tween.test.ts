import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";
import { tween } from "./tween";

describe("tween", async () => {
  test("waits the specified time before continuing", async () => {
    const makeSceneFrame = frameMaker(
      {
        t: 0,
      },
      0
    );

    const executed = runMotion(
      {
        t: 0,
      },
      function* (context) {
        yield* tween(1, (t) => context.state({ t }));
      },
      {
        fps: 3,
      }
    );

    expect(executed.frames.length).toBe(3);
    expect(executed.frames).toEqual([
      makeSceneFrame({
        t: 1 / 3,
      }),
      makeSceneFrame({
        t: 2 / 3,
      }),
      makeSceneFrame({
        t: 1,
      }),
    ]);
  });
});
