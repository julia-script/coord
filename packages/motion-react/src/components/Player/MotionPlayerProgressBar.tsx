import React, { useMemo, useRef } from "react";
import { MotionControls } from "@/hooks";
import { MotionContextMeta } from "@coord/motion";
import { clamp, inverseLerp } from "@coord/core";
import { useDrag } from "@use-gesture/react";

export function MotionPlayerProgressBar({
  controls,
}: {
  controls: MotionControls;
}) {
  const { playing, play, pause, meta, setFrame, frame } = controls;
  const ref = useRef<HTMLDivElement>(null);
  const { duration: movieDuration } = meta;

  useDrag(
    ({ xy: [x], first, last, memo = false }) => {
      if (!ref.current) return;

      if (first) {
        pause();
        memo = playing;
      }
      const rect = ref.current.getBoundingClientRect();
      const pos = clamp((x - rect.x) / rect.width, 0, 1);
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
      [key: string]: Omit<MotionContextMeta, "scenes">;
    } = {};

    Object.keys(meta.scenes).forEach((key) => {
      const value = meta.scenes[key];
      if (!value) return;

      scenes[key] = value;
    });
    return scenes;
  }, [meta]);

  return (
    <div
      ref={ref}
      className={"group/bar relative flex w-full touch-none select-none gap-1"}
    >
      {Object.keys(normalizedMeta).map((key) => {
        const scene = normalizedMeta[key];
        if (!scene) return null;

        return (
          <div
            key={key}
            className="group/bar-scene relative h-1 w-full cursor-pointer"
            style={{
              width: `${(scene.duration / movieDuration) * 100}%`,
            }}
          >
            <div
              className={
                "absolute bottom-1 w-full py-2 opacity-0 transition-opacity duration-150 group-hover/bar:opacity-100"
              }
            >
              <h2 className="w-full overflow-hidden text-ellipsis whitespace-nowrap px-1 text-xs">
                {scene.title}
              </h2>
            </div>

            <div
              className={
                "h-1 w-full bg-gray-200/10 transition-transform duration-150 group-hover/bar-scene:scale-y-150"
              }
            >
              <div
                className={"h-full bg-blue-500 "}
                style={{
                  width: `${clamp(
                    inverseLerp(
                      scene.start,
                      scene.start + scene.duration - 1,
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
        className={
          "absolute -left-0.5 top-0  h-1 w-1 rounded-full bg-blue-500 opacity-0 transition-transform duration-150 group-hover/bar:scale-[4] group-hover/bar:opacity-100"
        }
        style={{
          left: `${(frame / movieDuration) * 100}%`,
        }}
      />
    </div>
  );
}
