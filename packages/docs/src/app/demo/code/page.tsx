"use client";
import { CodeMotion } from "@coord/code-motion-react";
import { useState } from "react";

const codeA = `
function hello() {/* do something */}
`;

const codeB = `
function hello() {
  console.log("hello world");
}
`;
export default function Page() {
  const [transition, setTransition] =
    useState(0.5);
  const [code, setCode] = useState(codeA);
  const [textareaCode, setTextareaCode] =
    useState(codeB);
  return (
    <div className="m-auto flex max-w-xl flex-col justify-center">
      <CodeMotion
        // transitionTime={transition}
        code={code}
        // transitionMode="typewriter"
        language="tsx"
      />

      <input
        type="range"
        min="0"
        max="1"
        step="0.005"
        value={transition}
        onChange={(e) =>
          setTransition(
            parseFloat(e.target.value)
          )
        }
      />
      <textarea
        className="bg-dark mt-4 h-40 w-full border border-neutral-400/10"
        value={textareaCode}
        onChange={(e) => {
          console.log(e.target.value);
          setTextareaCode(e.target.value);
        }}
      />
      <button
        className="btn btn-primary mt-4"
        onClick={() => setCode(textareaCode)}
      >
        Update
      </button>
    </div>
  );
}
