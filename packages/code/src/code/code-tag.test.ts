import { describe, test, expect } from "vitest";
// import { applyTheme, code } from "./code-tag";
import { dracula } from "@/themes/dracula";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { Tagifier, code, stringifyLeft, stringifyRight } from "./code-tag";

// describe("code-tag", () => {
//   test("should return correct values", () => {
//     let str = code`
//       function helloWorld() {
//         console.log('Hello, world!');
//       }
//     `;
//     expect(stringifyLeft(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hello, world!');\n}`
//     );
//     str = code`
//       function helloWorld() {
//         console.log('Hello, ${["World", "Universe"]}!');
//       }
//     `;

//     expect(stringifyLeft(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hello, World!');\n}`
//     );

//     expect(stringifyRight(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hello, Universe!');\n}`
//     );

//     str = code`
//       function helloWorld() {
//         console.log('${["Hi", "Hello"]}, ${["World", "Universe"]}!');
//       }
//     `;

//     expect(stringifyLeft(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hi, World!');\n}`
//     );

//     expect(stringifyRight(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hello, Universe!');\n}`
//     );

//     str = code`
//       function helloWorld() {
//         ${["console.log('Hello, world!');", "console.log('Hello, universe!');"]}
//       }
//     `;

//     expect(stringifyLeft(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hello, world!');\n}`
//     );

//     expect(stringifyRight(str)).toEqual(
//       `function helloWorld() {\n  console.log('Hello, universe!');\n}`
//     );
//   });
// });

describe("Tagifier", () => {
  test("should return correct values", () => {
    let str = code`
      function helloWorld() {
        console.log('Hello, ${["Hello", "World"]}!');
      }
    `;
    expect(Tagifier.generateTags(str)).toEqual([]);
  });
});
