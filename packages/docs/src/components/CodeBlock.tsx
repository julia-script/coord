"use client";

import {
  CodeBlock as CB,
  Language,
  useLiveRunner,
  CodeEditor,
} from "react-live-runner";
import { HiChevronDoubleDown, HiChevronDoubleUp } from "react-icons/hi";

import * as graph from "@coord/graph";
import * as motion from "@coord/motion";
import * as motionReact from "@coord/motion-react";
import * as core from "@coord/core";
import React, { useEffect } from "react";
import dedent from "ts-dedent";
import clsx from "clsx";

const scope = {
  import: {
    react: React,
    "@coord/graph": graph,
    "@coord/motion": motion,
    "@coord/motion-react": motionReact,
    "@coord/core": core,
  },
};

export function LiveCodeBlock({
  children,
  collapsed: collapsedInitialValue = false,
  partialCode,
}: {
  children: string;
  collapsed?: boolean;
  partialCode?: boolean;
}) {
  const { element, error, code, onChange } = useLiveRunner({
    // initialCode: "",
    scope,
  });
  useEffect(() => {
    onChange(dedent(children));
  }, []);
  const [collapsed, setCollapsed] = React.useState(collapsedInitialValue);

  return (
    <div className="not-prose relative mb-4 flex flex-col gap-2 rounded-md">
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
      <div className={"relative flex flex-col gap-2"}>
        {(!collapsed || partialCode) && (
          <div
            className={clsx(
              "border-dark-700/60 overflow-hidden rounded-md border",
              {
                "max-h-32 opacity-30": collapsed && partialCode,
              }
            )}
          >
            <CodeEditor
              className="font-mono text-xs"
              value={code}
              onChange={onChange}
            />
          </div>
        )}

        <button
          className={clsx(
            "hover:text-dark-100 flex w-full items-center justify-center gap-2 pb-4  text-sm font-bold",
            {
              "absolute left-0 top-0 h-full ": collapsed && partialCode,
            }
          )}
          onClick={() => setCollapsed((collapsed) => !collapsed)}
        >
          {collapsed ? (
            <>
              <span>Edit code</span>
              <HiChevronDoubleDown />
            </>
          ) : (
            <>
              <span>Hide code</span>
              <HiChevronDoubleUp />
            </>
          )}
        </button>
      </div>
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
