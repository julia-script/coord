import { useCallback } from "react";
import {
  useSafeEffect,
  useSafeRef,
} from "./safe-hooks";
import { EasingOptions, applyEasing } from "..";

/**
 * useStopwatch custom React hook.
 *
 * @param {Function} fn - The callback function to be executed on each animation frame.
 * @param {Object} config - The stopwatch configuration.
 * @param {number} [config.from=0] - The start value of t.
 * @param {number} [config.to=1] - The end value of t.
 * @param {number} [config.duration=1000] - The update interval of the stopwatch in milliseconds.
 * @param {boolean} [config.repeat=false] - If true, the stopwatch will loop from start to end.
 * @param {boolean} [config.autoplay=false] - If true, the stopwatch will start automatically.
 */
export const useStopwatch = (
  fn: (t: number) => void,
  config: {
    from?: number;
    to?: number;
    durationInSeconds?: number;
    repeat?: boolean;
    autoplay?: boolean;
    easing?: EasingOptions;
  } = {}
) => {
  const {
    from = 0,
    to = 1,
    durationInSeconds = 1,
    repeat = false,
    autoplay = false,
    easing = "easeInOutSine",
  } = config;
  const { current: state } = useSafeRef({
    isPlaying: false,
    time: 0,
    prevRequestTime: 0,
  });
  const requestRef = useSafeRef<
    number | undefined
  >(undefined);

  const callback = (t: number) => {
    state.time = Math.min(t, 1);

    const range = to - from;
    fn(
      from +
        range * applyEasing(easing, state.time)
    );
  };

  // const duration = durationInSeconds * 1000;
  const requestNextFrame = () => {
    if (state.isPlaying === false) return;

    requestRef.current =
      requestAnimationFrame(tick);
  };
  /**
   * Callback to be executed on each animation frame.
   *
   * @param {number} currentTime - The current time provided by requestAnimationFrame.
   */

  const tick = (currentTime: number) => {
    if (durationInSeconds === 0) {
      callback(1);
      stop();
      return;
    }
    if (state.prevRequestTime === 0) {
      state.prevRequestTime = currentTime;
    }
    const deltaTime =
      (currentTime - state.prevRequestTime) /
      1000;

    state.prevRequestTime = currentTime;
    if (deltaTime === 0) {
      requestNextFrame();
      return;
    }
    const time =
      state.time + deltaTime / durationInSeconds;

    if (time >= 1) {
      if (repeat) {
        callback(time % 1);
      } else {
        callback(1);
        stop();
      }
    } else {
      callback(time);
    }

    requestNextFrame();
  };

  /**
   * Starts or resumes the stopwatch.
   *
   * @param {number} t - The time to start at.
   */
  const play = (t: number = state.time) => {
    state.isPlaying = true;
    state.time = t >= 1 ? 0 : t;
    state.prevRequestTime = 0;
    requestNextFrame();
  };

  const pause = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      state.isPlaying = false;
    }
  };

  const stop = () => {
    pause();

    state.time = 0;
  };

  useSafeEffect(() => {
    if (autoplay) {
      play(0);
    }
    return () => stop();
  }, []);

  return {
    play,
    stop,
    pause,
    isPlaying: state.isPlaying,
  };
};
