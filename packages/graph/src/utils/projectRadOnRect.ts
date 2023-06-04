import { Point, point } from "@coord/core";
import { clamp } from "lodash-es";

export const projectRadOnRect = (rad: number, size: Point): Point => {
  const halfWidth = size.x / 2;
  const halfHeight = size.y / 2;

  const [cos, sin] = [Math.cos(rad), Math.sin(rad)];

  let [x, y] = [(sin > 0 ? cos : -cos) / sin, (cos > 0 ? sin : -sin) / cos];

  [x, y] = [
    clamp(x * halfHeight, -halfWidth, halfWidth),
    clamp(y * halfWidth, -halfHeight, halfHeight),
  ];

  return point(x, y);
};
