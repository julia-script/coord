import React from "react";
import { useNavigation } from "@/hooks";
import { GraphContext, withGraphContext } from "../utils";

const Component = ({
  onPointerDown,
  onPointerMove,
  onPointerUp,
  context,
}: {
  context: GraphContext;
} & Partial<ReturnType<typeof useNavigation>>) => {
  const { theme } = context;

  return (
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={"transparent"}
      onPointerDown={(e) => {
        onPointerDown?.(e, context);
      }}
      onPointerMove={(e) => {
        onPointerMove?.(e, context);
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e, context);
      }}
    />
  );
};

export const Navigation = withGraphContext(Component);
