import {
  runMotion,
  MotionScene,
  MotionSettings,
  Motion,
  SceneState,
} from "@/motion";

import { clamp } from "@coord/core";

import { EventEmitter } from "events";

interface MotionControllerEvents<
  MotionController
> {
  "frame-changed": MotionController;
  "play-status-changed": MotionController;
  "play-range-changed": MotionController;
  "repeat-changed": MotionController;
}

export class MotionController<
  TScene extends MotionScene
> extends EventEmitter {
  on<
    EventName extends keyof MotionControllerEvents<
      typeof this
    >
  >(
    event: EventName,
    listener: (
      payload: MotionControllerEvents<
        typeof this
      >[EventName]
    ) => void
  ): this {
    return super.on(event, listener);
  }
  emit<
    EventName extends keyof MotionControllerEvents<
      typeof this
    >
  >(
    event: EventName,
    payload: MotionControllerEvents<
      typeof this
    >[EventName]
  ): boolean {
    return super.emit(event, payload);
  }

  constructor(public motion: Motion<TScene>) {
    super();

    this._playRangeEnd =
      (motion.frames.length * 1000) /
      motion.settings.fps;
  }

  static from<TScene extends MotionScene>(
    scene: TScene,
    settings?: Partial<MotionSettings>
  ) {
    return new MotionController<TScene>(
      runMotion<TScene>(scene, settings)
    );
  }

  private _frameRequest = 0;
  private _playing = false;
  private _currentTime = 0;
  private _startTime = 0;
  private _repeat = false;

  private _playRangeStart = 0;
  private _playRangeEnd: number;

  get playing() {
    return this._playing;
  }

  get durationInFrames() {
    return this.motion.frames.length;
  }

  get fps() {
    return this.motion.settings.fps;
  }

  get duration() {
    return (
      (this.durationInFrames * 1000) / this.fps
    );
  }

  get currentTime() {
    return this._currentTime;
  }
  get state(): SceneState<TScene> {
    const frame =
      this.motion.frames[this.currentFrame];
    if (!frame)
      throw new Error("Frame not found");
    return frame;
    // return {
    //   ...frame,
    //   subscribe: this.subscribe,
    // } as typeof frame & {
    //   subscribe: typeof this.subscribe;
    // };
  }

  get repeat() {
    return this._repeat;
  }

  get playRange() {
    return [
      this._playRangeStart,
      this._playRangeEnd,
    ] as const;
  }

  get currentFrame() {
    return clamp(
      Math.floor(
        (this._currentTime / 1000) * this.fps
      ),
      0,
      this.durationInFrames - 1
    );
  }

  tick = (time: number) => {
    if (!this.playing) return;
    let currentTime = time - this._startTime;

    if (currentTime >= this._playRangeEnd) {
      if (this._repeat) {
        currentTime = this._playRangeStart;
        this._startTime = time;
      } else {
        this.setTime(this._playRangeEnd);
        this.pause();
        return;
      }
    }

    this.setTime(currentTime);

    this._frameRequest = requestAnimationFrame(
      this.tick
    );
  };

  play = (time = this._currentTime) => {
    if (this.playing) return;
    this.setIsPlaying(true);
    if (time >= this._playRangeEnd) {
      time = this._playRangeStart;
    }
    this.setTime(time);
    this._startTime =
      performance.now() - this._currentTime;
    this._frameRequest = requestAnimationFrame(
      this.tick
    );
  };

  pause = () => {
    cancelAnimationFrame(this._frameRequest);
    this.setIsPlaying(false);
  };

  stop = () => {
    this.pause();

    this.setTime(0);
  };

  setPlayRange = (start: number, end: number) => {
    start = Math.max(0, start);
    end = Math.min(this.duration, end);

    if (start > end) {
      throw new Error(
        "Play range start is greater than end"
      );
    }

    this._playRangeStart = start;
    this._playRangeEnd = end;

    this.emit("play-range-changed", this);
  };

  setTime = (time: number) => {
    const prevFrame = this.currentFrame;
    this._currentTime = clamp(
      time,
      this._playRangeStart,
      this._playRangeEnd
    );

    if (this.currentFrame !== prevFrame) {
      this.emit("frame-changed", this);
    }
  };

  setFrame = (frame: number) => {
    this.setTime(
      (frame / this.durationInFrames) *
        this.duration
    );
  };

  setRepeat = (repeat: boolean) => {
    if (repeat !== this._repeat) {
      this._repeat = repeat;
      this.emit("repeat-changed", this);
    }
  };

  private setIsPlaying = (playing: boolean) => {
    if (playing !== this._playing) {
      this._playing = playing;
      this.emit("play-status-changed", this);
    }
  };
  disconnect = () => {
    this.pause();
    this.removeAllListeners();
  };

  subscribe(
    fn: (state: SceneState<TScene>) => void
  ): () => void {
    const handler = () => {
      console.log("frame changed", this.state);
      fn(this.state);
    };
    this.on("frame-changed", handler);
    fn(this.state);
    return () => {
      this.off("frame-changed", handler);
    };
  }
}

export function makeControls<
  TScene extends MotionScene
>(
  scene: TScene,
  contextSettings?: Partial<MotionSettings>
) {
  return MotionController.from<TScene>(
    scene,
    contextSettings
  );
}
