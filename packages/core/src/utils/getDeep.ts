import { InferPath, InferPathValue, InferPathValueTree } from "../types";
import { get } from "lodash-es";

export function getDeep<
  T,
  TTree extends InferPathValueTree<T>,
  TKey extends keyof TTree
>(obj: T, path: TKey) {
  return get(obj, path) as TTree[TKey];
}
