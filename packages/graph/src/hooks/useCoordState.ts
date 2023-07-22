import {
  Vec2,
  Vec2ish,
  useSafeState,
} from "@coord/core";
import { Dispatch, SetStateAction } from "react";

export const useCoordState = (
  initial: Vec2ish
): [Vec2, Dispatch<SetStateAction<Vec2>>] => {
  return useSafeState(Vec2.of(initial));
};
