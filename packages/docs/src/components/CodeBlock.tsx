"use client";
import { Runner } from "react-runner";
import sdk from "@stackblitz/sdk";

import {
  CodeIcon,
  CopyIcon,
  CheckIcon,
  EyeIcon,
  EyeClosedIcon,
} from "@primer/octicons-react";
import * as graph from "@coord/graph";
import * as motion from "@coord/motion";
import * as motionReact from "@coord/motion-react";
import * as core from "@coord/core";
import React, {
  ComponentProps,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";
import dedent from "ts-dedent";
import clsx from "clsx";

import {
  CodeBlock as CB,
  CodeMorph,
  LanguageOptions,
  useCode,
} from "@coord/code";

const scope = {
  import: {
    react: React,
    "@coord/graph": graph,
    "@coord/motion": motion,
    "@coord/motion-react": motionReact,
    "@coord/core": core,
  },
};

const packageJson = {
  name: "curves-demo",
  version: "0.0.0",
  private: true,
  dependencies: {
    react: "18.2.0",
    "react-dom": "18.2.0",
    "@types/react": "18.2.14",
    "@types/react-dom": "18.2.6",
    "@coord/graph": "latest",
    "@coord/core": "latest",
  },
  stackblitz: {
    installDependencies: true,
    startCommand: "pnpm install && pnpm start",
  },
  scripts: {
    start: "react-scripts start",
    build: "react-scripts build",
    test: "react-scripts test --env=jsdom",
    eject: "react-scripts eject",
  },
  devDependencies: {
    "react-scripts": "latest",
  },
};

const files = {
  "src/index.tsx": dedent(`
    import * as React from 'react';

    import { StrictMode } from 'react';
    import { createRoot } from 'react-dom/client';
    import './style.css';
    import App from './App';

    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  `),
  "public/index.html": '<div id="root"></div>',
  "src/style.css": dedent(`
    html, body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background-color: #282c34;
      overflow: hidden;
    }
    #root {
      height: 100vh;
    }
  `),
  "package.json": JSON.stringify(
    packageJson,
    null,
    2
  ),
};

function CopyButton({
  code,
  ...rest
}: { code: string } & ComponentProps<"button">) {
  const [copied, setCopied] =
    React.useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
      }}
      {...rest}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

