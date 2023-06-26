// import {
//   isFunction,
//   isNumber,
//   isObject,
//   isString,
//   makeId,
// } from "@coord/core/dist";
// import { IndentationFinder } from "./get-indent";
// import { Theme } from "@/themes/theme";
// import { LRParser } from "@lezer/lr";
// import { highlightTree } from "@lezer/highlight";

import { highlightTree } from "@/parser/highlight-builder";
import { dracula } from "@/themes/dracula";
import { Theme } from "@/themes/theme";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import {
  isString,
  isNumber,
  makeId,
  isUndefined,
  isFunction,
} from "@coord/core/dist";
import { LRParser } from "@lezer/lr";
import dedent from "ts-dedent";
import { IndentationFinder } from "./get-indent";

// export type Nullish<T> = T | null | undefined;

// export type CodeState = {
//   code: string;
//   select: boolean;
//   squigglyLevel: "error" | "warning" | "info" | "none";

//   range: [number, number];
//   line: number;
//   column: number;

//   color: string;
// };

// const defaultState: CodeState = {
//   code: "",
//   select: false,
//   squigglyLevel: "none",
//   range: [0, 0],
//   line: 0,
//   column: 0,
//   color: "black",
// };

// const normalizeCodeState = (
//   part: string | number | Partial<CodeState>
// ): CodeState[] => {
//   const partCode = (isObject(part) ? part.code : String(part)) ?? "";
//   const obj = isObject(part) ? { ...defaultState, ...part } : defaultState;
//   const lines = partCode.split("\n");
//   const result: CodeState[] = [];
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i]!.trimEnd();
//     const code = i === 0 ? line : "\n" + line;
//     result.push({ ...obj, code });
//   }
//   return result;
// };

// const partFromString = (part: string): CodeState[] => {
//   const lines = part.split("\n");
//   const result: CodeState[] = [];
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i]!.trimEnd();
//     const code = i === 0 ? line : "\n" + line;
//     result.push({ ...defaultState, code });
//   }
//   return result;
// };

// type CodeStateInput = Pick<CodeState, "code" | "select" | "squigglyLevel">;
// type CodeStatePart<TArgs> =
//   | CodeStateInput
//   | ((param: TArgs) => string | number | Partial<CodeStateInput>);

// class Part {
//   code: string;
//   selected: boolean;
//   squigglyLevel: "error" | "warning" | "info" | "none";
//   color: string = "inherit";
//   position: number = 0;
//   line: number = 0;
//   column: number = 0;
//   get length() {
//     return this.code.length;
//   }
//   get range(): [number, number] {
//     return [this.position, this.position + this.code.length];
//   }

//   get isNewLine() {
//     return this.code[0] === "\n";
//   }

//   constructor() {
//     this.code = "";
//     this.selected = false;
//     this.squigglyLevel = "none";
//   }

//   static fromPartial({
//     code = "",
//     select = false,
//     squigglyLevel = "none",
//   }: Partial<CodeState>) {
//     const part = new Part();
//     part.code = code;
//     part.selected = select;
//     part.squigglyLevel = squigglyLevel;
//     return part;
//   }

//   splitAt(index: number) {
//     const code = this.code;
//     const left = code.slice(0, index);
//     const right = code.slice(index);
//     this.code = left;
//     const newPart = this.copy();
//     newPart.code = right;
//     newPart.position += index;
//     return newPart;
//   }
//   copy() {
//     const part = new Part();
//     part.code = this.code;
//     part.selected = this.selected;
//     part.squigglyLevel = this.squigglyLevel;
//     return part;
//   }

//   static fromString(str: string) {
//     const part = new Part();
//     part.code = str;
//     return part;
//   }
//   static fromPartish(partish: CodePartish) {
//     if (isString(partish) || isNumber(partish)) {
//       return Part.fromString(String(partish));
//     }

//     return Part.fromPartial(partish);
//   }
// }

