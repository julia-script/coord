import { Vec2, point } from "@coord/core/dist";
import {
  Control,
  Spring,
  SpringParameters,
  spring,
} from "@coord/motion/dist";

const lut = [
  [1], // n=0
  [1, 1], // n=1
  [1, 2, 1], // n=2
  [1, 3, 3, 1], // n=3
  [1, 4, 6, 4, 1], // n=4
  [1, 5, 10, 10, 5, 1], // n=5
  [1, 6, 15, 20, 15, 6, 1],
]; // n=6

export const binomial = (
  n: number,
  k: number
) => {
  while (n >= lut.length) {
    const s = lut.length;
    const nextRow = new Array(s + 1);
    nextRow[0] = 1;
    for (let i = 1, prev = s - 1; i < s; i++) {
      nextRow[i] =
        lut[prev][i - 1] + lut[prev][i];
    }
    nextRow[s] = 1;
    lut.push(nextRow);
  }
  return lut[n][k];
};

export const bezier = (
  w: Vec2[],
  t: number
): Vec2 => {
  let sumx = 0;
  let sumy = 0;
  const n = w.length - 1;

  for (let k = 0; k <= n; k++) {
    const pred =
      binomial(n, k) *
      Math.pow(1 - t, n - k) *
      Math.pow(t, k);
    sumx += w[k].x * pred;
    sumy += w[k].y * pred;
  }
  return point(sumx, sumy);
};

export function elevateBezierCurveOrder(
  controlVec2s: Vec2[],
  levels: number
): Vec2[] {
  if (controlVec2s.length <= 1) {
    throw new Error(
      "Control points array must have at least 2 points."
    );
  }
  if (levels === 0) return controlVec2s;
  if (levels < 1) {
    throw new Error(
      "Levels must be a positive integer."
    );
  }

  let currentControlVec2s = [...controlVec2s];

  for (let level = 0; level < levels; level++) {
    const p = currentControlVec2s,
      np = [p[0]],
      k = p.length;

    for (let i = 1, pi, pim; i < k; i++) {
      pi = p[i];
      pim = p[i - 1];
      np[i] = point(
        ((k - i) / k) * pi.x + (i / k) * pim.x,
        ((k - i) / k) * pi.y + (i / k) * pim.y
      );
    }
    np[k] = p[k - 1];
    currentControlVec2s = np;
  }

  return currentControlVec2s;
}

export const interpolateBezierCurves = (
  a: Vec2[],
  b: Vec2[]
) => {
  // if (t >= 1) return [...b];
  const raiseN = Math.abs(b.length - a.length);

  a =
    a.length < b.length
      ? elevateBezierCurveOrder(a, raiseN)
      : a;
  b =
    b.length < a.length
      ? elevateBezierCurveOrder(b, raiseN)
      : b;

  return (t: number) =>
    a.map((a, i) => {
      return a.lerp(b[i], t);
    });
};

export function springPath(
  control: Control<Vec2[]>,
  to: Vec2[],
  parameters: SpringParameters = Spring.Smooth
) {
  const from = control.get();
  const interpolator = interpolateBezierCurves(
    from,
    to
  );
  return spring(
    0,
    1,
    (t) => {
      control.set(interpolator(t));
    },
    parameters
  );
}

export const generateInterpolationLines = (
  w: Vec2[],
  t: number
) => {
  const levels: Vec2[][] = [];
  const pushLevel = (w: Vec2[], t: number) => {
    if (w.length <= 2) return;

    const level: Vec2[] = [];
    for (let i = 1; i < w.length; i++) {
      const prev = w[i - 1];
      const current = w[i];
      level.push(prev.lerp(current, t));
    }

    levels.push(level);
    pushLevel(level, t);
  };
  pushLevel(w, t);
  return levels;
};

export const makeSpiral = (points: number) => {
  const spiral: Vec2[] = [];

  const spiralRadius = point(5, 5);
  const center: Vec2 = point(0, 0);
  const turns = 3;
  for (let i = 0; i < points; i++) {
    const factor = i / points;
    const rot = turns * Math.PI * 2 * factor;

    const radius = spiralRadius.scale(factor);

    const rotation = point(
      Math.cos(rot),
      Math.sin(rot)
    ).mul(radius);

    spiral.push(rotation.add(center));
  }

  return spiral;
};
