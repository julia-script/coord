import {
  EasingOptions,
  isString,
} from "@coord/core";
import { Control } from "./control";
import { tween } from "@/tweening";
import { makeState } from "@/motion";
import {
  Code,
  code,
  diffCode,
  stringifyRight,
} from "@coord/code";

type CodeState = {
  code: Code;
  transition: number;
};
export class CodeControl extends Control<CodeState> {
  to(code: string | Code) {
    this._defer((t) => {
      if (!isString(code)) {
        return {
          ...t,
          code,
        };
      }
      const right = stringifyRight(t.code);

      return {
        ...t,
        code: diffCode(right, code).regions,
      };
    });
    return this;
  }
  edit(code: Code) {
    this._defer((t) => ({
      ...t,
      code,
    }));
    return this;
  }
  in(
    duration: number,
    easing: EasingOptions = "easeInOutSine"
  ) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const to = next();
      yield* tween(
        duration,
        (t) =>
          self.set({
            code: to.code,
            transition: t,
          }),
        easing
      );
    });
  }
}

export function controlCode(
  getter: () => CodeState,
  setter: (value: CodeState) => void
) {
  return new Control(getter, setter);
}

export function* makeCodeState<
  TKey extends string
>(key: TKey, initialState: Code | string) {
  const control = yield* makeState(key, {
    code: isString(initialState)
      ? code(initialState)
      : initialState,
    transition: 1,
  });

  return new CodeControl(
    control._get,
    control._set
  );
}
