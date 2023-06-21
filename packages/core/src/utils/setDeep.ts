import { InferPath, InferPathValue, InferPathValueTree } from "../types";
import { compact } from "lodash-es";
import { isObject } from "./isObject";
// const copy = <T extends Array<unknown> | Record<string, unknown>>(
//   obj: T
// ): T => {
//   return Array.isArray(obj) ? ([...obj] as T) : ({ ...obj } as T);
// };

// const insertAt = <TObj, TValue>(obj: TObj, path: string[], value: TValue) => {};
// export function setDeep<
//   T extends {
//     [key: string]: unknown;
//   },
//   TKey extends InferPath<T>
// >(obj: T, path: TKey, value: InferPathValue<T, TKey>) {
//   if (path === "") {
//     return value;
//   }
//   const parts = path.split(".");

//   let current: Record<string, unknown> | unknown[] = copy(obj);

//   for (let i = 0; i < parts.length - 1; i++) {
//     const part = parts[i]!;
//     let value: unknown = isObject(current)
//       ? current[part]
//       : current[parseInt(part)];

//     if (Array.isArray(value)) {
//       const newV = copy(value);
//       current[part] = newV;
//       current = newV;

//       // current = value;
//     }
//   }

//   const lastKey = parts[parts.length - 1]!;
//   current[lastKey] = value;
// }

export const isKey = (value: string) => /^\w*$/.test(value);
export const stringToPath = (input: string): string[] =>
  compact(input.replace(/["|']|\]/g, "").split(/\.|\[/));

const copy = <T extends Array<any> | object>(obj: T): T => {
  return Array.isArray(obj) ? ([...obj] as T) : ({ ...obj } as T);
};

export const setDeep = <
  T extends {
    [key: string]: unknown;
  },
  TTree extends InferPathValueTree<T>,
  TKey extends keyof TTree & string
>(
  obj: T,
  path: TKey,
  value: TTree[TKey]
) => {
  let index = -1;

  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;
  const newObj = copy(obj);
  let tempObj: {
    [key: string]: unknown;
  } = newObj;
  while (++index < length) {
    const key = tempPath[index] as keyof typeof tempObj;

    let newValue = value;
    if (index !== lastIndex) {
      const objValue = tempObj[key];

      if (isObject(objValue) || Array.isArray(objValue)) {
        newValue = copy(objValue) as TTree[TKey];
      } else if (isNaN(+tempPath[index + 1]!)) {
        newValue = {} as TTree[TKey];
      } else {
        newValue = [] as TTree[TKey];
      }
    }

    tempObj[key] = newValue;
    tempObj = tempObj[key] as typeof tempObj;
  }
  return newObj;
};
