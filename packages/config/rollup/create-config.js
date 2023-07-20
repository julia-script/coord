import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";
import typescript from "rollup-plugin-typescript2";
import esbuild from "rollup-plugin-esbuild";
/**
 * @param {{
 *  entry?: string;
 *  cssPrefix?: string;
 *  mapConfig?: (config: import('rollup').RollupOptions[]) => import('rollup').RollupOptions[];
 *  rootDir?: string;
 * }} [config]
 */
export const createConfig = async (
  config = {}
) => {
  const {
    entry = "src/index.ts",
    cssPrefix = "curvs",
    mapConfig = (config) => config,
    rootDir = process.cwd(),
  } = config;
  /**
   * @type {{
   *  dependencies?: Record<string, string>;
   *  peerDependencies?: Record<string, string>;
   *  devDependencies?: Record<string, string>;
   * }}
   */
  const pkg = (
    await import(`${rootDir}/package.json`, {
      assert: { type: "json" },
    })
  ).default;
  const external = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    "react/jsx-runtime",
    "react",
    "react-dom",
  ];

  return mapConfig([
    {
      input: entry,
      output: [
        {
          file: "dist/index.cjs",
          format: "cjs",
          sourcemap: true,
        },
        {
          file: "dist/index.js",
          format: "es",
          sourcemap: true,
        },
      ],
      context: "this",
      plugins: [
        postcss({
          plugins: [
            postcssPresetEnv(),
            autoprefixer(),
          ],
          extract: true,
          namedExports: true,
          modules: {
            localsConvention: "camelCaseOnly",
            dashedIdents: true,
            /** @param {string} className */
            generateScopedName: (className) =>
              `${cssPrefix}-${className}`,
          },
          minimize: true,
          sourceMap: true,
        }),
        nodeResolve(),
        commonjs(),
        typescript({
          tsconfig: `${rootDir}/tsconfig.json`,
          exclude: [
            "**/*.test.ts",
            "**/*.test.tsx",
          ],
        }),
      ],
      external,
    },
  ]);
};
