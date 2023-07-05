import { Theme } from "@/themes";
import {
  javascript,
  javascriptLanguage,
} from "@codemirror/lang-javascript";
import { isString, makeId } from "@coord/core";
import { LRParser } from "@lezer/lr";
import { gruvboxDark } from "@/themes";
import { CSSProperties } from "react";
import { Regions } from "./code-tag";
import {
  stringifyLeft,
  stringifyRight,
} from "./code-tag-utils";
import { LanguageSupport } from "@codemirror/language";

type MovingTag = {
  _id: string;
  code: string;
  left: [line: number, column: number];
  right: [line: number, column: number];
  styles: CSSProperties;
};

type LeavingTag = {
  _id: string;

  code: string;
  left: [line: number, column: number];
  right: null;
  styles: CSSProperties;
};

type EnteringTag = {
  _id: string;
  code: string;
  left: null;
  right: [line: number, column: number];
  styles: CSSProperties;
};

export type AnimatedTag =
  | MovingTag
  | LeavingTag
  | EnteringTag;

const js = javascript({
  jsx: true,
  typescript: true,
});
const languages = {
  javascript: js,
  typescript: js,
  jsx: js,
  tsx: js,
};

type Languages = keyof typeof languages;
export type LanguageOptions =
  | Languages
  | Omit<string, keyof {}>
  | LanguageSupport;
export class Tagifier {
  private tags: AnimatedTag[] = [];

  private right: [line: number, column: number] =
    [0, 0];
  private rightPosition = 0;

  private left: [line: number, column: number] = [
    0, 0,
  ];
  private leftPosition = 0;

  leftStyles = {
    inMap: new Map<number, Set<CSSProperties>>(),
    outMap: new Map<number, Set<CSSProperties>>(),
    active: new Set<CSSProperties>(),
  };

  rightStyles = {
    inMap: new Map<number, Set<CSSProperties>>(),
    outMap: new Map<number, Set<CSSProperties>>(),
    active: new Set<CSSProperties>(),
  };

  static generateTags(
    regions: Regions[],
    theme: Theme,
    parser: LanguageOptions = "tsx"
  ) {
    let selectedParser: LanguageSupport | null =
      null;
    if (isString(parser)) {
      if (parser in languages) {
        selectedParser =
          languages[parser as Languages];
      }
    } else {
      selectedParser = parser as LanguageSupport;
    }
    const tagifier = new Tagifier();

    const left = stringifyLeft(regions);
    const right = stringifyRight(regions);

    const leftStyles = selectedParser
      ? theme.highlight(left, selectedParser)
      : [];
    const rightStyles = selectedParser
      ? theme.highlight(right, selectedParser)
      : [];

    for (const style of leftStyles) {
      tagifier.setStyleAt(style, "left");
    }
    for (const style of rightStyles) {
      tagifier.setStyleAt(style, "right");
    }

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
    style: CSSProperties & {
      start: number;
      end: number;
    },
    side: "left" | "right"
  ) {
    const styles = this[`${side}Styles`];
    const current =
      styles.inMap.get(style.start) ?? new Set();
    styles.inMap.set(
      style.start,
      current.add(style)
    );

    const currentOut =
      styles.outMap.get(style.end) ?? new Set();
    styles.outMap.set(
      style.end,
      currentOut.add(style)
    );
  }
  updateStyle(left: boolean, right: boolean) {
    const leftIn = this.leftStyles.inMap.get(
      this.leftPosition
    );
    const leftOut = this.leftStyles.outMap.get(
      this.leftPosition
    );

    const rightIn = this.rightStyles.inMap.get(
      this.rightPosition
    );
    const rightOut = this.rightStyles.outMap.get(
      this.rightPosition
    );

    if (leftIn) {
      for (const style of leftIn) {
        this.leftStyles.active.add(style);
      }
    }
    if (leftOut) {
      for (const style of leftOut) {
        this.leftStyles.active.delete(style);
      }
    }

    if (rightIn) {
      for (const style of rightIn) {
        this.rightStyles.active.add(style);
      }
    }
    if (rightOut) {
      for (const style of rightOut) {
        this.rightStyles.active.delete(style);
      }
    }

    const leftUpdated = leftIn || leftOut;
    const rightUpdated = rightIn || rightOut;
    if (left && right) {
      if (leftUpdated || rightUpdated)
        this.makeTag(left, right);
    }
    if (left && !right) {
      if (leftUpdated) this.makeTag(left, right);
    }
    if (!left && right) {
      if (rightUpdated) this.makeTag(left, right);
    }
  }

  increasePosition(
    left: boolean,
    right: boolean
  ) {
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

  pushChar(
    char: string,
    left: boolean,
    right: boolean
  ) {
    this.tags.at(-1)!.code += char;
    switch (char) {
      case "\n": {
        this.increaseLine(left, right);
        break;
      }

      default: {
        this.increaseColumn(left, right);
        break;
      }
    }
  }

  get computedRightStyle() {
    return Object.assign(
      {},
      ...this.rightStyles.active
    ) as CSSProperties;
  }
  get computedLeftStyle() {
    return Object.assign(
      {},
      ...this.leftStyles.active
    ) as CSSProperties;
  }
  makeTag(left: boolean, right: boolean) {
    if (this.tags.at(-1)?.code === "") {
      this.tags.pop();
    }

    if (left && right) {
      this.tags.push({
        _id: makeId("tag-"),
        code: "",
        left: [...this.left],
        right: [...this.right],
        styles: this.computedRightStyle,
      });
    } else if (left) {
      this.tags.push({
        _id: makeId("tag-"),
        code: "",
        left: [...this.left],
        right: null,
        styles: this.computedLeftStyle,
      });
    } else if (right) {
      this.tags.push({
        _id: makeId("tag-"),
        code: "",
        left: null,
        right: [...this.right],
        styles: this.computedRightStyle,
      });
    }
  }
  pushString(
    string: string,
    left: boolean,
    right: boolean
  ) {
    this.makeTag(left, right);
    for (let i = 0; i < string.length; i++) {
      this.pushChar(string[i]!, left, right);
    }
  }
}
