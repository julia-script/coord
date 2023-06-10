import { Graph, Plot } from "@coord/graph";

export const GraphLogo = ({
  size = 400,
  globalMultiplier = 1,
}: {
  size?: number;
  globalMultiplier?: number;
}) => {
  const PI2 = Math.PI * 2;
  const [a1, b1, a2, b2] = [PI2 * 0.04, PI2 * 1, PI2 * 0.27, PI2 * 0.93];
  const dashMultiplier = size / 400;
  const dasharray = [15 * dashMultiplier, 20 * dashMultiplier];
  const domain: [number, number] = [-3, 3];
  const f = (x: number, a: number, b: number) =>
    Math.sin(((x - a) * Math.PI * 2) / (b - a));
  return (
    <Graph
      coordBox={[-2.5, 2.5, 2.5, -2.5]}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Plot.ofX
        domain={domain}
        f={(x) => f(x, a1, b1)}
        strokeColor={0}
        strokeWidth={`${0.12 * globalMultiplier}cs`}
        strokeDasharray={dasharray.map((v) => v + "px").join(" ")}
      />
      <Plot.ofX
        domain={domain}
        f={(x) => f(x, a2, b2)}
        strokeColor={2}
        strokeWidth={`${0.12 * globalMultiplier}cs`}
        strokeDasharray={dasharray.map((v) => v + "px").join(" ")}
      />
      <Plot.ofX
        domain={domain}
        f={(x) => f(x, a1, b1) + f(x, a2, b2)}
        strokeColor={1}
        strokeWidth={`${0.3 * globalMultiplier}cs`}
      />
    </Graph>
  );
};
