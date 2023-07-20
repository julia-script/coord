import {
  Token,
  computeStyles,
} from "@coord/code-motion";
import { TokenRenderer } from "../Token";
import {
  memo,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  clamp,
  inverseLerp,
  makeId,
  remap,
} from "@coord/core";
import { TransitionRendererProps } from "../types";
import {
  AnimationClock,
  RenderingState,
} from "@/utils";

type Group = {
  id: string;
  tokens: Token[];
  size: number;
  position: number;
  animationPosition: number;
};

const SingleToken = memo(
  ({
    token,
    group,
    renderingState,
    transitionTime,
    groupIsActive,
  }: {
    token: Token;
    group: Group;
    renderingState: RenderingState;
    transitionTime: number;
    groupIsActive: boolean;
  }) => {
    const tokenStyles = useMemo(() => {
      if (
        token.type === "deletion" ||
        (token.type === "static" &&
          !groupIsActive &&
          transitionTime <= 0)
      ) {
        return computeStyles(
          renderingState.fromTheme,
          ["foreground", ...token.pastStyles]
        );
      }

      return computeStyles(renderingState.theme, [
        "foreground",
        ...token.styles,
      ]);
    }, [renderingState]);

    if (transitionTime < 1) {
      const copy = {
        ...token,
      };
      if (token.type !== "static") {
        const size =
          token.content.length + token.skipLines;
        const trimmedSize = Math.round(
          size * transitionTime
        );
        copy.content = token.content.slice(
          0,
          trimmedSize
        );
        copy.skipLines =
          trimmedSize - copy.content.length;

        if (transitionTime === 0) {
          copy.indent = 0;
        }

        if (
          groupIsActive &&
          token.skipLines &&
          token ===
            group.tokens[group.tokens.length - 1]
        ) {
          copy.skipLines = clamp(
            copy.skipLines,
            1,
            token.skipLines
          );
        }
        token = copy;
      }
    }

    return (
      <TokenRenderer
        style={tokenStyles}
        token={token}
        renderNewLines
      />
    );
  },
  (prev, next) => {
    return (
      prev.transitionTime ===
        next.transitionTime &&
      prev.groupIsActive === next.groupIsActive &&
      prev.renderingState === next.renderingState
    );
  }
);

const TokenGroup = memo(
  ({
    group,
    renderingState,
    groupTransitionTime,
  }: {
    group: Group;
    renderingState: RenderingState;
    groupTransitionTime: number;
  }) => {
    if (group.tokens.length === 0) return null;
    if (group.tokens[0].type === "deletion")
      groupTransitionTime =
        1 - groupTransitionTime;

    let position = 0;
    const groupIsActive =
      groupTransitionTime > 0 &&
      groupTransitionTime < 1;
    return (
      <>
        {group.tokens.map((token, i) => {
          const tokenPosition = position;
          const tokenSize =
            token.content.length +
            token.skipLines;
          position += tokenSize;
          const tokenTime = globalToLocalTime(
            group.size,
            tokenPosition,
            tokenSize,
            groupTransitionTime
          );
          return (
            <SingleToken
              key={i}
              group={group}
              token={token}
              renderingState={renderingState}
              transitionTime={tokenTime}
              groupIsActive={groupIsActive}
            />
          );
        })}
      </>
    );
  },
  (prev, next) => {
    return (
      prev.groupTransitionTime ===
        next.groupTransitionTime &&
      prev.renderingState === next.renderingState
    );
  }
);

export const TypewriterRenderer = memo(
  ({
    renderingState,
    transitionTime,
  }: TransitionRendererProps) => {
    const { groups, animatedCharacters } =
      useMemo(() => {
        let position = 0;
        let animationPosition = 0;
        let currentGroup: Group = {
          id: makeId("group-"),
          tokens: [],
          size: 0,
          position: 0,
          animationPosition: 0,
        };
        const groups: Group[] = [currentGroup];

        let prev: Token | null = null;

        for (const token of renderingState.tokens) {
          if (prev && prev.type !== token.type) {
            currentGroup = {
              id: makeId("group-"),
              tokens: [],
              size: 0,
              position,
              animationPosition,
            };
            groups.push(currentGroup);
          }
          currentGroup.tokens.push(token);
          prev = token;
          const tokenSize =
            token.content.length +
            token.skipLines;
          currentGroup.size += tokenSize;
          position += tokenSize;

          if (token.type !== "static") {
            animationPosition += tokenSize;
          }
        }

        return {
          groups,
          animatedCharacters: animationPosition,
          characters: position,
        };
      }, [renderingState.tokens]);

    return (
      <code>
        {groups.map((group, i) => (
          <TokenGroup
            key={group.id}
            group={group}
            renderingState={renderingState}
            groupTransitionTime={
              group.tokens[0]?.type === "static"
                ? group.animationPosition >=
                  animatedCharacters *
                    transitionTime
                  ? 1
                  : 0
                : globalToLocalTime(
                    animatedCharacters,
                    group.animationPosition,
                    group.size,
                    transitionTime
                  )
            }
          />
        ))}
      </code>
    );
  }
);

const globalToLocalTime = (
  globalSize: number,
  start: number,
  size: number,
  time: number
) => {
  return clamp(
    inverseLerp(
      start,
      start + size,
      globalSize * time
    ),
    0,
    1
  );
};
