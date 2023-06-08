import React from "react";
import { GraphPoint } from "@/types";
import { Scalar } from "@/types";
import { GraphElement, withGraphContext } from "@/utils";

export type TextProps = {
  position?: GraphPoint;
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
  const fs = fontSize
    ? projectAbsoluteSize(fontSize, "viewspace")
    : theme.fontSize;
  return (
    <text
      x={x}
      y={y}
      fontSize={fs}
      fontFamily={fontFamily ?? theme.fontFamily}
      fontWeight={fontWeight ?? theme.fontWeight}
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
