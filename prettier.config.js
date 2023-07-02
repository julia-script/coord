module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  proseWrap: "always",
  overrides: [
    {
      files: "*.mdx",
      options: {
        printWidth: 70,
      },
    },
  ],
};
