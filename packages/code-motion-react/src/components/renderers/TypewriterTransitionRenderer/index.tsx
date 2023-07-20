import { Theme, Token } from "@coord/code-motion";
import { TokenRenderer } from "../Token";
import { typewriterTransition } from "./styles.module.css";
import cn from "clsx";
import { useMemo } from "react";
import {
  clamp,
  inverseLerp,
} from "@coord/core/dist";

const TokenGroup = ({
  tokens,
  time,
  size,
}: {
  tokens: Token[];
  time: number;
  size: number;
}) => {
  if (tokens.length === 0) return null;
  if (tokens[0].type === "deletion")
    time = 1 - time;
  const cutAt = size * time;

  let position = 0;
  const groupHasFinished = time >= 1;
  const groupHasStarted = time > 0;
  return (
    <>
      {tokens.map((token, i) => {
        let content = "";
        let skipLines = 0;
        let indent = 0;
        if (
          token.type === "static" ||
          groupHasFinished
        ) {
          content = token.content;
          skipLines = token.skipLines;
          indent = token.indent;
        } else if (groupHasStarted) {
          const size =
            token.content.length +
            token.skipLines;
          const tokenSplitPosition = clamp(
            Math.round(cutAt - position),
            0,
            size
          );
          content = token.content.slice(
            0,
            tokenSplitPosition
          );
          if (cutAt >= position) {
            indent = token.indent;
          }

          skipLines =
            tokenSplitPosition - content.length;

          if (i == tokens.length - 1)
            skipLines = Math.min(
              token.skipLines,
              1
            );
          position += size;
        }
        return (
          <TokenRenderer
            key={i}
            renderNewLines
            token={{
              ...token,
              skipLines,
              content,
              indent,
            }}
          />
        );
      })}
    </>
  );
};
type TypewriterTransitionRendererProps = {
  tokens: Token[];
  theme: Theme;
  fromTheme?: Theme;
  controlled?: boolean;
  transitionTime?: number;
};

type Group = {
  tokens: Token[];
  size: number;
  position: number;
};
export function TypewriterTransitionRenderer({
  transitionTime = 1,
  tokens,
}: TypewriterTransitionRendererProps) {
  const { groups, size } = useMemo(() => {
    let size = 0;
    let currentGroup: Group = {
      tokens: [],
      size: 0,
      position: 0,
    };
    const groups: Group[] = [currentGroup];

    let prev: Token | null = null;

    for (const token of tokens) {
      if (prev && prev.type !== token.type) {
        currentGroup = {
          tokens: [],
          size: 0,
          position: size,
        };
        groups.push(currentGroup);
      }
      currentGroup.tokens.push(token);
      prev = token;
      if (token.type === "static") continue;
      const tokenSize =
        token.content.length + token.skipLines;
      currentGroup.size += tokenSize;
      size += tokenSize;
    }

    return { groups, size };
  }, [tokens]);
  const cutAt = size * transitionTime;
  return (
    <code className={cn(typewriterTransition)}>
      {groups.map((group, i) => {
        const t = clamp(
          inverseLerp(
            group.position,
            group.position + group.size,
            cutAt
          ),
          0,
          1
        );

        return (
          <TokenGroup
            key={i}
            tokens={group.tokens}
            size={group.size}
            time={t}
          />
        );
      })}
    </code>
  );
}
