import { allDocPages } from "contentlayer/generated";
import { notFound } from "next/navigation";

import { getMDXComponent } from "next-contentlayer/hooks";
import { PreMDX } from "@/components";

interface DocPageProps {
  params: {
    slug: string[];
  };
}
export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocPages.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}
function getPostFromParams(params: DocPageProps["params"]) {
  const slug = "/" + (params?.slug ?? []).join("/");

  const post = allDocPages.find((post) => {
    return post.slug === slug;
  });

  if (!post) {
    null;
  }

  return post;
}
const components = {
  pre: (props: any) => <PreMDX {...props} />,
};

export default async function Page({ params }: DocPageProps) {
  const page = getPostFromParams(params);
  if (!page) {
    notFound();
  }

  const Mdx = getMDXComponent(page.body.code);

  return <Mdx components={components} />;
}
