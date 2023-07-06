let _id = 0;
export function makeId<T extends string = "id-">(
  prefix: T = "id-" as T
): `${T}${number}` {
  return `${prefix}${_id++}`;
}
