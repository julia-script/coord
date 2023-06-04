import { Point, Transform } from "@coord/core";
import React from "react";
import { BBox, Theme, PartialBy } from "../types";
import { GraphPoint } from "../types";
import { projectSizeFactory } from "./point";

export type GraphContext = {
  ref?: React.RefObject<SVGSVGElement>;
  computeColor: (color: string | number) => string;
  projectSize: ReturnType<typeof projectSizeFactory>;
  projectAbsoluteSize: ReturnType<typeof projectSizeFactory>;
  projectCoord: (point: GraphPoint) => Point;
  unprojectCoord: (point: GraphPoint) => Point;

  // unprojectSize: ReturnType<typeof projectSizeFactory>;
  // unprojectAbsoluteSize: ReturnType<typeof projectSizeFactory>;
  projectionTransform: Transform;

  coordBox: BBox;
  coordStep: Point;
  viewspaceSize: Point;
  theme: Theme;
};

export type WithGraphContext = {
  context: GraphContext;
};

export const withGraphContext = <P extends WithGraphContext>(
  Component: React.ComponentType<P>
): React.FC<PartialBy<P, "context">> => {
  return function withContext(props) {
    const { context } = props;
    if (!context) {
      throw new Error("This component must be a direct child of Graph");
    }

    return React.createElement(Component, { ...(props as P) });
  };
};

export const passContextToChildren = (
  children: React.ReactNode,
  context: GraphContext
) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const props = { ...child.props };
      props.context = context;
      props.children = passContextToChildren(props.children, context);

      return React.cloneElement(child, props);
    }
    return child;
  });
};
