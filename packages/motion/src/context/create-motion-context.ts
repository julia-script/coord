import { isObject } from "@coord/core";

export const DEFAULT_MOTION_CONTEXT_SETTINGS = {
  fps: 60,
  physicsFps: 120,
};

export type MotionContextSettings = typeof DEFAULT_MOTION_CONTEXT_SETTINGS;

export type MotionContextSceneMeta = {
  title: string;
  description?: string;
  frame: number;
  duration: number;
};

export type MotionContextMeta = {
  title: string;
  description?: string;
  scenes: MotionContextSceneMeta[];
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

  constructor(
    initialState: TState,
    contextSettings: Partial<MotionContextSettings> = {},
    meta: Partial<MotionContextMeta> = {}
  ) {
    this._state = { ...initialState, $frame: 0, $transitionIn: 1 };
    this.frames = [];
    this.settings = {
      ...DEFAULT_MOTION_CONTEXT_SETTINGS,
      ...contextSettings,
    };
    this.meta = {
      title: "Untitled",
      scenes: [],
      ...meta,
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
    }
  }

  createChildContext<TKey extends keyof TState>(key: TKey & string) {
    const childContext = new MotionContext<MotionState>(
      this._state[key] as MotionState,
      this.settings
    );
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
    this.collectChildStates();
    this.frames.push(this._state);

    this._state = {
      ...this._state,
      $frame: this.frames.length,
    };
  }
}

export function createMotionContext<TState extends MotionState>(
  initialState: TState,
  contextSettings: Partial<MotionContextSettings> = {}
) {
  return new MotionContext(initialState, contextSettings);
}
