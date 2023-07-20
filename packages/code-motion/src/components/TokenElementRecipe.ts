import { defineRecipe } from "@pandacss/dev";

export const tokenRecipe = defineRecipe({
  name: "tkn",

  description:
    "The styles for the Button component",
  base: {
    display: "flex",
  },
  variants: {
    visual: {
      funky: { bg: "red.200", color: "white" },
      edgy: {
        border: "1px solid",
      },
    },
    size: {
      sm: { padding: "4", fontSize: "12px" },
      lg: { padding: "8", fontSize: "40px" },
    },
    shape: {
      square: { borderRadius: "0" },
      circle: { borderRadius: "full" },
    },
  },
  defaultVariants: {
    visual: "funky",
    size: "sm",
    shape: "circle",
  },
});
