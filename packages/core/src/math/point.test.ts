import { test, describe, expect } from "vitest";
import { point } from "./point";

describe("Point", async () => {
  test("toArray", () => {
    const p = point(1, 2);
    const arr = p.toArray();
    expect(arr).toEqual([1, 2]);
  });

  test("clone", () => {
    const p1 = point(1, 2);
    const p2 = p1.clone();
    expect(p1).toEqual(p2);
    expect(p1).not.toBe(p2);
  });

  test("lerp", () => {
    const p1 = point(1, 2);
    const p2 = point(3, 4);
    const p3 = p1.lerp(p2, 0.5);
    expect(p3).toEqual(point(2, 3));
  });

  test("rotate", () => {
    const p1 = point(1, 0);
    const { x, y } = p1.rotate(Math.PI / 2);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(1);
  });

  test("angle", () => {
    const p1 = point(1, 1);
    const a = p1.angle();
    expect(a).toBeCloseTo(Math.PI / 4);
  });

  test("angleTo", () => {
    const p1 = point(1, 1);
    const p2 = point(-1, -1);
    const a = p1.angleTo(p2);
    expect(a).toBeCloseTo(Math.PI);
  });

  test("squaredDistanceTo", () => {
    const p1 = point(1, 1);
    const p2 = point(4, 5);
    const d = p1.squaredDistanceTo(p2);
    expect(d).toBe(25);
  });

  test("distanceTo", () => {
    const p1 = point(1, 1);
    const p2 = point(4, 5);
    const d = p1.distanceTo(p2);
    expect(d).toBeCloseTo(5);
  });

  test("length", () => {
    const p1 = point(3, 4);
    const l = p1.length();
    expect(l).toBe(5);
  });

  test("lengthSquared", () => {
    const p1 = point(3, 4);
    const l = p1.lengthSquared();
    expect(l).toBe(25);
  });

  test("sub", () => {
    const p1 = point(3, 4);
    const p2 = point(1, 2);
    const p3 = p1.sub(p2);
    expect(p3).toEqual(point(2, 2));
  });

  test("add", () => {
    const p1 = point(3, 4);
    const p2 = point(1, 2);
    const p3 = p1.add(p2);
    expect(p3).toEqual(point(4, 6));
  });

  test("mul", () => {
    const p1 = point(3, 4);
    const p2 = point(2, 3);
    const p3 = p1.mul(p2);
    expect(p3).toEqual(point(6, 12));
  });

  test("scale", () => {
    const p1 = point(3, 4);
    const p2 = p1.scale(2);
    expect(p2).toEqual(point(6, 8));
  });

  test("div", () => {
    const p1 = point(3, 4);
    const p2 = point(2, 3);
    const p3 = p1.div(p2);
    expect(p3).toEqual(point(1.5, 4 / 3));
  });
});
