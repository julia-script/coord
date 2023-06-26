"use client";
import {
  AnimatedTag,
  Tagifier,
  // CodeRegion,
  // CodeState,
  applyTheme,
  code,
  codeState,
  insert,
  replace,
  // codeState,
  // diffToAnimate,
  // stringifyCodeState,
} from "@coord/code/dist";
import { clamp, lerp, remap } from "@coord/core/dist";
import {
  makeScene,
  wait,
  tween,
  control,
  controlCode,
  controlString,
  makeState,
} from "@coord/motion";
import { useMotionController, MotionPlayer } from "@coord/motion-react";
import { memo, useMemo } from "react";
code`
function hello() {
  ~+console.log("Hello World!")+~
  ~-console.log("Hello Universe!")-~
  ++console.log("Hello Multiverse!")++
}`;
const scene = makeScene(
  "Hello World",
  {
    code: codeState`function hello() {\n  console.log("Hello World!")\n}`,
    text: "",
  },
  function* () {
    // console.log("hello");
    yield* makeState("test", 2);
    const text = yield* controlString("text");

    const codeControl = yield* controlCode("code");

    yield* codeControl
      .edit(
        code`
        function hello() {
          console.log("Hello World!")
        }
        ${insert(
          `

          function bye() {
            console.log("Bye World!")
          }

        `
        )}
        function hello() {
          console.log("Hello Universe!")
        }
        `
      )
      .in(1);
    yield* wait(1);

    yield* codeControl
      .edit(
        code`
        function hello() {
          console.log("Hello World!")
        }

        function ${replace("bye", "soooooDramatic")}() {
          console.log("Bye World!")
        }

        function hello() {
          console.log("Hello Universe!")
        }
        `
      )
      .in(1);
    yield* wait(1);
    // yield* codeControl
    //   .edit(code`console.log("Hello ${["Universe", "Multiverse"]}!")`)
    //   .in(1);

    // yield* wait(1);
    // yield* codeControl
    //   .edit(code`console.log(${['"Hello Multiverse!"', `\n\`Hi\`\n`]})`)
    //   .in(1);
    // yield* code.as({
    //   regions: diffToAnimate(codeTest(1), codeTest(2)),
    //   transition: 0,
    // });
    // initial = code.get();
    // yield* tween(
    //   1,
    //   (t) => {
    //     code.set({
    //       ...initial,
    //       transition: t,
    //     });
    //   },
    //   "easeInOutSine"
    // );

    // yield* wait(1);
    // yield* code.as({
    //   regions: diffToAnimate(codeTest(2), codeTest(0)),
    //   transition: 0,
    // });
    // initial = code.get();
    // yield* tween(
    //   1,
    //   (t) => {
    //     code.set({
    //       ...initial,
    //       transition: t,
    //     });
    //   },
    //   "easeInOutSine"
    // );
    // yield;
    // // return;
    // yield* chain(
    //   wait(0.2),
    //   text.to("Hello World!").in(1),
    //   wait(1),
    //   text.append(' I\'m "@coord/motion"').in(1),
    //   wait(1),
    //   text.clear(0.5)
    // );
  }
);

function Tag({ tag, transition }: { tag: AnimatedTag; transition: number }) {
  const [leftLine, leftColumn] = tag.left ?? tag.right ?? [0, 0];
  const [rightLine, rightColumn] = tag.right ?? tag.left ?? [0, 0];
  let opacity = 1;

  const resizeT = clamp(remap(transition, 0.2, 0.8, 0, 1), 0, 1);
  const leaveT = clamp(remap(transition, 0, 0.2, 0, 1), 0, 1);
  const enterT = clamp(remap(transition, 0.5, 1, 0, 1), 0, 1);
  if (!tag.left) {
    opacity = enterT;
  }

  if (!tag.right) {
    opacity = 1 - leaveT;
  }
  return (
    <span
      style={{
        color: tag.color,

        ...(transition < 1
          ? {
              position: "absolute",
              opacity,
              // left: `${lerp(leftColumn, rightColumn, resizeT)}ch`,
              translate: `${lerp(leftColumn, rightColumn, resizeT)}ch ${
                lerp(leftLine, rightLine, resizeT) * 100
              }%`,
            }
          : {
              display: !tag.right ? "none" : "inline-block",
            }),
      }}
    >
      {tag.code}
    </span>
  );
}

