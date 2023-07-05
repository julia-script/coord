import withMDX from "@next/mdx";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
    appDir: true,
  },
};

/** @type {import('@next/mdx').NextMDXOptions} */
const mdxConfig = {
  options: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [
      rehypeMdxCodeProps,
      rehypeKatex,
    ],
  },
};

export default withMDX(mdxConfig)(nextConfig);
