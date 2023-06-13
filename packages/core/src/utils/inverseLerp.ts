export const inverseLerp = (a: number, b: number, v: number) => {
  if (a === b) {
    return 0;
  }
  return (v - a) / (b - a);
};
