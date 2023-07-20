// import {
//   Language,
//   highlightTokens,
//   toPositionedTokens,
// } from "..";
// import { pipe } from "fp-ts/lib/function";
// import { Token } from "@/code/types";
// import {
//   ApplyTo,
//   shouldApplyToFuture,
//   shouldApplyToPast,
// } from "@/code/utils";
// import {
//   Rangeish,
//   queryRange,
//   styleRange,
//   Range,
//   normalizeRanges,
// } from "@/code/ranges";
// import { isObject } from "@coord/core/dist";

// export type RangeStyleMap = {
//   [key: string]:
//     | Rangeish
//     | {
//         query: Rangeish;
//         outOfRangeStyle?: string;
//         outOfRangeOnly?: boolean;
//       };
// };
// export type TokenStylesConfig = {
//   language?: Language;
//   rangeStyles?: RangeStyleMap;
// };

// export const getRanges =
//   (str: string, rangeMap: RangeStyleMap) =>{

//     const ranges: {
//       range: Range[];
//       style: string[];
//       outOfRangeStyle: string[];
//     }[] = [];
//     for (let [style, range] of Object.entries(
//       rangeMap
//     )) {
//       let query: Rangeish;
//       let outOfRangeStyle: string[] = [];
//       let styles = style
//         .split(" ")
//         .filter(Boolean);
//       if (isObject(range) && "query" in range) {
//         outOfRangeStyle =
//           range.outOfRangeStyle
//             ?.split(" ")
//             .filter(Boolean) ?? [];

//         query = range.query;
//         if (range.outOfRangeOnly) {
//           styles = [];
//         }
//       } else {
//         query = range;
//       }

//       const rangeQuery = !Array.isArray(query)
//         ? queryRange(query)
//         : () => query as Range;

//       ranges.push({
//         range: normalizeRanges(
//           rangeQuery(tokens, "future")
//         ),
//         style: style.split(" ").filter(Boolean),
//         outOfRangeStyle,
//       });
//     }
//     return ranges;
//   };
// export const calculateRanges =
//   (rangeMap: RangeStyleMap, applyTo: ApplyTo) =>
//   (tokens: Token[]) => {
//     let out = tokens;
//     for (let [style, range] of Object.entries(
//       rangeMap
//     )) {
//       let query: Rangeish;
//       let outOfRangeStyle: string[] = [];
//       let styles = style
//         .split(" ")
//         .filter(Boolean);
//       if (isObject(range) && "query" in range) {
//         outOfRangeStyle =
//           range.outOfRangeStyle
//             ?.split(" ")
//             .filter(Boolean) ?? [];

//         query = range.query;
//         if (range.outOfRangeOnly) {
//           styles = [];
//         }
//       } else {
//         query = range;
//       }

//       const rangeQuery = !Array.isArray(query)
//         ? queryRange(query)
//         : () => query as Range;

//       if (shouldApplyToPast(applyTo)) {
//         out = styleRange(
//           rangeQuery(out, "past"),
//           styles,
//           outOfRangeStyle,
//           "past"
//         )(out);
//       }
//       if (shouldApplyToFuture(applyTo)) {
//         out = styleRange(
//           rangeQuery(out, "future"),
//           styles,
//           outOfRangeStyle,
//           "future"
//         )(out);
//         console.log(styles, out);
//       }
//     }
//     return out;
//   };

// export const prepareTokensForRendering =
//   (
//     config: Partial<TokenStylesConfig> = {},
//     applyTo: ApplyTo = "both"
//   ) =>
//   (tokens: Token[]) => {
//     const { language = "tsx", rangeStyles = {} } =
//       config;
//     let out = pipe(
//       tokens,
//       highlightTokens(language, applyTo),
//       calculateRanges(rangeStyles, applyTo)
//     );

//     return pipe(out, toPositionedTokens());
//   };
