import { test, describe, expect } from "vitest";
import { createMotion, requestContext, runScene } from "./motion-runner";
import { MotionContext, createMotionContext } from "./create-motion-context";
import { frameMaker } from "@/test-utils";
import { makeScene } from "..";

describe("createMotion", async () => {
  test("should create motion context and execute correctly", async () => {
    const scene = makeScene(
      "Test",
      {
        value: "",
      },
      function* motionBuilder(context) {
        yield;
        context.state({
          value: "Hello",
        });
        yield;
        context.state({
          value: "World",
        });
        yield;
      }
    );
    const [context, runner] = createMotion(scene);

    runner.next();
    expect(context?.frames.length).toBe(1);
    expect(context?.state().value).toBe("");
    runner.next();
    expect(context?.frames.length).toBe(2);
    expect(context?.state().value).toBe("Hello");
    runner.next();
    expect(context?.frames.length).toBe(3);
    expect(context?.state().value).toBe("World");

    expect(runner.next().done).toBe(true);
  });
});

describe("runScene", async () => {
  test("should create motion context and execute correctly", async () => {
    const scene = makeScene(
      "Test",
      {
        value: "",
      },
      function* motionBuilder(context) {
        yield;
        context.state({
          value: "Hello",
        });
        yield;
        context.state({
          value: "World",
        });
        yield;
      }
    );
    const context = runScene(scene);

    const makeSceneFrame = frameMaker(
      {
        value: "",
      },
      0
    );

    expect(context.frames).toEqual([
      makeSceneFrame(),
      makeSceneFrame({
        value: "Hello",
      }),
      makeSceneFrame({
        value: "World",
      }),
    ]);
  });
});

describe("requestContext", async () => {
  test("should provide context when requested", async () => {
    const scene = makeScene(
      "Test",
      {
        value: "",
      },
      function* motionBuilder() {
        const requestedContext = yield* requestContext();
        expect(requestedContext).instanceOf(MotionContext);
      }
    );
    runScene(scene);
  });
});
