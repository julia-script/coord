import { EasingOptions, Transform, isFunction } from "@coord/core";
import { Control, Dispatcher } from "./control";
import { SpringParameters, spring, tween } from "@/tweening";
import { makeState } from "@/motion";

export class TransformControl extends Control<Transform> {
  to(value: Dispatcher<Transform>) {
    this._defer(value);
    return this;
  }

  translateTo(x: number, y: number) {
    return this.to((t) => t.setPosition([x, y]));
  }
  scaleTo(x: number, y: number = x) {
    return this.to((t) => t.setScale([x, y]));
  }

  rotateTo(angle: number) {
    return this.to((t) => t.setRotation(angle));
  }

  translate(x: number, y: number) {
    return this.to((t) => t.translate([x, y]));
  }

  scale(x: number, y: number = x) {
    return this.to((t) => t.scale([x, y]));
  }

  rotate(angle: number) {
    return this.to((t) => t.rotate(angle));
  }

  in(duration: number, easing?: EasingOptions) {
    const self = this;
    return this._applyDeferred(function* (next) {
      const from = self.get();
      const to = next();
      yield* tween(duration, (t) => self.set(from.lerp(to, t)), easing);
    });
  }
}

export function controlTransform(
  getter: () => Transform,
  setter: (value: Transform) => void
) {
  return new Control(getter, setter);
}

export function* makeTransformState<TKey extends string>(
  key: TKey,
  initialState: Transform
) {
  const control = yield* makeState(key, initialState);

  return new TransformControl(control._get, control._set);
}
