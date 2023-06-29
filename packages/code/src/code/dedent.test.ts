// import dedent from "ts-dedent";
import { describe, test, expect } from "vitest";
import { trim } from "./dedent";

describe("dedent", () => {
  test("should remove trailing whitespace", () => {
    expect(
      trim(`
      function foo() {
        console.log("bar");  
      }
    `).value
    ).toBe(`function foo() {\n  console.log("bar");\n}`);
  });
});
