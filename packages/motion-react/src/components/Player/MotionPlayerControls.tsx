import React from "react";
import { MotionControls } from "@/hooks";
import {
  HiPlay,
  HiPause,
  HiOutlineArrowsPointingOut,
  HiArrowPath,
} from "react-icons/hi2";
import { MotionPlayerProgressBar } from "./MotionPlayerProgressBar";
import { formatDuration } from "@coord/core";
import clsx from "clsx";

type MotionPlayerControlsProps = {
  controls: MotionControls;
  toggleFullScreen?: () => void;
};
const oneHour = 3600_000;

export function MotionPlayerControls({
  controls,
  toggleFullScreen,
}: MotionPlayerControlsProps) {
  const {
    playing,
    play,
    pause,
    meta,
    setFrame,
    repeat,
    setRepeat,
    frame,
    currentTime,
    duration,
  } = controls;

  const longerThanAnHour = duration >= oneHour;

  return (
    <div className={"motion-player-controls"}>
      <div className={"motion-player-controls-progress-bar"}>
        <MotionPlayerProgressBar controls={controls} />
      </div>
      <div className={"motion-player-controls-actions"}>
        <div>
          {playing ? (
            <button className="motion-player-controls-button">
              <HiPause
                onClick={() => {
                  pause();
                }}
              />
            </button>
          ) : (
            <button
              className="motion-player-controls-button"
              onClick={() => {
                play();
              }}
            >
              <HiPlay />
            </button>
          )}

          <button
            className={clsx("motion-player-controls-button", {
              "motion-player-controls-button-active": repeat,
            })}
            onClick={() => {
              setRepeat(!repeat);
            }}
          >
            <HiArrowPath />
          </button>
        </div>

        <div className="motion-player-controls-time">
          {formatDuration(currentTime, longerThanAnHour)}
          {" / "}
          {formatDuration(duration, longerThanAnHour)}
        </div>
        <div className={"motion-player-controls-title"}>{meta.title}</div>
        {toggleFullScreen && (
          <div>
            <button
              className="motion-player-controls-button"
              onClick={() => {
                toggleFullScreen?.();
              }}
            >
              <HiOutlineArrowsPointingOut />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
