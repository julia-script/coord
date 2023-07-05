import { isString } from "@coord/core";

export const getIndent = (str: string) => {
  const indentationFinder =
    new IndentationFinder();
  indentationFinder.feedString(str);
  return indentationFinder.getIndent();
};

export class IndentationFinder {
  indents: number[] = [];
  isOnIndent: boolean = true;
  isEmptyLine: boolean = true;
  currentIndent: number = 0;
  trimLinesStart: number = -1;
  trimLinesEnd: number = 0;

  currentLine: number = 0;

  feedString(str: string) {
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        if (
          !this.isEmptyLine ||
          (this.isEmptyLine && !this.isOnIndent)
        )
          this.indents.push(this.currentIndent);
        this.currentLine++;
        this.isOnIndent = true;
        this.isEmptyLine = true;
        this.currentIndent = 0;

        continue;
      }
      if (this.isOnIndent && str[i] === " ") {
        this.currentIndent++;
        continue;
      }
      if (this.isOnIndent && str[i] !== " ") {
        this.isOnIndent = false;
        if (this.trimLinesStart === -1) {
          this.trimLinesStart = this.currentLine;
        }
        this.trimLinesEnd = this.currentLine;
        continue;
      }
    }
  }

  getResults() {
    return {
      contentStartLine: this.trimLinesStart,
      contentEndLine: this.trimLinesEnd,
      indent: this.getIndent(),
    };
  }
  getIndent() {
    if (!this.isOnIndent)
      this.indents.push(this.currentIndent);
    if (this.indents.length === 0) return null;
    return Math.min(...this.indents);
  }
  copy() {
    const copy = new IndentationFinder();
    copy.indents = [...this.indents];
    copy.isOnIndent = this.isOnIndent;
    copy.isEmptyLine = this.isEmptyLine;
    copy.currentIndent = this.currentIndent;
    return copy;
  }
}
