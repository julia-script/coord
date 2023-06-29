export type YieldedType<
  T extends ((...args: any) => Generator<any>) | Generator<any>
> = T extends Generator<infer U, any, any>
  ? U
  : T extends (...args: any) => Generator<infer U, any, any>
  ? U
  : never;
