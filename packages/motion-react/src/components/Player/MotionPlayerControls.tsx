import React from "react";
import { MotionControls } from "@/hooks";
import {
  HiPlay,
  HiPause,
  HiOutlineArrowsPointingOut,
  HiArrowPath,
} from "react-icons/hi2";
import { MotionPlayerProgressBar } from "./MotionPlayerProgressBar";
import { formatDuration } from "@coord/core/dist";
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
    <div className={"w-full"}>
      <div className={"w-full"}>
        <MotionPlayerProgressBar controls={controls} />
      </div>
      <div className={"flex w-full items-center gap-2 py-2"}>
        <div>
          {playing ? (
            <button className="px-3">
              <HiPause
                onClick={() => {
                  pause();
                }}
              />
            </button>
          ) : (
            <button
              className="px-3"
              onClick={() => {
                play();
              }}
            >
              <HiPlay />
            </button>
          )}

          <button
            className={clsx("rounded px-2 py-1", {
              "bg-blue-500": repeat,
            })}
            onClick={() => {
              setRepeat(!repeat);
            }}
          >
            <HiArrowPath />
          </button>
        </div>

        <div className="text-xs">
          {formatDuration(currentTime, longerThanAnHour)}
          {" / "}
          {formatDuration(duration, longerThanAnHour)}
        </div>
        <div className={"flex-grow overflow-hidden text-xs"}>{meta.title}</div>
        {toggleFullScreen && (
          <div>
            <button
              className="px-3"
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
