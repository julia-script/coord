import { describe, test, expect } from "vitest";
import { makeMotion } from "./make-scene";
import { makeState } from "./requests";
import { runMotion } from "./run-scene";
import {
  YieldedType,
  isFunction,
  isGenerator,
  isGeneratorFunction,
} from "@coord/core";
import {
  isMakeStateRequest,
  isRequest,
} from "./assertions";
import { T } from "vitest/dist/types-dea83b3d";

describe("run-scene", () => {
  test("should return correct values", () => {
    const scene = makeMotion(
      "name",
      function* () {
        const [get, set] = yield* makeState(
          "x",
          0
        );
        yield* makeState("y", 0);
        yield* makeState("z", 0);
        yield set(1);
        yield set(2);
        yield set(3);
      }
    );

    const result = runMotion(scene);
    expect(result.frames).toEqual([
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
    ]);
  });
  test("should return correct values 2", () => {
    const scene = makeMotion(
      "name",
      function* () {
        const x = yield* makeControl("x", "a");
        const y = yield* makeControl("y", 0);
        const z = yield* makeControl("z", 0);

        yield* all(function* () {
          yield* makeState("z", "a");
        });
      }
    );

    const result = runMotion(scene);

    expect(result.frames).toEqual([
      { x: 1, y: 1, z: 1 },
    ]);
  });
});
