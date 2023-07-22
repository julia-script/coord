// "use client";

import { CodeBlock } from "./CodeBlock";
import { get } from "lodash-es";

export type PreMDXProps = {
  editable?: boolean;
  children: React.ReactNode;
  height?: number;
  live?: boolean;
  collapsed?: boolean;
  collapsable?: boolean;
  className?: string;
  preview?: boolean;
  morph?: boolean;
};

const parseProps = (props: PreMDXProps) => {
  const code: unknown = get(
    props,
    "children.props.children"
  );
  const className: unknown = get(
    props,
    "children.props.className"
  );
  const live = !!props.live;

  const {
    preview = live,
    collapsable = live,
    collapsed = false,
    editable = live,
    morph = false,
  } = props;

  return {
    height: props.height ?? 400,
    code: typeof code === "string" ? code : "",
    language:
      typeof className === "string"
        ? className.replace("language-", "")
        : "typescript",

    children: props.children,
    collapsable,
    collapsed,
    editable,
    preview,
    morph,
  };
};

export async function PreMDX(props: PreMDXProps) {
  const {
    morph,
    editable,
    code,
    height,
    collapsable,
    collapsed,
    preview,
    language,
  } = parseProps(props);

  return (
    <CodeBlock
      morph={morph}
      code={code}
      height={height}
      collapsable={collapsable}
      collapsed={collapsed}
      preview={preview}
      language={language}
      editable={editable}
    />
  );
}
