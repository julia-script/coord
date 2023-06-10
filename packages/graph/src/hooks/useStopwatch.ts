import { useCallback } from "react";
import { useSafeEffect, useSafeRef } from "./safe-server-hooks";
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
    duration?: number;
    repeat?: boolean;
    autoplay?: boolean;
  } = {}
) => {
  const {
    from = 0,
    to = 1,
    duration = 1000,
    repeat = false,
    autoplay = false,
  } = config;

  const requestRef = useSafeRef<number | undefined>(undefined);
  const previousTimeRef = useSafeRef<number>(Date.now());
  const startTime = useSafeRef<number>(performance.now());
  /**
   * Callback to be executed on each animation frame.
   *
   * @param {number} currentTime - The current time provided by requestAnimationFrame.
   */
  const animate = useCallback(
    (currentTime: number) => {
      const deltaTime = currentTime - startTime.current;
      const t = (to - from) * (deltaTime / duration);

      if (t >= to) {
        if (repeat) {
          startTime.current = currentTime;
        } else {
          stop();
        }
      }
      fn(t);
      requestRef.current = requestAnimationFrame(animate);
    },
    [from, to, duration, repeat]
  );
  /**
   * Starts or resumes the stopwatch.
   *
   * @param {number} t - The time to start at.
   */
  const play = useCallback(
    (t: number = from) => {
      previousTimeRef.current = performance.now() - t * duration;
      requestRef.current = requestAnimationFrame(animate);
    },
    [animate, from]
  );

  /**
   * Stops the stopwatch and resets it to the start time.
   */
  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, [from]);

  /**
   * Pauses the stopwatch.
   */
  const pause = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  useSafeEffect(() => {
    if (autoplay) {
      play();
    }
    return () => stop(); // cleanup function to stop on component unmount
  }, [autoplay, play, stop]);

  return {
    play,
    stop,
    pause,
  };
};
