import {
  CSSProperties,
  ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import cn from "clsx";
import {
  Language,
  Theme,
  Token,
  vscodeDark,
} from "@coord/code-motion";

import { isNumber } from "lodash-es";

import {
  EasingOptions,
  PartialBy,
  useStopwatch,
} from "@coord/core";
import {
  RenderingState,
  initializeRenderingState,
  updateRenderingState,
} from "@/utils";
import {
  TypewriterRenderer,
  FadeEffectRenderer,
} from "./renderers";

type CodeMotionProps = {
  tokens: Token[];
  code: string;
  language?: Language;
  theme?: Theme;
  fromTheme?: Theme;
  transitionTime?: number;
  transitionDuration?: number;
  transitionMode?: "fade" | "typewriter";
  easing?: EasingOptions;
  measureDurationPer?:
    | "full-transition"
    | "change-rate";

  displayBackground?: boolean;
} & ComponentProps<"pre">;

const defaultsPerMode: Record<
  CodeMotionProps["transitionMode"] & string,
  Partial<CodeMotionProps>
> = {
  fade: {
    transitionDuration: 0.8,
    measureDurationPer: "full-transition",
  },
  typewriter: {
    transitionDuration: 2,
    measureDurationPer: "change-rate",
  },
};

export function CodeMotion({
  className,
  tokens,
  code,
  language = "tsx",
  theme = vscodeDark,
  fromTheme = theme,
  style,
  transitionTime,
  transitionMode = "fade",
  transitionDuration,
  measureDurationPer,
  easing,
  ...props
}:
  | PartialBy<CodeMotionProps, "code">
  | PartialBy<CodeMotionProps, "tokens">) {
  const modeDefaults =
    defaultsPerMode[transitionMode];
  transitionDuration ??=
    modeDefaults.transitionDuration ?? 0.5;

  measureDurationPer ??=
    modeDefaults.measureDurationPer ??
    "full-transition";

  const isFirstRender = useRef(true);
  const controlled = isNumber(transitionTime);
  const [renderingState, setRenderingState] =
    useState<RenderingState>(() =>
      initializeRenderingState(
        tokens ?? code ?? "",
        language,
        theme,
        fromTheme
      )
    );

  let duration = transitionDuration;
  if (measureDurationPer === "change-rate") {
    duration *= renderingState.changes / 100;
  }

  const [transitionTimeState, setTransitionTime] =
    useState(1);
  const { play } = useStopwatch(
    setTransitionTime,
    {
      durationInSeconds: duration,
      easing,
    }
  );

  useLayoutEffect(() => {
    if (isFirstRender.current) return;
    setRenderingState((prev) =>
      updateRenderingState(prev, {
        code,
        tokens,
        language,
        theme,
      })
    );
    setTransitionTime(0);
  }, [tokens, code, theme, language]);

  useLayoutEffect(() => {
    if (controlled || isFirstRender.current)
      return;
    if (duration === 0) {
      setTransitionTime(1);
      return;
    }

    play(0);
  }, [renderingState]);
  useEffect(() => {
    isFirstRender.current = false;
    return () => {
      isFirstRender.current = true;
    };
  }, []);
  return (
    <pre
      className={cn("cm-code-motion", className)}
      style={
        {
          ...style,
          "--cm-transition-time": transitionTime,
          "--cm-transition-duration":
            transitionDuration,
        } as CSSProperties
      }
      {...props}
    >
      {transitionMode === "fade" && (
        <FadeEffectRenderer
          renderingState={renderingState}
          transitionTime={
            transitionTime ?? transitionTimeState
          }
        />
      )}
      {transitionMode === "typewriter" && (
        <TypewriterRenderer
          renderingState={renderingState}
          transitionTime={
            transitionTime ?? transitionTimeState
          }
        />
      )}
    </pre>
  );
}
