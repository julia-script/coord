import { MotionControls } from "@/hooks";
import React, { useEffect, useState } from "react";
import { MotionPlayerControls } from "./MotionPlayerControls";
import clsx from "clsx";
import "./MotionPlayer.css";

type MotionPlayerProps = React.PropsWithChildren<{
  controls: MotionControls;
  autoplay?: boolean;
  repeat?: boolean;
}> &
  React.HTMLAttributes<HTMLDivElement>;

export function MotionPlayer({
  controls,
  children,
  className,
  repeat,

  autoplay = false,

  ...rest
}: MotionPlayerProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const ref = React.useRef<HTMLDivElement>(null);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      ref.current?.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const [cursorIsIdle, setCursorIsIdle] = useState(true);

  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isProgressBarVisible = controls.playing === false || !cursorIsIdle;

  useEffect(() => {
    if (autoplay) {
      controls.play();
    }

    if (repeat) {
      controls.setRepeat(true);
    }
  }, []);
  return (
    <div
      ref={ref}
      className={clsx("motion-player", className)}
      onMouseMove={() => {
        setCursorIsIdle(false);
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(() => {
          setCursorIsIdle(true);
        }, 1000);
      }}
      onClick={() => {
        if (controls.playing) {
          controls.pause();
          return;
        }
        controls.play();
      }}
      {...rest}
    >
      {!loading && (
        <>
          {children}

          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={clsx("motion-player_progress-bar-area", {
              "motion-player_progress-bar-area_visible": isProgressBarVisible,
            })}
          >
            <MotionPlayerControls
              controls={controls}
              toggleFullScreen={toggleFullScreen}
            />
          </div>
        </>
      )}
    </div>
  );
}