// class Cluster {
//   staticContent: boolean;
//   parts: Part[];
//   constructor() {
//     this.parts = [];
//     this.staticContent = true;
//   }
//   static fromString(str: string, staticContent = true) {
//     const cluster = Cluster.fromPart({ code: str }, staticContent);
//     return cluster;
//   }

//   static fromPart(part: Partial<CodeState>, staticContent = true) {
//     const newPart = Part.fromPartial(part);
//     const cluster = new Cluster();
//     cluster.staticContent = staticContent;
//     cluster.pushPart(newPart);
//     return cluster;
//   }

//   pushPart(part: Part) {
//     let lineBreakIndex = part.code.indexOf("\n");
//     while (lineBreakIndex !== -1) {
//       part = part.splitAt(lineBreakIndex);
//       this.parts.push(part);
//       lineBreakIndex = part.code.indexOf("\n");
//     }
//     this.parts.push(part);
//   }
//   copy() {
//     const cluster = new Cluster();
//     cluster.staticContent = this.staticContent;
//     cluster.parts = this.parts.map((part) => part.copy());
//     return cluster;
//   }
// }

// type CodePartish = Partial<CodeStateInput> | string | number;
// type CodeFactory = (version: number) => CodePartish | CodePartish[];

// type CodePart = CodePartish | CodeFactory;

// class CodeBuilder {
//   clusters: (Cluster | CodeFactory)[] = [];
//   pushCluster(cluster: Cluster) {
//     this.clusters.push(cluster);
//   }
//   pushFactory(factory: CodeFactory) {
//     this.clusters.push(factory);
//   }
//   static fromTemplateString(
//     { raw }: TemplateStringsArray,
//     ...args: CodePart[]
//   ) {
//     const code = new CodeBuilder();
//     let currentStr = "";
//     for (let i = 0; i < raw.length; i++) {
//       currentStr += raw[i]!;
//       const arg = args[i] ?? "";
//       if (isString(arg) || isNumber(arg)) {
//         currentStr += arg;
//         continue;
//       }
//       const cluster = Cluster.fromString(currentStr);
//       code.pushCluster(cluster);
//       currentStr = "";

//       if (isObject(arg)) {
//         const cluster = Cluster.fromPart(arg);
//         code.pushCluster(cluster);
//         continue;
//       }

//       code.pushFactory(arg);
//     }
//     if (currentStr) {
//       const cluster = Cluster.fromString(currentStr);
//       code.pushCluster(cluster);
//     }
//   }

//   evalStep(step: number) {
//     const code = new Code();
//     for (const cluster of this.clusters) {
//       if (isFunction(cluster)) {
//         const result = cluster(step);

//         if (isString(result) || isNumber(result)) {
//           const cluster = Cluster.fromString(String(result), false);
//           code.pushCluster(cluster);
//           continue;
//         }
//         const newCluster = new Cluster();
//         newCluster.staticContent = false;
//         for (const part of Array.isArray(result) ? result : [result]) {
//           newCluster.pushPart(Part.fromPartish(part));
//         }
//         code.pushCluster(newCluster);
//         continue;
//       }
//       code.pushCluster(cluster.copy());
//     }
//     return code;
//   }
// }

// class Code {
//   clusters: Cluster[] = [];

//   indenter = new IndentationFinder();
//   pushCluster(cluster: Cluster) {
//     for (const part of cluster.parts) {
//       this.indenter.feedString(part.code);
//     }
//     this.clusters.push(cluster);
//   }

//   trim() {
//     let position = 0;
//     let line = 0;
//     let column = 0;
//     const { contentStartLine, contentEndLine, indent } =
//       this.indenter.getResults();
//     for (const cluster of this.clusters) {
//       for (const part of cluster.parts) {
//         if (part.isNewLine) {
//           line++;
//           column = 0;
//           part.code = "\n" + part.code.slice(indent ?? 0);
//         }

