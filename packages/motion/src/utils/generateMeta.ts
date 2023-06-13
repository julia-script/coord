export type SceneMeta<T extends string> = {
  title: T;
  description?: string;
};

export type InferSceneName<T extends SceneMetaish> = T extends SceneMeta<
  infer TName
>
  ? TName
  : T;

export type SceneMetaish<T extends string = string> = SceneMeta<T> | T;

const getMetaName = <const T extends SceneMetaish>(meta: T) => {
  if (typeof meta === "string") {
    return meta as InferSceneName<T>;
  }
  return meta.title as InferSceneName<T>;
};

const getMetaDescription = <T extends SceneMetaish>(meta: T) => {
  if (typeof meta === "string") {
    return undefined;
  }
  return meta.description;
};

export function generateMeta<const TMeta extends SceneMetaish>(
  meta: TMeta
): SceneMeta<InferSceneName<TMeta>> {
  return {
    title: getMetaName(meta),
    description: getMetaDescription(meta),
  };
}
