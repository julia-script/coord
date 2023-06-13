import { test, describe, expect } from "vitest";
import { createMotion, requestContext, runMotion } from "./motion-runner";
import { MotionContext, createMotionContext } from "./create-motion-context";
import { frameMaker } from "@/test-utils";

describe("createMotion", async () => {
  test("should create motion context and execute correctly", async () => {
    const [context, runner] = createMotion(
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

describe("runMotion", async () => {
  test("should create motion context and execute correctly", async () => {
    const context = runMotion(
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
    runMotion(
      {
        value: "",
      },
      function* motionBuilder() {
        const requestedContext = yield* requestContext();
        expect(requestedContext).instanceOf(MotionContext);
      }
    );
  });
});
