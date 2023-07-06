export type DedentOptions = {
  trimStart: boolean;
  trimEnd: boolean;
  dedent: boolean;
  baseIndent: number;
  trimLineEnds: boolean;
};

export function trim(
  str: string,
  options: Partial<DedentOptions> = {}
) {
  const {
    trimStart = true,
    trimEnd = true,
    baseIndent = Infinity,
    trimLineEnds = true,
    dedent = true,
  } = options;

  if (trimEnd)
    str = str.replace(/\r?\n([\t ]*)$/, "");

  let indentLength = 0;
  if (dedent) {
    const matches = str.match(
      /^([\t ]+)[^\t \n]/gm
    );
    console.log(str, baseIndent);
    indentLength = Math.min(
      matches?.reduce((min, match) => {
        return Math.min(min, match.length - 1);
      }, Infinity) ?? Infinity,
      baseIndent
    );

    if (indentLength !== Infinity) {
      const pattern = new RegExp(
        `\n[\t ]{${indentLength}}`,
        "g"
      );
      str = str.replace(pattern, "\n");
    }
  }

  if (trimLineEnds)
    str = str.replace(/( |\t)+$/gm, "");

  if (trimStart) str = str.replace(/^\r?\n/, "");
  return {
    value: str,
    trimmedIndent: dedent ? indentLength : 0,
  };
}
