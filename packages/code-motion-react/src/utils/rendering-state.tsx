import {
  Language,
  Theme,
  Token,
  diffTokenizer,
  highlightTokens,
  stringifyTokens,
  tokenize,
} from "@coord/code-motion";
import { pipe } from "fp-ts/function";
import { isString } from "lodash";
import dedent from "ts-dedent";

export type RenderingState = {
  code: string;
  tokens: Token[];
  language: Language;
  theme: Theme;
  fromTheme: Theme;
  fromLanguage: Language;
  changes: number;
};

const stringifyFuture = stringifyTokens("future");

const tokenizeCode = (
  code: string,
  language: Language,
  prevCode?: string,
  prevLanguage?: Language
) =>
  pipe(
    code,
    (code) =>
      isString(prevCode)
        ? diffTokenizer(prevCode, code)
        : tokenize(code),

    highlightTokens(language, "future"),
    highlightTokens(
      prevLanguage ?? language,
      "past"
    )
  );

export const initializeFromCode = (
  code: string,
  language: Language,
  theme: Theme,
  fromTheme = theme
): RenderingState => {
  return {
    code,
    changes: 0,
    tokens: tokenizeCode(code, language),
    language,
    theme,
    fromTheme,
    fromLanguage: language,
  };
};

const countChanges = (tokens: Token[]) =>
  tokens.reduce(
    (acc, { content, skipLines, type }) =>
      type !== "static"
        ? acc + content.length + skipLines
        : acc,
    0
  );
export const initializeFromTokens = (
  tokens: Token[],
  language: Language,
  theme: Theme,
  fromTheme = theme
): RenderingState => {
  const code = stringifyFuture(tokens);

  return {
    code,
    changes: countChanges(tokens),
    tokens,
    language,
    theme,
    fromTheme,
    fromLanguage: language,
  };
};

export const initializeRenderingState = (
  codeOrTokens: string | Token[],
  language: Language,
  theme: Theme,
  fromTheme = theme
): RenderingState => {
  if (isString(codeOrTokens)) {
    return initializeFromCode(
      codeOrTokens,
      language,
      theme,
      fromTheme
    );
  }
  return initializeFromTokens(
    codeOrTokens,
    language,
    theme,
    fromTheme
  );
};
type ExtractEntries<
  T extends {
    [key: string]: unknown;
  }
> = {
  [K in keyof T]: [K, T[K]];
}[keyof T] &
  [string, unknown];

const entries = <
  T extends {
    [key: string]: unknown;
  }
>(
  obj: T
) => Object.entries(obj) as ExtractEntries<T>[];

export const updateRenderingState = (
  state: RenderingState,
  update: Partial<RenderingState>
) => {
  const newState = {
    ...state,
    ...update,
  };
  const updateEntries = entries(update);
  //      ^?
  for (const [key, value] of updateEntries) {
    if (value === undefined) continue;
    switch (key) {
      case "code": {
        // token updates have priority
        if (update.tokens) continue;
        const dedentedCode = dedent(value);
        newState.tokens = tokenizeCode(
          dedentedCode,
          newState.language,
          state.code,
          state.language
        );
        newState.code = dedentedCode;
        break;
      }
      case "tokens": {
        const tokens = value;
        newState.code = stringifyFuture(tokens);
        newState.tokens = tokens;
        break;
      }
      case "theme": {
        newState.fromTheme = state.theme;
        break;
      }
      case "language": {
        newState.fromLanguage = state.language;
        break;
      }
    }
  }
  newState.changes = countChanges(
    newState.tokens
  );
  return newState;
};
