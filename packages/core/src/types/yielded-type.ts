export type YieldedType<T extends ((...args: any) => any) | Generator> =
  T extends Generator<infer U, any, any>
    ? U
    : T extends (...args: any) => Generator<infer U, any, any>
    ? U
    : never;
