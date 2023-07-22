import { LimitedApplyTo, Token } from "../types";
import { Tokenizer } from "./tokenizer";
import { isNumber } from "fp-ts/number";
import {
  Nullable,
  isObject,
  isString,
  raise,
} from "@coord/core";

import { toEntries } from "fp-ts/Record";
import { pipe } from "fp-ts/function";

export type Range = [number, number];

export const isRange = (
  range: unknown
): range is Range =>
  Array.isArray(range) &&
  isNumber(range[0]) &&
  isNumber(range[1]);

export const normalizeRanges = (
  ranges: Range | Range[]
): Range[] => {
  let rangesList: Range[];
  if (isRange(ranges)) {
    rangesList = [ranges];
  } else {
    rangesList = ranges;
  }
  rangesList.sort((a, b) => a[0] - b[0]);

  return rangesList.reduce<Range[]>(
    (acc, range) => {
      const last = acc.at(-1);
      if (last && last[1] >= range[0]) {
        last[1] = Math.max(last[1], range[1]);
        return acc;
      }
      acc.push(range);
      return acc;
    },
    []
  );
};

export const styleRange =
  (
    ranges: Range | Range[],
    styles: string[],
    outOfRangeStyles: string[] = [],
    applyTo: LimitedApplyTo = "future"
  ) =>
  (tokens: Token[]) => {
    if (ranges.length === 0) {
      return tokens;
    }
    const rangesList = normalizeRanges(ranges);
    const tokenizer =
      Tokenizer.fromTokens(tokens);

    const mapUntil =
      tokenizer.remapByPosition(applyTo);
    const key =
      applyTo === "future"
        ? "styles"
        : "pastStyles";
    const outOfRange =
      outOfRangeStyles.length === 0
        ? (token: Token) => token
        : (token: Token) => ({
            ...token,
            [key]: [
              ...token[key],
              ...outOfRangeStyles,
            ],
          });
    for (const [from, to] of rangesList) {
      mapUntil(from, outOfRange);
      mapUntil(to, (token) => {
        return {
          ...token,
          [key]: [...token[key], ...styles],
        };
      });
    }
    mapUntil(Infinity, outOfRange);

    return tokenizer.tokens;
  };

export type Rangeish =
  | RangeQuery
  | Range
  | Range[];

export type RangeQuery = RegExp | string;

const parseRangeString = (ocurrances: string) => {
  const out = new Set<number>();
  for (const ocurrance of ocurrances.split(",")) {
    const [start, end] = ocurrance
      .split("-")
      .map(Number);
    if (!Number.isFinite(start)) continue;
    if (!Number.isFinite(end)) {
      out.add(start);
      continue;
    }
    for (let i = start; i <= end; i++) {
      out.add(i);
    }
  }
  if (out.size === 0) {
    out.add(0);
  }
  return out;
};

const parseStringQuery = (query: string) => {
  if (
    query.startsWith("{") &&
    query.endsWith("}")
  ) {
    const ocurrances = parseRangeString(
      query.slice(1, -1)
    );

    if (ocurrances.size === 0) {
      return () => [];
    }
    return (str: string) => {
      const lines = str.split("\n");
      let pos = 0;
      return lines.reduce<Range[]>(
        (acc, line, i) => {
          if (ocurrances.has(i)) {
            acc.push([pos, pos + line.length]);
          }

          pos += line.length + 1;
          return acc;
        },
        []
      );
    };
  }

  let queryString = query;
  let ocurrances: Set<number> | null = null;
  const queryStringMatch = query.match(
    /\/(.+)\/(.*)?/
  );
  if (queryStringMatch) {
    const [
      ,
      queryStringFromMatch,
      ocurrancesString,
    ] = queryStringMatch;
    if (queryStringFromMatch)
      queryString = queryStringFromMatch;
    if (ocurrancesString)
      ocurrances = parseRangeString(
        ocurrancesString
      );
  }

  if (!queryString) return () => [];

  const shouldInclude = ocurrances
    ? (i: number) =>
        (ocurrances ?? raise()).has(i)
    : () => true;
  return (str: string) => {
    const regexp = new RegExp(queryString, "g");
    return [...str.matchAll(regexp)].reduce<
      Range[]
    >((acc, { index, 0: match }, i) => {
      if (
        index === undefined ||
        !shouldInclude(i)
      )
        return acc;
      acc.push([index, index + match.length]);
      return acc;
    }, []);
  };
};
export const queryRange = (
  str: string,
  query: RegExp | string
) => {
  const queryFn = isString(query)
    ? parseStringQuery(query)
    : (str: string) =>
        [...str.matchAll(query)].reduce<Range[]>(
          (acc, { index, 0: match }) => {
            if (index === undefined) return acc;
            acc.push([
              index,
              index + match.length,
            ]);
            return acc;
          },
          []
        );

  return queryFn(str);
};

export type RangeStyleMap = {
  [key: string]: Nullable<
    | Rangeish
    | {
        query: Rangeish;
        outOfRangeStyles?: string;
        outOfRangeOnly?: boolean;
      }
  >;
};
export function queryRangeFromStyleMap(
  str: string,
  rangeMap: RangeStyleMap
) {
  const ranges: {
    styles: string[];
    outOfRangeStyles: string[];
    ranges: Range[];
  }[] = [];
  for (let [styleId, query] of toEntries(
    rangeMap
  )) {
    if (!query) continue;
    let outOfRangeStyles: string[] = [];
    let styles = styleId
      .split(" ")
      .filter(Boolean);
    if (isObject(query)) {
      outOfRangeStyles =
        query.outOfRangeStyles
          ?.split(" ")
          .filter(Boolean) ?? outOfRangeStyles;
      if (query.outOfRangeOnly) styles = [];
      query = query.query;
    }
    if (Array.isArray(query)) {
      ranges.push({
        styles,
        outOfRangeStyles,
        ranges: normalizeRanges(query),
      });
      continue;
    }
    if (
      isString(query) ||
      query instanceof RegExp
    ) {
      ranges.push({
        styles,
        outOfRangeStyles,
        ranges: queryRange(str, query),
      });
      continue;
    }
  }
  return ranges;
}

export const applyRanges =
  (
    rangeStyles: {
      styles: string[];
      outOfRangeStyles: string[];
      ranges: Range[];
    }[],
    applyTo: LimitedApplyTo
  ) =>
  (tokens: Token[]) => {
    for (const range of rangeStyles) {
      tokens = pipe(
        tokens,
        styleRange(
          range.ranges,
          range.styles,
          range.outOfRangeStyles,
          applyTo
        )
      );
    }
    return tokens;
  };
