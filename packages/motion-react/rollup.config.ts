import typescript from "@rollup/plugin-typescript";
import { Plugin, RollupOptions } from "rollup";
import postcss from "rollup-plugin-postcss";

const mergeTailwind = (): Plugin => {
  const virtualStyles = new Map<string, string>();
  return {
    name: "rollup-plugin-postcss",

    transform(code, id) {
      console.log(id);

      if (id.endsWith("styles.css")) {
        console.log(virtualStyles);
        code += `@layer components {`;

        for (const [
          className,
          styles,
        ] of virtualStyles.entries()) {
          code += `
            .${className} {
              @apply ${styles}
            }
          `;
        }
        code += `}`;

        console.log(code);
        return code;
      }
      if (id.endsWith(".tsx")) {
        const pattern =
          /(["'`])([\w-.\[\]\(\):]+)\s+?<~\s+?([\w-.\s\/\[\]\(\):]+)\1/g;
        const modifiedSource = code.replace(
          pattern,
          (_, quote, className, styles) => {
            // Add extracted styles to the CSS content
            const existing =
              virtualStyles.get(className);
            if (!existing) {
              virtualStyles.set(
                className,
                styles
              );
              console.log(className, styles);
            } else {
              if (existing !== styles) {
                throw new Error(
                  `class name ${className} has conflicting styles: ${existing} and ${styles}`
                );
              }
            }
            return quote + className + quote;
          }
        );

        return modifiedSource;
      }

      return null;
    },
  };
};
const config: RollupOptions = {
  input: "src/index.ts",
  plugins: [
    typescript(),
    mergeTailwind(),
    postcss({
      extract: true,
    }),
  ],
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.mjs",
      format: "es",
      sourcemap: true,
    },
  ],
};

export default config;
