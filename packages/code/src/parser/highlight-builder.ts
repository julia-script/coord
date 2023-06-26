import { Highlighter, Tag, getStyleTags } from "@lezer/highlight";
import {
  Tree,
  NodeType,
  NodeProp,
  TreeCursor,
  SyntaxNodeRef,
} from "@lezer/common";

const enum Mode {
  Opaque,
  Inherit,
  Normal,
}

function highlightTags(
  highlighters: readonly Highlighter[],
  tags: readonly Tag[]
): string | null {
  let result = null;
  for (let highlighter of highlighters) {
    let value = highlighter.style(tags);
    if (value) result = result ? result + " " + value : value;
  }
  return result;
}

export function highlightTree(
  tree: Tree,
  highlighter: Highlighter | readonly Highlighter[],
  /// Assign styling to a region of the text. Will be called, in order
  /// of position, for any ranges where more than zero classes apply.
  /// `classes` is a space separated string of CSS classes.
  putStyle: (from: number, to: number, classes: string) => void,
  /// The start of the range to highlight.
  from = 0,
  /// The end of the range.
  to = tree.length
) {
  let builder = new HighlightBuilder(
    from,
    Array.isArray(highlighter) ? highlighter : [highlighter],
    putStyle
  );
  builder.highlightRange(tree.cursor(), from, to, "", builder.highlighters);
  builder.flush(to);
}
const test = [, "hi"] as const;
const code = (a: any, ...args: [string, string][]) => {};
code`console.log("${["hello", "world"]}")`;

export class HighlightBuilder {
  class = "";
  constructor(
    public at: number,
    readonly highlighters: readonly Highlighter[],
    readonly span: (from: number, to: number, cls: string) => void
  ) {}

  startSpan(at: number, cls: string) {
    if (cls != this.class) {
      this.flush(at);
      if (at > this.at) this.at = at;
      this.class = cls;
    }
  }

  flush(to: number) {
    if (to > this.at && this.class) this.span(this.at, to, this.class);
  }

  highlightRange(
    cursor: TreeCursor,
    from: number,
    to: number,
    inheritedClass: string,
    highlighters: readonly Highlighter[]
  ) {
    let { type, from: start, to: end } = cursor;
    if (start >= to || end <= from) return;
    if (type.isTop)
      highlighters = this.highlighters.filter((h) => !h.scope || h.scope(type));

    let cls = inheritedClass;
    let rule = (getStyleTags(cursor) as Rule) || Rule.empty;
    let tagCls = highlightTags(highlighters, rule.tags);
    if (tagCls) {
      if (cls) cls += " ";
      cls += tagCls;
      if (rule.mode == Mode.Inherit)
        inheritedClass += (inheritedClass ? " " : "") + tagCls;
    }

    this.startSpan(Math.max(from, start), cls);
    if (rule.opaque) return;

    let mounted = cursor.tree && cursor.tree.prop(NodeProp.mounted);
    if (mounted && mounted.overlay) {
      let inner = cursor.node.enter(mounted.overlay[0]!.from + start, 1)!;
      let innerHighlighters = this.highlighters.filter(
        (h) => !h.scope || h.scope(mounted!.tree.type)
      );
      let hasChild = cursor.firstChild();
      for (let i = 0, pos = start; ; i++) {
        let next = i < mounted.overlay.length ? mounted.overlay[i] : null;
        let nextPos = next ? next.from + start : end;
        let rangeFrom = Math.max(from, pos),
          rangeTo = Math.min(to, nextPos);
        if (rangeFrom < rangeTo && hasChild) {
          while (cursor.from < rangeTo) {
            this.highlightRange(
              cursor,
              rangeFrom,
              rangeTo,
              inheritedClass,
              highlighters
            );
            this.startSpan(Math.min(rangeTo, cursor.to), cls);
            if (cursor.to >= nextPos || !cursor.nextSibling()) break;
          }
        }
        if (!next || nextPos > to) break;
        pos = next.to + start;
        if (pos > from) {
          this.highlightRange(
            inner.cursor(),
            Math.max(from, next.from + start),
            Math.min(to, pos),
            "",
            innerHighlighters
          );
          this.startSpan(Math.min(to, pos), cls);
        }
      }
      if (hasChild) cursor.parent();
    } else if (cursor.firstChild()) {
      if (mounted) inheritedClass = "";
      do {
        if (cursor.to <= from) continue;
        if (cursor.from >= to) break;
        this.highlightRange(cursor, from, to, inheritedClass, highlighters);
        this.startSpan(Math.min(to, cursor.to), cls);
      } while (cursor.nextSibling());
      cursor.parent();
    }
  }
}

class Rule {
  constructor(
    readonly tags: readonly Tag[],
    readonly mode: Mode,
    readonly context: readonly string[] | null,
    public next?: Rule
  ) {}

  get opaque() {
    return this.mode == Mode.Opaque;
  }
  get inherit() {
    return this.mode == Mode.Inherit;
  }

  sort(other: Rule | undefined) {
    if (!other || other.depth < this.depth) {
      this.next = other;
      return this;
    }
    other.next = this.sort(other.next);
    return other;
  }

  get depth() {
    return this.context ? this.context.length : 0;
  }

  static empty = new Rule([], Mode.Normal, null);
}
