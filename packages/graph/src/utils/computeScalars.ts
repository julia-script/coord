import { Point, point, remap } from "@curves/core";
import { isNumber, isString } from "lodash-es";
import { Scalar, ScalarUnits, ScalarPoint, BBox } from "../types";

export const parseScalar = (
  value: Scalar,
  inferredUnit: ScalarUnits = "cs"
): [number, ScalarUnits] => {
  if (typeof value === "number") {
    return [value, inferredUnit];
  }
  const unit = value.slice(-2) as ScalarUnits;
  const number = parseFloat(value.slice(0, -2));
  return [number, unit];
};

export const createScalarToVsComputer = (unitInPx: number) => {
  return (value: Scalar, inferredUnit: ScalarUnits = "cs") => {
    const [valueNumber, valueUnit] = parseScalar(value, inferredUnit);
    if (valueUnit === "vs") {
      return valueNumber;
    }
    return valueNumber * unitInPx;
  };
};

const isCoordSpace = (
  coord: ScalarPoint,
  inferredUnit: ScalarUnits = "cs"
): boolean => {
  if ("_space" in coord) {
    if (coord.isCoordSpace()) {
      return true;
    }
  } else if (inferredUnit === "cs") {
    return true;
  }
  return false;
};
export const createCoordToVsComputer = (coordBox: BBox, viewSize: Point) => {
  // const [width, height] = viewSize;
  const { horizontal, vertical } = coordBox;
  // const [xMin, xMax] = coordBox.horizontal;
  // const [yMin, yMax] = coordBox.vertical;

  return (coord: ScalarPoint, inferredUnit: ScalarUnits = "cs"): Point => {
    if (isCoordSpace(coord, inferredUnit)) {
      return point(
        remap(horizontal.x, horizontal.y, 0, viewSize.x, coord.x),
        remap(vertical.x, vertical.y, 0, viewSize.y, coord.y)
      );
    }
    return coord;
  };
};

export const createVsToCoordComputer = (coordBox: BBox, viewSize: Point) => {
  return (coord: ScalarPoint, inferredUnit: ScalarUnits = "vs"): Point => {
    if (!isCoordSpace(coord, inferredUnit)) {
      return point(
        remap(
          0,
          viewSize.x,
          coordBox.horizontal.x,
          coordBox.horizontal.y,
          coord.x
        ),
        remap(0, viewSize.y, coordBox.vertical.x, coordBox.vertical.y, coord.y)
      );
    }
    return coord;
  };
};

export const createCoordSizeToVsComputer = (unitVectorSize: Point) => {
  // const [xUnit, yUnit] = unitVectorSize;

  function fn(size: ScalarPoint, inferredUnit?: ScalarUnits): Point;
  function fn(size: Scalar, inferredUnit?: ScalarUnits): number;
  function fn(
    size: ScalarPoint | Scalar,
    inferredUnit: ScalarUnits = "cs"
  ): Point | number {
    if (isNumber(size) || isString(size)) {
      const [value, unit] = parseScalar(size, inferredUnit);
      if (unit === "vs") {
        return value;
      }
      return value * unitVectorSize.x;
    }

    if (isCoordSpace(size, inferredUnit)) {
      return point(size.x * unitVectorSize.x, size.y * unitVectorSize.y);
    }
    return size;
  }
  return fn;
};

export const createVsSizeToCsComputer = (unitVectorSize: Point) => {
  function fn(size: ScalarPoint, inferredUnit?: ScalarUnits): Point;
  function fn(size: Scalar, inferredUnit?: ScalarUnits): number;
  function fn(
    size: ScalarPoint | Scalar,
    inferredUnit: ScalarUnits = "vs"
  ): Point | number {
    if (isNumber(size) || isString(size)) {
      const [value, unit] = parseScalar(size, inferredUnit);
      if (unit === "cs") {
        return value;
      }
      return value / unitVectorSize.x;
    }

    if (!isCoordSpace(size, inferredUnit)) {
      return point(size.x / unitVectorSize.x, size.y / unitVectorSize.y);
    }
    return size;
  }
  return fn;
};