//         if (line < contentStartLine || line > contentEndLine) {
//           part.code = "";
//           part.position = position;
//           part.line = line;
//           part.column = column;
//           continue;
//         }
//       }
//     }
//   }
// }
// export function code<TArgs = number>(
//   config: {
//     language?: string;
//   } = {}
// ) {
//   const { language = "typescript" } = config;
//   const id = makeId("code-");

//   const parts: CodeStatePart<TArgs>[] = [];

//   return (
//     { raw }: TemplateStringsArray,
//     ...args: (string | number | CodeStatePart<TArgs>)[]
//   ) => {
//     let currentStr = "";
//     for (let i = 0; i < raw.length; i++) {
//       currentStr += raw[i]!;
//       const arg = args[i] ?? "";
//       if (isString(arg) || isNumber(arg)) {
//         currentStr += arg;
//         continue;
//       }
//       parts.push(...normalizeCodeState(currentStr));
//       currentStr = "";
//       parts.push(arg);
//     }
//     parts.push(...normalizeCodeState(currentStr));

//     return (param: TArgs): CodeTag => {
//       const indentationFinder = new IndentationFinder();
//       let currentCluster: CodeState[] = [];
//       const clusters: CodeState[][] = [currentCluster];

//       const startNewCluster = () => {
//         currentCluster = [];
//         clusters.push(currentCluster);
//       };

//       const pushToCluster = (parts: CodeState[]) => {
//         currentCluster.push(...parts);
//         parts.forEach(({ code }) => indentationFinder.feedString(code));
//       };
//       parts.forEach((part) => {
//         // let normalized: CodeState[];
//         if (isFunction(part)) {
//           startNewCluster();
//           pushToCluster(normalizeCodeState(part(param)));
//           startNewCluster();
//         } else {
//           pushToCluster(normalizeCodeState(part));
//         }
//       });

//       const { contentEndLine, contentStartLine, indent } =
//         indentationFinder.getResults();
//       return {
//         _id: id,
//         parts: trimParts(
//           clusters,
//           indent ?? 0,
//           contentStartLine,
//           contentEndLine
//         ),
//         language,
//       };
//     };
//   };
// }

// const trimParts = (
//   clusters: CodeState[][],
//   indent: number,
//   startLine: number,
//   endLine: number
// ) => {
//   const newClusters: CodeState[][] = [];
//   let pos = 0;
//   let line = 0;
//   let column = 0;
//   for (const cluster of clusters) {
//     const parts: CodeState[] = [];
//     for (const part of cluster) {
//       if (part.code[0] === "\n") {
//         line++;
//         column = 0;
//         part.code = "\n" + part.code.slice(1 + indent);
//       }
//       if (line < startLine || line > endLine) {
//         part.code = "";
//       }

//       parts.push({
//         ...part,
//         range: [pos, pos + part.code.length],
//         line: Math.max(line - startLine, 0),
//         column,
//       });
//       pos += part.code.length;
//       column += part.code.length;
//     }

//     newClusters.push(parts);
//   }
//   return newClusters;
// };

// export type CodeTag = {
//   _id: string;
//   parts: CodeState[][];
//   language: string;
// };

// export const stringifyParts = (code: CodeState[][]): string => {
//   let result = "";
//   for (const cluster of code) {
//     for (const part of cluster) {
//       result += part.code;
//     }
//   }
//   return result;
// };

// export function* iterateParts(clusters: CodeState[][]) {
//   let c = 0;
//   while (c < clusters.length) {
//     const cluster = clusters[c]!;
//     let p = 0;
//     while (p < cluster.length) {
//       const part = cluster[p]!;
//       yield [part, c, p] as const;
//       p++;
//     }
//     c++;
//   }
// }

// export function applyTheme(
//   clusters: CodeState[][],
//   theme: Theme,
//   parser: LRParser
// ) {
//   const codeString = stringifyParts(clusters);
//   const tree = parser.parse(codeString);

//   let pos = 0;
//   const iterator = iterateParts(clusters);

