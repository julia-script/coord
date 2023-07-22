export function isGenerator(
  value: unknown
): value is Generator {
  return (
    typeof value === "object" &&
    value !== null &&
    Symbol.iterator in value
  );
}
export const isGeneratorFunction = (
  value: unknown
): value is () => Generator => {
  return (
    typeof value === "function" &&
    value.constructor.name === "GeneratorFunction"
  );
};
