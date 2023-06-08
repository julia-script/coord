import { Point, Transform, point } from "@coord/core";
import { Scalar, Space, GraphPoint } from "@/types";
import { clamp } from "lodash-es";

export const parseScalar = (
  value: Scalar,
  inferredUnit: Space = "coordspace"
): [number, Space] => {
  if (typeof value === "number") {
    return [value, inferredUnit];
  }
  const unit: Space = value.slice(-2) === "cs" ? "coordspace" : "viewspace";
  const number = parseFloat(value.slice(0, -2));
  return [number, unit];
};
export const normalizeGraphPoint = (
  point: GraphPoint,
  inferredUnit: Space = "coordspace"
): [[number, Space], [number, Space]] => {
  if (point instanceof Point || "x" in point) {
    return [
      parseScalar(point.x, inferredUnit),
      parseScalar(point.y, inferredUnit),
    ];
  }
  return [
    parseScalar(point[0], inferredUnit),
    parseScalar(point[1], inferredUnit),
  ];
};

const isScalar = (value: unknown): value is Scalar => {
  return typeof value === "number" || typeof value === "string";
};
export const projectSizeFactory = (
  projection: Transform,
  abs = false,
  inverse = false
) => {
  const applyTo = (p: Point) => {
    if (inverse) {
      return projection.applyInverseTo(p);
    }
    return projection.applyTo(p);
  };
  const origin = applyTo(point(0, 0));

  const unit = inverse ? "viewspace" : "coordspace";

  function factory(size: GraphPoint, inferredUnit?: Space): Point;
  function factory(size: Scalar, inferredUnit?: Space): number;
  function factory(
    size: Scalar | GraphPoint,
    inferredUnit: Space = unit
  ): number | Point {
    if (isScalar(size)) {
      let [s, sizeUnit] = parseScalar(size, inferredUnit);

      const projectedPoint = applyTo(point(0, s));
      s = sizeUnit === unit ? projectedPoint.y - origin.y : s;
      if (abs) {
        return Math.abs(s);
      }
      return s;
    }
    const [[x, xUnit], [y, yUnit]] = normalizeGraphPoint(size, inferredUnit);

    const projectedPoint = applyTo(point(x, y)).sub(origin);

    const p = point(
      xUnit === unit ? projectedPoint.x : x,
      yUnit === unit ? projectedPoint.y : y
    );
    if (abs) {
      return p.abs();
    }
    return p;
  }
  return factory;
};

export const projectCoordFactory =
  (projection: Transform) =>
  (coord: GraphPoint, inferredUnit: Space = "coordspace"): Point => {
    let [[x, xUnit], [y, yUnit]] = normalizeGraphPoint(coord, inferredUnit);

    x = clamp(x, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    y = clamp(y, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

    if (xUnit !== "coordspace" && yUnit !== "coordspace") {
      return point(x, y);
    }
    const projectedPoint = projection.applyTo(point(x, y));

    projectedPoint.x = clamp(
      projectedPoint.x,
      -Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    );

    projectedPoint.y = clamp(
      projectedPoint.y,
      -Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    );

    return point(
      xUnit === "coordspace" ? projectedPoint.x : x,
      yUnit === "coordspace" ? projectedPoint.y : y
    );
  };

export const unprojectCoordFactory =
  (projection: Transform) =>
  (coord: GraphPoint): Point => {
    const [[x, xUnit], [y, yUnit]] = normalizeGraphPoint(coord, "viewspace");

    const unprojectedPoint = projection.applyInverseTo(point(x, y));

    return point(
      xUnit === "viewspace" ? unprojectedPoint.x : x,
      yUnit === "viewspace" ? unprojectedPoint.y : y
    );
  };
