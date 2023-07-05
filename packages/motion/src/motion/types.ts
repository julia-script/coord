import { YieldedType } from "@coord/core";
import { makeMotion } from "./make-scene";
import {
  makeState,
  requestContext,
} from "./requests";
import { runMotion } from "./run-scene";

export type MotionBuilder =
  () => MotionBuilderGenerator;
export type MotionBuilderGenerator = Generator<
  unknown,
  unknown,
  unknown
>;

export type MotionState = Record<string, unknown>;

export type MotionRequest = {
  type: string;
};

export type ContextRequest<
  TState extends MotionState
> = ReturnType<typeof requestContext<TState>>;

export type EndRequest = Readonly<{
  type: "REQUEST_END";
}>;

export type MakeStateRequest<
  TKey extends string,
  TValue
> = Readonly<{
  type: "MAKE_STATE";
  state: { key: TKey; initialState: TValue };
}>;
export type MotionScene<
  TBuilder extends MotionBuilder = MotionBuilder
> = ReturnType<typeof makeMotion<TBuilder>>;

type ExtractMakeState<
  TBuilder extends
    | Generator<any>
    | (() => Generator<any>)
> = Extract<
  YieldedType<TBuilder>,
  {
    type: "MAKE_STATE";
    state: {
      key: string;
      initialState: any;
    };
  }
>;
export type BuilderState<
  TBuilder extends
    | MotionBuilder
    | MotionBuilderGenerator
> = {
  [T in ExtractMakeState<TBuilder>["state"] as T["key"]]: T["initialState"];
};

type test = SceneState<
  MotionScene<
    () => Generator<
      | {
          type: "MAKE_STATE";
          state: {
            key: "test";
            initialState: number;
          };
        }
      | {
          type: "MAKE_STATE";
          state: {
            key: "test2";
            initialState: string;
          };
        }
    >
  >
>;
export type MergeUnion<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;

export type SceneState<
  TScene extends MotionScene<MotionBuilder>
> = BuilderState<TScene["builder"]>;

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

export type Motion<
  TScene extends MotionScene<MotionBuilder> = MotionScene<MotionBuilder>
> = ReturnType<typeof runMotion<TScene>>;
