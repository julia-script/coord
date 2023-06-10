import { test, describe, expect } from "vitest";
import { lerp } from "./lerp";

describe("lerp", () => {
  test("should interpolate between two numbers", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 100, 0.25)).toBe(25);
    expect(lerp(-10, 10, 0.75)).toBe(5);
  });

  test("should return the start value when t is 0", () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(-10, 10, 0)).toBe(-10);
    expect(lerp(100, 200, 0)).toBe(100);
  });

  test("should return the end value when t is 1", () => {
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(-10, 10, 1)).toBe(10);
    expect(lerp(100, 200, 1)).toBe(200);
  });

  test("should handle negative values", () => {
    expect(lerp(-10, -5, 0.5)).toBe(-7.5);
    expect(lerp(-100, -50, 0.25)).toBe(-87.5);
    expect(lerp(-10, 10, 0.5)).toBe(0);
  });
});
