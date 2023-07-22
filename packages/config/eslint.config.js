import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import nextjs from "./next.eslint.js";
// import next from "eslint-config-next";
// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  allConfig: undefined,
  recommendedConfig: undefined,
  baseDirectory: __dirname,
});

/**
 * @type {Function}
 * @param {object} config
 * @returns {object[]}
 */
const config = compat.config.bind(compat);
const lintConfig = [
  ...config(nextjs),
  ...config({
    extends: [
      // "next",
      // nextjs,
      "turbo",
      "prettier",
      "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
      babelOptions: {
        presets: ["next/babel"],
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/no-this-alias": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/ban-types": "off",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
          ignoreReadBeforeAssign: false,
        },
      ],
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          ignoreRestArgs: true,
        },
      ],
    },
  }),
  {
    ignores: [
      "**/dist/**/*",
      "**/node_modules/**/*",
      "**/.next/**/*",
    ],
  },
];

export default lintConfig;
