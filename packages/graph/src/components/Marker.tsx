import React, { useRef } from "react";
import { Text } from "./Text";
import { GraphElement, withGraphContext } from "../utils";
import { Scalar } from "../types";
import { GraphPoint } from "@/types";
import { Point } from "@coord/core";

import { useDrag } from "@/hooks/useDrag";

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

export type MarkerProps = GraphElement<
  {
    position: GraphPoint;
    size?: Scalar;
    color?: number | string;
    rotation?: number;
    label?: string | typeof DefaultMarker;
    style?: React.CSSProperties;
    opacity?: number;
    onChange?: (position: Point) => void;
  },
  Omit<React.SVGProps<SVGGElement>, "color" | "onChange">
>;

const emojiRegex = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/u;

const Component = ({
  position,
  size,
  color = 1,
  rotation = 0,
  context,
  label = DefaultMarker,
  style,
  opacity,
  onChange,
  ...rest
}: MarkerProps) => {
  const { projectCoord, projectAbsoluteSize, computeColor, unprojectCoord } =
    context;

  const interactable = !!onChange;
  const positionTracking = useRef(unprojectCoord(position));
  const events = useDrag({
    context,
    onDrag: ({ coordMovement }) => {
      positionTracking.current = positionTracking.current.add(coordMovement);
      onChange?.(positionTracking.current);
    },
  });

  const { x, y } = projectCoord(position);

  const hasEmoji = typeof label === "string" && emojiRegex.test(label);
  if (!size) size = typeof label === "string" ? size || "35vs" : size || "13vs";

  const width = projectAbsoluteSize(size, "viewspace");
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
          ? { cursor: "grab", ...style }
          : {
              pointerEvents: "none",
              ...style,
            }
      }
      opacity={opacity}
      {...events}
      {...rest}
    >
      {c}
    </g>
  );
};

export const Marker = withGraphContext(Component);