function CodeBlock({ code, transition }: ReturnType<typeof codeState>) {
  const tags = useMemo(() => {
    const lines: AnimatedTag[][] = [];
    Tagifier.generateTags(code).forEach((tag) => {
      let line = (tag.right?.[0] ?? tag.left?.[0])!;
      if (!lines[line]) lines[line] = [];
      lines[line].push(tag);
    });
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i])
        lines[i] = [
          {
            code: " ",
            color: "transparent",
            left: null,
            right: [i, 0],
            opacity: 0,
          },
        ];
    }
    return lines;
  }, [code]);

  return (
    <pre className="relative text-[40px]">
      {tags.map((line, i) => (
        <div className="relative">
          {line.map((tag) => (
            <Tag tag={tag} transition={transition} />
          ))}
        </div>
      ))}
    </pre>
  );
}
export default function Page() {
  const controls = useMotionController(scene);
  return (
    <MotionPlayer controls={controls} autoplay repeat>
      <CodeBlock {...controls.state.code} />
    </MotionPlayer>
  );
}
// const isBetween = (value: number, min: number, max: number) =>
//   value >= min && value <= max;

// const overlaps = (a: [number, number], b: [number, number]) => {
//   const [a0, a1] = a;
//   const [b0, b1] = b;
//   return isBetween(a0, b0, b1) || isBetween(a1, b0, b1);
// };
// function Region({
//   region,
//   transition,
//   highlights,
// }: {
//   region: [CodeRegion | null, CodeRegion | null];
//   transition: number;
//   highlights: [[number, number, string][], [number, number, string][]];
// }) {
//   const leaveT = clamp(transition * 2, 0, 1);
//   const moveT = clamp(transition * 2 - 1, 0, 1);
//   const enterT = clamp(transition * 3 - 2, 0, 1);
//   const [a, b] = region;
//   const { line, column } = lerpPos(a, b, moveT);
//   const aLines = a?.code.split("\n") ?? [];
//   const bLines = b?.code.split("\n") ?? [];
//   const codeChanged = a?.code !== b?.code;

//   const [aHighlight, bHighlight] = highlights;
//   const bParts = useMemo(() => {
//     if (!b) return [];
//     const lines = b.code.split("\n").reverse();
//     const highlights = bHighlight.slice().reverse();
//     const parts = [];
//     let position = b.position;

//     let highlightIndex = 0;
//     let i = 0;

//     let currLine = lines.pop();
//     let currHighlight = highlights.pop();
//     let pos = b.position;
//     let line = b.line;
//     let column = b.column;
//     while (currLine) {
//       if (!currHighlight || currHighlight[0] > pos + currLine.length) {
//         parts.push({
//           code: currLine,
//           column,
//           length: currLine.length,
//           color: "inherit",
//         });

//         currLine = lines.pop();
//       }
//     }
//   }, [transition, region]);

//   const bComponents = useMemo(
//     () =>
//       bLines.map((lineCode, i) => {
//         return (
//           <span
//             key={i}
//             style={{
//               translate: `${i === 0 ? column * 1 + "ch" : 0} ${
//                 (line + i) * 1.5 + "em"
//               }`,
//               position: "absolute",
//               opacity: codeChanged ? enterT : 1,
//             }}
//           >
//             {lineCode}
//           </span>
//         );
//       }),
//     [transition, region]
//   );
//   const aComponents = useMemo(() => {
//     if (!codeChanged) {
//       return null;
//     }
//     return aLines.map((lineCode, i) => {
//       return (
//         <span
//           key={i}
//           style={{
//             translate: `${i === 0 ? column * 1 + "ch" : 0} ${
//               (line + i) * 1.5 + "em"
//             }`,
//             position: "absolute",
//             opacity: 1 - leaveT,
//           }}
//         >
//           {lineCode}
//         </span>
//       );
//     });
//   }, [transition, region]);
//   return (
//     <>
//       {bComponents}
//       {aComponents}
//     </>
//   );
// }

