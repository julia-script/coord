import { tags as t } from "@lezer/highlight";
import { makeTheme } from "./theme";
const motion = "hsl(164 100.00% 60%)";
const motion2 = "hsl(164 100.00% 60%)";
const graph = "hsl(337 100.00% 60%)";

const graph2 = "hsl(337 50.00% 70%)";
const editor = "hsl(200 100.00% 60%)";
export const curves = makeTheme(
  "dark",
  {
    background: { background: "#051014" },
    foreground: { color: "#FFFFFF" },
    caret: { color: motion },
    selection: { color: "#4C5964" },
    selectionMatch: { color: "#3A546E" },
    gutterBackground: { color: "#303841" },
    gutterForeground: { color: "#FFFFFF70" },
    lineHighlight: { color: "#00000059" },
  },
  [
    { tag: [t.meta, t.comment], color: "#A2A9B5" },
    { tag: [t.attributeName, t.keyword], color: graph2 },
    { tag: t.function(t.variableName), color: editor },
    { tag: [t.string, t.regexp, t.attributeValue], color: "#99C592" },
    { tag: t.operator, color: "#f47954" },

    { tag: [t.tagName, t.modifier], color: graph },
    {
      tag: [
        t.number,
        t.definition(t.tagName),
        t.className,
        t.definition(t.variableName),
      ],
      color: motion,
    },
    {
      tag: [t.atom, t.bool, t.special(t.variableName)],
      color: graph,
    },
    { tag: t.variableName, color: editor },
    { tag: [t.propertyName, t.typeName], color: "#629ccd" },
    { tag: t.propertyName, color: "#36b7b5" },
  ]
);
