import { MotionState, requestContext } from "@/context";
import { Vec2, point } from "@coord/core";
const isNumber = (n: unknown): n is number => typeof n === "number";

export function* spring<T extends number | Vec2, TState extends MotionState>(
  from: T,
  to: T,
  fn: (t: T) => void,
  spring: SpringParameters = Spring.Plop
) {
  const { settings } = yield* requestContext<TState>();

  const { settleTolerance = 0.001 } = spring;

  let position = isNumber(from) ? point(from, from) : from.clone();
  const target = isNumber(to) ? point(to, to) : to.clone();
  const velocity = isNumber(spring.initialVelocity)
    ? point(spring.initialVelocity, spring.initialVelocity)
    : spring.initialVelocity;
  const update = (dt: number) => {
    if (spring === null) {
      return;
    }
    const positionDelta = position.sub(target);

    // Using hooks law: F=-kx; with k being the spring constant and x the offset
    // to the settling position

    const force = point(
      -spring.stiffness * positionDelta.x - spring.damping * velocity.x,
      -spring.stiffness * positionDelta.y - spring.damping * velocity.y
    );

    // Update the velocity based on the given timestep
    velocity.x += (force.x / spring.mass) * dt;
    velocity.y += (force.y / spring.mass) * dt;

    position = position.add(velocity.scale(dt));
  };

  const fixedStep = 1 / settings.physicsFps;
  const updateStep = 1 / settings.fps;
  const loopStep = Math.min(fixedStep, updateStep);

  let settled = false;

  let frameTime = 0;
  let fixedTime = 0;
  const toleranceSquared = Math.pow(settleTolerance, 2);
  while (!settled) {
    frameTime += loopStep;
    fixedTime += loopStep;

    if (fixedTime >= fixedStep) {
      fixedTime -= fixedStep;
      update(fixedStep);

      if (
        Math.abs(position.squaredDistanceTo(target)) < toleranceSquared &&
        Math.abs(velocity.lengthSquared()) < toleranceSquared
      ) {
        settled = true;
        position = target;
      }
    }

    if (frameTime >= updateStep) {
      frameTime -= updateStep;
      fn((isNumber(from) ? position.x : position) as T);
      yield;
    }
  }
}

export interface SpringParameters {
  mass: number;
  stiffness: number;
  damping: number;
  initialVelocity: number | Vec2;
  settleTolerance?: number;
}

export const Spring = {
  Beat: {
    mass: 0.13,
    stiffness: 5.7,
    damping: 1.2,
    initialVelocity: 10.0,
    settleTolerance: 0.001,
  },
  Plop: {
    mass: 0.2,
    stiffness: 20.0,
    damping: 0.68,
    initialVelocity: 0.0,
    settleTolerance: 0.001,
  },
  Bounce: {
    mass: 0.08,
    stiffness: 4.75,
    damping: 0.05,
    initialVelocity: 0.0,
    settleTolerance: 0.001,
  },
  Swing: {
    mass: 0.39,
    stiffness: 19.85,
    damping: 2.82,
    initialVelocity: 0.0,
    settleTolerance: 0.001,
  },
  Jump: {
    mass: 0.04,
    stiffness: 10.0,
    damping: 0.7,
    initialVelocity: 8.0,
    settleTolerance: 0.001,
  },
  Strike: {
    mass: 0.03,
    stiffness: 20.0,
    damping: 0.9,
    initialVelocity: 4.8,
    settleTolerance: 0.001,
  },
  Smooth: {
    mass: 0.16,
    stiffness: 15.35,
    damping: 1.88,
    initialVelocity: 0.0,
    settleTolerance: 0.001,
  },
};
