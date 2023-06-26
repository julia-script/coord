import { parser } from "@lezer/javascript";
import { parse } from "css";
import {
  highlightTree,
  Highlighter,
  tags,
  styleTags,
  // classHighlighter,
  tagHighlighter,
} from "@lezer/highlight";
import { HighlightStyle, defaultHighlightStyle } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { abcdef, dracula } from "@uiw/codemirror-themes-all";
import { Extension, EditorState } from "@codemirror/state";
import { code, codeAsString, getPartCode, getPartLength } from "../code";
import { CSSProperties } from "react";
import { tags as t } from "@lezer/highlight";

const highlighterr = tagHighlighter([
  { tag: t.comment, class: "#6272a4" },
  { tag: t.string, class: "#f1fa8c" },
  { tag: t.atom, class: "#bd93f9" },
  { tag: t.meta, class: "#f8f8f2" },
  { tag: [t.keyword, t.operator, t.tagName], class: "#ff79c6" },
  { tag: [t.function(t.propertyName), t.propertyName], class: "#66d9ef" },
  {
    tag: [
      t.definition(t.variableName),
      t.function(t.variableName),
      t.className,
      t.attributeName,
    ],
    class: "#50fa7b",
  },
  { tag: t.atom, class: "#bd93f9" },
]);
const styleMap = {
  c1b: {
    color: "#ff79c6",
    fontStyle: "italic",
  },
};
// const parseCssRule = (rule: string) => {
//   const styleMap = new Map<string, CSSProperties>();
//   const [selector, ...declarations] = rule.split("{");
//   const properties = declarations.join("").split(";");
// };
// console.log(dracula[1][2].value);
// const getThemeHighlighter = (theme: Extension) => {
//   if (Array.isArray(theme)) {
//     console.log(
//       "theme",
//       theme[0][1].value.rules.map(
//         (rule: string) => parse(rule).stylesheet.rules
//       )
//     );
//     const highlighter = theme[1][2].value as HighlightStyle;
//     return highlighter;
//   }
// };

// let code = `function helloWorld() {
//   console.log('Hello, world!');
// }`;

const test = code()`const my${(step) => {
  if (step === 0) {
    return "Bool";
  }
  return "Var";
}} = true;`;

const a = test(0);
const b = test(1);
const treeA = javascriptLanguage.parser.parse(codeAsString(a));
const treeB = javascriptLanguage.parser.parse(codeAsString(b));

// treeA.iterate({
//   enter(...args) {
//     console.log("enter", ...args);
//   },
// });
const highlighted: ([string, string] | string)[] = [];

const highlighter = highlighterr;
// console.log("highlighter", highlighter);

if (highlighter) {
  let cursorA = 0;
  let cursorB = 0;

  const aCode = codeAsString(a);
  const bCode = codeAsString(b);
  // console.log(aCode);
  // console.log(bCode);
  for (let i = 0; i < a.parts.length; i++) {
    const partA = a.parts[i]!;
    const partB = b.parts[i]!;
    const aRange = [cursorA, cursorA + getPartLength(partA)] as const;
    const bRange = [cursorB, cursorB + getPartLength(partB)] as const;

    // console.log("aRange", aRange, aCode.slice(...aRange));

    highlightTree(
      treeA,
      highlighter,
      (from: number, to: number, label) => {
        // highlighted.push([code.slice(from, to), label]);
        console.log(
          "from A",
          codeAsString(a).slice(from, to),
          from,
          "to",
          to,
          "label",
          label
        );
      },
      ...aRange
    );
    // console.log("bRange", bRange, bCode.slice(...bRange));
    highlightTree(
      treeB,
      highlighter,
      (from: number, to: number, label) => {
        // highlighted.push([code.slice(from, to), label]);
        console.log(
          "from B",
          codeAsString(b).slice(from, to),
          from,
          "to",
          to,
          "label",
          label
        );
      },
      ...bRange
    );
    cursorA += getPartLength(partA);
    cursorB += getPartLength(partB);
  }
  // }
  // console.log(highlighted);
}
