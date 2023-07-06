import { BBox, BBoxish } from "@/types";
import { normalizeBBox } from "@/utils";
import { useSafeState } from "@coord/core";
import { Dispatch, SetStateAction } from "react";

export const useNavigationState = (
  initialCoordBox: BBoxish = {
    horizontal: [-10, 10],
    vertical: [10, -10],
  }
): [BBox, Dispatch<SetStateAction<BBox>>] => {
  return useSafeState(
    normalizeBBox(initialCoordBox)
  );
};
