import {
  Vec2,
  Transform,
  point,
} from "@coord/core";
import {
  Scalar,
  Space,
  ScalarPoint,
} from "@/types";
import { clamp } from "lodash-es";

export const parseScalar = (
  value: Scalar,
  inferredUnit: Space = "coordspace"
): [number, Space] => {
  if (typeof value === "number") {
    return [value, inferredUnit];
  }
  const unit: Space =
    value.slice(-2) === "cs"
      ? "coordspace"
      : "viewspace";
  const number = parseFloat(value.slice(0, -2));
  return [number, unit];
};
export const normalizeScalarPoint = (
  point: ScalarPoint,
  inferredUnit: Space = "coordspace"
): [[number, Space], [number, Space]] => {
  if (point instanceof Vec2 || "x" in point) {
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

const isScalar = (
  value: unknown
): value is Scalar => {
  return (
    typeof value === "number" ||
    typeof value === "string"
  );
};
export const projectSizeFactory = (
  projection: Transform,
  abs = false,
  inverse = false
) => {
  const applyTo = (p: Vec2) => {
    if (inverse) {
      return projection.applyInverseTo(p);
    }
    return projection.applyTo(p);
  };
  const origin = applyTo(point(0, 0));

  const unit = inverse
    ? "viewspace"
    : "coordspace";

  function factory(
    size: ScalarPoint,
    inferredUnit?: Space
  ): Vec2;
  function factory(
    size: Scalar,
    inferredUnit?: Space
  ): number;
  function factory(
    size: Scalar | ScalarPoint,
    inferredUnit: Space = unit
  ): number | Vec2 {
    if (isScalar(size)) {
      let [s, sizeUnit] = parseScalar(
        size,
        inferredUnit
      );

      const projectedPoint = applyTo(point(0, s));
      s =
        sizeUnit === unit
          ? projectedPoint.y - origin.y
          : s;
      if (abs) {
        return Math.abs(s);
      }
      return s;
    }
    const [[x, xUnit], [y, yUnit]] =
      normalizeScalarPoint(size, inferredUnit);

    const projectedPoint = applyTo(
      point(x, y)
    ).sub(origin);

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
  (
    coord: ScalarPoint,
    inferredUnit: Space = "coordspace"
  ): Vec2 => {
    let [[x, xUnit], [y, yUnit]] =
      normalizeScalarPoint(coord, inferredUnit);

    x = clamp(
      x,
      -Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    );
    y = clamp(
      y,
      -Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    );

    if (
      xUnit !== "coordspace" &&
      yUnit !== "coordspace"
    ) {
      return point(x, y);
    }
    const projectedPoint = projection.applyTo(
      point(x, y)
    );

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
      xUnit === "coordspace"
        ? projectedPoint.x
        : x,
      yUnit === "coordspace"
        ? projectedPoint.y
        : y
    );
  };

export const unprojectCoordFactory =
  (projection: Transform) =>
  (
    coord: ScalarPoint,
    inferredUnit: Space = "viewspace"
  ): Vec2 => {
    const [[x, xUnit], [y, yUnit]] =
      normalizeScalarPoint(coord, inferredUnit);

    const unprojectedPoint =
      projection.applyInverseTo(point(x, y));

    return point(
      xUnit === "viewspace"
        ? unprojectedPoint.x
        : x,
      yUnit === "viewspace"
        ? unprojectedPoint.y
        : y
    );
  };
