import React from "react";
import { AnimatedTag } from "@/code";
import { clamp, remap, lerp } from "@coord/core";
import { useMemo, Fragment } from "react";

export function SmoothReplace({
  transition,
  tags,
}: {
  transition: number;
  tags: AnimatedTag[];
}) {
  const {
    right,
    left,

    fromCol,
    toCol,
    fromLine,
    toLine,
  } = useMemo(() => {
    const right: Extract<
      AnimatedTag,
      { right: [number, number] }
    >[] = [];
    const left: Extract<
      AnimatedTag,
      { left: [number, number] }
    >[] = [];
    let fromCol = 0;
    let toCol = 0;
    let fromLine = 0;
    let toLine = 0;
    for (const tag of tags) {
      if (tag.right) {
        right.push(tag);
      }
      if (tag.left && !tag.right) {
        left.push(tag);
      }

      const leftCol = tag.left
        ? tag.left[1] + tag.code.length
        : 0;
      const rightCol = tag.right
        ? tag.right[1] + tag.code.length
        : 0;
      const leftLine = tag.left ? tag.left[0] : 0;
      const rightLine = tag.right
        ? tag.right[0]
        : 0;
      fromCol = Math.max(fromCol, leftCol);
      toCol = Math.max(toCol, rightCol);
      fromLine = Math.max(fromLine, leftLine);
      toLine = Math.max(toLine, rightLine);
    }

    return {
      right,
      left,

      fromCol,
      toCol,
      fromLine,
      toLine,
    };
  }, [tags]);
  const resizeT = clamp(
    remap(transition, 0.2, 0.8, 0, 1),
    0,
    1
  );
  const leaveT = clamp(
    remap(transition, 0, 0.2, 0, 1),
    0,
    1
  );
  const enterT = clamp(
    remap(transition, 0.8, 1, 0, 1),
    0,
    1
  );
  return (
    <div
      style={{
        position: "relative",
        whiteSpace: "pre",

        width: `${lerp(
          fromCol,
          toCol,
          resizeT
        )}ch`,
        height: `${lerp(
          fromLine + 1,
          toLine + 1,
          resizeT
        )}lh`,
      }}
    >
      {leaveT < 1 && (
        <div
          style={{
            opacity: 1 - leaveT,
            position: "absolute",
          }}
        >
          {left.map((tag) => (
            <span
              key={tag._id}
              style={{
                position: "absolute",
                display: "inline-block",
                translate: `${tag.left[1]}ch ${
                  tag.left[0] * 100
                }%`,
                ...tag.styles,
              }}
            >
              {tag.code}
            </span>
          ))}
        </div>
      )}
      {right.map((tag) => {
        const lineOffset = tag.left
          ? tag.left[0] - tag.right[0]
          : 0;
        const columnOffset = tag.left
          ? tag.left[1] - tag.right[1]
          : 0;

        return (
          <Fragment key={tag._id}>
            {tag.code
              .split(/(\n)/g)
              .map((code, i) => {
                if (code === "\n")
                  return <br key={i} />;
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      translate: `${
                        columnOffset *
                        (1 - resizeT)
                      }ch ${
                        lineOffset *
                        (1 - resizeT) *
                        100
                      }%`,
                      ...tag.styles,
                      opacity: !tag.left
                        ? enterT
                        : 1,
                    }}
                  >
                    {code}
                  </span>
                );
              })}
          </Fragment>
        );
      })}
    </div>
  );
}
