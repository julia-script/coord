import { describe, test, expect } from "vitest";

import { diffCode } from "./diff";

describe("diffCode", () => {
  test("basic", () => {
    const a = `
    function test() {
      console.log("Hello World");
    }
    `;
    const b = `
    function test() {
      console.log("Hello Universe");
    }
    `;

    console.log(diffCode(a, b));
    expect(true).toEqual(true);
  });
});
