import { Point, Pointish, point } from "@coord/core";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ScalarUnits = "vs" | "cs";
export type Scalar = number | `${number}${ScalarUnits}`;

export type Space = "viewspace" | "coordspace";
export type GraphPoint = Readonly<
  Point | [Scalar, Scalar] | { x: Scalar; y: Scalar }
>;

export interface Theme {
  background: string;
  body: string;
  text: string;

  fontSize: Scalar;
  fontWeight: number | string;
  fontFamily: string;
  grid: {
    maxStepSize: number;
    stepStrokeColor: string;
    stepStrokeWidth: Scalar;

    axisStrokeColor: [string, string];
    axisStrokeWidth: Scalar;
    labelsColor: [string, string];
    labelsFontSize: Scalar;
  };
  palette: [string, ...string[]];
}

export type BBox = {
  horizontal: Point;
  vertical: Point;
};

export type BBoxish =
  | {
      horizontal: Pointish;
      vertical: Pointish;
    }
  | [number, number, number, number];

export const normalizeBBox = (bbox: BBoxish): BBox => {
  if (Array.isArray(bbox)) {
    return {
      horizontal: point(bbox[0], bbox[2]),
      vertical: point(bbox[1], bbox[3]),
    };
  }
  return {
    horizontal: Point.of(bbox.horizontal),
    vertical: Point.of(bbox.vertical),
  };
};
