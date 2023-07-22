import { runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { makeNumberState } from "./control-number";

describe("NumberControl", async () => {
  test("tweening", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeNumberState("a", 10);
        yield* a.to(100).in(1);
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames.length).toBe(60);
    expect(executed.frames).toMatchSnapshot();
  });
  test("spring", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeNumberState("a", 10);

        yield* a.to(100).spring();
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames).toMatchSnapshot();
  });
});
