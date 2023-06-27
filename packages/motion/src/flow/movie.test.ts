import { makeState, requestEnd, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";

import { movie, scene } from "./movie";

describe("movie", async () => {
  test("without transition", async () => {
    const scene1 = makeMotion("Test A", function* () {
      const test = yield* makeState("a", 0);
      yield test.set(1);
      yield test.set(2);
    });
    const scene2 = makeMotion("Test B", function* () {
      const test = yield* makeState("b", 0);
      yield test.set(1);
      yield test.set(2);
    });
    const scene3 = makeMotion("Test C", function* () {
      const test = yield* makeState("c", 0);
      yield test.set(1);
      yield test.set(2);
    });

    const testMovie = makeMotion(
      "Test",
      movie(
        scene("scene1", scene1),
        scene("scene2", scene2),
        scene("scene3", scene3)
      )
    );
    const executed = runMotion(testMovie, {
      fps: 1,
    });
    expect(executed.frames).toMatchSnapshot();
  });

  test("with transition", async () => {
    const scene1 = makeMotion("Test A", function* () {
      const test = yield* makeState("a", 0);
      yield* requestEnd();
      yield test.set(1);
      yield test.set(2);
    });
    const scene2 = makeMotion("Test B", function* () {
      const test = yield* makeState("b", 0);
      yield test.set(1);
      yield test.set(2);
    });

    const testMovie = makeMotion(
      "Test",
      movie(scene("scene1", scene1), scene("scene2", scene2))
    );
    const executed = runMotion(testMovie, {
      fps: 1,
    });

    expect(executed.frames).toMatchSnapshot();
  });
});
