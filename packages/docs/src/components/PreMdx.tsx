"use client";
import { CodeBlock, LiveCodeBlock } from "./CodeBlock";

export function PreMdx({
  children,
  live,
  collapsed,
}: {
  children: React.ReactNode;
  live?: boolean;
  previewOnly?: boolean;
  collapsed?: boolean;
  className?: string;
}) {
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
}
