import diff from "fast-diff";

import { Tokenizer } from "./tokenizer";
import dedent from "ts-dedent";

export function diffTokenizer(
  a: string,
  b: string,
  cleanup = true
) {
  const tokenizer = new Tokenizer();
  diff(dedent(a), dedent(b), 0, cleanup).forEach(
    ([op, code]) => {
      switch (op) {
        case diff.INSERT:
          tokenizer.pushMorphing("", code);
          break;
        case diff.DELETE:
          tokenizer.pushMorphing(code, "");
          break;
        case diff.EQUAL:
          tokenizer.pushStatic(code);

          break;
      }
    }
  );

  tokenizer.cleanEmpty();

  return tokenizer.tokens;
}
