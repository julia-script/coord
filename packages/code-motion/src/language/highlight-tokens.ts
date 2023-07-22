import { highlightTree } from "@lezer/highlight";
import { Language, getParser } from "./parsers";
import { Theme } from "@/theming";
import { LimitedApplyTo, Token } from "@/types";
import { Tokenizer } from "@/tokenizer";

export const highlightTokens =
  (
    language: Language,
    theme: Theme,
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
      theme.highlighter,
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

    return tokenizer.tokens;
  };
