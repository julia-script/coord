export function isFunction(
  value: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): value is (...args: any[]) => any {
  return typeof value === "function";
}
