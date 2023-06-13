import {
  MotionBuilder,
  MotionContext,
  MotionState,
  isMotionBuilderRequest,
  requestTransition,
} from "@/context";
import { SceneMetaish, generateMeta } from "@/utils";
import { Scene, makeScene } from "./make-scene";

export type MovieSettings = {
  transitionDuration: number;
};
export type SceneMap = Record<string, Scene<string, any>> & {
  [key: number]: never;
};

export type SceneMapInitialState<TSceneMap extends SceneMap> = {
  [K in keyof TSceneMap]: TSceneMap[K] extends Scene<any, infer TState>
    ? TState & { $transitionIn: number }
    : never;
};

export function mergeStates<TSceneMap extends SceneMap>(scenes: TSceneMap) {
  return Object.entries(scenes).reduce((acc, [key, scene]) => {
    acc[key as keyof TSceneMap] = {
      ...scene.initialState,
      $transitionIn: 0,
      $frame: 0,
    };
    return acc;
  }, {} as SceneMapInitialState<TSceneMap>);
}

export function* runSceneBuilder(
  parentContext: MotionContext<MotionState>,
  builder: ReturnType<MotionBuilder<MotionState>>,
  context: MotionContext<MotionState>,
  transition: number
) {
  let hasRequestedTransition = false;

  let frame = 0;
  const fps = context.settings.fps;
  const transitionInFrames = Math.round(fps * transition);

  while (true) {
    const { value, done } = builder.next();

    if (isMotionBuilderRequest(value)) {
      if (value.type === "REQUEST_CONTEXT") {
        value.context = context;
        continue;
      }
      if (value.type === "REQUEST_TRANSITION") {
        if (hasRequestedTransition) {
          throw new Error("Cannot request transition twice");
        }
        hasRequestedTransition = true;
        yield value;
        continue;
      }
    }

    if (done) {
      if (!hasRequestedTransition) {
        yield* requestTransition();
      }
      break;
    }

    context.state({
      $transitionIn:
        transitionInFrames === 0
          ? 1
          : Math.min((frame + 1) / transitionInFrames, 1),
    });
    frame++;

    yield value;
  }

  // In case the scene was shorter the transition, we want to run it at least for the transition duration
  while (frame < transitionInFrames) {
    context.state({
      $transitionIn:
        transitionInFrames === 0
          ? 1
          : Math.min((frame + 1) / transitionInFrames, 1),
    });
    frame++;

    yield;
  }
  parentContext.removeChildContext(context);
}

export function createMovieBuilder<TSceneMap extends SceneMap>(
  scenes: TSceneMap,
  settings: MovieSettings
): MotionBuilder<SceneMapInitialState<TSceneMap>> {
  const sceneStack = Object.keys(scenes).reverse() as (keyof TSceneMap &
    string)[];

  let sceneBuilders: (ReturnType<typeof runSceneBuilder> | null)[] = [];

  return function* (context) {
    const startNext = (transition = 0) => {
      const scene = sceneStack.pop();
      if (!scene) {
        return;
      }
      const childContext = context.createChildContext(scene);
      const childScene = scenes[scene];

      if (!childScene) {
        throw new Error(`Scene ${String(scene)} not found`);
      }

      sceneBuilders.push(
        runSceneBuilder(
          context,
          childScene.builder(childContext),
          childContext,
          transition
        )
      );
    };

    // starts the first scene without transition
    startNext(0);

    while (true) {
      let i = 0;
      while (true) {
        const current = sceneBuilders[i];
        if (!current) {
          break;
        }
        while (true) {
          const { value, done } = current.next();

          if (done) {
            // Mark for removal
            sceneBuilders[i] = null;

            break;
          }
          if (isMotionBuilderRequest(value)) {
            if (value.type === "REQUEST_TRANSITION") {
              const duration = value.duration ?? settings.transitionDuration;

              startNext(duration);
              continue;
            }
            continue;
          }

          break;
        }
        i++;
      }

      sceneBuilders = sceneBuilders.filter((x) => x !== null);

      if (sceneBuilders.length === 0) {
        break;
      }

      yield;
    }
  };
}

export function makeMovie<
  TMeta extends SceneMetaish,
  const TSceneMap extends SceneMap
>(meta: TMeta, scenes: TSceneMap, movieSettings: Partial<MovieSettings> = {}) {
  const settings = {
    transitionDuration: 0.5,
    ...movieSettings,
  };
  const movieMeta = { ...generateMeta(meta), scenes: [] };
  const initialState = mergeStates(scenes);
  const builder = createMovieBuilder(scenes, settings);

  return makeScene(movieMeta, initialState, builder);
}
