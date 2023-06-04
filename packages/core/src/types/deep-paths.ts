type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"]
  ? false
  : true;

type TupleKey<T> = Exclude<keyof T, keyof any[]>;

type ArrayKey = number;

export type AnythingButTupleOrRecord<T> = T extends Record<string, any>
  ? T extends Array<any>
    ? IsTuple<T> extends true
      ? false
      : true
    : false
  : true;

export type ExtractBranches<TShape, TKey> = TKey extends keyof any
  ? Extract<TShape, { [key in TKey]?: any }>
  : never;

export type InferPathValueImpl<
  TShape,
  TPath,
  TUndefined = false
> = TPath extends keyof TShape
  ? TShape[TPath] | (TUndefined extends true ? undefined : never)
  : TPath extends `${infer THead}.${infer TTail}` | `${infer THead}`
  ? THead extends keyof TShape
    ? InferPathValueImpl<
        TShape[THead],
        TTail,
        TUndefined extends true ? true : AnythingButTupleOrRecord<TShape[THead]>
      >
    : // The lines below basically normalizes the inputs and recursively call the type utility again
    THead extends keyof ExtractBranches<TShape, THead>
    ? InferPathValueImpl<ExtractBranches<TShape, THead>, TPath, true>
    : never
  : never;

export type InferPathValue<
  TShape extends Record<string, any>,
  TPath extends InferPath<TShape>
> = InferPathValueImpl<TShape, TPath>;

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

export type InferPath<TFieldValues extends Record<string, any>> =
  InferPathImpl<TFieldValues>;

export type InferMultiplePathValues<
  TFieldValues extends Record<string, any>,
  TPath extends InferPath<TFieldValues>[]
> = {
  [K in keyof TPath]: InferPathValueImpl<
    TFieldValues,
    TPath[K] & InferPath<TFieldValues>
  >;
};

export type InferPathValueTree<T> = {
  [K in InferPathImpl<T>]-?: InferPathValueImpl<T, K>;
};
