import { B, T } from "vitest/dist/types-dea83b3d";

type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"]
  ? false
  : true;

type TupleKey<T> = Exclude<keyof T, keyof any[]>;

type ArrayKey = number;

export type AnythingButTupleOrRecord<T> = [T] extends [never]
  ? true
  : IsTupleOrRecord<T> extends true
  ? false
  : true;

export type IsTupleOrRecord<T> = [T] extends [never]
  ? false
  : T extends Record<string, any>
  ? T extends Array<any>
    ? IsTuple<T>
    : true
  : false;

export type ExtractBranches<TShape, TKey> = TKey extends `${number}`
  ? Extract<TShape, Array<any>>
  : TKey extends keyof any
  ? Extract<TShape, { [key in TKey]?: any }>
  : never;

type GetValue<TShape, TKey> = TKey extends keyof TShape
  ? TShape[TKey]
  : TKey extends `${number}`
  ? TShape extends Array<any>
    ? IsTuple<TShape> extends false
      ? TShape[number]
      : never
    : never
  : never;

type Maybe<T> = T | undefined;
type MaybefyIf<T, TCondition> = TCondition extends true ? Maybe<T> : T;

export type ShouldMaybefy<IsMaybeAlready, TShape> = IsMaybeAlready extends true
  ? true
  : IsTupleOrRecord<TShape> extends true
  ? false
  : true;

export type InferPathValueImplementation<
  TShape,
  TPath,
  IsMaybeBranch = false
> = SplitHead<TPath> extends [infer THead, infer TTail]
  ? TTail extends undefined
    ? MaybefyIf<
        GetValue<ExtractBranches<TShape, THead>, THead>,
        ShouldMaybefy<THead extends keyof TShape ? IsMaybeBranch : true, TShape>
      >
    : InferPathValueImplementation<
        GetValue<ExtractBranches<TShape, THead>, THead>,
        TTail,
        ShouldMaybefy<THead extends keyof TShape ? IsMaybeBranch : true, TShape>
      >
  : TPath;

export type InferPathValue<TShape, TPaths extends string> = {
  [K in TPaths]: InferPathValueImplementation<TShape, K>;
}[TPaths];

type MakePaths<K extends string | number, V> = V extends Record<string, any>
  ? `${K}` | `${K}.${InferPathImpl<V>}`
  : `${K}`;

export type InferPathImpl<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKey<T>]-?: MakePaths<K & string, T[K]>;
      }[TupleKey<T>]
    : MakePaths<ArrayKey, V>
  : {
      [K in keyof T]-?: MakePaths<K & string, T[K]>;
    }[keyof T];

export type InferPath<TFieldValues> = InferPathImpl<TFieldValues>;

export type InferMultiplePathValues<
  TFieldValues extends Record<string, any>,
  TPath extends InferPath<TFieldValues>[]
> = {
  [K in keyof TPath]: InferPathValueImplementation<
    TFieldValues,
    TPath[K] & InferPath<TFieldValues>
  >;
};

export type InferPathValueTree<T> = {
  [K in InferPath<T>]: InferPathValue<T, K>;
};

export type OnlyKeysOfType<T, TType> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends TType ? never : K;
  }[keyof T]
>;

type SplitHead<T> = T extends `${infer U}.${infer V}`
  ? [U, V]
  : T extends string
  ? [T, undefined]
  : never;

export type ExtractPathsOfType<TObject, TType> = {
  [K in InferPath<TObject>]: InferPathValueImplementation<
    TObject,
    K,
    false
  > extends TType | undefined
    ? K
    : never;
}[InferPath<TObject>];
