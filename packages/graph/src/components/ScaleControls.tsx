import React from "react";
import { GraphContext, withGraphContext } from "../utils";

const Component = ({
  scale,
  context,
}: {
  scale: (v: number) => void;
  context: GraphContext;
}) => {
  const { theme } = context;

  return (
    <g>
      <foreignObject
        x={context.viewspaceSize.x - 45}
        y={10}
        width={35}
        height={100}
      >
        <style>{`
                .graph-scale-controls {
                  display: flex;
                  flex-direction: column;
                  gap: 5px;
                }
                .graph-scale-controls-button {
                  width: 35px;
                  height: 35px;
                  border-radius: 5px;
                  border-style: solid;
                  border-width: 1px;
                  padding: 0;
                  background-color: ${theme.background};
                  border-color:  ${theme.body};
                  color: ${theme.body};
                  font-size: 20px;
                  cursor: pointer;
                  opacity: 0.8;
                }
                .graph-scale-controls-button:hover {
                  opacity: 1;
                }
            `}</style>
        <div className={"graph-scale-controls"}>
          <button
            className={"graph-scale-controls-button"}
            onClick={() => {
              scale(0.5);
            }}
          >
            +
          </button>
          <button
            className={"graph-scale-controls-button"}
            onClick={() => {
              scale(2);
            }}
          >
            -
          </button>
        </div>
      </foreignObject>
    </g>
  );
};

export const ScaleControls = withGraphContext(Component);
