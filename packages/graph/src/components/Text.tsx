import React from "react";
import { ScalarPoint } from "@/types";
import { Scalar } from "@/types";
import { GraphElement, withGraphContext } from "@/utils";

export type TextProps = {
  position?: ScalarPoint;
  fontSize?: Scalar;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: number | string;
  children?: React.ReactNode;
} & Omit<React.SVGProps<SVGTextElement>, "color"> &
  GraphElement;

const Component = ({
  children,
  fontSize,
  fontWeight,
  color,
  fontFamily,
  position = ["0vs", "0vs"],

  context,
  ...rest
}: TextProps) => {
  const { projectCoord, projectAbsoluteSize, theme, computeColor } = context;

  const { x, y } = projectCoord(position);

  const props = {
    ...theme.text,
    fontSize: fontSize
      ? projectAbsoluteSize(fontSize, "viewspace")
      : theme.text.fontSize,
  };
  return (
    <text
      x={x}
      y={y}
      {...props}
      fill={computeColor(color ?? theme.body)}
      textAnchor={"middle"}
      dominantBaseline={"middle"}
      {...rest}
    >
      {children}
    </text>
  );
};

export const Text = withGraphContext(Component);
