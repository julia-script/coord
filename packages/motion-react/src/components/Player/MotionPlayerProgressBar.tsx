import React, { useMemo, useRef } from "react";
import { MotionControls } from "@/hooks";
import { MotionContextMeta } from "@coord/motion";
import { clamp, inverseLerp } from "@coord/core";
import { useDrag } from "@use-gesture/react";
import clsx from "clsx";
import "./MotionPlayerProgressBar.css";

export function MotionPlayerProgressBar({
  controls,
}: {
  controls: MotionControls;
}) {
  const {
    playing,
    play,
    pause,
    meta,
    setFrame,
    frame,
  } = controls;
  const ref = useRef<HTMLDivElement>(null);
  const { duration: movieDuration } = meta;

  useDrag(
    ({ xy: [x], first, last, memo = false }) => {
      if (!ref.current) return;

      if (first) {
        pause();
        memo = playing;
      }
      const rect =
        ref.current.getBoundingClientRect();
      const pos = clamp(
        (x - rect.x) / rect.width,
        0,
        1
      );
      setFrame(Math.round(movieDuration * pos));

      if (last && memo) {
        play();
      }
      return memo;
    },
    {
      target: ref,
    }
  );

  const normalizedMeta = useMemo(() => {
    if (Object.keys(meta.scenes).length === 0) {
      return {
        movie: meta,
      };
    }

    const scenes: {
      [key: string]: Omit<
        MotionContextMeta,
        "scenes"
      >;
    } = {};

    Object.keys(meta.scenes).forEach((key) => {
      const value = meta.scenes[key];
      if (!value) return;

      scenes[key] = value;
    });
    return scenes;
  }, [meta]);
  const sceneKeys = Object.keys(normalizedMeta);
  return (
    <div
      ref={ref}
      className={clsx(
        "motion-player-progress-bar"
      )}
    >
      {sceneKeys.map((key) => {
        const scene = normalizedMeta[key];
        if (!scene) return null;

        return (
          <div
            key={key}
            className={clsx(
              "motion-player-progress-bar_scene"
            )}
            style={{
              width: `${
                (scene.duration / movieDuration) *
                100
              }%`,
            }}
          >
            {sceneKeys.length > 1 && (
              <div
                className={clsx(
                  "motion-player-progress-bar_scene-title-area"
                )}
              >
                <h2 className="motion-player-progress-bar_scene-title">
                  {scene.title}
                </h2>
              </div>
            )}
            <div
              className={clsx(
                "motion-player-progress-bar_scene-bar"
              )}
            >
              <div
                className={
                  "motion-player-progress-bar_scene-bar-progress"
                }
                style={{
                  width: `${clamp(
                    inverseLerp(
                      scene.start,
                      scene.start +
                        scene.duration -
                        1,
                      frame
                    ) * 100,
                    0,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        );
      })}

      <button
        className={clsx(
          "motion-player-progress-bar_head"
        )}
        style={{
          left: `${
            (frame / movieDuration) * 100
          }%`,
        }}
      />
    </div>
  );
}
