import { MotionControls } from "@/hooks";
import React, { useEffect, useState } from "react";
import { MotionPlayerControls } from "./MotionPlayerControls";
import clsx from "clsx";

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
      className={clsx(
        "group/player relative flex cursor-pointer items-center justify-center",
        className
      )}
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
      {children}

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={clsx(
          "absolute bottom-0 w-full transition-opacity duration-300 ",
          {
            "opacity-0": controls.playing,
            "group-hover/player:opacity-100": !cursorIsIdle,
          }
        )}
      >
        <MotionPlayerControls
          controls={controls}
          toggleFullScreen={toggleFullScreen}
        />
      </div>
    </div>
  );
}
