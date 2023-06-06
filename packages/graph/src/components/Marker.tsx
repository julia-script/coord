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

export type MarkerContentProps = {
  size: number;
  color: string;
  interactable: boolean;
};
const DefaultMarker = ({ size, color, interactable }: MarkerContentProps) => (
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

export type MarkerProps = {
  position: GraphPoint;
  size?: Scalar;
  color?: number | string;
  rotation?: number;
  label?: string | typeof DefaultMarker;
  style?: React.CSSProperties;
  opacity?: number;
} & WithGraphContext &
  WithPointerEvents;

const emojiRegex = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/u;
const Component = ({
  position,
  size,
  color = 1,
  rotation = 0,
  context,
  label = DefaultMarker,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  interactable,
  isDragging,
  style,
  opacity,
}: MarkerProps) => {
  const { projectCoord, projectAbsoluteSize, computeColor } = context;
  const { x, y } = projectCoord(position);

  const hasEmoji = typeof label === "string" && emojiRegex.test(label);
  if (!size) size = typeof label === "string" ? size || "35vs" : size || "13vs";

  const width = Math.abs(projectAbsoluteSize(size));
  const fill = computeColor(color);

  const fontSize = width * (hasEmoji ? 0.7 : 0.45);
  let c: ReturnType<typeof DefaultMarker>;
  if (typeof label === "string") {
    c = (
      <g style={style} opacity={opacity}>
        <circle r={width / 2} fill={fill} />
        <Text
          fontSize={fontSize}
          dy={hasEmoji ? "0.65em" : "0.55em"}
          dominantBaseline={"middle"}
          textAnchor={"middle"}
          y={-fontSize / 2}
          x={0}
          context={context}
        >
          {label}
        </Text>
      </g>
    );
  } else {
    c = React.createElement(label, {
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
