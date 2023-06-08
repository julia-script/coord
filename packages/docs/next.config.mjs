import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // mdxRs: true,
    appDir: true,
  },
};
import mdx from "@next/mdx";
const withMDX = mdx({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeMdxCodeProps],
    // providerImportSource: "@mdx-js/react",
    useDynamicImport: true,
  },
});
export default withMDX(nextConfig);
