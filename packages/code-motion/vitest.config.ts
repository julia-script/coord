import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    alias: {
      "@/": "src/",
    },
    testTimeout: 1000,
  },
});