//   const styleUntil = (to: number, color: string) => {
//     while (pos < to) {
//       const { done, value } = iterator.next();
//       if (done) {
//         break;
//       }
//       const [part, clusterIndex, partIndex] = value;

//       if (pos + part.code.length > to) {
//         const diff = to - pos;
//         const code = part.code;
//         part.code = code.slice(0, diff);

//         const [start, end] = part.range;
//         part.range = [start, start + diff];

//         const newPart: CodeState = {
//           ...part,
//           range: [start + diff, end],
//           column: part.column + diff,
//           code: code.slice(diff),
//         };

//         clusters[clusterIndex]!.splice(partIndex + 1, 0, newPart);
//       }

//       part.color = color;

//       pos += part.code.length;
//     }
//     return;
//   };
//   highlightTree(tree, theme.highlighter, (from, to, color) => {
//     styleUntil(from, theme.themeStyles.foreground);
//     styleUntil(to, color);
//   });

//   styleUntil(Infinity, theme.themeStyles.foreground);

//   return clusters;
// }

// export type CodeRegion = {
//   code: string;
//   id: string;
//   line: number;
//   column: number;
//   position: number;
// };

// export function code(
//   { raw }: TemplateStringsArray,
//   ...args: (
//     | string
//     | number
//     | ((step: number) => string | number | CodeRegion[])
//   )[]
// ) {
//   const id = makeId();

//   const liveRegions: ((
//     step: number,
//     _parentId: string
//   ) => string | number | CodeRegion[])[] = [];
//   const staticRegions: string[] = [];
//   const liveRegionsIndent: number[] = [];
//   let code = "";
//   for (let i = 0; i < raw.length; i++) {
//     const part = raw[i]!;
//     code += part;
//     const arg = args[i];
//     if (isString(arg) || isNumber(arg)) {
//       code += arg;
//       continue;
//     }
//     if (isUndefined(arg)) {
//       continue;
//     }
//     code += `$#${liveRegions.length}#$`;

//     liveRegions.push(arg);
//   }

//   code = dedent(code);

//   while (code.length) {
//     const nextRegionIndex = code.indexOf("$#");
//     if (nextRegionIndex === -1) {
//       staticRegions.push(code);
//       break;
//     }
//     const region = code.slice(0, nextRegionIndex);
//     staticRegions.push(region);
//     code = code.slice(nextRegionIndex + `$#${staticRegions.length}#$`.length);
//     let lineStart = region.lastIndexOf("\n");
//     if (lineStart === -1) {
//       liveRegionsIndent.push(liveRegionsIndent.at(-1) ?? 0);
//       continue;
//     }
//     let indent = 0;
//     lineStart++;
//     while (region[lineStart + indent] === " ") {
//       indent++;
//     }
//     liveRegionsIndent.push(indent);
//   }

//   return (step: number, _parentId = id) => {
//     const result: CodeRegion[] = [];
//     let r = 0;

//     let position = 0;
//     let line = 0;
//     let column = 0;
//     const pushRegion = (id: string, code: string) => {
//       result.push({
//         id,
//         code,
//         line,
//         column,
//         position,
//       });
//       position += code.length;
//       const lines = code.split("\n");
//       line += lines.length - 1;
//       if (lines.length > 1) {
//         column = lines[lines.length - 1]!.length;
//       } else {
//         column += code.length;
//       }
//     };
//     for (let i = 0; i < staticRegions.length; i++) {
//       const region = staticRegions[i]!;

//       pushRegion(`${_parentId}-${r++}`, region);
//       const liveRegion = liveRegions[i];
//       if (!liveRegion) {
//         break;
//       }
//       const indent = liveRegionsIndent[i] ?? 0;

//       const liveRegionId = `${_parentId}-${r++}`;
//       const live = liveRegion(step, liveRegionId);
//       if (isString(live) || isNumber(live)) {
//         pushRegion(
//           liveRegionId,
//           dedent(String(live)).replace(/\n/g, "\n" + " ".repeat(indent))
//         );
//         continue;
//       }
//       live.forEach(({ id, code }) => {
//         code = code.replace(/\n/g, "\n" + " ".repeat(indent));

