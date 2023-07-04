import { Vec2, point } from "@coord/core";
import { BBox } from "@/types";

export const fitCoordBoxToView = (
  { horizontal, vertical }: BBox,
  stepSize: Vec2,
  { x: width, y: height }: Vec2,

  padding = 0
): BBox => {
  const xStep = stepSize.x;
  const yStep = stepSize.y;

  const coordWidth = horizontal.y - horizontal.x;
  const coordHeight = vertical.y - vertical.x;

  const coordRatio = Math.abs(
    coordWidth / xStep / (coordHeight / yStep)
  );
  const ratio =
    (width - padding * 2) /
    (height - padding * 2);

  const multiplier = coordRatio / ratio;

  let xFactor = Math.max(1, 1 / multiplier);
  let yFactor = Math.max(1, multiplier);

  // accounts for padding
  xFactor *= width / (width - padding * 2);
  yFactor *= height / (height - padding * 2);

  const xCoordPadding =
    (coordWidth * xFactor - coordWidth) / 2;
  const yCoordPadding =
    (coordHeight * yFactor - coordHeight) / 2;

  const xMin = horizontal.x - xCoordPadding;
  const xMax = horizontal.y + xCoordPadding;

  const yMin = vertical.x - yCoordPadding;
  const yMax = vertical.y + yCoordPadding;

  return {
    horizontal: point(xMin, xMax),
    vertical: point(yMin, yMax),
  };
};
