import { Vec2, Vec2ish } from "../math";

const fullHD = Vec2.of([1920, 1080]);
const HD = Vec2.of([1280, 720]);
const SD = Vec2.of([640, 480]);
const reels = Vec2.of([1080, 1920]);
const square = Vec2.of([1080, 1080]);

export const videoSizes = {
  fullHD: fullHD,
  video: fullHD,
  HD,
  SD,

  reels,
  square,
};

export type VideoSize = keyof typeof videoSizes;
export type VideoSizeish = VideoSize | Vec2ish;

export const getVideoSize = (
  size: VideoSizeish
) => {
  if (typeof size === "string") {
    return videoSizes[size];
  }
  return Vec2.of(size);
};
