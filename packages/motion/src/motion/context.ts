import {
  isContextRequest,
  isEndRequest,
  isMakeStateRequest,
  isRequest,
} from "./assertions";
import {
  MotionBuilder,
  MotionMeta,
  MotionRequest,
  MotionScene,
  MotionSettings,
  MotionState,
  SceneState,
} from "./types";

type FullState<TState extends MotionState> = TState & {
  $transition: number;
  $frame: number;
  $done: boolean;
};
type FullStateKeys<TState extends MotionState> = keyof FullState<TState> &
  string;

export class MotionContext<TState extends MotionState> {
  _state: FullState<TState>;
  frames: FullState<TState>[] = [];
  meta: MotionMeta = {
    title: "Untitled",
    start: 0,
    duration: 0,
    scenes: {},
  };

  settings: MotionSettings = {
    fps: 60,
    physicsFps: 120,
  };

  get time() {
    return this.frames.length / this.settings.fps;
  }
  constructor() {
    this._state = {} as FullState<TState>;
  }

  static from<TScene extends MotionScene<MotionBuilder>>(
    scene: TScene,
    settings: Partial<MotionSettings> & { transitionDuration?: number } = {}
  ): MotionContext<SceneState<TScene>> {
    const context = new MotionContext<SceneState<TScene>>();
    context.meta.title = scene.meta.title;
    context.meta.description = scene.meta.description;

    const { transitionDuration = 0, ...rest } = settings;
    context.settings = { ...context.settings, ...rest };
    const builderIterator = scene.builder();

    let transitionDurationInFrames = context.settings.fps * transitionDuration;
    context._state.$done = false;

    let done = false;
    while (true) {
      if (done === false) {
        const currentIteration = builderIterator.next();
        done = !!currentIteration.done;
        if (isRequest(currentIteration.value)) {
          context.respondRequest(currentIteration.value);
          continue;
        }
      }
      if (
        done === true &&
        context.frames.length >= transitionDurationInFrames
      ) {
        break;
      }

      context._state.$frame = context.frames.length;

      context._state.$transition =
        transitionDurationInFrames <= 0
          ? 1
          : Math.min(
              (context.frames.length + 1) / transitionDurationInFrames,
              1
            );

      context.pushFrame();
    }
    if (context.frames.length === 0) {
      context._state.$done = true;
      context.pushFrame();
    }
    return context;
  }

  pushFrame() {
    this.meta.duration++;
    this.frames.push({
      ...this._state,
    });
  }

  setState<TKey extends FullStateKeys<TState>>(
    key: TKey,
    value: (typeof this._state)[TKey]
  ) {
    this._state[key] = value;
  }

  respondRequest<TRequest extends MotionRequest>(request: TRequest) {
    if (isContextRequest<TState>(request)) {
      request.context = this;
    } else if (
      isMakeStateRequest<
        FullStateKeys<TState>,
        FullState<TState>[FullStateKeys<TState>]
      >(request)
    ) {
      this.makeState(request.state.key, request.state.initialState);
    } else if (isEndRequest(request)) {
      this._state.$done = true;
    }
  }

  makeState<TKey extends FullStateKeys<TState>>(
    key: TKey,
    value: FullState<TState>[TKey]
  ) {
    this.setState(key, value);

    for (let i = this.frames.length - 1; i >= 0; i--) {
      const frame = this.frames[i]!;
      if (key in frame) {
        break;
      }
      Object.assign(frame, { [key]: value });
    }
  }
}
