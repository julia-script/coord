import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};
import mdx from "@next/mdx";
const withMDX = mdx({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeMdxCodeProps],
    useDynamicImport: true,
  },
});
export default withMDX(nextConfig);
