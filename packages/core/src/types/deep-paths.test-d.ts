import { assertType, describe } from "vitest";
import {
  InferMultiplePathValues,
  InferPath,
  InferPathValue,
  InferPathValueTree,
} from "./deep-paths";

describe("types: deep paths", () => {
  describe("InferPath", () => {
    assertType<
      InferPath<{
        foo: {
          bar: {
            baz: 1;
          };
        };
      }>
    >("" as "foo" | "foo.bar" | "foo.bar.baz");
    assertType<
      InferPath<{
        foo: {
          bar: {
            baz: 1;
          };
        };
        bar: {
          baz: 1;
        };
      }>
    >("" as "foo" | "foo.bar" | "foo.bar.baz" | "bar" | "bar.baz");

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
      InferPath<{
        foo: [
          {
            bar: "hello";
          },
          {
            baz: "world";
          }
        ];
      }>
    >("" as "foo" | "foo.0" | "foo.0.bar" | "foo.1" | "foo.1.baz");

    assertType<
      InferPath<{
        foo: (
          | {
              bar: "hello";
            }
          | {
              baz: "world";
            }
        )[];
      }>
    >(
      "" as "foo" | `foo.${number}` | `foo.${number}.bar` | `foo.${number}.baz`
    );

    assertType<
      InferPath<{
        foo?:
          | {
              bar: 2;
            }
          | "hello";
      }>
    >("" as "foo" | "foo.bar");
  });
  describe("InferPathValue", () => {
    assertType<
      InferPathValue<
        {
          foo: {
            bar: {
              baz: 1;
            };
          };
        },
        "foo.bar.baz"
      >
    >(1);

    assertType<
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
      >
    >({} as 1 | 2);

    assertType<
      InferPathValue<
        {
          foo?: {
            bar: 1;
          };
        },
        "foo.bar"
      >
    >({} as 1 | undefined);

    assertType<
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
      >
    >({} as 1 | undefined);

    assertType<
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
      >
    >({} as 1 | 2);
  });
  describe("InferMultiplePathValues", () => {
    assertType<
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
      >
    >([1, 2, 3]);
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

    assertType<InferPathValueTree<testCase1>>(
      {} as {
        foo: testCase1["foo"];
        "foo.bar": testCase1["foo"]["bar"];
        "foo.bar.baz": testCase1["foo"]["bar"]["baz"];

        bar: testCase1["bar"];
        "bar.baz": testCase1["bar"]["baz"];

        baz: testCase1["baz"];
        "baz.hello": testCase1["baz"]["hello"];
        "baz.hello.world": testCase1["baz"]["hello"]["world"];
      }
    );
  });
});
