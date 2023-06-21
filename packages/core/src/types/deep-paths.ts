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

export type KeyOfTree<TState> = keyof InferPathValueTree<TState> & string;
export type ValueOfTree<TState> = InferPathValueTree<TState>[KeyOfTree<TState>];
/**
 * v2
 */

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

export type Paths<T, D extends number = 3> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

type Leaves<T, D extends number = 3> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

export type FilteredPaths<T, TType, D extends number = 3> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? T[K] extends object
          ? Join<K, FilteredPaths<T[K], TType, Prev[D]>>
          : T[K] extends TType
          ? `${K}` //| Join<K, Paths<T[K], Prev[D]>>
          : never
        : never;
    }[keyof T]
  : "";

type TuplesJoin<K, P> = P extends string | number
  ? K extends string | number
    ? `${K}${"" extends K ? "" : "."}${P}`
    : never
  : never;
export type KVPathsImpl<T, TPath = "", D extends number = 3> = [D] extends [
  never
]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ?
            | [TuplesJoin<TPath, K>, T[K]]
            | KVPathsImpl<T[K], TuplesJoin<TPath, K>, Prev[D]> // TuplesJoin<K, KVPaths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : never;

export type KVPaths<T, D extends number = 3> = Extract<
  KVPathsImpl<T, "", D>,
  [string, any]
>;

type NestedObjectType = {
  a: string;
  b: number;
  nest: {
    c: number;
  }[];
  otherNest: {
    c: string;
  };
};

type test = KPaths<NestedObjectType, number>;
//     ^?
type test2 = VPaths<NestedObjectType, "b">;
//     ^?
export type KPaths<T, TTypeFilter = any, D extends number = 3> = Extract<
  KVPaths<T, D>,
  [any, TTypeFilter]
> extends [infer K, any]
  ? K & string
  : never;

export type VPaths<T, K, TTypeFilter = any, D extends number = 3> = Extract<
  KVPaths<T, D>,
  [K, TTypeFilter]
> extends [any, infer V]
  ? V extends TTypeFilter
    ? V
    : never
  : never;
