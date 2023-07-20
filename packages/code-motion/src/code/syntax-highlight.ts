import {
  highlightTree,
  tagHighlighter,
  tags,
} from "@lezer/highlight";
import { Token } from "./types";
import { parser } from "@lezer/javascript";
import type { LRParser } from "@lezer/lr";
import {
  isString,
  makeId,
} from "@coord/core/dist";

import { Tokenizer } from "./tokenizer";
import {
  ApplyTo,
  LimitedApplyTo,
  existsInTheFuture,
  existsInThePast,
  shouldApplyToFuture,
  shouldApplyToPast,
} from "./utils";
import { has } from "fp-ts/Record";

export const classHighlighter = tagHighlighter([
  {
    tag: tags.special(tags.string),
    class: "specialString",
  },
  {
    tag: tags.local(tags.variableName),
    class: "variableName variableNameLocal",
  },
  {
    tag: tags.function(tags.variableName),
    class: "variableName variableNameFunction",
  },
  {
    tag: tags.definition(tags.variableName),
    class: "variableName variableNameDefinition",
  },

  {
    tag: tags.special(tags.variableName),
    class: "specialVariableName",
  },
  {
    tag: tags.definition(tags.propertyName),
    class: "propertyName propertyNameDefinition",
  },

  { tag: tags.link, class: "link" },
  { tag: tags.heading, class: "heading" },
  { tag: tags.emphasis, class: "emphasis" },
  { tag: tags.strong, class: "strong" },
  { tag: tags.keyword, class: "keyword" },
  { tag: tags.atom, class: "atom" },
  { tag: tags.bool, class: "bool" },
  { tag: tags.url, class: "url" },
  { tag: tags.labelName, class: "labelName" },
  { tag: tags.inserted, class: "inserted" },
  { tag: tags.deleted, class: "deleted" },
  { tag: tags.literal, class: "literal" },
  { tag: tags.string, class: "string" },
  { tag: tags.number, class: "number" },
  {
    tag: tags.regexp,
    class: "regexp",
  },
  {
    tag: tags.escape,
    class: "escape",
  },

  {
    tag: tags.variableName,
    class: "variableName",
  },

  {
    tag: tags.attributeName,
    class: "attributeName",
  },

  { tag: tags.typeName, class: "typeName" },
  { tag: tags.namespace, class: "namespace" },
  { tag: tags.className, class: "className" },
  { tag: tags.macroName, class: "macroname" },
  {
    tag: tags.propertyName,
    class: "propertyName",
  },

  { tag: tags.operator, class: "operator" },
  { tag: tags.comment, class: "comment" },

  { tag: tags.meta, class: "meta" },
  { tag: tags.invalid, class: "invalid" },
  { tag: tags.punctuation, class: "punctuation" },

  {
    tag: tags.angleBracket,
    class: "angleBracket",
  },
  {
    tag: tags.tagName,
    class: "tagName",
  },
  {
    tag: tags.content,
    class: "content",
  },
]);

export type TokenStyle = {
  ids: string[];
  from: number;
  to: number;
};

const parsers = {
  javascript: parser,
  typescript: parser.configure({
    dialect: "ts",
  }),
  jsx: parser.configure({
    dialect: "jsx",
  }),
  tsx: parser.configure({
    dialect: "jsx ts",
  }),
};

const getParser = (language: Language) => {
  if (isString(language)) {
    if (!has(language, parsers)) {
      return null;
    }
    return parsers[language];
  }
  return language;
};

export type Language =
  | keyof typeof parsers
  | (string & {})
  | LRParser;

export const highlightTokens =
  (
    language: Language,
    applyTo: LimitedApplyTo = "future"
  ) =>
  (tokens: Token[]) => {
    const parser = getParser(language);
    if (!parser) return tokens;

    const tokenizer =
      Tokenizer.fromTokens(tokens);

    const str =
      applyTo === "future"
        ? tokenizer.stringifyFuture()
        : tokenizer.stringifyPast();

    const mapUntil =
      tokenizer.remapByPosition(applyTo);
    const stylesKey =
      applyTo === "future"
        ? "styles"
        : "pastStyles";
    highlightTree(
      parser.parse(str),
      classHighlighter,
      (from, to, id) => {
        mapUntil(from, (token) => token);
        mapUntil(to, (token) => {
          return {
            ...token,
            [stylesKey]: [
              ...token[stylesKey],
              ...id.split(" "),
            ],
          };
        });
      }
    );
    mapUntil(Infinity, (token) => token);

    // if (shouldApplyToFuture(applyTo)) {
    //   const future = tokenizer.stringifyFuture();

    //   const mapFutureUntil =
    //     tokenizer.remapByPosition("future");
    //   highlightTree(
    //     parser.parse(future),
    //     classHighlighter,
    //     (from, to, id) => {
    //       mapFutureUntil(from, (token) => token);
    //       mapFutureUntil(to, (token) => {
    //         return {
    //           ...token,
    //           styles: [
    //             ...token.styles,
    //             ...id.split(" "),
    //           ],
    //         };
    //       });
    //     }
    //   );
    //   mapFutureUntil(Infinity, (token) => token);
    // }
    return tokenizer.tokens;
  };

export type PositionedToken = Token & {
  id: string;
  pastPosition: { line: number; column: number };
  position: { line: number; column: number };
};

export const toPositionedTokens =
  () =>
  (tokens: Token[]): PositionedToken[] => {
    const position = { line: 0, column: 0 };
    const pastPosition = { line: 0, column: 0 };
    const out: PositionedToken[] = [];
    for (const token of tokens) {
      const positioned = {
        id: makeId("token-"),
        ...token,
        position: { ...position },
        pastPosition: { ...pastPosition },
      };
      if (existsInTheFuture(token)) {
        if (token.skipLines) {
          position.line += token.skipLines;
          position.column = 0;
        } else {
          position.column +=
            token.content.length + token.indent;
        }
      }
      if (existsInThePast(token)) {
        if (token.skipLines) {
          pastPosition.line += token.skipLines;
          pastPosition.column = 0;
        } else {
          pastPosition.column +=
            token.content.length + token.indent;
        }
      }
      out.push(positioned);
    }
    return out;
  };

export const mapLines = <
  T extends Token,
  TReturn
>(
  tokens: T[],
  fn: (line: T[], index: number) => TReturn,
  when: "past" | "future" = "future"
) => {
  const checkerFn =
    when === "future"
      ? existsInTheFuture
      : existsInThePast;
  let currentLine: T[] = [];
  const lines: TReturn[] = [];

  for (const token of tokens) {
    if (!checkerFn(token)) continue;
    currentLine.push(token);

    if (token.skipLines) {
      for (let i = 0; i < token.skipLines; i++) {
        lines.push(fn(currentLine, lines.length));
        currentLine = [];
      }
    }
  }
  lines.push(fn(currentLine, lines.length));
  return lines;
};
