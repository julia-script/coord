import { Vec2, Vec2ish } from "@coord/core";
import { Dispatch, SetStateAction } from "react";
import { useSafeState } from "./safe-server-hooks";

export const useCoordState = (
  initial: Vec2ish
): [Vec2, Dispatch<SetStateAction<Vec2>>] => {
  return useSafeState(Vec2.of(initial));
};