//         pushRegion(id, code);
//       });
//     }

//     return result;
//   };
// }

// export function stringifyCode(code: CodeRegion[]) {
//   return code.map(({ code }) => code).join("");
// }

// export function diffToAnimate(a: CodeRegion[], b: CodeRegion[]) {
//   const from = new Map<string, CodeRegion>(a.map((r) => [r.id, r]));
//   const regionPairs: [CodeRegion | null, CodeRegion | null][] = [];

//   for (const bRegion of b) {
//     const aRegion = from.get(bRegion.id);
//     regionPairs.push([aRegion ?? null, bRegion]);
//     from.delete(bRegion.id);
//   }
//   let i = 0;
//   for (const clearedRegion of from.values()) {
//     while (true) {
//       const pair = regionPairs[i];
//       if (!pair) {
//         regionPairs.push([clearedRegion, null]);
//         break;
//       }
//       const [a] = pair;
//       if (a?.position ?? 0 < clearedRegion.position) {
//         i++;
//         continue;
//       }
//       regionPairs.splice(i, 0, [a, null]);
//       break;
//     }
//   }
//   return regionPairs;
// }

// export function codeState(
//   code: CodeRegion[] | ((step: number) => CodeRegion[])
// ) {
//   const regions = isFunction(code) ? code(0) : code;

//   return {
//     transition: 1,
//     regions: regions.map((r) => [r, r]) as [
//       CodeRegion | null,
//       CodeRegion | null
//     ][],
//   };
// }

// export function stringifyCodeState(codeState: CodeState) {
//   let left = "";
//   let right = "";
//   for (const [a, b] of codeState.regions) {
//     left += a?.code ?? "";
//     right += b?.code ?? "";
//   }
//   return [left, right] as const;
// }

// export type CodeState = ReturnType<typeof codeState>;
// export function diffRegions(a: CodeRegion[], b: CodeRegion[]) {
//   const result: (CodeRegion | undefined)[] = [];
//   if (a.length !== b.length)
//     throw new Error(
//       "Diffed code do not seem to have been generated by the same code template"
//     );

//   for (let i = 0; i < a.length; i++) {
//     const aRegion = a[i]!;
//     const bRegion = b[i]!;
//     if (aRegion.live !== bRegion.live) {
//       throw new Error(
//         "Diffed code do not seem to have been generated by the same code template"
//       );
//     }
//     if (aRegion.code !== bRegion.code) {
//       result[i] = bRegion;
//     }
//   }
//   return result;
// }

export function applyTheme(
  code: string,
  theme: Theme = dracula,
  parser: LRParser = javascriptLanguage.parser
) {
  const tree = parser.parse(code);
  const styles: [number, number, string][] = [];
  highlightTree(tree, theme.highlighter, (from, to, color) => {
    styles.push([from, to, color]);
  });

  return styles;
}

type MovingTag = {
  code: string;
  left: [line: number, column: number];
  right: [line: number, column: number];
  color: string;
  opacity: number;
};

type LeavingTag = {
  code: string;
  left: [line: number, column: number];
  right: null;
  color: string;
  opacity: number;
};

type EnteringTag = {
  code: string;
  left: null;
  right: [line: number, column: number];
  color: string;
  opacity: number;
};

export type AnimatedTag = MovingTag | LeavingTag | EnteringTag;

export class Tagifier {
  private tags: AnimatedTag[] = [];

  private right: [line: number, column: number] = [0, 0];
  private rightPosition = 0;

  private left: [line: number, column: number] = [0, 0];
  private leftPosition = 0;
  styleMapLeft: Map<
    number,
    {
      color?: string | null;
      opacity?: number | null;
    }
  > = new Map();

