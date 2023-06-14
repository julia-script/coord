import {
  MotionBuilder,
  MotionContext,
  MotionState,
  requestContext,
} from "@/context";
import { tween, spring, SpringParameters } from "@/tweening";
import {
  getDeep,
  setDeep,
  InferPathValueTree,
  EasingOptions,
  Vec2ish,
  Vec2,
} from "@coord/core";

type OnlyKeysOfType<T, TType> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends TType ? never : K;
  }[keyof T]
>;

export function* controlPoint<
  TState extends MotionState,
  TTree extends OnlyKeysOfType<InferPathValueTree<TState>, Vec2 | undefined>,
  TKey extends keyof TTree,
  TControl extends PointControl<TState, TTree[TKey]>
>(
  key: TKey & string,
  fn?: (control: TControl) => ReturnType<MotionBuilder<TState>>
) {
  const context = yield* requestContext<TState>();
  const control = new PointControl(context, key) as TControl;
  if (fn) {
    yield* fn(control);
  }
  return control;
}

export class PointControl<TState extends MotionState, TType = Vec2> {
  chain: ReturnType<MotionBuilder<TState>>[] = [];

  constructor(public context: MotionContext<MotionState>, public key: string) {}

  get() {
    const value = getDeep(this.context._state, this.key);
    return value as TType;
  }
  set(value: Vec2ish) {
    this.context._state = setDeep(this.context._state, this.key, value);
  }

  tweenTo(value: Vec2ish, duration: number, easing?: EasingOptions) {
    const initialValue = this.get();
    if (
      !(initialValue instanceof Vec2) ||
      (initialValue instanceof Vec2 && !initialValue.isFinite())
    ) {
      throw new Error(
        `Cannot tween to a non-finite value, got ${initialValue}`
      );
    }
    const target = Vec2.of(value);

    return tween<TState>(
      duration,
      (t) => {
        this.set(initialValue.lerp(target, t));
      },
      easing
    );
  }

  springTo(to: Vec2ish, parameters?: SpringParameters) {
    const initialValue = this.get() ?? 0;
    if (
      !(initialValue instanceof Vec2) ||
      (initialValue instanceof Vec2 && !initialValue.isFinite())
    ) {
      throw new Error(
        `Cannot tween to a non-finite value, got ${initialValue}`
      );
    }
    const target = Vec2.of(to);

    return spring(
      initialValue,
      target,
      (t) => {
        this.set(t);
      },
      parameters
    );
  }
}
