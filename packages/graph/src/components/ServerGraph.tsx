import { Point, Pointish, point, transform } from "@curves/core";
import React, { useCallback, useMemo } from "react";
import {
  darkTheme,
  fitCoordBoxToView,
  passContextToChildren,
  GraphContext,
  defaultThemes,
} from "@/utils";
import { BBoxish, Theme, normalizeBBox } from "../types";
import { projectCoord, projectSizeFactory, unprojectCoord } from "@/utils";
import { GraphPoint } from "@/types";

/**
 * ServerGraph component properties.
 */
export type ServerGraphProps = React.PropsWithChildren<
  {
    /**
     * The coordinate of the bounding box of the graph that's guaranteed to be visible.
     * The real bounding box of the graph may be affect by the padding and the aspect ration of the graph element
     * @defaultValue { horizontal: point(-10, 10), vertical: point(10, -10) }
     * @example
     * ```tsx
     * <Graph coordBox={{ horizontal: [-10, 10], vertical: [10, -10] }} />
     * ```
     * @example
     * ```tsx
     * // [top, right, bottom, left]
     * <Graph coordBox={[10, 10, -10, -10]} />
     * ```
     *
     * @see {@link BBoxish}
     */
    coordBox?: BBoxish;
    /**
     * The step for each axis in the graph.
     * @defaultValue point(1, 1)
     * @example
     * ```tsx
     * <Graph coordStep={[1, 1]} />
     * ```
     * @see {@link Pointish}
     * */
    coordStep?: Pointish;
    /**
     * The absolute width of the graph.
     * @defaultValue 400
     */
    width?: number;
    /**
     * The absolute height of the graph.
     * @defaultValue 400
     * */
    height?: number;
    /**
     * The padding in pixels of the graph.
     * @defaultValue 0
     * */
    padding?: number;
    /**
     * The theme of the graph.
     * @defaultValue darkTheme
     * @see {@link Theme}
     * */
    theme?: Theme | keyof typeof defaultThemes;
  } & Omit<React.SVGProps<SVGSVGElement>, "ref">
>;

/**
 * A component that renders a server graph.
 *
 * @param {ServerGraphProps} props - The properties of the server graph component.
 *
 * @returns {React.Element} The rendered server graph component.
 */
export const ServerGraph = ({
  coordBox = {
    horizontal: point(-10, 10),
    vertical: point(10, -10),
  },
  coordStep = point(1, 1),
  width = 400,
  height = 400,
  padding = 0,
  theme: themeProp = "dark",

  children,
  ...rest
}: ServerGraphProps) => {
  const context = useCreateContext({
    coordBox,
    coordStep,
    width,
    height,
    padding,
    theme: themeProp,
  });
  return (
    <svg
      viewBox={[0, 0, context.viewspaceSize.x, context.viewspaceSize.y].join(
        " "
      )}
      width={width}
      height={height}
      {...rest}
    >
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={context.theme.background}
      />

      {passContextToChildren(children, context)}
    </svg>
  );
};

const useCreateContext = ({
  coordBox = {
    horizontal: point(-10, 10),
    vertical: point(10, -10),
  },
  coordStep = point(1, 1),
  width = 400,
  height = 400,
  padding = 0,
  theme: themeProp = "dark",
}: Pick<
  ServerGraphProps,
  "coordBox" | "coordStep" | "width" | "height" | "padding" | "theme"
>): GraphContext => {
  const viewspaceSize = useMemo(() => point(width, height), [width, height]);

  padding = Math.min(
    padding,
    Math.min(viewspaceSize.x, viewspaceSize.y) / 2 - 1
  );
  const normalizedCoordStep = Point.fromPointish(coordStep);
  const visibleCoordBox = fitCoordBoxToView(
    normalizeBBox(coordBox),
    normalizedCoordStep,
    viewspaceSize,
    padding
  );
  const projectionTransform = useMemo(() => {
    const coordWidth =
      visibleCoordBox.horizontal.y - visibleCoordBox.horizontal.x;
    const coordHeight = visibleCoordBox.vertical.y - visibleCoordBox.vertical.x;

    const a = width / coordWidth;
    const d = height / coordHeight;

    const tx = visibleCoordBox.horizontal.x * -a;
    const ty = visibleCoordBox.vertical.x * -d;
    return transform(a, 0, 0, d, tx, ty);
  }, [
    height,
    visibleCoordBox.horizontal.x,
    visibleCoordBox.horizontal.y,
    visibleCoordBox.vertical.x,
    visibleCoordBox.vertical.y,
    width,
  ]);
  const theme =
    typeof themeProp === "string" ? defaultThemes[themeProp] : themeProp;

  const computeColor = useCallback(
    (color: string | number) => {
      if (typeof color === "string") {
        switch (color) {
          case "background":
            return theme.background;
          case "body":
            return theme.body;
          case "text":
            return theme.text;
          default:
            return color;
        }
      }
      return theme.palette[color % theme.palette.length] || "black";
    },
    [theme]
  );

  return {
    theme,

    coordBox: visibleCoordBox,
    projectionTransform,
    coordStep: normalizedCoordStep,
    viewspaceSize,

    computeColor,
    projectCoord: useCallback(
      (coord: GraphPoint) => projectCoord(coord, projectionTransform),
      [projectionTransform]
    ),
    unprojectCoord: useCallback(
      (coord: GraphPoint) => unprojectCoord(coord, projectionTransform),
      [projectionTransform]
    ),
    projectSize: useCallback(projectSizeFactory(projectionTransform), [
      projectionTransform,
    ]),
    projectAbsoluteSize: useCallback(
      projectSizeFactory(projectionTransform, true),
      [projectionTransform]
    ),
  };
};
