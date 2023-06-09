import { test, describe, expect } from "vitest";
import { remap } from "./remap";

describe("remap", () => {
  test("should remap a value from one range to another", () => {
    expect(remap(0, 0, 10, 0, 100)).toBe(0);
    expect(remap(5, 0, 10, 0, 100)).toBe(50);
    expect(remap(10, 0, 10, 0, 100)).toBe(100);
    expect(remap(2.5, 0, 5, 0, 100)).toBe(50);
  });

  test("should handle negative values", () => {
    expect(remap(-5, -10, 0, 0, 100)).toBe(50);
    expect(remap(-2.5, -5, 0, 0, 100)).toBe(50);
    expect(remap(-10, -10, 10, 0, 100)).toBe(0);
    expect(remap(-5, -10, 10, 0, 100)).toBe(25);
  });

  test("should handle reversed ranges", () => {
    expect(remap(0, 10, 0, 0, 100)).toBe(100);
    expect(remap(5, 10, 0, 0, 100)).toBe(50);
    expect(remap(10, 10, 0, 0, 100)).toBe(0);
    expect(remap(2.5, 5, 0, 0, 100)).toBe(50);
  });

  test("should handle non-zero start values", () => {
    expect(remap(0, 0, 10, 10, 110)).toBe(10);
    expect(remap(5, 0, 10, 10, 110)).toBe(60);
    expect(remap(10, 0, 10, 10, 110)).toBe(110);
    expect(remap(2.5, 0, 5, 10, 110)).toBe(60);
  });
});
