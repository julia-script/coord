export const countFrames = (
  time: number,
  fps: number,
  duration: number
) => {
  const expectedFinishTime = time + duration;

  let frames = Math.floor(duration * fps);
  const actualDuration = frames / fps;
  const actualFinishTime = time + actualDuration;
  let remainder =
    expectedFinishTime - actualFinishTime;

  if (remainder >= 1 / fps) {
    frames++;
    remainder =
      expectedFinishTime - (time + frames / fps);
  }
  return [frames, remainder] as const;
};