export function CodeBlock({
  code,
  height,
  collapsed = false,
  collapsable = true,
  preview = false,
  editable = false,
  morph = false,
  language,
}: {
  code: string;
  height: number;
  collapsed?: boolean;
  collapsable?: boolean;
  preview?: boolean;
  language?: string;
  editable?: boolean;
  morph?: boolean;
}) {
  const codeSections = useMemo(() => {
    code = dedent(code);
    if (!morph)
      return [
        {
          type: "option",
          description: "",
          code,
          name: "",
        },
      ];
    return parseMorphingCode(code);
  }, [code]);

  const [
    activeSectionIndex,
    setActiveSectionIndex,
  ] = React.useState(0);
  const activeCode =
    codeSections[activeSectionIndex]?.code ?? "";

  const [edit, setEdit] = React.useState(false);
  const [isCollapsed, setIsCollapsed] =
    React.useState(collapsed);
  const [loading, setLoading] =
    React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!edit) return;
    if (!ref.current) return;
    sdk
      .embedProject(
        ref.current,
        {
          title: "Curves demo",
          description: "Curves demo",
          template: "create-react-app",
          dependencies: packageJson.dependencies,
          files: {
            ...files,
            "src/App.tsx": activeCode,
          },
        },
        {
          openFile: "src/App.tsx",
          theme: "dark",
          hideExplorer: true,
          hideNavigation: true,
          hideDevTools: true,
          view: "default",
          height: 500,
        }
      )
      .then(() => {
        setLoading(false);
      });
  }, [edit]);
  const steps = codeSections.filter(
    ({ type }) => type === "step"
  );
  const options = codeSections.filter(
    ({ type }) => type === "option"
  );
  return (
    <div className="not-prose relative mb-2 flex w-full flex-col ">
      <div
        className={clsx(
          "w-full overflow-hidden rounded",
          {
            absolute:
              edit === false || loading === true,
          }
        )}
      >
        <div ref={ref} />
      </div>
      <div
        className={clsx({
          "opacity-50": loading,
          hidden:
            edit === true && loading === false,
        })}
      >
        {preview && (
          <div
            style={{
              height,
            }}
            className={clsx(
              "relative overflow-hidden rounded"
            )}
          >
            {codeSections.map(
              (
                { type, description, code, name },
                i
              ) => (
                <div
                  key={i}
                  className={clsx(
                    "absolute h-full w-full transition-all duration-1000",
                    {
                      "opacity-0":
                        i !== activeSectionIndex,
                    }
                  )}
                >
                  <Runner
                    key={i}
                    code={code}
                    scope={scope}
                  />
                </div>
              )
            )}
          </div>
        )}
        {morph && !!steps.length && (
          <div className="my-2 flex gap-2">
            {steps.map(
              (
                { name, description, code },
                i
              ) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSectionIndex(i);
                  }}
                  className={clsx(
                    "flex w-0 grow flex-col items-center justify-center rounded border  px-1 py-4 transition-all duration-200 hover:scale-105",
                    {
                      "border-white/5":
                        i !== activeSectionIndex,
                      "border-accent/50 bg-accent-graph-300/5":
                        i === activeSectionIndex,
                    }
                  )}
                >
                  <span className="flex flex-col items-center gap-2 text-xs font-bold md:text-sm">
                    <span
                      className={clsx(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs",
                        {
                          "bg-accent-graph-300/20":
                            i ===
                            activeSectionIndex,
                        }
                      )}
                    >
                      {i + 1}
                    </span>{" "}
                    {name}
                  </span>
                  {description && (
                    <span className="mt-2 text-xs text-white/60">
                      {description}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        )}
        <CodeContainer
          buttonsLeft={
            options.length > 1
              ? options.map((c, i) => (
                  <button
                    key={i}
                    className={clsx(
                      "flex items-center gap-2 border-b  px-3 py-2 transition-colors duration-200",
                      {
                        "border-accent border-solid font-bold text-white":
                          i ===
                          activeSectionIndex,
                        "border-transparent font-normal":
                          i !==
                          activeSectionIndex,
                      }
                    )}
                    onClick={() => {
                      setActiveSectionIndex(i);
                    }}
                  >
                    {c.name}
                  </button>
                ))
              : undefined
          }
          buttonsRight={[
            collapsable && (
              <button
                className="flex items-center gap-2 px-3 py-2"
                onClick={() => {
                  setIsCollapsed((v) => !v);
                }}
              >
                {isCollapsed ? (
                  <>
                    <EyeIcon size={12} /> View
                  </>
                ) : (
                  <>
                    <EyeClosedIcon size={12} />{" "}
                    Hide
                  </>
                )}
              </button>
            ),

            editable && (
              <button
                className="flex items-center gap-2 px-3 py-2"
                disabled={loading}
                onClick={() => {
                  setEdit(true);
                  setLoading(true);
                }}
              >
                <CodeIcon size={12} />
                Edit
              </button>
            ),
            <CopyButton
              className="flex items-center gap-2 px-3 py-2"
              code={activeCode}
            />,
          ]}
        >
          {!isCollapsed && !morph && (
            <CB
              code={activeCode}
              noBg
              language={language}
              className="m-0 bg-none p-4 "
            />
          )}
          {!isCollapsed && morph && (
            <MorphingCodeBlock
              language={language ?? "txt"}
              code={activeCode}
            />
          )}
        </CodeContainer>
      </div>
    </div>
  );
}
function CodeContainer({
  children,
  buttonsRight = [],
  buttonsLeft = [],
}: PropsWithChildren<{
  buttonsRight?: React.ReactNode[];
  buttonsLeft?: React.ReactNode[];
}>) {
  return (
    <div className="bg-dark-750 mt-2 flex w-full flex-col rounded-lg border border-white/5">
      <header className="flex items-center bg-neutral-600/10">
        <div className="flex">
          {buttonsLeft.map((c, i) => (
            <div
              key={i}
              className={
                "flex items-center text-xs font-bold transition-colors duration-200  hover:bg-neutral-700/10"
              }
            >
              {c}
            </div>
          ))}
        </div>
        <div className="ml-auto flex">
          {buttonsRight.map((c, i) => (
            <div
              key={i}
              className={
                "flex items-center text-xs font-bold transition-colors duration-200 hover:bg-neutral-700/10"
              }
            >
              {c}
            </div>
          ))}
        </div>
      </header>
      <div className="grow-1 w-full overflow-scroll">
        <div className=" flex w-fit">
          {children}
        </div>
      </div>
    </div>
  );
}
const parseMorphingCode = (code: string) => {
  const lines = code.split("\n");
  const codeParts = [
    {
      type: "option",
      description: "",
      code: "",
      name: "",
    },
  ];

  for (const line of lines) {
    const [_, optionName] = line.split("option:");
    const [__, stepName] = line.split("step:");

    if (optionName || stepName) {
      if (codeParts.at(-1)?.code.trim() === "") {
        codeParts.pop();
      }
      const [name, description] = (
        optionName ?? stepName
      ).split(" - ");

      const type = optionName ? "option" : "step";
      codeParts.push({
        type,
        code: "",
        description: description?.trim() ?? "",
        name: name.trim(),
      });
      continue;
    }
    const part = codeParts.at(-1);
    if (!part) continue;

    part.code += `${line}\n`;
  }
  return codeParts.map((c) => {
    c.code = dedent(c.code);
    return c;
  });
};
export function MorphingCodeBlock({
  code,
  language,
}: {
  code: string;
  language: LanguageOptions;
}) {
  const props = useCode(code, {
    duration: 0.8,
    language,
  });
  return (
    <CodeMorph
      code={props.code}
      transition={props.transition}
      options={props.options}
      noBg
      className="m-0 bg-none p-4"
    />
  );
}
