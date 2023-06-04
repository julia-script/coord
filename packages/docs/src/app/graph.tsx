"use client";

import { useState } from "react";

export * from "@curves/graph";

type NumberProperties = "number" | "range";
type InputTypes = NumberProperties | "boolean";
type Control = {
  input: InputTypes;
};

type PropertiesControls = {
  [key: string]: Control;
};

type InferProperties<T extends PropertiesControls> = {
  [K in keyof T]: T[K]["input"] extends NumberProperties ? number : boolean;
};
export function GraphControls<T extends PropertiesControls>({
  properties,
  children,
}: {
  properties: T;
  children: (properties: InferProperties<T>) => React.ReactNode;
}) {
  const [state, setState] = useState<InferProperties<T>>(() => {
    return Object.keys(properties).reduce((acc, key) => {
      const input = properties[key].input;

      return {
        ...acc,
        [key]: properties[key].input === "boolean" ? false : 0,
      };
    }, {} as InferProperties<T>);
  });
  return (
    <div>
      {children(state)}{" "}
      <div>
        {Object.keys(properties).map((key) => {
          const input = properties[key].input;
          return (
            <div>
              <label>{key}</label>
              {input === "boolean" ? (
                <input
                  type="checkbox"
                  checked={state[key] as boolean}
                  onChange={(e) => {
                    setState((state) => ({
                      ...state,
                      [key]: e.target.checked,
                    }));
                  }}
                />
              ) : (
                <input
                  type="number"
                  value={state[key] as number}
                  onChange={(e) => {
                    setState((state) => ({
                      ...state,
                      [key]: Number(e.target.value),
                    }));
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
