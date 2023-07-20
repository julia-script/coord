export type Nullable<T> = T | null | undefined;
export type PartialBy<
  T,
  K extends keyof T
> = Omit<T, K> & Partial<Pick<T, K>>;
