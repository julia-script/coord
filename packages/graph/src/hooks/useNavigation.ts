import { Point, Transform, point } from "@coord/core";
import { useMemo, useState } from "react";
import { useDraggable } from "./useDraggable";
import { BBox } from "../types";

export const useNavigation = (
  coordBox: BBox = {
    horizontal: point(-5, 5),
    vertical: point(5, -5),
  }
) => {
  const [transform, setTransform] = useState(Transform.identity());

  const events = useDraggable(
    useMemo(
      () => ({
        onDrag: (e) => {
          const { x, y } = e.coordMovement;
          setTransform((prev) => prev.translate(x, y));
        },
      }),
      [setTransform]
    )
  );

  return useMemo(() => {
    const x = transform.applyTo(
      new Point(coordBox.horizontal.x, coordBox.vertical.x)
    );
    const y = transform.applyTo(
      new Point(coordBox.horizontal.y, coordBox.vertical.y)
    );

    const newCoordBox = {
      horizontal: new Point(x.x, y.x),
      vertical: new Point(x.y, y.y),
    };

    return {
      coordBox: newCoordBox,
      ...events,
      scale: (scale: number) => {
        // setTransform((prev) => {
        //   // const center = new Point(lerp(...x, 0.5), lerp(...y, 0.5));
        //   return prev.scaleAbout(center, scale);
        // });
      },
    };
  }, [coordBox, events, transform, setTransform]);
};
