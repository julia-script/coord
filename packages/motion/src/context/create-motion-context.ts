import { MotionScene } from "..";

export const DEFAULT_MOTION_CONTEXT_SETTINGS = {
  fps: 60,
  physicsFps: 120,
};

export type MotionContextSettings = typeof DEFAULT_MOTION_CONTEXT_SETTINGS;

export type MotionContextMeta = {
  title: string;
  description?: string;
  duration: number;
  start: number;
  scenes: {
    [key: string]: Omit<MotionContextMeta, "scenes">;
  };
};

export type MotionState = {
  [key: string]: unknown;
};

export type MotionStateContextProps = {
  $frame: number;
  $transitionIn: number;
};

export class MotionContext<TState extends MotionState> {
  _childContexts: Map<string, MotionContext<MotionState>> = new Map();
  _state: TState & MotionStateContextProps;
  frames: (TState & MotionStateContextProps)[];
  meta: MotionContextMeta;
  settings: MotionContextSettings;
  time = 0;

  constructor(
    scene: MotionScene<TState>,
    contextSettings: Partial<MotionContextSettings> = {}
  ) {
    this._state = { ...scene.initialState, $frame: 0, $transitionIn: 1 };
    this.frames = [];
    this.settings = {
      ...DEFAULT_MOTION_CONTEXT_SETTINGS,
      ...contextSettings,
    };
    this.meta = {
      ...scene.meta,
      start: 0,
      duration: 0,
      scenes: {},
    };
  }

  state(state?: {
    [K in keyof TState]?: TState[K];
  }): TState & Readonly<MotionStateContextProps> {
    if (state) {
      Object.assign(this._state, state);
    }
    return this._state;
  }

  collectChildStates() {
    for (const [key, childContext] of this._childContexts.entries()) {
      Object.assign(this._state, { [key]: childContext._state });
      childContext.pushFrame();
      Object.assign(this.meta.scenes, { [key]: childContext.meta });
    }
  }

  createChildContext<TKey extends keyof TState>(
    key: TKey & string,
    scene: MotionScene<MotionState>
  ) {
    const childContext = new MotionContext<MotionState>(scene, this.settings);
    childContext.meta.start = this.frames.length;
    this._childContexts.set(key, childContext);
    return childContext;
  }

  removeChildContext(context: MotionContext<MotionState>) {
    for (const [key, childContext] of this._childContexts.entries()) {
      if (childContext === context) {
        this._childContexts.delete(key);
        return;
      }
    }
  }
  pushFrame() {
    this.passTime(1 / this.settings.fps);
    this.collectChildStates();
    this.frames.push(this._state);

    this.meta.duration = this.frames.length;
    this._state = {
      ...this._state,
      $frame: this.frames.length,
    };
  }
  passTime = (time: number) => {
    if (time > 1 / this.settings.fps) {
      throw new Error(`Time should be less than 1 frame, got ${time}`);
    }
    this.time += time;
  };
}

export function createMotionContext<TState extends MotionState>(
  scene: MotionScene<TState>,
  contextSettings: Partial<MotionContextSettings> = {}
) {
  return new MotionContext(scene, contextSettings);
}
