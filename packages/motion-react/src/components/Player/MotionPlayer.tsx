import { MotionControls } from "@/hooks";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { MotionPlayerControls } from "./MotionPlayerControls";
import clsx from "clsx";
import "./MotionPlayer.css";
import {
  VideoSizeish,
  useSafeId,
  ScreenReaderOnly,
  getVideoSize,
} from "@coord/core";
import { MotionPlayerView } from "./MotionPlayerView";

type MotionPlayerProps = React.PropsWithChildren<{
  controls: MotionControls<any>;
  autoplay?: boolean;
  repeat?: boolean;
  size?: VideoSizeish;
  colors?: {
    accent?: string;
    body?: string;
    backdrop?: string;
  };
  playerAspectRatio?: number | "source";
}> &
  React.HTMLAttributes<HTMLDivElement>;

export function MotionPlayer({
  id,
  controls,
  children,
  className,
  repeat,
  size = "video",
  autoplay = false,
  colors = {},
  playerAspectRatio = 16 / 9,
  ...rest
}: MotionPlayerProps) {
  const elId = useSafeId("motion-player-");
  const [isLoading, setIsLoading] =
    useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      ref.current?.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const [cursorIsIdle, setCursorIsIdle] =
    useState(true);

  const timeout = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const isProgressBarVisible =
    controls.playing === false || !cursorIsIdle;

  useEffect(() => {
    setIsLoading(false);
    if (autoplay) {
      controls.play();
    }

    if (repeat) {
      controls.setRepeat(true);
    }
  }, []);
  const videoSize = getVideoSize(size);
  return (
    <section
      ref={ref}
      id={elId}
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
      aria-label="Video player"
      aria-controls={`${elId}-controls`}
      aria-describedby={`${elId}-description`}
    >
      <style>
        {`
          #${elId} {
            display: flex;
            aspect-ratio: ${
              playerAspectRatio === "source"
                ? videoSize.x / videoSize.y
                : playerAspectRatio
            };
            --motion-player-accent-color: ${
              colors.accent ?? "#22A699"
            }; 
            --motion-player-text-color: ${
              colors.body ?? "#fff"
            };
            --motion-player-background-color: ${
              colors.backdrop ?? "#0c0c0c"
            };
          }
        `}
      </style>
      <MotionPlayerView videoSize={size}>
        {children}
      </MotionPlayerView>

      <div
        id={`${elId}-controls`}
        aria-hidden={isLoading}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={
          isLoading ? { display: "none" } : {}
        }
        className={clsx(
          "motion-player_controls",
          {
            "motion-player_controls_visible":
              isProgressBarVisible,
          }
        )}
      >
        <MotionPlayerControls
          controls={controls}
          toggleFullScreen={toggleFullScreen}
        />
      </div>
      <ScreenReaderOnly
        id={`${elId}-description`}
      >
        <h2>{controls.meta?.title}</h2>
        {controls.meta?.description && (
          <p>{controls.meta?.description}</p>
        )}
      </ScreenReaderOnly>
    </section>
  );
}
