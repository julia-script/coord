"use client";
import {
  CodeBlock as CB,
  Language,
  useLiveRunner,
  CodeEditor,
} from "react-live-runner";

import * as graph from "@curves/graph";
import * as React from "react";
import dedent from "ts-dedent";

const scope = {
  import: {
    react: React,
    "@curves/graph": graph,
  },
};
export function LiveCodeBlock({
  children,
  collapsed: collapsedInitialValue = false,
}: {
  children: string;
  collapsed?: boolean;
}) {
  const { element, error, code, onChange } = useLiveRunner({
    initialCode: dedent(children),
    scope,
  });
  const [collapsed, setCollapsed] = React.useState(collapsedInitialValue);

  return (
    <div className="p-2 bg-gray-200/5 rounded-md gap-2 flex flex-col mb-4 not-prose">
      <div className="relative">
        <div className={"border border-gray-700/60 rounded-md overflow-hidden"}>
          {element}
        </div>

        {error && (
          <div className={"absolute w-full bottom-0 left-0 p-2"}>
            <pre
              className={
                "p-4 m-0 text-xs border border-gray-700/60 rounded-md overflow-hidden"
              }
            >
              {error}
            </pre>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className={"border border-gray-700/60 rounded-md overflow-hidden"}>
          <CodeEditor
            className="text-xs font-mono"
            value={code}
            onChange={onChange}
          />
        </div>
      )}
      <button
        className="text-sm hover:text-gray-100 font-bold"
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
    <div className="relative not-prose">
      <header className="text-xs text-gray-100 font-bold font-mono absolute top-2 right-2 bg-gray-900/50 py-2 rounded-md">
        <ul className="p-0 m-0 flex flex-row [&>li]:px-2">
          <li className="border-r border-gray-50/10">
            <span className="uppercase">{language}</span>
          </li>
          <li>
            <button
              className="hover:text-gray-200 font-bold"
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
      <CB className="text-xs font-mono p-2" padding={16} language={language}>
        {code}
      </CB>
    </div>
  );
}
