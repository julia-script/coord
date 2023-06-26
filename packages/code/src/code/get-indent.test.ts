import { getIndent } from "./get-indent";
import { describe, expect, test } from "vitest";

describe("getIndent", () => {
  test("should return correct indent", () => {
    expect(getIndent(`  const a = 1;`)).toBe(2);
    expect(
      getIndent(`
        const a = 1;
      `)
    ).toBe(8);
    expect(
      getIndent(`
        function a() {
          const b = 2;
        }
      `)
    ).toBe(8);

    expect(
      getIndent(`
        function a() {
          const b = 2;
        }
           `)
    ).toBe(8);

    expect(
      getIndent(`  function a() {
        const b = 2;
      }`)
    ).toBe(2);

    expect(getIndent(`a`)).toBe(0);
    expect(getIndent(`  a`)).toBe(2);
    expect(getIndent(``)).toBe(null);
  });
});
