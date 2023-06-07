import { getRoute, routePaths } from "@/content/graph/docs/routeMaps";
import { PreMdx } from "@/components/PreMdx";

export async function generateStaticParams() {
  return routePaths.map((path) => ({
    slug: path.split("/").slice(2),
  }));
}
const components = {
  pre: PreMdx,
};

export default async function Page(props: { params: { slug?: string[] } }) {
  const C = (
    await getRoute(["graph", "docs", ...(props.params.slug ?? [])].join("/"))
  ).default;

  return <C />;
}
