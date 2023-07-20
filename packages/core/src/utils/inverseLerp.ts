export const inverseLerp = (
  a: number,
  b: number,
  value: number
) => {
  if (a === b) {
    return value >= b ? 1 : 0;
  }
  return (value - a) / (b - a);
};
