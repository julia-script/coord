import { BBox, BBoxish, normalizeBBox } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { useSafeState } from "./safe-server-hooks";

export const useNavigationState = (
  initialCoordBox: BBoxish = { horizontal: [-10, 10], vertical: [10, -10] }
): [BBox, Dispatch<SetStateAction<BBox>>] => {
  return useSafeState(normalizeBBox(initialCoordBox));
};
