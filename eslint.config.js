async function getConfig() {
  const { default: baseConfig } = await import(
    "@coord/config/eslint.config.js"
  );
  return [
    ...baseConfig,
    {
      settings: {
        next: {
          rootDir: ["packages/docs"],
        },
      },
    },
    {
      ignores: [
        "**/dist/**/*",
        "**/node_modules/**/*",
        "**/.next/**/*",
      ],
    },
    {
      files: ["./**/*.tsx", "./**/*.ts"],
    },
  ];
}
module.exports = getConfig();
