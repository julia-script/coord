import { makeState, runMotion } from "@/motion";
import { makeMotion } from "@/motion";
import { test, describe, expect } from "vitest";
import { control } from "./control";
import { makeNumberState } from "./control-number";
import { makeTransformState } from "./control-transform";
import { transform } from "@coord/core";
import { makeCodeState } from "./control-code";
import { code, replace } from "@coord/code";

describe("CodeControl", async () => {
  test("tweening", async () => {
    const scene = makeMotion(
      "Test",
      function* () {
        const a = yield* makeCodeState(
          "a",
          code`
        function helloWorld() {
          console.log("Hello World");
        }
      `
        );
        yield* a
          .edit(
            code`
            function helloWorld() {
              console.log("Hello ${replace(
                "World",
                "Universe"
              )}");
            }
          `
          )
          .in(1);
      }
    );
    const executed = runMotion(scene);

    expect(executed.frames.length).toBe(60);
    expect(executed.frames).toMatchSnapshot();
  });
});
