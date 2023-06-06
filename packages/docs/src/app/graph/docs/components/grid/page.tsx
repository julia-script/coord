import { LiveCodeBlock } from "@/components/CodeBlock";

export default function Page() {
  return (
    <>
      <h1>Grid</h1>
      <p>
        The <code>Grid</code> component renders a Cartesian grid coordinate
        system.
      </p>
      <h2>Usage</h2>
      <p>
        Here is a basic usage of the <code>Grid</code> component:
      </p>
      <LiveCodeBlock>{`
        import { Graph, Grid, Plot } from '@coord/graph'

        export default function MyGraph() {
          return (
            <Graph height={400} width="100%">
              <Grid />
              <Plot.ofX f={(x) => Math.sin(x) * Math.exp(-x / 10)} strokeColor={2} />
            </Graph>
          );
        }
      `}</LiveCodeBlock>

      <h2>Props</h2>

      <ul>
        <li>
          <code>displayNumbers</code> (boolean, optional): If set to true,
          numbers will be displayed along the x and y axes. If not specified,
          the default value is <code>false</code>.
        </li>
        <li>
          <code>displayAxis</code> (boolean, optional): If set to true, the x
          and y axes will be displayed. If not specified, the default value is{" "}
          <code>false</code>.
        </li>
        <li>
          <code>displayGrid</code> (boolean, optional): If set to true, the grid
          will be displayed. If not specified, the default value is{" "}
          <code>false</code>.
        </li>
      </ul>
    </>
  );
}
