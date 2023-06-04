import { Point } from "@curves/core";

export const parametricAdaptiveSampling = (
  domain: [number, number],
  xy: (t: number) => Point,
  errorTolerance: number,
  minSamplingDepth = 2,
  maxSamplingDepth = 10
): Point[] => {
  const squaredTolerance = errorTolerance * errorTolerance;
  const start = xy(domain[0]);
  const end = xy(domain[1]);
  const points: Point[] = [];
  const pushPoint = (point: Point) => {
    if (!point.isNaN()) {
      points.push(point);
    }
  };
  pushPoint(start);
  const split = (
    domain: [number, number],
    min: Point,
    max: Point,
    depth: number
  ) => {
    const [tMin, tMax] = domain;
    const tMid = (tMin + tMax) / 2;
    const mid = xy(tMid);

    const estimatedMidPoint = new Point(
      (min.x + max.x) / 2,
      (min.y + max.y) / 2
    );

    const squaredError = mid.squaredDistanceTo(estimatedMidPoint) ** 2;

    if (
      depth < minSamplingDepth ||
      (squaredError > squaredTolerance && depth < maxSamplingDepth)
    ) {
      split([tMin, tMid], min, mid, depth + 1);
      split([tMid, tMax], mid, max, depth + 1);

      return;
    }

    pushPoint(mid);
    pushPoint(max);
  };
  split(domain, start, end, 0);
  return points;
};
