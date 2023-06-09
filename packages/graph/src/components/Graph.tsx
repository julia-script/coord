import React, { CSSProperties } from "react";
import { Pointish, point } from "@coord/core";
import { defaultThemes, passContextToChildren, useGraphContext } from "@/utils";
import { BBox, BBoxish, Theme } from "@/types";
import { Navigation } from "./Navigation";

export type GraphProps = React.PropsWithChildren<
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
    width?: CSSProperties["width"];
    /**
     * The absolute height of the graph.
     * @defaultValue 400
     * */
    height?: CSSProperties["height"];
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

    /**
     * Callback when the bounding box of the graph changes.
     * @see {@link BBoxish}
     * */
    onCoordBoxChange?: (coordBox: BBox) => void;
  } & Omit<React.SVGProps<SVGSVGElement>, "ref">
>;

export const Graph = ({
  scale,
  width = 400,
  height = 400,
  padding = 0,
  theme = "dark",
  coordBox = {
    horizontal: point(-10, 10),
    vertical: point(10, -10),
  },
  coordStep = point(1, 1),
  onCoordBoxChange,
  children,
  ...rest
}: GraphProps) => {
  const { ready, ...context } = useGraphContext({
    width,
    height,
    padding,
    coordBox,
    theme,
    coordStep,
  });

  return (
    <svg
      {...(context.ref ? { ref: context.ref } : {})}
      width={width}
      height={height}
      style={{
        touchAction: onCoordBoxChange ? "none" : "auto",
      }}
      {...rest}
    >
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={context.theme.background}
      />
      {onCoordBoxChange && (
        <Navigation
          context={context}
          rawCoordBox={coordBox}
          onCoordBoxChange={onCoordBoxChange}
        />
      )}

      {ready && passContextToChildren(children, context)}
    </svg>
  );
};
