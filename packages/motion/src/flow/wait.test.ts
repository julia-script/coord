import { makeState, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { wait } from "./wait";

describe("wait", async () => {
  test("waits the specified time before continuing", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeState(
          "a",
          "Waiting"
        );
        yield* wait(1);
        yield a.set("Done");
      }
    );
    const executed = runMotion(scene, {
      fps: 3,
    });

    expect(executed.frames).toMatchSnapshot();
  });
});
