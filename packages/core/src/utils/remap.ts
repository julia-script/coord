export const remap = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  return toMin + ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin);
};
