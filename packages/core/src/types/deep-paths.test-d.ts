import { assertType, describe } from "vitest";
import {
  AnythingButTupleOrRecord,
  InferMultiplePathValues,
  InferPath,
  InferPathValue,
  InferPathValueTree,
} from "./deep-paths";
import { Equal } from "./test-utils";

describe("types: deep paths", () => {
  describe("InferPath", () => {
    assertType<
      Equal<
        InferPath<{
          foo: {
            bar: {
              baz: 1;
            };
          };
        }>,
        "foo" | "foo.bar" | "foo.bar.baz"
      >
    >(true);

    assertType<
      Equal<
        InferPath<{
          foo: {
            bar: {
              baz: 1;
            };
          };
          bar: {
            baz: 1;
          };
        }>,
        "foo" | "foo.bar" | "foo.bar.baz" | "bar" | "bar.baz"
      >
    >(true);

    assertType<
      InferPath<{
        foo:
          | {
              bar: "hello";
            }
          | {
              baz: "world";
            };
      }>
    >("" as "foo" | "foo.bar" | "foo.baz");

    assertType<
      Equal<
        InferPath<{
          foo: [
            {
              bar: "hello";
            },
            {
              baz: "world";
            }
          ];
        }>,
        "foo" | "foo.0" | "foo.0.bar" | "foo.1" | "foo.1.baz"
      >
    >(true);

    assertType<
      Equal<
        InferPath<{
          foo: (
            | {
                bar: "hello";
              }
            | {
                baz: "world";
              }
          )[];
        }>,
        "foo" | `foo.${number}` | `foo.${number}.bar` | `foo.${number}.baz`
      >
    >(true);

    assertType<
      Equal<
        InferPath<{
          foo?:
            | {
                bar: 2;
              }
            | "hello";
        }>,
        "foo" | "foo.bar"
      >
    >(true);
  });
  describe("InferPathValue", () => {
    assertType<
      Equal<
        InferPathValue<
          {
            foo: {
              bar: {
                baz: 1;
              };
            };
          },
          "foo.bar.baz"
        >,
        1
      >
    >(true);

    assertType<
      Equal<
        InferPathValue<
          {
            foo: {
              bar: {
                baz: 1;
              };
            };
            bar: {
              baz: 2;
            };
          },
          "foo.bar.baz" | "bar.baz"
        >,
        1 | 2
      >
    >(true);

    assertType<
      Equal<
        InferPathValue<
          {
            foo?: {
              bar: 1;
            };
          },
          "foo.bar"
        >,
        1 | undefined
      >
    >(true);

    assertType<
      Equal<
        InferPathValue<
          {
            foo:
              | {
                  bar: 1;
                }
              | {
                  baz: 2;
                };
          },
          "foo.bar"
        >,
        1 | undefined
      >
    >(true);

    assertType<
      Equal<
        InferPathValue<
          {
            foo: [
              {
                bar: 1;
              },
              {
                baz: 2;
              }
            ];
          },
          "foo.0.bar" | "foo.1.baz"
        >,
        1 | 2
      >
    >(true);
    assertType<
      Equal<
        InferPathValue<
          {
            foo: number[];
          },
          "foo.0"
        >,
        number | undefined
      >
    >(true);
    assertType<
      Equal<
        InferPathValue<
          {
            foo: { bar: number }[];
          },
          "foo.0.bar"
        >,
        number | undefined
      >
    >(true);
  });
  describe("InferMultiplePathValues", () => {
    assertType<
      Equal<
        InferMultiplePathValues<
          {
            foo: {
              bar: {
                baz: 1;
              };
            };
            bar: {
              baz: 2;
            };
            baz: {
              hello: {
                world: 3;
              };
            };
          },
          ["foo.bar.baz", "bar.baz", "baz.hello.world"]
        >,
        [1, 2, 3]
      >
    >(true);
  });

  describe("InferPathValueTree", () => {
    type testCase1 = {
      foo: {
        bar: {
          baz: 1;
        };
      };
      bar: {
        baz: 2;
      };
      baz: {
        hello: {
          world: 3;
        };
      };
    };

    type actual = InferPathValueTree<testCase1>;
    type expected = {
      foo: testCase1["foo"];
      "foo.bar": testCase1["foo"]["bar"];
      "foo.bar.baz": testCase1["foo"]["bar"]["baz"];

      bar: testCase1["bar"];
      "bar.baz": testCase1["bar"]["baz"];

      baz: testCase1["baz"];
      "baz.hello": testCase1["baz"]["hello"];
      "baz.hello.world": testCase1["baz"]["hello"]["world"];
    };
    assertType<Equal<actual, expected>>(true);
  });

  describe("AnythingButTupleOrRecord", () => {
    assertType<AnythingButTupleOrRecord<1>>(true);
    assertType<AnythingButTupleOrRecord<Array<number>>>(true);
    assertType<AnythingButTupleOrRecord<Record<string, number>[]>>(true);

    assertType<AnythingButTupleOrRecord<[]>>(false);
    assertType<AnythingButTupleOrRecord<Record<string, number>>>(false);
    assertType<
      AnythingButTupleOrRecord<{
        foo: {
          bar: 2;
        };
      }>
    >(false);
  });
});
