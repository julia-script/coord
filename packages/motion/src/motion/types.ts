import { YieldedType } from "@coord/core";
import { makeMotion } from "./make-scene";
import { makeState, requestContext } from "./requests";

export type MotionBuilder = () => MotionBuilderGenerator;
export type MotionBuilderGenerator = Generator<unknown, unknown, unknown>;

export type MotionState = Record<string, unknown>;

export type MotionRequest = {
  type: string;
};

export type ContextRequest<TState extends MotionState> = ReturnType<
  typeof requestContext<TState>
>;

export type EndRequest = Readonly<{
  type: "REQUEST_END";
}>;

export type MakeStateRequest<TKey extends string, TValue> = Readonly<{
  type: "MAKE_STATE";
  state: { key: TKey; initialState: TValue };
}>;
export type MotionScene<TBuilder extends MotionBuilder> = ReturnType<
  typeof makeMotion<TBuilder>
>;

export type BuilderState<
  TBuilder extends MotionBuilder | MotionBuilderGenerator
> = Extract<
  YieldedType<TBuilder>,
  {
    readonly type: "MAKE_STATE";
    readonly state: {
      readonly key: string;
    };
  }
> extends {
  state: infer TState & { key: infer K; initialState: any };
}
  ? {
      [TKey in K & string]: Extract<
        TState,
        { key: TKey; initialState: any }
      >["initialState"];
    }
  : never;

export type SceneState<TScene extends MotionScene<MotionBuilder>> =
  BuilderState<TScene["builder"]>;

export type MotionSettings = {
  fps: number;
  physicsFps: number;
};

export type MotionMeta = {
  title: string;
  description?: string;
  start: number;
  duration: number;
  scenes: {
    [key: string]: MotionMeta;
  };
};
