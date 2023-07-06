import {
  AnimatedTag,
  LanguageOptions,
  Tagifier,
  diffCode,
} from "@/code";
import {
  EasingOptions,
  applyEasing,
  isNumber,
  isUndefined,
} from "@coord/core";
import {
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Theme, curves } from "@/themes";

export type CodeOptions = {
  duration: number;
  durationPerChar: number;
  easing: EasingOptions;
  language?: LanguageOptions;
  theme: Theme;
  mode: "fade" | "type";
};

const defaultOptions: CodeOptions = {
  duration: 0.5,
  durationPerChar: 0,
  easing: "easeInOutSine",

  theme: curves,
  mode: "fade",
};

const modeDefaults: Record<
  CodeOptions["mode"],
  Partial<CodeOptions>
> = {
  fade: {
    duration: 0.6,
    durationPerChar: 0,
  },
  type: {
    duration: 0,
    durationPerChar: 0.015,
  },
};

export const normalizeOptions = (
  options: OptionsInput
) => {
  const mode = isNumber(options)
    ? "fade"
    : options.mode ?? "fade";
  const config = {
    ...defaultOptions,
    ...modeDefaults[mode],
  };
  if (isNumber(options)) {
    mode === "fade"
      ? (config.duration = options)
      : (config.durationPerChar = options);
  } else {
    Object.assign(config, options);
  }
  return config;
};
type OptionsInput = Partial<CodeOptions> | number;
export function useCode(
  code: string,
  options: OptionsInput = {}
) {
  const [config, setConfig] = useState(() =>
    normalizeOptions(options)
  );

  const [current, setCurrent] = useState(code);
  const [prev, setPrev] = useState(code);

  useEffect(() => {
    setPrev(current);

    setCurrent(code);
  }, [code]);
  useEffect(() => {
    return () => {
      setPrev(current);
    };
  }, [current]);

  const [t, setT] = useState(1);
  const [tags, setTags] = useState<AnimatedTag[]>(
    []
  );

  useLayoutEffect(() => {
    const { regions, total } = diffCode(
      prev,
      current
    );
    setTags(
      Tagifier.generateTags(
        regions,
        config.theme,
        config.language
      )
    );
    if (current === prev) return;

    setT(0);

    const start = performance.now();

    const duration = config.durationPerChar
      ? config.durationPerChar * total
      : config.duration;

    let request = 0;
    const animate = () => {
      const now = performance.now();
      const t = Math.min(
        (now - start) / 1000 / duration,
        1
      );
      setT(applyEasing(config.easing, t));
      if (t < 1) {
        request = requestAnimationFrame(animate);
      }
    };
    request = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(request);
    };
  }, [current]);

  return {
    transition: t,
    options: config,
    code: tags,
    isAnimating: t < 1,
    setCode: (
      code: string,
      options?: OptionsInput
    ) => {
      if (t < 1) return;
      if (!isUndefined(options)) {
        setConfig(normalizeOptions(options));
      }
      setPrev(current);
      setCurrent(code);
    },
  };
}
