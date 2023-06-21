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
import "./MotionPlayerControls.css";

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
    repeat,
    setRepeat,
    currentTime,
    duration,
  } = controls;

  const longerThanAnHour = duration >= oneHour;

  return (
    <div className={"motion-player-controls"}>
      <div className={"motion-player-controls_progress-bar"}>
        <MotionPlayerProgressBar controls={controls} />
      </div>
      <div className={"motion-player-controls_actions"}>
        <div className={"motion-player-controls_actions_controls"}>
          {playing ? (
            <button className="motion-player-controls_button">
              <HiPause
                size={"1.7em"}
                onClick={() => {
                  pause();
                }}
              />
            </button>
          ) : (
            <button
              className="motion-player-controls_button"
              onClick={() => {
                play();
              }}
            >
              <HiPlay size={"1.7em"} />
            </button>
          )}
          <button
            className={clsx("motion-player-controls_button", {
              "motion-player-controls_button_active": repeat,
            })}
            onClick={() => {
              setRepeat(!repeat);
            }}
          >
            <HiArrowPath size={"1.7em"} />
          </button>
        </div>

        <div className="motion-player-controls_time">
          {formatDuration(currentTime, longerThanAnHour)}
          {" / "}
          {formatDuration(duration, longerThanAnHour)}
        </div>
        <div className={"motion-player-controls_title"}>{meta.title}</div>
        {toggleFullScreen && (
          <div>
            <button
              className="motion-player-controls_button"
              onClick={() => {
                toggleFullScreen?.();
              }}
            >
              <HiOutlineArrowsPointingOut size={"1.7em"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
