import React from "react";
import { GraphElement, renderNumber, withGraphContext } from "@/utils";
import { ScalarPoint, Scalar } from "@/types";
import { Vec2, point } from "@coord/core";
import { useGesture } from "@use-gesture/react";
import { Text } from "./Text";

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
          r={renderNumber(size / 2 + 8)}
          fill="transparent"
          stroke={color}
          strokeWidth={3}
          opacity={0.3}
        />
      </>
    )}
    <circle r={renderNumber(size / 2)} fill={color} />
  </g>
);

export type MarkerProps = GraphElement<
  {
    position: ScalarPoint;
    size?: Scalar;
    color?: number | string;
    rotation?: number;
    label?: string | typeof DefaultMarker;
    style?: React.CSSProperties;
    opacity?: number;
    onChange?: (position: Vec2) => void;
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

  const bind = useGesture({
    onDrag: ({ down, movement, memo, first }) => {
      if (!down) return;
      if (first) {
        return context.unprojectSize(position, "coordspace");
      }
      if (!memo) return;
      const { x, y } = context.unprojectSize(movement, "viewspace");
      onChange?.(memo.add(point(x, y)));
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
        <circle r={renderNumber(width / 2)} fill={fill} />
        <Text
          fontSize={fontSize}
          dy={hasEmoji ? "0.65em" : "0.55em"}
          dominantBaseline={"middle"}
          textAnchor={"middle"}
          y={renderNumber(-fontSize / 2)}
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
      transform={`translate(${renderNumber(x)} ${renderNumber(
        y
      )}) rotate(${renderNumber(rotation * (180 / Math.PI))})`}
      style={
        interactable
          ? { cursor: "grab", touchAction: "none", ...style }
          : {
              pointerEvents: "none",
              ...style,
            }
      }
      opacity={opacity}
      {...bind()}
      {...rest}
    >
      {c}
    </g>
  );
};

export const Marker = withGraphContext(Component);
