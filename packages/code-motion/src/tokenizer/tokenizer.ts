import { Nullable } from "vitest";
import { LimitedApplyTo, Token } from "../types";
import {
  isNumber,
  isString,
  isUndefined,
  raise,
} from "@coord/core";
import {
  existsInTheFuture,
  existsInThePast,
} from "./utils";

type TokenInput =
  | [Nullable<string>, Nullable<string>]
  | string
  | number;

export const tokenize = (
  src: TemplateStringsArray | string,
  ...inputs: (TokenInput | string | number)[]
) => {
  const tokenizer = new Tokenizer();
  const strings = isString(src)
    ? [src]
    : [...src];

  for (let i = 0; i < strings.length; i++) {
    const region = strings[i] ?? raise();
    tokenizer.pushStatic(region);
    const input = inputs[i];
    if (isUndefined(input)) continue;

    if (isString(input) || isNumber(input)) {
      tokenizer.pushStatic(String(input));
      continue;
    }
    const [past, future] = input;

    tokenizer.pushMorphing(
      past ?? "",
      future ?? ""
    );
  }
  tokenizer.trim();

  return tokenizer.tokens;
};

export class Tokenizer {
  tokens: Token[] = [];
  indent = Infinity;
  get last() {
    return this.tokens.at(-1);
  }

  static fromTokens(tokens: Token[]) {
    const tokenizer = new Tokenizer();
    tokenizer.tokens = tokens;
    return tokenizer;
  }

  pushStatic(str: string) {
    this.tokens.push(
      ...this.processString(str, "static")
    );
  }

  processString(
    str: string,
    type: Token["type"]
  ): Token[] {
    return str
      .split("\n")
      .reduce<Token[]>((acc, line, i, list) => {
        const considerThisLineIndent =
          i > 0 || !this.last;
        const content = considerThisLineIndent
          ? line.trimStart()
          : line;

        const indent =
          line.length - content.length;

        if (
          considerThisLineIndent &&
          content.length
        ) {
          this.indent = Math.min(
            this.indent,
            indent
          );
        }
        const isLastLine = i === list.length - 1;
        const skipLine =
          list.length > 1 && !isLastLine;

        acc.push({
          type,
          content,
          indent: indent,
          skipLines: skipLine ? 1 : 0,
          pastStyles: [],
          styles: [],
        });
        return acc;
      }, []);
  }

  dedent() {
    for (const token of this.tokens) {
      token.indent = Math.max(
        token.indent - this.indent,
        0
      );
    }
  }
  trimStart() {
    let pastIsTrimmed = false;
    let indent = 0;
    this.flatRemapPast((token) => {
      if (pastIsTrimmed) return [token];
      const isEmpty = !/\S/.test(token.content);

      if (isEmpty) {
        if (token.skipLines) {
          indent = 0;
        }
        indent = Math.max(token.indent, indent);
        if (token.type === "static") {
          token.type = "insertion";
          return [token];
        }
        return [];
      }
      pastIsTrimmed = true;
      token.indent = Math.max(
        indent,
        token.indent
      );
      return [token];
    });
    let futureIsTrimmed = false;
    indent = 0;
    this.flatRemapFuture((token) => {
      if (futureIsTrimmed) return [token];
      const isEmpty = !/\S/.test(token.content);

      if (isEmpty) {
        if (token.skipLines) {
          indent = 0;
        }
        indent = Math.max(token.indent, indent);
        if (token.type === "static") {
          token.type = "deletion";
          return [token];
        }
        return [];
      }
      futureIsTrimmed = true;
      token.indent = Math.max(
        indent,
        token.indent
      );
      return [token];
    });
  }

  trimEnd() {
    let pastIsTrimmed = false;

    this.flatRemapPast((token) => {
      if (pastIsTrimmed) return [token];

      const isEmpty = !/\S/.test(token.content);
      if (isEmpty) {
        if (token.type === "static") {
          token.type = "insertion";
          return [token];
        }
        return [];
      }
      pastIsTrimmed = true;
      token.skipLines = 0;
      return [token];
    }, true);
    let futureIsTrimmed = false;

    this.flatRemapFuture((token) => {
      if (futureIsTrimmed) return [token];

      const isEmpty = !/\S/.test(token.content);
      if (isEmpty) {
        if (token.type === "static") {
          token.type = "deletion";
          return [token];
        }
        return [];
      }
      futureIsTrimmed = true;
      token.skipLines = 0;
      return [token];
    }, true);
  }

