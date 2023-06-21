export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export const isGeneratorFunction = <T>(
  value: T
): value is T & (() => Generator) => {
  return (
    typeof value === "function" &&
    value.constructor.name === "GeneratorFunction"
  );
};
