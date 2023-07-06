import { isString } from "@coord/core";
import { Regions } from "./code-tag";

export function stringifyLeft(
  regions: Regions[]
) {
  let code = "";
  for (const region of regions) {
    if (isString(region)) {
      code += region;
      continue;
    }
    code += region[0];
  }

  return code;
}

export function stringifyRight(
  regions: Regions[]
) {
  let code = "";
  for (const region of regions) {
    if (isString(region)) {
      code += region;
      continue;
    }
    code += region[1];
  }

  return code;
}

export function insert(code: string): Regions {
  return ["", code];
}

export function remove(code: string): Regions {
  return [code, ""];
}

export function replace(
  left: string,
  right: string
): Regions {
  return [left, right];
}

export const i = insert;
export const r = replace;
export const rm = remove;
