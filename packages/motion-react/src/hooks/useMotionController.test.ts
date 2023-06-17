import { test, expect, describe, vi } from "vitest";
import { useMotionController } from "./useMotionController";
import { renderHook } from "@testing-library/react-hooks";
import { MotionScene, makeScene } from "@coord/motion";

describe("useMotionController", () => {
  test("should return correct values", () => {
    const scene = makeScene("Test", { x: 0, y: 0 }, function* () {
      yield;
      yield;
      yield;
    });

    const { result } = renderHook(() => useMotionController(scene));
    expect(result.current.playing).toBe(false);
    expect(result.current.frame).toBe(0);
    expect(result.current.playRange).toEqual([0, 50]);
    expect(result.current.repeat).toBe(false);

    result.current.play();
    expect(result.current.playing).toBe(true);
    result.current.pause();
    expect(result.current.playing).toBe(false);
  });
});
