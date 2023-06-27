import { makeState, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { wait } from "./wait";

describe("wait", async () => {
  test("waits the specified time before continuing", async () => {
    const scene = makeMotion("Test", function* () {
      const a = yield* makeState("a", "Waiting");
      yield* wait(1);
      yield a.set("Done");
    });
    const executed = runMotion(scene, {
      fps: 3,
    });

    expect(executed.frames).toEqual([
      {
        a: "Waiting",
        $frame: 0,
        $transition: 1,
      },
      {
        a: "Waiting",
        $frame: 1,
        $transition: 1,
      },
      {
        a: "Waiting",
        $frame: 2,
        $transition: 1,
      },
      {
        a: "Done",
        $frame: 3,
        $transition: 1,
      },
    ]);
  });
});
