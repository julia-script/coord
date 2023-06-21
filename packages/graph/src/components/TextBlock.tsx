import React from "react";
import { GraphElement, withGraphContext } from "@/utils";
import { point } from "@coord/core";
import { useCoordState } from "@/hooks";
import { useSafeLayoutEffect, useSafeRef } from "@/hooks/safe-server-hooks";
import { ScalarPoint } from "..";

export type TextBlockProps = GraphElement<
  {
    position: ScalarPoint;
    size: ScalarPoint;
    strokeColor?: number | string;
    fillColor?: number | string;
    opacity?: number;
  } & React.HTMLAttributes<HTMLDivElement>
>;

const Component = ({
  style = {},
  context,
  position,
  strokeColor = "body",
  children,
  size,
  opacity,

  ...rest
}: TextBlockProps) => {
  const { projectCoord, projectAbsoluteSize, computeColor } = context;
  // const [size, setSize] = useCoordState([10, 10]);

  const projectedSize = projectAbsoluteSize(size, "coordspace");
  const projectedPosition = projectCoord(position);
  const ref = useSafeRef<HTMLDivElement>(null);

  return (
    <foreignObject
      x={projectedPosition.x}
      y={projectedPosition.y}
      width={projectedSize.x}
      height={projectedSize.y}
    >
      <div
        style={{
          width: projectedSize.x,
          height: projectedSize.y,
          color: context.computeColor(strokeColor),
          opacity,
          ...style,
        }}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    </foreignObject>
  );
};

export const TextBlock = withGraphContext(Component);
