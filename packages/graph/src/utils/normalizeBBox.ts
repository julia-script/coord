import { Vec2, point } from "@coord/core";
import { BBoxish, BBox } from "../types";

export const normalizeBBox = (bbox: BBoxish): BBox => {
  if (Array.isArray(bbox)) {
    return {
      horizontal: point(bbox[0], bbox[2]),
      vertical: point(bbox[1], bbox[3]),
    };
  }
  if ("x" in bbox) {
    return {
      horizontal: Vec2.of(bbox.x),
      vertical: Vec2.of(bbox.y),
    };
  }
  return {
    horizontal: Vec2.of(bbox.horizontal),
    vertical: Vec2.of(bbox.vertical),
  };
};