  styleMapRight: Map<
    number,
    {
      color?: string | null;
      opacity?: number | null;
    }
  > = new Map();
  defaultStyles = {
    color: "inherit",
    opacity: 1,
  };
  leftStyle = { ...this.defaultStyles };
  rightStyle = { ...this.defaultStyles };

  static generateTags(
    regions: Regions[],
    theme: Theme = dracula,
    parser: LRParser = javascriptLanguage.parser
  ) {
    const tagifier = new Tagifier();
    const left = stringifyLeft(regions);
    const right = stringifyRight(regions);
    const leftStyles = applyTheme(left, theme, parser);
    const rightStyles = applyTheme(right, theme, parser);

    for (const [from, to, color] of leftStyles) {
      tagifier.setStyleAt(from, { color }, true, false);
      tagifier.setStyleAt(to, { color: null }, true, false);
    }
    for (const [from, to, color] of rightStyles) {
      tagifier.setStyleAt(from, { color }, false, true);
      tagifier.setStyleAt(to, { color: null }, false, true);
    }
    tagifier.defaultStyles.color = theme.themeStyles.foreground;
    tagifier.updateStyle(true, true);

    for (const region of regions) {
      if (isString(region)) {
        tagifier.pushString(region, true, true);
        continue;
      }
      const [left, right] = region;
      tagifier.pushString(left, true, false);
      tagifier.pushString(right, false, true);
    }

    return tagifier.tags;
  }
  setStyleAt(
    position: number,
    style: { color?: string | null; opacity?: number | null },
    left: boolean,
    right: boolean
  ) {
    if (left) {
      const positionStyle = this.styleMapLeft.get(position) ?? {};

      this.styleMapLeft.set(position, {
        ...positionStyle,
        ...style,
      });
    }

    if (right) {
      const positionStyle = this.styleMapRight.get(position) ?? {};
      this.styleMapRight.set(position, {
        ...positionStyle,
        ...style,
      });
    }
  }
  updateStyle(left: boolean, right: boolean) {
    const leftStyle = this.styleMapLeft.get(this.leftPosition);
    const rightStyle = this.styleMapRight.get(this.rightPosition);

    if (leftStyle) {
      if (leftStyle.color === null) {
        this.leftStyle.color = this.defaultStyles.color;
      } else if (leftStyle.color !== undefined) {
        this.leftStyle.color = leftStyle.color;
      }
      if (leftStyle.opacity === null) {
        this.leftStyle.opacity = 1;
      } else if (leftStyle.opacity !== undefined) {
        this.leftStyle.opacity = leftStyle.opacity;
      }
    }
    if (rightStyle) {
      if (rightStyle.color === null) {
        this.rightStyle.color = this.defaultStyles.color;
      } else if (rightStyle.color !== undefined) {
        this.rightStyle.color = rightStyle.color;
      }

      if (rightStyle.opacity === null) {
        this.rightStyle.opacity = 1;
      } else if (rightStyle.opacity !== undefined) {
        this.rightStyle.opacity = rightStyle.opacity;
      }
    }
    if (left && right) {
      if (!!leftStyle || !!rightStyle) this.makeTag(left, right);
    }
    if (left && !right) {
      if (!!leftStyle) this.makeTag(left, right);
    }
    if (!left && right) {
      if (!!rightStyle) this.makeTag(left, right);
    }
  }

  increasePosition(left: boolean, right: boolean) {
    if (left) {
      this.leftPosition++;
    }
    if (right) {
      this.rightPosition++;
    }
    this.updateStyle(left, right);
  }

  increaseColumn(left: boolean, right: boolean) {
    if (left) {
      this.left[1] = this.left[1] + 1;
    }
    if (right) {
      this.right[1] = this.right[1] + 1;
    }
    this.increasePosition(left, right);
  }

  increaseLine(left: boolean, right: boolean) {
    if (left) {
      this.left[0] = this.left[0] + 1;
      this.left[1] = 0;
    }
    if (right) {
      this.right[0] = this.right[0] + 1;
      this.right[1] = 0;
    }
    this.increasePosition(left, right);
    this.makeTag(left, right);
  }

