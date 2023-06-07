import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // mdxRs: true,
  },
};
import mdx from "@next/mdx";
const withMDX = mdx({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeMdxCodeProps],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});
export default withMDX(nextConfig);
