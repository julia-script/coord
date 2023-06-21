import { EasingOptions, applyEasing } from "@coord/core/dist";

export const blink = (
  t: number,
  blinkDuration = 0.5,
  easing: EasingOptions = "easeInOutExpo"
) => {
  const blinkT = Math.cos((t / (blinkDuration * 1000)) * Math.PI) / 2 + 0.5;

  return applyEasing(easing, blinkT);
};
