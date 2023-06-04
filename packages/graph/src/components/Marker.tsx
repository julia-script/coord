import React from "react";
import { Text } from "./Text";
import {
  WithGraphContext,
  WithPointerEvents,
  mapPointerEvent,
  withGraphContext,
} from "../utils";
import { Scalar } from "../types";
import { GraphPoint } from "@/types";

export type MarkContentProps = {
  size: number;
  color: string;
  interactable: boolean;
};
const DefaultMarker = ({ size, color, interactable }: MarkContentProps) => (
  <g className="curves-graph-default-marker">
    {interactable && (
      <>
        <style>
          {`
           .curves-graph-default-marker-border {
            transition: opacity 0.2s;
           }
          .curves-graph-default-marker:hover .curves-graph-default-marker-border {
            opacity: .8;
          }
        `}
        </style>
        <circle
          className="curves-graph-default-marker-border"
          r={size / 2 + 8}
          fill="transparent"
          stroke={color}
          strokeWidth={3}
          opacity={0.3}
        />
      </>
    )}
    <circle r={size / 2} fill={color} />
  </g>
);

export type MarkProps = {
  position: GraphPoint;
  size?: Scalar;
  color?: number | string;
  rotation?: number;
  content?: string | typeof DefaultMarker;
  style?: React.CSSProperties;
  opacity?: number;
} & WithGraphContext &
  WithPointerEvents;

const Component = ({
  position,
  size,
  color = "body",
  rotation = 0,
  context,
  content = DefaultMarker,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  interactable,
  isDragging,
  style,
  opacity,
}: MarkProps) => {
  const { projectCoord, projectAbsoluteSize, computeColor } = context;
  const { x, y } = projectCoord(position);
  if (!size)
    size = typeof content === "string" ? size || "35vs" : size || "13vs";

  const width = Math.abs(projectAbsoluteSize(size));
  const fill = computeColor(color);

  const fontSize = width * 0.6;
  let c: ReturnType<typeof DefaultMarker>;

  if (typeof content === "string") {
    c = (
      <g style={style} opacity={opacity}>
        <circle r={width / 2} fill={fill} />
        <Text
          fontSize={fontSize}
          textAnchor={"middle"}
          dy={"0.65em"}
          dominantBaseline={"middle"}
          y={-fontSize / 2}
          x={0}
          context={context}
        >
          {content}
        </Text>
      </g>
    );
  } else {
    c = React.createElement(content, {
      size: width,
      color: fill,
      interactable: !!interactable,
    });
  }

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotation * (180 / Math.PI)})`}
      style={
        interactable
          ? { cursor: isDragging ? "grabbing" : "grab", ...style }
          : {
              pointerEvents: "none",
              ...style,
            }
      }
      opacity={opacity}
      onPointerDown={mapPointerEvent(context, onPointerDown)}
      onPointerMove={mapPointerEvent(context, onPointerMove)}
      onPointerUp={mapPointerEvent(context, onPointerUp)}
    >
      {c}
    </g>
  );
};

export const Marker = withGraphContext(Component);
