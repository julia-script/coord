// import { calcStep } from "./";
// import { fitCoordBoxToView } from "./fitCoordBoxToView";
// import { calcStepGridMultiplier } from "./calcStepGridMultiplier";
// import { describe, expect, test } from "@jest/globals";

// describe("utils", () => {
//   test("fitCoordBoxToView", () => {
//     const coordBox = fitCoordBoxToView(
//       { horizontal: [-10, 10], vertical: [10, -10] },

//       [1, 1],
//       [200, 100],
//       10
//     );
//   });

//   test("calcStep", () => {
//     // expect(calcStep(1 / 16)).toBe(10);
//     expect(calcStep(1 / 4)).toBe(5);
//     expect(calcStep(1 / 2)).toBe(2);
//     expect(calcStep(1)).toBe(1);
//     expect(calcStep(2)).toBe(0.5);
//     expect(calcStep(4)).toBe(0.2);
//     expect(calcStep(8)).toBe(0.1);
//     expect(calcStep(16)).toBe(0.05);
//     expect(calcStep(32)).toBe(0.02);
//     expect(calcStep(64)).toBe(0.01);
//     expect(calcStep(128)).toBe(0.005);
//   });

//   test("calcStepGridMultiplier", () => {
//     expect(calcStepGridMultiplier(10)).toBe(1);
//     expect(calcStepGridMultiplier(9)).toBe(1);
//     expect(calcStepGridMultiplier(8)).toBe(1);
//     expect(calcStepGridMultiplier(7)).toBe(1);
//     expect(calcStepGridMultiplier(6)).toBe(1);
//     expect(calcStepGridMultiplier(5)).toBe(2);
//     expect(calcStepGridMultiplier(4)).toBe(2);
//     expect(calcStepGridMultiplier(3)).toBe(2);
//     expect(calcStepGridMultiplier(2)).toBe(4);
//     expect(calcStepGridMultiplier(1)).toBe(8);
//   });
// });
