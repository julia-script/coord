// contentlayer.config.ts
import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from "contentlayer/source-files";

import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

export const DocPage = defineDocumentType(() => ({
  name: "DocPage",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",

  fields: {
    title: { type: "string", required: false },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./src/content",

  mdx: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeMdxCodeProps, rehypeKatex],
  },
  documentTypes: [DocPage],
});
