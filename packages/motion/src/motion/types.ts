import { YieldedType } from "@coord/core";
import { makeMotion } from "./make-scene";
import { requestContext } from "./requests";
import { runMotion } from "./run-motion";

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
    | Generator<unknown>
    | (() => Generator<unknown>)
> = Extract<
  YieldedType<TBuilder>,
  {
    type: "MAKE_STATE";
    state: {
      key: string;
      initialState: unknown;
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

export type MergeUnion<T> = (
  T extends unknown ? (x: T) => unknown : never
) extends (x: infer R) => unknown
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
