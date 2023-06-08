import { getRoute, routePaths } from "@/content/graph/docs/routeMaps";

export async function generateStaticParams() {
  return routePaths.map((path) => ({
    slug: path.split("/").slice(2),
  }));
}

export default async function Page(props: { params: { slug?: string[] } }) {
  const C = (
    await getRoute(["graph", "docs", ...(props.params.slug ?? [])].join("/"))
  ).default;

  return <C />;
}