// type Tag = {
//   code: string;
//   color: string;
//   line: number;
//   column: number;
// };

// type TagGroup = {
//   tags: Tag[];
//   line: number;
//   column: number;
//   lineCount: number;
//   contentChanged: boolean;
// };

// class Tagifier {
//   currentGroup: TagGroup = {
//     tags: [],
//     line: 0,
//     column: 0,
//     lineCount: 0,
//     contentChanged: false,
//   };
//   // groups: TagGroup[] = [this.currentGroup];

//   // color = "inherit";
//   position = 0;
//   line = 0;
//   column = 0;
//   currentHighlight: [number, number, string] | null = null;

//   get nextHighlight() {
//     return this.highlights[0];
//   }
//   constructor(public highlights: [number, number, string][]) {
//     this.nextHighglight();
//   }

//   // nextPosition() {
//   //   this.position++;
//   //   if (this.currentHighlight) {
//   //     const [start, end] = this.currentHighlight;
//   //     if (this.position >= start && this.position < end) {
//   //       return;
//   //     } else {
//   //       this.currentHighlight = null;
//   //     }
//   //   }

//   //   const nextHighglight = this.highlights[0];
//   //   if (nextHighglight) {
//   //     const [start] = nextHighglight;
//   //     if (this.position >= start) {
//   //       this.currentHighlight = nextHighglight;
//   //       this.highlights.shift();
//   //     }
//   //   }
//   // }
//   getColor() {
//     if (this.currentHighlight) {
//       const [start, end, color] = this.currentHighlight;
//       if (this.position >= start && this.position < end) {
//         return color;
//       }
//     }

//     return "inherit";
//   }

//   nextHighglight() {
//     this.currentHighlight = this.highlights.shift() ?? null;
//   }
//   pushTag(code: string) {
//     if (code === "") {
//       return;
//     }
//     const { line, column } = this;
//     this.currentGroup.tags.push({
//       code,
//       color: this.getColor(),
//       line,
//       column,
//     });
//     this.column += code.length;
//   }
//   pushCode(code: string) {
//     let str = "";
//     for (let i = 0; i < code.length; i++) {
//       let char = code[i]!;

//       if (char === "\n") {
//         this.pushTag(str);
//         this.column = 0;
//         this.currentGroup.lineCount++;
//         this.line++;
//         str = "";
//         char = "";
//       }

//       str += char;

//       const highlight = this.currentHighlight;
//       if (highlight) {
//         if (this.position + 1 === highlight[0]) {
//           this.pushTag(str);
//           str = "";
//         }
//         if (this.position + 1 === highlight[1]) {
//           this.pushTag(str);
//           this.nextHighglight();

//           str = "";
//         }
//       }

//       this.position++;
//     }
//     this.pushTag(str);
//   }

//   getRegionGroup(code: string) {
//     this.pushCode(code);
//     const group = this.currentGroup;
//     this.currentGroup = {
//       tags: [],
//       line: this.line,
//       column: this.column,
//       lineCount: 0,
//       contentChanged: false,
//     };
//     return group;
//   }
// }
// function tagifyState(
//   codeState: CodeState,
//   highlights: readonly [[number, number, string][], [number, number, string][]]
// ) {
//   const tags: [TagGroup, TagGroup][] = [];

//   const [a, b] = codeState.regions;
//   const [aHighlight, bHighlight] = highlights;

//   const aTagifier = new Tagifier(aHighlight.slice());
//   const bTagifier = new Tagifier(bHighlight.slice());

//   for (const [a, b] of codeState.regions) {
//     const contentChanged = a?.code !== b?.code;
//     const aGroup = aTagifier.getRegionGroup(a?.code ?? "");
//     const bGroup = bTagifier.getRegionGroup(b?.code ?? "");
//     aGroup.contentChanged = contentChanged;
//     bGroup.contentChanged = contentChanged;

//     tags.push([aGroup, bGroup]);
//   }

//   return tags;
// }

// function TagGroupTransition({
//   tagGroup,
//   transition,
// }: {
//   tagGroup: [TagGroup, TagGroup];
//   transition: number;
// }) {
//   const leaveT = clamp(transition * 2, 0, 1);

