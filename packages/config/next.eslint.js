const config = {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
  ],
  plugins: ["import", "react", "jsx-a11y"],
  rules: {
    "import/no-anonymous-default-export": "warn",
    "react/no-unknown-property": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "jsx-a11y/alt-text": [
      "warn",
      {
        elements: ["img"],
        img: ["Image"],
      },
    ],
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/aria-proptypes": "warn",
    "jsx-a11y/aria-unsupported-elements": "warn",
    "jsx-a11y/role-has-required-aria-props":
      "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "react/jsx-no-target-blank": "off",
  },
  parser: "eslint-config-next/parser.js",
  parserOptions: {
    requireConfigFile: false,
    sourceType: "module",
    allowImportExportEverywhere: true,
    babelOptions: {
      presets: ["next/babel"],
      caller: {
        // Eslint supports top level await when a parser for it is included. We enable the parser by default for Babel.
        supportsTopLevelAwait: true,
      },
    },
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
  ],
  settings: {
    react: {
      version: "latest",
    },
    "import/parsers": {
      ["@typescript-eslint/parser"]: [
        ".ts",
        ".mts",
        ".cts",
        ".tsx",
        ".d.ts",
      ],
    },
    "import/resolver": {
      ["eslint-import-resolver-node"]: {
        extensions: [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ],
      },
      ["eslint-import-resolver-typescript"]: {
        alwaysTryTypes: true,
      },
    },
  },
  env: {
    browser: true,
    node: true,
  },
};

export default config;
