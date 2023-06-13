import { test, describe, expect } from "vitest";

import { runMotion } from "@/context";
import { frameMaker } from "@/test-utils";
import { spring } from "./spring";

// describe("spring", async () => {
//   test("aaa", () => {
//     const makeSceneFrame = frameMaker(
//       {
//         t: 0,
//       },
//       0
//     );

//     const executed = runMotion(
//       {
//         t: 0,
//       },
//       function* (context) {
//         yield* spring(0, 100, (t) => context.state({ t }));
//       },
//       {
//         fps: 30,
//       }
//     );
//   });
// });
