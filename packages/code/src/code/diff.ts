import diff from "fast-diff";
import dedent from "ts-dedent";
import { Regions } from "./code-tag";

export function diffCode(a: string, b: string, cleanup: boolean = true) {
  const regions: Regions[] = [];
  let deletions = 0;
  let insertions = 0;

  diff(dedent(a), dedent(b), 0, cleanup).forEach(([op, code]) => {
    switch (op) {
      case diff.INSERT:
        regions.push(["", code]);
        insertions += code.length;
        break;
      case diff.DELETE:
        regions.push([code, ""]);
        deletions += code.length;
        break;
      case diff.EQUAL:
        regions.push(code);
        break;
    }
  });

  return { regions, deletions, insertions, total: deletions + insertions };
}
