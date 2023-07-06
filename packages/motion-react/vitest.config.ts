import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "happy-dom", // or 'jsdom', 'node'

    alias: {
      "@/": "src/",
    },
  },
});
