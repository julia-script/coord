import { test, expect, describe } from "vitest";
import { setDeep } from "./setDeep";
describe("setDeep", () => {
  test("sets a value at a deep path", () => {
    const obj = {
      foo: {
        bar: {
          baz: 1,
        },
      },
    };
    const newObj = setDeep(obj, "foo.bar.baz", 2);

    expect(newObj).toEqual({
      foo: {
        bar: {
          baz: 2,
        },
      },
    });
  });

  test("keep the changed path immutable", () => {
    const obj = {
      foo: {
        bar: {
          baz: 1,
        },
        shouldNotMutate: {
          baz: 1,
        },
      },
      shouldNotMutate: {
        baz: 1,
      },
    };
    const newObj = setDeep(obj, "foo.bar.baz", 2);

    //  branches that should  mutate
    expect(newObj).not.toBe(obj);
    expect(newObj.foo).not.toBe(obj.foo);
    expect(newObj.foo.bar).not.toBe(obj.foo.bar);

    //  branches that should NOT mutate
    expect(newObj.foo.shouldNotMutate).toBe(obj.foo.shouldNotMutate);
    expect(newObj.shouldNotMutate).toBe(obj.shouldNotMutate);
  });
});
