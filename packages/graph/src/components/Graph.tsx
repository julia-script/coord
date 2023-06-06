import React, { CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { Point, Pointish, point } from "@coord/core";

import { useNavigation } from "../hooks/useNavigation";
import { ScaleControls } from "./ScaleControls";
import { Navigation } from "./Navigation";
// import { ServerGraphProps, ServerGraph } from "./ServerGraph";
import { passContextToChildren, useGraphContext } from "@/utils/graphContext";
import { defaultThemes } from "@/utils";
import { BBoxish, Theme } from "@/types";

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
> &
  Partial<ReturnType<typeof useNavigation>>;

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
  children,
  ...rest
}: GraphProps) => {
  const { coordBox: navigationCoordBox, ...navigationEvents } =
    useNavigation(coordBox);

  const context = useGraphContext({
    width,
    height,
    padding,
    coordBox: navigationCoordBox,
    theme,
    coordStep,
  });

  return (
    <svg
      {...(context.ref ? { ref: context.ref } : {})}
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
      <Navigation context={context} {...navigationEvents} />

      {context.ready && passContextToChildren(children, context)}
    </svg>
  );
};

{
  /* <div
      style={{
        width,
        height,
      }}
      ref={(el) => {
        if (!el) return;
        setSvgElement(el.childNodes[0] as SVGSVGElement);
      }}
    > */
}
{
  /* <ServerGraph
        style={
          expand
            ? {
                position: "absolute",
                width: "100%",
                height: "100%",
              }
            : {}
        }
        width={viewspaceSize.x}
        height={viewspaceSize.y}
        {...rest}
      >
        <Navigation />

        {scale && <ScaleControls scale={scale} />}
        {children}
      </ServerGraph>
    </div> */
}
