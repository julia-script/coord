import { Vec2, Vec2ish } from "@coord/core";

export type PartialBy<
  T,
  K extends keyof T
> = Omit<T, K> & Partial<Pick<T, K>>;

export type ScalarUnits = "vs" | "cs";
export type Space = "viewspace" | "coordspace";

export type Scalar =
  | number
  | `${number}${ScalarUnits}`;
export type ScalarPoint = Readonly<
  | Vec2
  | [Scalar, Scalar]
  | { x: Scalar; y: Scalar }
>;

export type Color = string;

export type SVGProps = React.SVGProps<SVGElement>;
export type SVGPropsKeys = keyof SVGProps;
export type FilteredSvgProps = {
  [K in SVGPropsKeys]: SVGProps[K] extends (
    ...args: unknown[]
  ) => unknown
    ? never
    : SVGProps[K];
};
export type ThemeableProps = Pick<
  SVGProps,
  | "fill"
  | "stroke"
  | "strokeWidth"
  | "strokeDasharray"
  | "strokeDashoffset"
  | "strokeLinecap"
  | "strokeLinejoin"
  | "strokeMiterlimit"
  | "strokeOpacity"
  | "fillOpacity"
  | "color"
  | "className"
  | "style"
  | "opacity"
  | "fontFamily"
  | "fontSize"
  | "fontWeight"
  | "fontStyle"
  | "fontVariant"
  | "textAnchor"
  | "alignmentBaseline"
  | "dominantBaseline"
  | "letterSpacing"
  | "wordSpacing"
  | "textDecoration"
>;

export type Theme = {
  background: ThemeableProps;
  text: ThemeableProps;
  gridMaxStepSize: number;
  gridStep: ThemeableProps;
  gridAxis: ThemeableProps;
  gridLabels: ThemeableProps;
  palette: [Color, ...Color[]];
  body: Color;
};

export type BBox = {
  horizontal: Vec2;
  vertical: Vec2;
};

export type BBoxish =
  | {
      horizontal: Vec2ish;
      vertical: Vec2ish;
    }
  | {
      x: Vec2ish;
      y: Vec2ish;
    }
  | [number, number, number, number];
