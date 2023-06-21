"use client";
import { CodeBlock, LiveCodeBlock } from "./CodeBlock";

export type PreMDXProps = {
  children: React.ReactNode;
  live?: boolean;
  previewOnly?: boolean;
  collapsed?: boolean;
  partial?: boolean;
  className?: string;
};

export function PreMDX({ children, live, collapsed, partial }: PreMDXProps) {
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children &&
    typeof children.props.children === "string"
  ) {
    const code = children.props.children;
    const language = children.props.className?.replace("language-", "");

    if (live)
      return (
        <LiveCodeBlock collapsed={collapsed} partialCode={partial}>
          {code}
        </LiveCodeBlock>
      );
    return <CodeBlock language={language}>{code}</CodeBlock>;
  }
  return children;
}
