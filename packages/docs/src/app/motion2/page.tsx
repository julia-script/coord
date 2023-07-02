"use client";
import { Button } from "@/components/Button";
import {
  code,
  insert,
  replace,
  CodeBlock,
  useCode,
  CodeMotion,
  r,
  rm,
  remove,
} from "@coord/code";
import { YieldedType, clamp, lerp, remap } from "@coord/core/dist";
import {
  wait,
  makeMotion,
  makeCodeState,
  chain,
  BuilderState,
} from "@coord/motion";
import { useMotionController, MotionPlayer } from "@coord/motion-react";
import { Fragment, memo, useMemo, useState } from "react";
import dedent from "ts-dedent";

const builder = function* () {
  const codeControl = yield* makeCodeState("test", `function test() {}`);

  yield* chain(
    codeControl
      .to(
        code`
      function test() {${insert(`
        return 1;
      `)}}`
      )
      .in(1),
    wait(1),
    codeControl
      .to(
        code`
      function test() {
        ${remove(`return 1;`)}
      }`
      )
      .in(1),
    wait(1),
    codeControl.to("var myVar;").in(1),
    wait(1),
    codeControl
      .to(code`${r("var", "const")} my${r("Var", "Const = 1")};`)
      .in(1),

    wait(1),
    codeControl.to("const myBool = true;").in(1),
    wait(1),
    codeControl.to("const myBool:boolean = true;").in(1),
    wait(1),

    codeControl
      .to(
        `
        type MyType = boolean;
        const myBool:MyType = true;
      `
      )
      .in(1),
    wait(1),
    codeControl
      .to(
        code`
        ${remove("type MyType = boolean;")}
        const my${replace("Bool:MyType", "String")} = ${replace(
          "true",
          '"Hi"'
        )};
      `
      )
      .in(1),

    wait(1),
    codeControl
      .to(code`${r("const", "var")} my${r('String = "Hi"', "Var")};`)
      .in(1),
    wait(1),
    codeControl.to(`function test() {}`).in(1),
    wait(1)
  );
};

const scene = makeMotion("Hello World", builder);

export default function Page() {
  const controls = useMotionController(scene);
  const { state } = controls;
  return (
    <div>
      {" "}
      <Button>Hi</Button>
    </div>
  );
  return (
    <MotionPlayer controls={controls} repeat autoplay>
      <CodeMotion
        className="code m-auto text-5xl leading-normal"
        noBg
        {...state.test}
      />
    </MotionPlayer>
  );
}
function Pageold() {
  const controls = useMotionController(scene);
  const [codeString, setCodeString] = useState(
    dedent(`
      function(){}
    `)
  );
  const { setCode, transition, isAnimating, ...rest } = useCode(codeString);
  const [manualT, setTransition] = useState(1);
  const [mode, setMode] = useState<"fade" | "type">("fade");

  return (
    <div className="container grid w-full grid-cols-2 p-8">
      <div>
        {/* <CodeBlock {...rest} transition={Math.min(manualT, transition)} /> */}
        <div>
          {/* <input
              className="w-full"
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={manualT}
              onChange={(e) => setTransition(Number(e.target.value))}
            /> */}
          {/* {transition.toFixed(2)} */}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          className="h-56 w-full rounded bg-gray-900 p-2 font-mono text-xs text-white"
          value={codeString}
          onChange={(e) => setCodeString(e.target.value)}
        />
        <button
          className="rounded bg-blue-500 p-1 text-xs text-white"
          onClick={() => {
            setCode(codeString, { mode });
          }}
        >
          Animate
        </button>
        <div className="flex gap-1 ">
          {[
            dedent(`
            function(){}
          `),
            dedent(`
            function hello() {
              console.log("Hello!")
            }
          `),
            dedent(`
            function hello() {
              console.log("Hello World!")
            }
            `),
            dedent(`
            function hello() {
              console.log("Hello World!")
            }
            function goodbye() {
              console.log("Goodbye World!")
            }
            `),
          ].map((code, i) => (
            <button
              key={i}
              className="rounded bg-blue-500 p-1 text-xs text-white"
              onClick={() => {
                setCodeString(code);
              }}
            >
              Example {i}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ">
          {(["fade", "type"] as const).map((m) => (
            <label key={m}>
              <input
                type="radio"
                name="mode"
                checked={mode === m}
                onChange={() => setMode(m)}
              />{" "}
              {m}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
