import { ReactElement } from "react";
import { CodeBlock, LiveCodeBlock } from "@/components/CodeBlock";
import { Tabs } from "@/components/Tabs";

export default function Page() {
  return (
    <>
      <LiveCodeBlock collapsed>{`
        import { Graph, Grid, Plot } from '@curves/graph'

        export default function MyGraph() {
          return (
            <Graph height={300} width="100%">
              <Grid />
              <Plot.ofX f={(x) => Math.sin(x)} />
            </Graph>
          );
        }
      `}</LiveCodeBlock>

      <h1>Getting started</h1>
      <p>
        Graph is a React component library for building data visualizations on
        the web.
      </p>
      <h2>Installation</h2>

      <p>
        Graph is available as an npm package. To install it, run the following
        command:
      </p>
      <Tabs
        preferenceKey="installation"
        tabs={{
          npm: (
            <CodeBlock key={"npm"} language="bash">
              npm install @curves/graph
            </CodeBlock>
          ),
          pnpm: (
            <CodeBlock key={"pnpm"} language="bash">
              pnpm install @curves/graph
            </CodeBlock>
          ),
          yarn: (
            <CodeBlock key={"yarn"} language="bash">
              yarn add @curves/graph
            </CodeBlock>
          ),
        }}
      />

      <h2>Hello World!</h2>
      <p>The following example shows how to plot a sine wave.</p>

      <LiveCodeBlock>{`
        import { Graph, Grid, Plot } from '@curves/graph'

          export default function MyGraph() {
            return (
              <Graph width="100%">
                <Grid />
                <Plot.ofX 
                  f={(x) => Math.sin(x)} 
                  strokeColor={8} 
                />
              </Graph>
            );
          }
      `}</LiveCodeBlock>

      <h2>Examples</h2>
      <p>Checkout these others single function plotting examples</p>

      <Tabs
        tabs={Object.entries(visualizations).reduce((acc, [name, code]) => {
          acc[name] = <LiveCodeBlock>{code}</LiveCodeBlock>;
          return acc;
        }, {} as { [key: string]: ReactElement })}
      />
    </>
  );
}
const visualizations = {
  "Sin Wave": `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={(x) => Math.sin(x)} />
        </Graph>
      );
    }
  `,
  Circle: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.Parametric
            domain={[0, Math.PI * 2]}
            f={(t) => {
              const radius = 4;
              return [Math.cos(t) * radius, Math.sin(t) * radius];
            }}
            strokeColor={1}
          />
        </Graph>
      );
    }
  `,
  Log: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={Math.log} strokeColor={2} />
        </Graph>
      );
    }
  `,
  Spiral: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.Parametric
            domain={[0, Math.PI * 10]}
            f={(t) => {
              const radius = t;
              return [Math.cos(t) * radius, Math.sin(t) * radius];
            }}
            strokeColor={3}
          />
        </Graph>
      );
    }
  `,
  Parabola: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={(x) => Math.pow(x, 2)} strokeColor={4} />
        </Graph>
      );
    }
  `,
  Hyperbola: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={(x) => 1 / x} strokeColor={5} />
        </Graph>
      );
    }
  `,
  "Lissajous Curve": `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph 
          height={300} 
          width="100%"
          coordBox={{
            horizontal: [-2, 2],
            vertical: [2, -2],
          }}
        >
          <Grid />
          <Plot.Parametric
            domain={[0, Math.PI * 2]}
            f={(t) => {

              const a = 3;
              const b = 4;
              const delta = Math.PI / 2;
              return [Math.sin(a * t + delta), Math.sin(b * t)];
            }}
            strokeColor={6}
          />
        </Graph>
      );
    }
  `,
  Tangent: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={Math.tan} strokeColor={7} />
        </Graph>
      );
    }
  `,
  "Damped Sine Wave": `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={(x) => Math.sin(x) * Math.exp(-x / 10)} strokeColor={8} />
        </Graph>
      );
    }
  `,
  Cardioid: `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph 
          height={300} 
          width="100%"
          coordBox={{
            horizontal: [-2, 2],
            vertical: [2, -2],
          }}
        >
          <Grid />
          <Plot.Parametric
            domain={[0, Math.PI * 2]}
            f={(t) => {
              const a = 1;
              return [
                a * (1 - Math.cos(t)) * Math.cos(t),
                a * (1 - Math.cos(t)) * Math.sin(t),
              ];
            }}
            strokeColor={9}
          />
        </Graph>
      );
    }
  `,
  "Square Root": `
    import { Graph, Grid, Plot } from '@curves/graph'

    export default function MyGraph() {
      return (
        <Graph height={300} width="100%">
          <Grid />
          <Plot.ofX f={Math.sqrt} strokeColor={10} />
        </Graph>
      );
    }
  `,
};
