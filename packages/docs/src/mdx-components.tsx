import type { MDXComponents } from "mdx/types";
import { CodeBlock, LiveCodeBlock } from "./components/CodeBlock";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    ...components,

    pre: ({
      children,
      live,
      collapsed,
    }: {
      children: React.ReactNode;
      live?: boolean;
      collapsed?: boolean;
      className?: string;
    }) => {
      if (
        typeof children === "object" &&
        children !== null &&
        "props" in children &&
        typeof children.props.children === "string"
      ) {
        const code = children.props.children;
        const language = children.props.className?.replace("language-", "");

        if (live)
          return <LiveCodeBlock collapsed={collapsed}>{code}</LiveCodeBlock>;
        return <CodeBlock language={language}>{code}</CodeBlock>;
      }
      return children;
    },
  };
}
