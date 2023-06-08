import { Point, Pointish } from "@coord/core";
import { Dispatch, SetStateAction } from "react";
import { useSafeState } from "./safe-server-hooks";

export const useCoordState = (
  initial: Pointish
): [Point, Dispatch<SetStateAction<Point>>] => {
  return useSafeState(Point.of(initial));
};
