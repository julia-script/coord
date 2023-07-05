import { makeState, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { control } from "./control";
import { makeNumberState } from "./control-number";
import { makeTransformState } from "./control-transform";
import { transform } from "@coord/core";

describe("TransformControl", async () => {
  test("tweening", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeTransformState(
          "a",
          transform()
        );
        yield* a.translate(10, 10).scale(2).in(1);
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames.length).toBe(60);
    expect(executed.frames).toMatchSnapshot();
  });
});
