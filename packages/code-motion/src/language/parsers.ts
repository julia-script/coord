import { isString } from "@coord/core";
import { parser } from "@lezer/javascript";
import type { LRParser } from "@lezer/lr";
import { has } from "fp-ts/Record";

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

export const getParser = (language: Language) => {
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
