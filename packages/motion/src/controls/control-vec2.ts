import {
  EasingOptions,
  Vec2,
  Vec2ish,
} from "@coord/core";
import { Control, Dispatcher } from "./control";
import {
  SpringParameters,
  spring,
  tween,
} from "@/tweening";
import { makeState } from "@/motion";

export class Vec2Control extends Control<
  Vec2,
  Vec2ish
> {
  normalizeValue(value: Vec2ish): Vec2 {
    return Vec2.of(value);
  }
  to(value: Dispatcher<Vec2, Vec2ish>) {
    this._defer(value);
    return this;
  }

  in(duration: number, easing?: EasingOptions) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = self.get();
      const to = next();
      yield* tween(
        duration,
        (t) => self.set(from.lerp(to, t)),
        easing
      );
    });
  }
  spring(parameters?: SpringParameters) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = self.get();
      const to = next();
      yield* spring(
        from,
        to,
        self.set,
        parameters
      );
    });
  }
}

export function controlVec2(
  getter: () => Vec2,
  setter: (value: Vec2) => void
) {
  return new Control(getter, setter);
}

export function* makeVec2State<
  TKey extends string
>(key: TKey, initialState: Vec2ish) {
  const control = yield* makeState(
    key,
    Vec2.of(initialState)
  );

  return new Vec2Control(
    control._get,
    (vec: Vec2ish) => control._set(Vec2.of(vec))
  );
}
