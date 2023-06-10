import { test, describe, expect } from "vitest";
import { transform } from "./transform";
import { point } from "./vec2";

describe("Transform", () => {
  test("getPosition", () => {
    const t = transform().setPosition({ x: 3, y: 6 });
    expect(t.getPosition()).toEqual({ x: 3, y: 6 });
  });

  test("getRotation", () => {
    const t = transform().setRotation(Math.PI / 4);
    expect(t.getRotation()).toBeCloseTo(Math.PI / 4);
  });

  test("getScale", () => {
    const t = transform().setScale({ x: 2, y: 3 });
    expect(t.getScale()).toEqual({ x: 2, y: 3 });
  });

  test("copy", () => {
    const t1 = transform().setPosition({ x: 3, y: 6 });
    const t2 = t1.copy();
    expect(t1).not.toBe(t2);
    expect(t1.getPosition()).toEqual(t2.getPosition());
  });

  test("setPosition", () => {
    const t1 = transform().setPosition({ x: 3, y: 6 });
    const t2 = t1.setPosition({ x: 4, y: 5 });
    expect(t1.getPosition()).toEqual({ x: 3, y: 6 });
    expect(t2.getPosition()).toEqual({ x: 4, y: 5 });
  });

  test("setRotation", () => {
    const t1 = transform().setRotation(Math.PI / 4);
    const t2 = t1.setRotation(Math.PI / 2);
    expect(t1.getRotation()).toBeCloseTo(Math.PI / 4);
    expect(t2.getRotation()).toBeCloseTo(Math.PI / 2);
  });

  test("setScale", () => {
    const t1 = transform().setScale({ x: 2, y: 3 });
    const t2 = t1.setScale({ x: 4, y: 5 });
    expect(t1.getScale()).toEqual({ x: 2, y: 3 });
    expect(t2.getScale()).toEqual({ x: 4, y: 5 });
  });

  test("scale", () => {
    const t1 = transform().setScale({ x: 2, y: 3 });
    const t2 = t1.scale(2);
    const t3 = t1.scale(2, 3);
    expect(t1.getScale()).toEqual({ x: 2, y: 3 });
    expect(t2.getScale()).toEqual({ x: 4, y: 6 });
    expect(t3.getScale()).toEqual({ x: 4, y: 9 });
  });

  test("scaleAboutOrigin", () => {
    const t1 = transform().scaleAboutOrigin(point(0, 0), 2);
    const t2 = transform().scaleAboutOrigin(point(5, 5), 2);

    expect(t1.applyTo(point(5, 5))).toEqual(point(10, 10));
    expect(t2.applyTo(point(5, 5))).toEqual(point(5, 5));
  });

  test("translate", () => {
    const t1 = transform().setPosition({ x: 3, y: 6 });
    const t2 = t1.translate(2, 3);
    expect(t1.getPosition()).toEqual({ x: 3, y: 6 });
    expect(t2.getPosition()).toEqual({ x: 5, y: 9 });
  });

  test("rotate", () => {
    const t1 = transform().setRotation(Math.PI / 4);
    const t2 = t1.rotate(Math.PI / 2);
    expect(t1.getRotation()).toBeCloseTo(Math.PI / 4);
    expect(t2.getRotation()).toBeCloseTo(Math.PI / 4 + Math.PI / 2);
  });

  test("lerp", () => {
    const t1 = transform().setPosition({ x: 3, y: 6 });
    const t2 = transform().setPosition({ x: 6, y: 3 });
    const t3 = t1.lerp(t2, 0.5);
    expect(t1.getPosition()).toEqual({ x: 3, y: 6 });
    expect(t2.getPosition()).toEqual({ x: 6, y: 3 });
    expect(t3.getPosition()).toEqual({ x: 4.5, y: 4.5 });
  });

  test("applyTo", () => {
    const t1 = transform().scale(2);

    const p = point(1, 1);
    const q = t1.applyTo(p);
    expect(q).toEqual(point(2, 2));
  });

  test("invert", () => {
    const t1 = transform().scale(2).translate(5, 5);
    const t2 = t1.invert();

    const p = point(5, 5);
    const q = t1.applyTo(p);
    const r = t2.applyTo(q);

    expect(q).toEqual(point(15, 15));
    expect(r).toEqual(p);
  });

  test("applyInverseTo", () => {
    const t1 = transform().scale(2).translate(5, 5);

    const p = point(5, 5);
    const q = t1.applyTo(p);
    const r = t1.applyInverseTo(q);

    expect(q).toEqual(point(15, 15));
    expect(r).toEqual(p);
  });
});
