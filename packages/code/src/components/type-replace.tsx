import React, { useMemo } from "react";
import { AnimatedTag } from "@/code";
import {
  clamp,
  inverseLerp,
  makeId,
} from "@coord/core";

const getCharT = (
  start: number,
  size: number,
  v: number
) => {
  if (v < start) {
    return 0;
  }
  if (v >= start + size) {
    return 1;
  }

  return clamp(
    inverseLerp(start, start + size, v),
    0,
    1
  );
};
export function Typewriter({
  transition,
  tags,
}: {
  transition: number;
  tags: AnimatedTag[];
}) {
  const { animatedChars, groups } =
    useMemo(() => {
      let animatedChars = 0;

      let prevTag = tags[0];
      if (!prevTag) {
        return {
          groups: [],
          animatedChars: 0,
        };
      }

      let group: GroupProps = {
        id: makeId(),
        start: 0,
        chars: 0,
        type:
          prevTag.left && prevTag.right
            ? "both"
            : prevTag.left
            ? "left"
            : "right",
        tags: [],
      };
      const groups = [group];
      for (const tag of tags) {
        if (
          !(
            !prevTag.left === !tag.left &&
            !prevTag.right === !tag.right
          )
        ) {
          group = {
            id: makeId(),
            tags: [],
            type:
              tag.left && tag.right
                ? "both"
                : tag.left
                ? "left"
                : "right",
            start: animatedChars,
            chars: 0,
          };
          groups.push(group);
        }
        let chars = 0;
        if (!(tag.left && tag.right)) {
          chars =
            tag.code.match(/[^ ]/g)?.length ?? 0;
        }

        group.tags.push({
          ...tag,
          chars: chars,
          start: animatedChars,
        });
        animatedChars += chars;
        group.chars += chars;

        prevTag = tag;
      }
      return {
        groups,
        animatedChars,
      };
    }, [tags]);

  const currChar = Math.round(
    animatedChars * transition
  );

  return (
    <div
      style={{
        position: "relative",
        whiteSpace: "pre",
      }}
    >
      {groups.map((group) => {
        return (
          <Group
            key={group.id}
            {...group}
            transition={getCharT(
              group.start,
              group.chars,
              currChar
            )}
            currentLine={0}
          />
        );
      })}
    </div>
  );
}
type GroupProps = {
  id: string;
  start: number;
  chars: number;
  type: "left" | "right" | "both";
  tags: (AnimatedTag & {
    start: number;
    chars: number;
  })[];
};

function Group({
  tags,
  type,
  transition,
  chars,
  start,
}: GroupProps & {
  transition: number;
  currentLine: number;
}) {
  if (type === "both") {
    return tags.map((tag) => (
      <span key={tag._id} style={tag.styles}>
        {tag.code}
      </span>
    ));
  }

  let prevLine = 0;
  const visibleChars = Math.floor(
    chars *
      (type === "left"
        ? 1 - transition
        : transition)
  );
  return tags.map((tag) => {
    const [line] = (transition < 0.5
      ? tag.left
      : tag.right) ?? [prevLine];
    prevLine = line;

    const t = getCharT(
      tag.start - start,
      tag.chars,
      visibleChars
    );
    return (
      <span key={tag._id} style={tag.styles}>
        {lerpString(tag.code, t)}
      </span>
    );
  });
}
const lerpString = (str: string, t: number) => {
  return str.slice(0, Math.round(str.length * t));
};
