export function generateStaticParams() {
  return routePaths.map((path) => ({
    slug: path.split("/").filter((x) => x !== ""),
  }));
}

import { getRoute, routePaths } from "./routeMaps";

export default async function Page(props: { params: { slug?: string[] } }) {
  const { component } = getRoute(`/${(props.params.slug ?? []).join("/")}`);
  const C = (await component).default;

  return <C />;
}