  pushChar(char: string, left: boolean, right: boolean) {
    switch (char) {
      case "\n": {
        // this.wrapCurrentString(left, right);
        this.increaseLine(left, right);
        break;
      }

      default: {
        this.tags.at(-1)!.code += char;
        this.increaseColumn(left, right);
        break;
      }
    }
  }

  makeTag(left: boolean, right: boolean) {
    if (this.tags.at(-1)?.code === "") {
      this.tags.pop();
    }
    if (left && right) {
      this.tags.push({
        code: "",
        left: [...this.left],
        right: [...this.right],
        ...this.rightStyle,
      });
    } else if (left) {
      this.tags.push({
        code: "",
        left: [...this.left],
        right: null,
        ...this.leftStyle,
      });
    } else if (right) {
      this.tags.push({
        code: "",
        left: null,
        right: [...this.right],
        ...this.rightStyle,
      });
    }
  }
  pushString(string: string, left: boolean, right: boolean) {
    this.makeTag(left, right);
    for (const char of string) {
      this.pushChar(char, left, right);
    }
  }
}

type Nullable<T> = T | null | undefined;

type CodeTagInput =
  | [
      Nullable<string>,
      Nullable<string>,
      (code: string, indent: number) => string
    ]
  | [Nullable<string>, Nullable<string>]
  | [Nullable<string>];

type LiveRegion = [string, string];
type Regions = string | LiveRegion;
const DELIMITER = "⛿";

export function code(
  { raw }: TemplateStringsArray,
  ...inputs: (CodeTagInput | string | number)[]
) {
  const liveRegions: [
    string,
    string,
    (code: string, indent: number) => string
  ][] = [];
  let code = "";
  const defaultFn = (code: string, indent: number) =>
    dedent(code).replace(/\n/g, "\n" + " ".repeat(indent));
  for (let i = 0; i < raw.length; i++) {
    const part = raw[i]!;
    code += part;
    const arg = inputs[i];
    if (isString(arg) || isNumber(arg)) {
      code += arg;
      continue;
    }
    if (isUndefined(arg)) {
      continue;
    }

    code += DELIMITER;

    liveRegions.push([arg[0] ?? "", arg[1] ?? "", defaultFn]);
  }
  code = dedent(code);

  const regions: Regions[] = [];

  let currentString = "";
  code.split("\n").forEach((line, i) => {
    const parts = line.split(DELIMITER);
    if (i > 0) currentString += "\n";
    if (parts.length === 1) {
      currentString += line;
      return;
    }
    const indent = getLineIndent(line).length;
    parts.forEach((part, j) => {
      currentString += part;

      regions.push(currentString);
      currentString = "";
      const liveRegion = liveRegions.shift();

      if (liveRegion) {
        const [left, right, fn] = liveRegion;
        regions.push([fn(left, indent), fn(right, indent)]);
      }
    });
  });

  if (currentString) regions.push(currentString);
  return regions;
}
const getLineIndent = (line: string) => {
  let indent = "";
  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (char === " " || char === "\t") indent += char;
    else break;
  }
  return indent;
};
export function codeState(...args: Parameters<typeof code>) {
  return {
    code: code(...args),
    transition: 1,
  };
}

export type CodeState = ReturnType<typeof codeState>;
export type Code = ReturnType<typeof code>;
export function stringifyLeft(regions: Regions[]) {
  let code = "";
  for (const region of regions) {
    if (isString(region)) {
      code += region;
      continue;
    }
    code += region[0];
  }

  return code;
}

export function stringifyRight(regions: Regions[]) {
  let code = "";
  for (const region of regions) {
    if (isString(region)) {
      code += region;
      continue;
    }
    code += region[1];
  }

  return code;
}

export function insert(code: string): Regions {
  return ["", code];
}

export function remove(code: string): Regions {
  return [code, ""];
}

export function replace(left: string, right: string): Regions {
  return [left, right];
}
