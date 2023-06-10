"use client";

import {
  CodeBlock as CB,
  Language,
  useLiveRunner,
  CodeEditor,
} from "react-live-runner";

import * as graph from "@coord/graph";
import React from "react";
import dedent from "ts-dedent";
import clsx from "clsx";

const scope = {
  import: {
    react: React,
    "@coord/graph": graph,
  },
};

export function LiveCodeBlock({
  children,
  collapsed: collapsedInitialValue = false,
  partiallyVisibleWhenCollapsed,
}: {
  children: string;
  collapsed?: boolean;
  partiallyVisibleWhenCollapsed?: boolean;
}) {
  const { element, error, code, onChange } = useLiveRunner({
    initialCode: dedent(children),
    scope,
  });
  const [collapsed, setCollapsed] = React.useState(collapsedInitialValue);

  return (
    <div className="bg-dark-200/5 not-prose relative mb-4 flex flex-col gap-2 rounded-md p-2">
      <div className="relative">
        <div className={"border-dark-700/60 overflow-hidden rounded-md border"}>
          {element}
        </div>
      </div>

      {error && (
        <pre
          className={
            "m-0 overflow-hidden rounded-md  border-2 border-red-500 p-4 font-mono text-xs font-bold"
          }
        >
          {error}
        </pre>
      )}
      {!collapsed && (
        <div className={"border-dark-700/60 overflow-hidden rounded-md border"}>
          <CodeEditor
            className="font-mono text-xs"
            value={code}
            onChange={onChange}
          />
        </div>
      )}
      {collapsed && partiallyVisibleWhenCollapsed && (
        <div
          className={
            "border-dark-700/60 relative max-h-32 overflow-hidden rounded-b-md border-t"
          }
        >
          <CodeEditor
            className="font-mono text-xs"
            value={code}
            onChange={onChange}
          />
          <div
            className={
              "from-dark-900/40 to-dark-900/100 absolute bottom-0 left-0 right-0 h-full bg-gradient-to-b"
            }
          />
        </div>
      )}
      <button
        className={clsx("hover:text-dark-100 text-sm font-bold", {
          "absolute bottom-14 w-full":
            collapsed && partiallyVisibleWhenCollapsed,
        })}
        onClick={() => setCollapsed((collapsed) => !collapsed)}
      >
        {collapsed ? (
          <span>
            Edit code <span className="text-lg">🐵</span>
          </span>
        ) : (
          <span>
            Hide code <span className="text-lg">🙈</span>
          </span>
        )}
      </button>
    </div>
  );
}
export function CodeBlock({
  children,
  language = "typescript",
}: {
  language?: Language;
  showLineNumbers?: boolean;
  children: string;
}) {
  const code = React.useMemo(() => dedent(children), []);
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="not-prose relative">
      <header className="text-dark-100 bg-dark-900/50 absolute right-2 top-2 rounded-md py-2 font-mono text-xs font-bold">
        <ul className="m-0 flex flex-row p-0 [&>li]:px-2">
          <li className="border-dark-50/10 border-r">
            <span className="uppercase">{language}</span>
          </li>
          <li>
            <button
              className="hover:text-dark-200 font-bold"
              disabled={copied}
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
            >
              {copied ? "Copied ✅" : "Copy 📋"}
            </button>
          </li>
        </ul>
      </header>
      <CB className="p-2 font-mono text-xs" padding={16} language={language}>
        {code}
      </CB>
    </div>
  );
}
