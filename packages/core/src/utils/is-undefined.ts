export function isUndefined(v: unknown): v is undefined {
  return typeof v === "undefined";
}
