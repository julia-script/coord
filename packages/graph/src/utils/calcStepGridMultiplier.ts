export const calcStepGridMultiplier = (size: number, maxSize = 10) => {
  return 1 / Math.pow(2, Math.ceil(Math.log2(size / maxSize)));
};
