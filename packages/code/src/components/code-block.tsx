import React, { useMemo } from "react";
import { AnimatedTag, Regions, Tagifier } from "@/code";
import { SmoothReplace } from "./smooth-replace";
import { CodeOptions, normalizeOptions } from "@/hooks";
import { Typewriter } from "./type-replace";
import { Theme, atomone, gruvboxDark, nord, sublime } from "..";
import { LRParser } from "@lezer/lr";
import { javascript } from "@codemirror/lang-javascript";
import { LRLanguage, LanguageSupport } from "@codemirror/language";

export type CodeState = {
  theme?: Theme;
  code: AnimatedTag[];
  transition: number;
  noBg?: boolean;
  options?: Partial<Omit<CodeOptions, "language" | "easing">>;
} & React.HTMLAttributes<HTMLPreElement>;

export function CodeBlock({
  code,
  transition,
  options = {},
  theme = sublime,
  noBg = false,
  ...rest
}: CodeState) {
  const config = normalizeOptions(options);
  const style = Object.assign(
    { overflow: "hidden" },
    noBg
      ? {}
      : { padding: "0.5em", borderRadius: "0.2em", ...theme.styles.background }
  );
  return (
    <pre style={style} {...rest}>
      {config.mode === "fade" ? (
        <SmoothReplace transition={transition} tags={code} />
      ) : (
        <Typewriter transition={transition} tags={code} />
      )}
    </pre>
  );
}

type CodeMotionProps = {
  code: Regions[];
  language?: LanguageSupport;
} & Omit<CodeState, "code">;

export function CodeMotion({
  code,
  theme = sublime,
  language,
  ...rest
}: CodeMotionProps) {
  const tags = useMemo(
    () => Tagifier.generateTags(code, theme, language),
    [code]
  );
  return <CodeBlock code={tags} {...rest} />;
}
