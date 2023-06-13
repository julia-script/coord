import { test, describe, expect } from "vitest";
import { makeMovie } from "./make-movie";
import { makeScene } from "./make-scene";
import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";

describe("makeMovie", async () => {
  test("Single scene without transition", async () => {
    const makeScene1Frame = frameMaker(
      {
        a: "Waiting",
      },
      0
    );
    const makeMovieFrame = frameMaker(
      {
        scene1: makeScene1Frame.initialState,
      },
      0
    );

    const movie = makeMovie(
      "Test",
      {
        scene1: makeScene("Scene 1", { a: "Waiting" }, function* (context) {
          context.state({
            a: "Hello",
          });
          yield;

          context.state({
            a: "world",
          });
          yield;

          context.state({
            a: "!",
          });
          yield;
        }),
      },
      {
        transitionDuration: 0,
      }
    );

    const executed = runMotion(movie.initialState, movie.builder);

    expect(executed.frames.length).toBe(3);
    expect(executed.frames).toEqual([
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "Hello",
        }),
      }),
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "world",
        }),
      }),
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "!",
        }),
      }),
    ]);
  });

  test("Sequence of scenes without transition", async () => {
    const makeScene1Frame = frameMaker(
      {
        a: "Waiting",
      },
      0
    );
    const makeScene2Frame = frameMaker(
      {
        b: "Waiting",
      },
      0
    );
    const makeMovieFrame = frameMaker(
      {
        scene1: makeScene1Frame.initialState,
        scene2: makeScene2Frame.initialState,
      },
      0
    );
    const movie = makeMovie(
      "Test",
      {
        scene1: makeScene("Scene 1", { a: "Waiting" }, function* (context) {
          context.state({
            a: "Hello",
          });
          yield;

          context.state({
            a: "world",
          });
          yield;
        }),
        scene2: makeScene("Scene 2", { b: "Waiting" }, function* (context) {
          context.state({
            b: "Hello",
          });
          yield;
          context.state({
            b: "world",
          });
          yield;
        }),
      },
      {
        transitionDuration: 0,
      }
    );

    const executed = runMotion(movie.initialState, movie.builder);

    expect(executed.frames.length).toBe(4);

    expect(executed.frames).toEqual([
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "Hello",
        }),
      }),
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "world",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "world",
        }),
      }),
    ]);
  });

  test("Sequence of scenes with transition", async () => {
    const makeScene1Frame = frameMaker(
      {
        a: "Waiting",
      },
      0
    );
    const makeScene2Frame = frameMaker(
      {
        b: "Waiting",
      },
      3
    );
    const makeMovieFrame = frameMaker(
      {
        scene1: makeScene1Frame.initialState,
        scene2: makeScene2Frame.initialState,
      },
      0
    );
    const movie = makeMovie(
      "Test",
      {
        scene1: makeScene("Scene 1", { a: "Waiting" }, function* (context) {
          context.state({
            a: "Hello World!",
          });

          yield;
        }),
        scene2: makeScene(
          "Scene 2",
          {
            b: "Waiting",
          },
          function* (context) {
            context.state({
              b: "Hello",
            });
            yield;
            context.state({
              b: "Hello World",
            });
            yield;

            context.state({
              b: "Hello World!",
            });
            yield;
          }
        ),
      },
      {
        transitionDuration: 3,
      }
    );

    const executed = runMotion(movie.initialState, movie.builder, {
      fps: 1,
    });

    expect(executed.frames.length).toBe(4);
    expect(executed.frames).toEqual([
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "Hello World!",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello World",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello World!",
        }),
      }),
    ]);
  });

  test("Sequence of scenes with transition longer than its duration", async () => {
    const makeScene1Frame = frameMaker(
      {
        a: "Waiting",
      },
      0
    );
    const makeScene2Frame = frameMaker(
      {
        b: "Waiting",
      },
      3
    );
    const makeMovieFrame = frameMaker(
      {
        scene1: makeScene1Frame.initialState,
        scene2: makeScene2Frame.initialState,
      },
      0
    );
    const movie = makeMovie(
      "Test",
      {
        scene1: makeScene("Scene 1", { a: "Waiting" }, function* (context) {
          context.state({
            a: "Hello World!",
          });

          yield;
        }),
        scene2: makeScene(
          "Scene 2",
          {
            b: "Waiting",
          },
          function* (context) {
            context.state({
              b: "Hello World!",
            });
            yield;
          }
        ),
      },
      {
        transitionDuration: 3,
      }
    );

    const executed = runMotion(movie.initialState, movie.builder, {
      fps: 1,
    });

    expect(executed.frames.length).toBe(4);
    expect(executed.frames).toEqual([
      makeMovieFrame({
        scene1: makeScene1Frame({
          a: "Hello World!",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello World!",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello World!",
        }),
      }),
      makeMovieFrame({
        scene2: makeScene2Frame({
          b: "Hello World!",
        }),
      }),
    ]);
  });

  test("should update $transitionIn correctly", () => {
    const movie = makeMovie(
      "Test",
      {
        scene1: makeScene("Scene 1", {}, function* (context) {
          yield;
        }),
        scene2: makeScene("Scene 2", {}, function* (context) {
          yield;
          yield;
          yield;
        }),
      },
      {
        transitionDuration: 3,
      }
    );

    const executed = runMotion(movie.initialState, movie.builder, {
      fps: 1,
    });

    expect(executed.frames.length).toBe(4);

    // First frame
    expect(executed.frames[0]?.scene1.$transitionIn).toEqual(1);
    expect(executed.frames[0]?.scene2.$transitionIn).toEqual(0);

    // Second frame
    expect(executed.frames[1]?.scene2.$transitionIn).toEqual(1 / 3);

    // Third frame
    expect(executed.frames[2]?.scene2.$transitionIn).toEqual(2 / 3);

    // Fourth frame
    expect(executed.frames[3]?.scene2.$transitionIn).toEqual(1);
  });
});
