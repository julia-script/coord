export type YieldedType<
  T extends
    | ((...args: unknown[]) => Generator<unknown>)
    | Generator<unknown>
> = T extends Generator<infer U, unknown, unknown>
  ? U
  : T extends (
      ...args: unknown[]
    ) => Generator<infer U, unknown, unknown>
  ? U
  : never;
