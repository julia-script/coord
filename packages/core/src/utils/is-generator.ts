export function isGenerator(value: unknown): value is Generator<any, any, any> {
  return (
    typeof value === "object" && value !== null && Symbol.iterator in value
  );
}
export const isGeneratorFunction = <T>(
  value: unknown
): value is () => Generator => {
  return (
    typeof value === "function" &&
    value.constructor.name === "GeneratorFunction"
  );
};
