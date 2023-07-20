import { EventEmitter } from "events";

interface AnimationClockEvents {
  "time-update": (time: number) => void;
  end: () => void;
}

export class AnimationClock extends EventEmitter {
  private _frameRequest: number = 0;

  private _startTime = 0;
  private isPlaying = false;

  constructor(public durationInSeconds = 1) {
    super();
    this.setMaxListeners(0);
  }

  on = <Event extends keyof AnimationClockEvents>(
    event: Event,
    listener: AnimationClockEvents[Event]
  ) => {
    return super.on(event, listener);
  };
  emit = <
    Event extends keyof AnimationClockEvents
  >(
    event: Event,
    ...args: Parameters<
      AnimationClockEvents[Event]
    >
  ) => {
    return super.emit(event, ...args);
  };
  private _time = 0;
  get time(): Readonly<number> {
    return this._time;
  }

  play = (time: number = 0) => {
    this._time = time;
    this._startTime = performance.now();
    this.isPlaying = true;
    this.tick(this._startTime);
  };

  private emitTime = (time: number) => {
    time = Math.min(time, 1);
    if (time === this._time) {
      return;
    }
    this._time = time;

    this.emit("time-update", time);
    if (time === 1) {
      this.isPlaying = false;
      this.emit("end");
    }
  };
  tick = (time: number) => {
    if (!this.isPlaying) {
      this.emitTime(time);
      return;
    }
    const timeDiff = time - this._startTime;
    console.log(timeDiff);
    const animationTime =
      timeDiff / 1000 / this.durationInSeconds;
    this.emitTime(animationTime);

    if (!this.isPlaying) return;
    this._frameRequest = requestAnimationFrame(
      this.tick
    );
  };
  stop = () => {
    this.isPlaying = false;
    cancelAnimationFrame(this._frameRequest);
  };
}
