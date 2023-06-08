import React, { useLayoutEffect, useRef } from "react";
import { withGraphContext } from "@/utils";
import { BBoxish, normalizeBBox } from "@/types";
import { Rect, RectProps } from "./Rect";
import { LabelContainer, LabelContainerProps } from "./LabelContainer";
import { Point, point, useCoordState } from "..";
import { useGesture } from "@use-gesture/react";

export type LabelProps = {
  onChange?: (position: Point) => void;
} & Omit<LabelContainerProps, "size">;

const Component = ({
  onChange,
  style = {},
  context,
  position,
  children,

  ...rest
}: LabelProps) => {
  const [size, setSize] = useCoordState([10, 10]);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const setCurrentSize = () => {
      if (!ref.current) return;
      const { width, height } = ref.current.getBoundingClientRect();

      setSize(point(width, height));
    };

    setCurrentSize();

    const observer = new ResizeObserver(() => {
      setCurrentSize();
    });

    observer.observe(ref.current);

    return () => {
      observer.unobserve(ref.current!);
    };
  }, []);

  const interactable = !!onChange && !!position;

  const bind = useGesture(
    {
      onDrag: ({ down, movement, memo, first }) => {
        if (!position) return;
        if (!down) return;
        if (first) {
          return context.unprojectSize(position, "coordspace");
        }
        if (!memo) return;
        const { x, y } = context.unprojectSize(movement, "viewspace");
        onChange?.(memo.add(point(x, y)));
      },
    },
    {
      drag: {
        enabled: interactable,
      },
    }
  );
  return (
    <LabelContainer
      style={{
        touchAction: interactable ? "none" : "auto",
        cursor: interactable ? "grab" : "auto",
        ...style,
      }}
      size={size}
      context={context}
      position={position}
      {...bind()}
      {...rest}
    >
      <foreignObject width={size.x} height={size.y}>
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
          }}
          ref={ref}
        >
          {children}
        </div>
      </foreignObject>
    </LabelContainer>
  );
};

export const Label = withGraphContext(Component);
