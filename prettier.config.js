module.exports = {
  plugins: [
    require("prettier-plugin-tailwindcss"),
  ],
  proseWrap: "always",
  printWidth: 50,

  overrides: [
    {
      files: "*.mdx",
      options: {
        printWidth: 60,
      },
    },
  ],
};
