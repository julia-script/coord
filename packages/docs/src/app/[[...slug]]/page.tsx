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
  pre: PreMDX,
};

export default async function Page({
  params,
}: DocPageProps) {
  let C;
  try {
    C = await fetchPageMdx(
      params.slug.join("/" ?? "")
    );
  } catch (e) {
    notFound();
  }

  return <C components={components} />;
}