//   const enterT = clamp(transition * 2 - 1, 0, 1);
//   const [a, b] = tagGroup;

//   const aComponents = useMemo(() => {
//     if (!a.contentChanged) return null;
//     return a.tags.map((tag, i) => {
//       return (
//         <span
//           key={i}
//           style={{
//             translate: `${tag.column * 1 + "ch"} ${tag.line * 1.5 + "em"}`,
//             position: "absolute",
//             opacity: 1 - leaveT,
//             color: tag.color,
//           }}
//         >
//           {tag.code}
//         </span>
//       );
//     });
//   }, [leaveT, tagGroup]);

//   const bComponents = useMemo(() => {
//     const srcLine = lerp(a.line, b.line, leaveT);
//     const srcColumn = lerp(a.column, b.column, leaveT);
//     return b.tags.map((tag, i) => {
//       const aTag = a.tags[i] ?? tag;
//       const coloffset = tag.column - b.column;
//       const lineoffset = tag.line - b.line;

//       // const column = srcColumn + coloffset;
//       const line = srcLine + lineoffset;
//       const column = lerp(aTag.column, tag.column, leaveT);
//       // const line = lerp(aTag.line, tag.line, leaveT);
//       const translate = b.contentChanged
//         ? `${tag.column * 1 + "ch"} ${tag.line * 1.5 + "em"}`
//         : `${column * 1 + "ch"} ${line * 1.5 + "em"}`;
//       return (
//         <span
//           key={i}
//           style={{
//             translate,
//             position: "absolute",
//             opacity: b.contentChanged ? enterT : 1,
//             color: tag.color,
//           }}
//         >
//           {tag.code}
//         </span>
//       );
//     });
//   }, [enterT, leaveT, tagGroup]);
//   return (
//     <>
//       {aComponents}
//       {bComponents}
//     </>
//   );
// }
// function Code({ codeState }: { codeState: CodeState }) {
//   const { regions, transition } = codeState;

//   const tags = useMemo(() => {
//     let now = performance.now();
//     const [left, right] = stringifyCodeState(codeState);

//     const highlights = [applyTheme(left), applyTheme(right)] as const;
//     now = performance.now() - now;

//     return tagifyState(codeState, highlights);
//   }, [codeState.regions]);
//   return (
//     <div className="text-[40px]">
//       <pre className="relative font-mono">
//         {tags.map((group, i) => {
//           return (
//             <TagGroupTransition
//               key={`${i}`}
//               tagGroup={group}
//               transition={transition}
//             />
//           );
//         })}
//         {/* {codeState.regions.map(([a, b]) => {
//           return (
//             <Region
//               highlighted={highlights}
//               key={`${a?.id}-${b?.id}`}
//               region={[a, b]}
//               transition={transition}
//             />
//           );
//         })} */}
//       </pre>
//     </div>
//   );
// }

// function lerpPos(a: CodeRegion | null, b: CodeRegion | null, t: number) {
//   if (!a && !b) {
//     throw new Error("a and b cannot both be null");
//   }
//   if (!a) {
//     return {
//       line: b?.line ?? 0,
//       column: b?.column ?? 0,
//       position: b?.position ?? 0,
//     };
//   }
//   if (!b) {
//     return {
//       line: a?.line ?? 0,
//       column: a?.column ?? 0,
//       position: a?.position ?? 0,
//     };
//   }

//   const line = lerp(a.line, b.line, t);
//   const column = lerp(a.column, b.column, t);
//   const position = lerp(a.position, b.position, t);
//   return { line, column, position };
// }
// export default function MyAnimation() {
//   const controls = useMotionController(scene);

//   const { state } = controls;

//   return (
//     <MotionPlayer controls={controls} autoplay repeat>
//       <div>
//         <Code codeState={state.code} />
//       </div>
//       {/* <div className="flex h-full w-full flex-col items-center justify-center">
//         <h1 className="font-mono text-6xl font-bold">{state.text}</h1>
//       </div> */}
//     </MotionPlayer>
//   );
// }
