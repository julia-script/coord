import { allDocPages } from "contentlayer/generated";
import { notFound } from "next/navigation";

import { getMDXComponent } from "next-contentlayer/hooks";
import { PreMDX } from "@/components";
import dynamic from "next/dynamic";
import Module from "node:module";
import React from "react";
import { Example } from "@/components/motion/Example";

interface DocPageProps {
  params: {
    slug: string[];
  };
}
export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocPages.map((post) => ({
    slug: post.slug.split("/").filter(Boolean),
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
  MotionLandingPage: () => {
    return <Example />;
  },
};

export default async function Page({ params }: DocPageProps) {
  const page = getPostFromParams(params);
  if (!page) {
    notFound();
  }

  const Mdx = await getMDXComponent(page.body.code);

  return <Mdx components={components} />;
}
