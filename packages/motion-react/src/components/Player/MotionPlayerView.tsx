import React from "react";
import { VideoSizeish, getVideoSize, useClientRect } from "@coord/core";

type MotionPlayerViewProps = React.PropsWithChildren<{
  videoSize: VideoSizeish;
}>;
export function MotionPlayerView({
  videoSize,
  children,
}: MotionPlayerViewProps) {
  const { x: width, y: height } = getVideoSize(videoSize);

  const videoShellRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLDivElement>(null);

  const ref = useClientRect((playerSize) => {
    if (!videoShellRef.current) return;
    if (!videoRef.current) return;

    const scale = Math.min(
      playerSize.width / width,
      playerSize.height / height
    );
    videoShellRef.current.style.maxWidth = `${width * scale}px`;
    videoRef.current.style.transform = `scale(${scale})`;
    videoRef.current.style.display = "block";
  });
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        minHeight: 1,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <div
        ref={videoShellRef}
        style={{
          aspectRatio: `${width} / ${height}`,
          position: "relative",
          margin: "auto",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          ref={videoRef}
          style={{
            width,
            height,
            position: "absolute",
            background: "black",
            display: "none",
            transformOrigin: "top left",
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
