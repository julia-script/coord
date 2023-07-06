export function raise(message = "Error"): never {
  throw new Error(message);
}
