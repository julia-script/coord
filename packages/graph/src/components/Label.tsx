import React from "react";
import { withGraphContext } from "@/utils";
import {
  LabelContainer,
  LabelContainerProps,
} from "./LabelContainer";
import {
  Vec2,
  point,
  useSafeLayoutEffect,
  useSafeRef,
} from "@coord/core";
import { useCoordState } from "@/hooks";
import { useGesture } from "@use-gesture/react";

export type LabelProps = {
  onChange?: (position: Vec2) => void;
} & Omit<
  LabelContainerProps,
  "size" | "onChange"
>;

const Component = ({
  onChange,
  style = {},
  context,
  position,
  strokeColor = "body",
  children,

  ...rest
}: LabelProps) => {
  const [size, setSize] = useCoordState([10, 10]);
  const ref = useSafeRef<HTMLDivElement>(null);

  useSafeLayoutEffect(() => {
    if (!ref.current) return;
    const setCurrentSize = () => {
      if (!ref.current) return;
      const { width, height } =
        ref.current.getBoundingClientRect();

      setSize(point(width, height));
    };

    setCurrentSize();

    const observer = new ResizeObserver(() => {
      setCurrentSize();
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const interactable = !!onChange && !!position;

  const bind = useGesture(
    {
      onDrag: ({
        down,
        movement,
        memo,
        first,
      }) => {
        if (!position) return;
        if (!down) return;
        if (first) {
          return context.unprojectSize(
            position,
            "coordspace"
          );
        }
        if (!memo) return;
        const { x, y } = context.unprojectSize(
          movement,
          "viewspace"
        );
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
        touchAction: interactable
          ? "none"
          : "auto",
        cursor: interactable ? "grab" : "auto",
        ...style,
      }}
      size={size}
      context={context}
      position={position}
      strokeColor={strokeColor}
      {...bind()}
      {...rest}
    >
      <foreignObject
        width={size.x}
        height={size.y}
      >
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
            color:
              context.computeColor(strokeColor),
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