  cleanEmpty() {
    this.tokens = this.tokens.reduce<Token[]>(
      (acc, token, i) => {
        if (token.content !== "") {
          acc.push(token);
          return acc;
        }
        if (
          token.indent &&
          token.skipLines === 0
        ) {
          const next = this.tokens[i + 1];
          if (next && next.type === token.type) {
            next.indent += token.indent;
          } else {
            acc.push(token);
          }
        }

        if (token.skipLines) {
          const prev = acc[acc.length - 1];
          if (prev && prev.type === token.type) {
            prev.skipLines += token.skipLines;
          } else {
            acc.push(token);
          }
        }
        return acc;
      },
      []
    );
  }
  trim() {
    this.dedent();
    this.trimStart();
    this.trimEnd();
    this.cleanEmpty();
  }

  pushMorphing(
    deletion: string,
    insetion: string
  ) {
    this.tokens.push(
      ...this.processString(deletion, "deletion")
    );

    this.tokens.push(
      ...this.processString(insetion, "insertion")
    );
  }

  flatRemapPast(
    fn: (token: Token) => Token[],
    reverse = false
  ) {
    this.tokens = this.tokens[
      reverse ? "reduceRight" : "reduce"
    ]<Token[]>((acc, token) => {
      if (!existsInThePast(token)) {
        acc.push(token);
        return acc;
      }
      acc.push(...fn(token));
      return acc;
    }, []);
    if (reverse) {
      this.tokens.reverse();
    }
  }

  flatRemapFuture(
    fn: (token: Token) => Token[],
    reverse = false
  ) {
    this.tokens = this.tokens[
      reverse ? "reduceRight" : "reduce"
    ]<Token[]>((acc, token) => {
      if (!existsInTheFuture(token)) {
        acc.push(token);
        return acc;
      }
      acc.push(...fn(token));
      return acc;
    }, []);
    if (reverse) {
      this.tokens.reverse();
    }
  }

  stringifyPast() {
    return this.tokens.reduce((acc, token) => {
      if (existsInThePast(token)) {
        if (token.indent) {
          acc += " ".repeat(token.indent);
        }
        acc += token.content;

        if (token.skipLines) {
          acc += "\n".repeat(token.skipLines);
        }
      }
      return acc;
    }, "");
  }
  remapByPosition = (when: "past" | "future") => {
    let position = 0;
    const stack = [...this.tokens].reverse();
    this.tokens = [];

    return (
      to: number,
      fn: (token: Token) => Token
    ) => {
      while (position < to) {
        const token = stack[stack.length - 1];

        if (!token) {
          break;
        }
        if (
          (when === "past" &&
            !existsInThePast(token)) ||
          (when === "future" &&
            !existsInTheFuture(token))
        ) {
          stack.pop();
          this.tokens.push(token);
          continue;
        }

        const endPosition =
          position +
          token.content.length +
          token.skipLines +
          token.indent;

        if (endPosition > to) {
          break;
        }
        this.tokens.push(fn(token));
        position = endPosition;
        stack.pop();
      }

      if (position === to) return;

      let token = stack.pop();
      if (!token) return;
      token = { ...token };

      const split = to - position - token.indent;
      if (split < 0) {
        token.indent += split;

        token.content =
          " ".repeat(-split) + token.content;
      }
      position = to;
      const newToken: Token = {
        ...token,
        content: token.content.slice(0, split),
        skipLines: 0,
      };

      token.content = token.content.slice(split);
      token.indent = 0;
      stack.push(token);
      this.tokens.push(fn(newToken));
    };
  };
  stringifyFuture() {
    return this.tokens.reduce((acc, token) => {
      if (existsInTheFuture(token)) {
        if (token.indent) {
          acc += " ".repeat(token.indent);
        }
        acc += token.content;

        if (token.skipLines) {
          acc += "\n".repeat(token.skipLines);
        }
      }
      return acc;
    }, "");
  }
}

export const stringifyTokens =
  (applyTo: LimitedApplyTo = "future") =>
  (tokens: Token[]) =>
    Tokenizer.fromTokens(tokens)[
      applyTo === "future"
        ? "stringifyFuture"
        : "stringifyPast"
    ]();

// Alias
export const code = tokenize;
