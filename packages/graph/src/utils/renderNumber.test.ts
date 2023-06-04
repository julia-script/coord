import { test, describe, expect } from "vitest";
import { renderNumber } from "./renderNumber";

describe("renderNumber", () => {
  test("should render number as string with up to 2 decimal places", () => {
    expect(renderNumber(1)).toBe("1");
    expect(renderNumber(1.1)).toBe("1.1");
    expect(renderNumber(1.11)).toBe("1.11");
    expect(renderNumber(1.111)).toBe("1.11");
  });
});
