import { notFound } from "next/navigation";
import React from "react";
import {
  fetchPageMdx,
  getAllRoutes,
} from "@/utils/routes";
import { PreMDX } from "@/components";

interface DocPageProps {
  params: {
    slug: string[];
  };
}
export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  const allRoutes = await getAllRoutes();

  return allRoutes.map((route) => ({
    slug: route.split("/").filter(Boolean),
  }));
}

const components = {
  pre: (props: any) => <PreMDX {...props} />,
};
const pageMap = new Map<
  string,
  Promise<React.ComponentType<any>>
>();
const fetchPage = (route: string) => {
  if (!pageMap.has(route)) {
    pageMap.set(route, fetchPageMdx(route));
  }

  return pageMap.get(route)!;
};

export default async function Page({
  params,
}: DocPageProps) {
  let C;
  try {
    C = await fetchPage(
      params.slug.join("/" ?? "")
    );
  } catch (e) {
    notFound();
  }

  return <C components={components} />;
}
