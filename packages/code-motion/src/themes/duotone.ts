/**
 * @name duotone
 * @author Bram de Haan
 * by Bram de Haan, adapted from DuoTone themes by Simurai (http://simurai.com/projects/2016/01/01/duotone-themes)
 */
import { makeTheme } from "@/theming";
export const duotoneLight = makeTheme(
  "duotone",
  "light",
  {
    background: { background: "#faf8f5" },
    foreground: { color: "#b29762" },
    caret: { color: "#93abdc" },
    selection: { color: "#e3dcce" },
    selectionMatch: { color: "#e3dcce" },
    gutter: {
      background: "#faf8f5",
      color: "#cdc4b1",
    },
    lineHighlight: { color: "#EFEFEF" },
    "comment,bracket": { color: "#b6ad9a" },
    "atom,number,keyword,link,attributeName,quote":
      { color: "#063289" },
    "emphasis,heading,tagName,propertyName,variableName":
      { color: "#2d2006" },
    "typeName,url,string": { color: "#896724" },
    "operator,string": { color: "#1659df" },
    propertyName: { color: "#b29762" },
    "unit,punctuation": { color: "#063289" },
  }
);

export const duotoneDark = makeTheme(
  "duotone",
  "dark",
  {
    background: { background: "#2a2734" },
    foreground: { color: "#6c6783" },
    caret: { color: "#ffad5c" },
    selection: {
      color: "rgba(255, 255, 255, 0.1)",
    },
    gutter: {
      background: "#2a2734",
      color: "#545167",
    },
    lineHighlight: { color: "#36334280" },
    "comment,bracket": { color: "#6c6783" },
    "atom,number,keyword,link,attributeName,quote":
      { color: "#ffcc99" },
    "emphasis,heading,tagName,propertyName,className,variableName":
      { color: "#eeebff" },
    "typeName,url": { color: "#7a63ee" },
    operator: { color: "#ffad5c" },
    string: { color: "#ffb870" },
    propertyName: { color: "#9a86fd" },
    "unit,punctuation": { color: "#e09142" },
  }
);
