import {
  isString,
  isNumber,
  isUndefined,
  Nullable,
  raise,
} from "@coord/core";
import { DedentOptions, trim } from "./dedent";

type CodeTagInput =
  | [
      Nullable<string>,
      Nullable<string>,
      (code: string, indent: number) => string
    ]
  | [Nullable<string>, Nullable<string>]
  | [Nullable<string>];

export type LiveRegion = [string, string];
export type Regions = string | LiveRegion;

const DELIMITER = "⛿";

export function code(
  src: TemplateStringsArray | string,
  ...inputs: (CodeTagInput | string | number)[]
): Regions[] {
  if (isString(src)) {
    return [trim(src).value];
  }
  const raw = src.raw;
  const liveRegions: [string, string][] = [];
  let code = "";

  for (let i = 0; i < raw.length; i++) {
    const part = raw[i] ?? raise();
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

    liveRegions.push([
      arg[0] ?? "",
      arg[1] ?? "",
    ]);
  }

  const { value, trimmedIndent } = trim(code);
  code = value;

  const regions: Regions[] = [];

  const pushString = (str: string) => {
    if (isString(regions.at(-1))) {
      regions[regions.length - 1] += str;
      return;
    }
    regions.push(str);
  };

  code.split("\n").forEach((line, i, list) => {
    const parts = line.split(DELIMITER);
    const eol = i === list.length - 1 ? "" : "\n";

    if (parts.length === 1) {
      pushString(line + eol);
      return;
    }

    let lineRegions: Regions[] = [];
    let leftCode = "";
    let rightCode = "";

    parts.forEach((part, j) => {
      leftCode += part;
      rightCode += part;

      if (j === parts.length - 1) {
        part + eol;
        leftCode += eol;
        rightCode += eol;
        lineRegions.push(part);
        return;
      }

      lineRegions.push(part);

      const liveRegion = liveRegions.shift();

      if (liveRegion) {
        const [left, right] = liveRegion;
        const newRegion: LiveRegion = [
          trimLiveRegion(left, {
            baseIndent: trimmedIndent,
          }),
          trimLiveRegion(right, {
            baseIndent: trimmedIndent,
          }),
        ];

        lineRegions.push(newRegion);
        leftCode += newRegion[0];
        rightCode += newRegion[1];
      }
    });

    const leftIsRelevant = /[^ \t\n]/.test(
      leftCode
    );
    const rightIsRelevant = /[^ \t\n]/.test(
      rightCode
    );

    if (leftIsRelevant !== rightIsRelevant) {
      lineRegions = [
        [
          leftIsRelevant ? leftCode : "",
          rightIsRelevant ? rightCode : "",
        ],
      ];
    }

    if (rightIsRelevant || leftIsRelevant) {
      lineRegions.forEach((region) => {
        if (isString(region)) {
          pushString(region);
          return;
        }
        regions.push(region);
      });
    }
  });

  return regions;
}

export type Code = ReturnType<typeof code>;
const trimLiveRegion = (
  code: string,
  options: Partial<DedentOptions> = {}
) => {
  const isMultiline = code.includes("\n");
  if (!isMultiline) return code;
  return trim(code, {
    trimStart: false,
    trimEnd: false,
    ...options,
  }).value;
};
