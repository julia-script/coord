export const remap = (
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  value: number
): number => {
  return toMin + ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin);
};
