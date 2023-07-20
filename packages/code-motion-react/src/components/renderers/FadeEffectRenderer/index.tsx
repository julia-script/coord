import {
  Token,
  computeStyles,
} from "@coord/code-motion";
import { TokenRenderer } from "../Token";
import {
  CSSProperties,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  clamp,
  lerp,
  makeId,
  inlined,
  remap,
} from "@coord/core";
import { TransitionRendererProps } from "../types";
import { RenderingState } from "@/utils";

type TokenPosition = {
  past: { x: number; y: number };
  future: { x: number; y: number };
};
type PositionMap = Map<Token, TokenPosition>;
export function FadeEffectRenderer({
  renderingState,
  transitionTime,
}: TransitionRendererProps) {
  const [elementMap] = useState(
    new Map<Token, HTMLElement>()
  );
  const [
    expectedPositionMap,
    setExpectedPositionMap,
  ] = useState<PositionMap | null>(null);

  const [containerSize, setContainerSize] =
    useState<{
      past: { width: number; height: number };
      future: { width: number; height: number };
    } | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const positionMap = new Map<
      Token,
      {
        past: { x: number; y: number };
        future: { x: number; y: number };
      }
    >();
    const { lineHeight } = getComputedStyle(
      ref.current
    );

    const lineHeightPx = parseFloat(lineHeight);

    let x = 0;
    let y = 0;

    let pastX = 0;
    let pastY = 0;

    let pastWidth = 0;

    let futureWidth = 0;

    for (let token of renderingState.tokens) {
      const el = elementMap.get(token);
      if (!el) continue;

      positionMap.set(token, {
        past: {
          x: pastX,
          y: pastY,
        },
        future: {
          x,
          y,
        },
      });

      let { width } = el.getBoundingClientRect();

      if (token.type !== "insertion") {
        pastWidth = Math.max(
          pastWidth,
          pastX + width
        );

        if (token.skipLines) {
          pastY += lineHeightPx * token.skipLines;
          pastX = 0;
        } else {
          pastX += width;
        }
      }

      if (token.type !== "deletion") {
        futureWidth = Math.max(
          futureWidth,
          x + width
        );
        if (token.skipLines) {
          y += lineHeightPx * token.skipLines;
          x = 0;
        } else {
          x += width;
        }
      }
    }
    setExpectedPositionMap(positionMap);
    setContainerSize({
      past: {
        width: pastWidth,
        height: pastY + lineHeightPx,
      },
      future: {
        width: futureWidth,
        height: y + lineHeightPx,
      },
    });
  }, [
    renderingState.tokens,
    elementMap,
    ref.current,
  ]);
  const transformTime = clamp(
    remap(0.2, 0.8, 0, 1, transitionTime),
    0,
    1
  );
  return (
    <code
      ref={ref}
      style={inlined(
        {
          position: "relative",
          display: "block",
        },
        containerSize && {
          width: lerp(
            containerSize.past.width,
            containerSize.future.width,
            transformTime
          ),
          height: lerp(
            containerSize.past.height,
            containerSize.future.height,
            transformTime
          ),
        }
      )}
    >
      {renderingState.tokens.map((token, i) => {
        const expectedPosition =
          expectedPositionMap?.get(token);
        return (
          <SingleToken
            ref={(el) => {
              if (!el) return;
              elementMap.set(token, el);
            }}
            key={i}
            token={token}
            renderingState={renderingState}
            expectedPosition={expectedPosition}
            time={transitionTime}
          />
        );
      })}
    </code>
  );
}

const SingleToken = forwardRef<
  HTMLSpanElement,
  {
    token: Token;
    expectedPosition?: TokenPosition;
    renderingState: RenderingState;

    time: number;
  }
>(function (
  {
    token,
    expectedPosition,
    renderingState,

    time,
  },
  ref
) {
  const offset = useMemo(() => {
    if (!expectedPosition) return undefined;
    if (token.type !== "static") return undefined;
    const offset = {
      x:
        expectedPosition.past.x -
        expectedPosition.future.x,
      y:
        expectedPosition.past.y -
        expectedPosition.future.y,
    };
    if (offset.x === 0 && offset.y === 0)
      return undefined;
    return offset;
  }, [expectedPosition, token, renderingState]);
  const positionStyles =
    useMemo<CSSProperties>(() => {
      if (token.type !== "deletion") return {};
      if (!expectedPosition)
        return {
          position: "absolute",
          left: 0,
          top: 0,
        };
      return {
        position: "absolute",
        left: expectedPosition.past.x,
        top: expectedPosition.past.y,
      };
    }, [expectedPosition]);

  const tokenStyles = useMemo(() => {
    if (token.type === "deletion")
      return computeStyles(
        renderingState.fromTheme,
        ["foreground", ...token.pastStyles]
      );

    return computeStyles(renderingState.theme, [
      "foreground",
      ...token.styles,
    ]);
  }, [renderingState, token]);

  const pastStyles = useMemo(() => {
    if (token.type !== "static") return undefined;
    return computeStyles(
      renderingState.fromTheme,
      ["foreground", ...token.pastStyles]
    );
  }, [renderingState]);

  const transformTime = clamp(
    1 - remap(0.2, 0.8, 0, 1, time),
    0,
    1
  );

  const deletionTime = clamp(
    remap(0, 0.2, 0, 1, time),
    0,
    1
  );
  const insertionTime = clamp(
    remap(0.8, 1, 0, 1, time),
    0,
    1
  );

  const composedStyles = {
    ...tokenStyles,
    ...positionStyles,
  };
  if (offset && transformTime > 0) {
    composedStyles.transform = `translate(${
      offset.x * transformTime
    }px, ${offset.y * transformTime}px)`;
  }

  if (pastStyles) {
    if (pastStyles.color !== tokenStyles.color)
      composedStyles.color = `mix-color(in srgb, ${
        pastStyles.color
      }, ${tokenStyles.color} ${time * 100}%)`;

    if (
      pastStyles.opacity !== tokenStyles.opacity
    )
      composedStyles.opacity = lerp(
        Number(pastStyles.opacity ?? 1),
        Number(tokenStyles.opacity ?? 1),
        time
      );
  }

  if (token.type === "deletion") {
    composedStyles.opacity = lerp(
      Number(tokenStyles.opacity ?? 1),
      0,
      deletionTime
    );
  } else if (token.type === "insertion") {
    composedStyles.opacity = lerp(
      0,
      Number(tokenStyles.opacity ?? 1),
      insertionTime
    );
  }
  return (
    <TokenRenderer
      ref={ref}
      token={token}
      style={composedStyles}
      renderNewLines={token.type !== "deletion"}
    />
  );
});
