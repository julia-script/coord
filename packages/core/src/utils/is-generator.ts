export function isGenerator(value: unknown): value is Generator {
  return (
    typeof value === "object" && value !== null && Symbol.iterator in value
  );
}
