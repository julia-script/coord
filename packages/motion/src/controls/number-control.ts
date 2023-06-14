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
  lerp,
  EasingOptions,
} from "@coord/core";

type OnlyKeysOfType<T, TType> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends TType ? never : K;
  }[keyof T]
>;

export function* controlNumber<
  TState extends MotionState,
  TTree extends OnlyKeysOfType<InferPathValueTree<TState>, number | undefined>,
  TKey extends keyof TTree,
  TControl extends NumberControl<TState, TTree[TKey]>
>(
  key: TKey & string,
  fn?: (control: TControl) => ReturnType<MotionBuilder<TState>>
) {
  const context = yield* requestContext<TState>();
  const control = new NumberControl(context, key) as TControl;
  if (fn) {
    yield* fn(control);
  }
  return control;
}

const isFinite = (value: unknown): value is number => Number.isFinite(value);

export class NumberControl<TState extends MotionState, TType = number> {
  chain: ReturnType<MotionBuilder<TState>>[] = [];

  constructor(public context: MotionContext<MotionState>, public key: string) {}

  get() {
    return getDeep(this.context._state, this.key) as TType;
  }
  set(value: number) {
    this.context._state = setDeep(this.context._state, this.key, value);
  }

  tweenTo(value: number, duration: number, easing?: EasingOptions) {
    const initialValue = this.get() ?? 0;
    if (!isFinite(initialValue)) {
      throw new Error(
        `Cannot tween to a non-finite value, got ${initialValue}`
      );
    }

    return tween<TState>(
      duration,
      (t) => {
        this.set(lerp(initialValue, value, t));
      },
      easing
    );
  }

  springTo(to: number, parameters?: SpringParameters) {
    const initialValue = this.get() ?? 0;
    if (!isFinite(initialValue)) {
      throw new Error(
        `Cannot spring to a non-finite value, got ${initialValue}`
      );
    }

    return spring(
      initialValue,
      to,
      (t) => {
        this.set(t);
      },
      parameters
    );
  }
}
