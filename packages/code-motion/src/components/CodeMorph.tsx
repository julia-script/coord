import React from "react";
import { CodeBlockProps } from "..";
import { Token } from "@/code/types";
import {
  UncontrolledCodeMorph,
  UncontrolledCodeMorphProps,
} from "./UncontrolledCodeMorph";
import {
  ControlledCodeMorph,
  ControlledCodeMorphProps,
} from "./ControlledCodeMorph";

type CodeMorphProps =
  | UncontrolledCodeMorphProps
  | ControlledCodeMorphProps;

export function CodeMorph(props: CodeMorphProps) {
  if ("code" in props) {
    return <UncontrolledCodeMorph {...props} />;
  }
  return <ControlledCodeMorph {...props} />;
}
