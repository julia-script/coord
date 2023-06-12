import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};
import mdx from "@next/mdx";
const withMDX = mdx({
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeMdxCodeProps, rehypeKatex],
    useDynamicImport: true,
  },
});
export default withMDX(nextConfig);
