let _id = 0;
export function makeId(prefix = "") {
  return `${prefix}${_id++}`;
}
