import React from "react";
import {
  Vec2,
  point,
  Vec2ish,
  useSafeMemo,
} from "@coord/core";
import {
  withGraphContext,
  parametricAdaptiveSampling,
  GraphElement,
} from "@/utils";
import {
  PolyLineProps,
  PolyLine,
} from "./PolyLine";

export type PlotParametricProps = GraphElement<
  {
    domain: [number, number];
    f: (t: number) => Vec2ish;
    errorTolerance?: number;
    minSamplesDepth?: number;
    maxSamplesDepth?: number;
  },
  Omit<PolyLineProps, "points">
>;

const Parametric = withGraphContext(
  ({
    domain,
    f,
    errorTolerance = 0.01,
    minSamplesDepth = 8,
    maxSamplesDepth = 9,

    strokeWidth = 3,
    ...rest
  }: PlotParametricProps) => {
    const points = useSafeMemo(
      () =>
        parametricAdaptiveSampling(
          domain,
          (t: number) => Vec2.of(f(t)),
          errorTolerance,
          minSamplesDepth,
          maxSamplesDepth
        ),
      [
        domain,
        errorTolerance,
        maxSamplesDepth,
        minSamplesDepth,
        f,
      ]
    );

    return (
      <PolyLine
        points={points}
        strokeWidth={strokeWidth}
        {...rest}
      />
    );
  }
);
export type OfXProps = GraphElement<
  {
    domain?: [number, number];
    f: (x: number) => number;
  },
  Omit<PlotParametricProps, "f" | "domain">
>;

const OfX = withGraphContext(
  ({ f, domain, context, ...rest }: OfXProps) => {
    return (
      <Parametric
        domain={
          domain ??
          context.coordBox.horizontal.toArray()
        }
        f={(x: number) => point(x, f(x))}
        context={context}
        {...rest}
      />
    );
  }
);

export type OfYProps = GraphElement<
  {
    domain?: [number, number];
    f: (y: number) => number;
  },
  Omit<PlotParametricProps, "f" | "domain">
>;

const OfY = withGraphContext(
  ({ f, domain, context, ...rest }: OfYProps) => {
    return (
      <Parametric
        domain={
          domain ??
          context.coordBox.vertical.toArray()
        }
        context={context}
        f={(y: number) => point(f(y), y)}
        {...rest}
      />
    );
  }
);

export const Plot = {
  Parametric,
  ofX: OfX,
  ofY: OfY,
};
