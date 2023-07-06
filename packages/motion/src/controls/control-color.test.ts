import { runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { makeColorState } from "./control-color";

describe("ColorControl", async () => {
  test("tweening", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeColorState(
          "a",
          "white"
        );
        yield* a.to("black").in(1);
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames.length).toBe(60);
    expect(executed.frames).toMatchSnapshot();
  });
});
