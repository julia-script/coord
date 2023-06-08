import { useState, useEffect, useRef, useCallback } from "react";
/**
 * useStopwatch custom React hook.
 *
 * @param {Object} config - The stopwatch configuration.
 * @param {number} [config.start=0] - The start time of the stopwatch.
 * @param {number} [config.end=1] - The end time of the stopwatch.
 * @param {number} [config.duration=1000] - The update interval of the stopwatch in milliseconds.
 * @param {boolean} [config.repeat=false] - If true, the stopwatch will loop from start to end.
 * @param {boolean} [config.autoplay=false] - If true, the stopwatch will start automatically.
 * @returns {Object} The stopwatch state and controls.
 */
export const useStopwatch = (
  config: {
    start?: number;
    end?: number;
    duration?: number;
    repeat?: boolean;
    autoplay?: boolean;
  } = {}
) => {
  const {
    start = 0,
    end = 1,
    duration = 1000,
    repeat = false,
    autoplay = false,
  } = config;
  const [t, setT] = useState(start);

  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number>(Date.now());
  /**
   * Callback to be executed on each animation frame.
   *
   * @param {number} currentTime - The current time provided by requestAnimationFrame.
   */
  const animate = useCallback(
    (currentTime: number) => {
      const delta = (currentTime - previousTimeRef.current) / duration;
      setT((prevT) => {
        const nextT = prevT + delta;
        if (nextT >= end) {
          if (repeat) {
            return nextT - (end - start);
          } else {
            stop();
            return end;
          }
        }
        return nextT;
      });
      previousTimeRef.current = currentTime;
      requestRef.current = requestAnimationFrame(animate);
    },
    [start, end, duration, repeat]
  );
  /**
   * Starts or resumes the stopwatch.
   *
   * @param {number} t - The time to start at.
   */
  const play = useCallback(
    (t: number = start) => {
      setT(t);
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    },
    [animate, start]
  );

  /**
   * Stops the stopwatch and resets it to the start time.
   */
  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
      setT(start);
      previousTimeRef.current = Date.now();
    }
  }, [start]);

  /**
   * Pauses the stopwatch.
   */
  const pause = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (autoplay) {
      play();
    }
    return () => stop(); // cleanup function to stop on component unmount
  }, [autoplay, play, stop]);

  return {
    play,
    stop,
    pause,
    t,
  };
};
