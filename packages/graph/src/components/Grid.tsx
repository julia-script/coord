import React from "react";
import { point, useSafeId } from "@coord/core";
import {
  renderNumber,
  GraphElement,
  withGraphContext,
  calcStepGridMultiplier,
} from "@/utils";

const range = (
  start: number,
  end: number,
  step: number
) => {
  const [rangeStart, rangeEnd] = [
    start,
    end,
  ].sort((a, b) => a - b) as [number, number];
  const result = [];
  for (
    let i = rangeStart;
    i <= rangeEnd;
    i += step
  ) {
    result.push(i);
  }
  return result;
};

export type GridProps = GraphElement<{
  displayNumbers?: boolean;
  displayAxis?: boolean;
  displayGrid?: boolean;
}>;

const originRotation = point(
  -Math.cos(Math.PI / 4),
  Math.sin(Math.PI / 4)
);

const Component = ({
  displayNumbers = true,
  displayAxis = true,
  displayGrid = true,
  context,
}: GridProps) => {
  const gridPatternId = useSafeId("grid-pattern");

  const {
    projectCoord,
    projectAbsoluteSize,
    coordStep,
    coordBox,
    theme,
  } = context;

  const unitVectorSize = projectAbsoluteSize([
    1, 1,
  ]);
  const stepSize = Math.min(
    Math.abs(unitVectorSize.x),
    Math.abs(unitVectorSize.y)
  );
  const multiplier = calcStepGridMultiplier(
    stepSize,
    theme.gridMaxStepSize
  );
  const viewSpaceStepSize =
    projectAbsoluteSize(stepSize, "viewspace") *
    multiplier;
  const origin = projectCoord([0, 0]);

  return (
    <g
      pointerEvents={"none"}
      style={{
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {displayGrid && (
        <g>
          <defs>
            <pattern
              x={renderNumber(origin.x)}
              y={renderNumber(origin.y)}
              id={gridPatternId}
              width={renderNumber(
                viewSpaceStepSize
              )}
              height={renderNumber(
                viewSpaceStepSize
              )}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={renderNumber(
                  viewSpaceStepSize
                )}
                height={renderNumber(
                  viewSpaceStepSize
                )}
                {...theme.gridStep}
                fill="none"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${gridPatternId})`}
          />
        </g>
      )}

      {displayAxis && (
        <>
          <line
            x1={renderNumber(origin.x)}
            x2={renderNumber(origin.x)}
            y1={"0%"}
            y2={"100%"}
            {...theme.gridAxis}
          />
          <line
            x1={"0%"}
            x2={"100%"}
            y1={renderNumber(origin.y)}
            y2={renderNumber(origin.y)}
            {...theme.gridAxis}
          />
        </>
      )}

      {displayNumbers &&
        range(
          Math.round(
            coordBox.horizontal.x /
              (coordStep.x * multiplier)
          ) *
            (coordStep.x * multiplier),
          Math.round(
            coordBox.horizontal.y /
              (coordStep.x * multiplier)
          ) *
            (coordStep.x * multiplier),
          coordStep.x * multiplier
        ).map((stepX) => {
          const { x, y } = projectCoord([
            stepX,
            0,
          ]);
          const isOrigin =
            renderNumber(stepX) === "0";
          return (
            <g
              key={stepX}
              transform={`translate(${renderNumber(
                x
              )} ${y})`}
            >
              <line
                x2={
                  isOrigin
                    ? originRotation.x * 6
                    : 0
                }
                y2={
                  isOrigin
                    ? originRotation.y * 6
                    : 6
                }
                x1={0}
                y1={0}
                {...theme.gridAxis}
              />
              <text
                x={
                  isOrigin
                    ? originRotation.x * 14
                    : 0
                }
                y={
                  isOrigin
                    ? originRotation.y * 14
                    : 14
                }
                textAnchor={
                  stepX === 0 ? "end" : "middle"
                }
                dominantBaseline={"hanging"}
                {...theme.gridLabels}
              >
                {renderNumber(stepX)}
              </text>
            </g>
          );
        })}
      {displayNumbers &&
        range(
          Math.round(
            coordBox.vertical.x /
              (coordStep.y * multiplier)
          ) *
            (coordStep.y * multiplier),
          Math.round(
            coordBox.vertical.y /
              (coordStep.y * multiplier)
          ) *
            (coordStep.y * multiplier),
          coordStep.y * multiplier
        ).map((stepY) => {
          if (stepY === 0) return null;
          const { x, y } = projectCoord([
            0,
            stepY,
          ]);

          return (
            <g
              key={stepY}
              transform={`translate(${x} ${renderNumber(
                y
              )})`}
            >
              <line
                x1={0}
                y1={0}
                x2={-6}
                y2={0}
                {...theme.gridAxis}
              />
              <text
                x={-14}
                y={0}
                textAnchor="end"
                dominantBaseline={"middle"}
                {...theme.gridLabels}
              >
                {renderNumber(stepY)}
              </text>
            </g>
          );
        })}
    </g>
  );
};

export const Grid = withGraphContext(Component);
