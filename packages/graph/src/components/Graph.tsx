import React, { CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { Point, point } from "@coord/core";

import { useNavigation } from "../hooks/useNavigation";
import { ScaleControls } from "./ScaleControls";
import { Navigation } from "./Navigation";
import { ServerGraphProps, ServerGraph } from "./ServerGraph";

/**
 * Type representing the properties for a Graph component.
 *
 * @typedef {Object} GraphProps
 *
 * @property {CSSProperties["width"]} [width] - Optional property that specifies the width of the graph. This property accepts the same values as the CSS width property.
 *
 * @property {CSSProperties["height"]} [height] - Optional property that specifies the height of the graph. This property accepts the same values as the CSS height property.
 */
export type GraphProps = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
} & Omit<ServerGraphProps, "width" | "height"> &
  Partial<ReturnType<typeof useNavigation>>;

export const Graph = ({
  onPointerMove,
  onPointerDown,
  onPointerUp,
  scale,

  width = 400,
  height = 400,
  children,
  ...rest
}: GraphProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  const expand = typeof width === "string" || typeof height === "string";
  const [viewspaceSize, setViewspaceSize] = useState<Point>(point(400, 400));

  useLayoutEffect(() => {
    if (!expand) return;
    const parent = svgElement?.parentElement;
    if (!parent) return;
    const setSize = (parentWidth: number, parentHeight: number) => {
      const size = point(parentWidth, parentHeight);
      if (typeof width !== "string") {
        size.x = width;
      }
      if (typeof height !== "string") {
        size.y = height;
      }
      setViewspaceSize(size);
    };
    setSize(parent.clientWidth, parent.clientHeight);
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(parent);
    return () => {
      observer.disconnect();
    };
  }, [expand, svgElement]);

  return (
    <div
      style={{
        width,
        height,
      }}
      ref={(el) => {
        if (!el) return;
        setSvgElement(el.childNodes[0] as SVGSVGElement);
      }}
    >
      <ServerGraph
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
    </div>
  );
};
