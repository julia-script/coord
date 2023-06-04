import { CodeBlock, LiveCodeBlock } from "@/components/CodeBlock";
import { defaultThemes } from "@curves/graph";

export default function Page() {
  return (
    <>
      <h1>Graph</h1>
      <p>
        The Graph component by itself is pretty boring. It's just a container
        for the other components. It is also where the global definitions of
        your graph are set.
      </p>
      <h2>Controlling the Coordinate Box</h2>
      <p>
        The <code>coordBox</code> defines the visible area of the graph. This
        property defines a bounding box within the coordinate system of the
        graph that is guaranteed to be shown, regardless of the size or aspect
        ratio of the rendering viewport.
      </p>
      <p>
        The actual dimensions of the bounding box of the graph can be influenced
        by other properties. These include <code>padding</code>,{" "}
        <code>width</code>, and <code>height</code>.
      </p>
      <p>
        The <code>padding</code> property determines the amount of space in
        pixels that is added around the edges of the <code>coordBox</code>.
      </p>
      <p>
        The <code>width</code> and <code>height</code> properties specify the
        dimensions of the rendering viewport, they accept the same values as CSS{" "}
        <code>width</code> and <code>height</code> properties.
      </p>
      <LiveCodeBlock>{`
        import { Graph, Grid, Plot, Rect, Text, BoundingBox } from '@curves/graph'

        export default function MyGraph() {
          const top = 10;
          const right = 10;
          const bottom = -10;
          const left = -10;

          const coordBox = { 
            horizontal: [left, right],
            vertical: [top, bottom],
          };

          return (
            <Graph 
              coordBox={coordBox}
              height={300}
              width="100%"
              padding={15}
            >
              <Grid />
              <BoundingBox 
                bbox={coordBox}
                fillColor={"#00000066"}
                strokeDasharray={5}
              />
              <Text 
                position={[0, 0]}
                fontSize={18}
                color={0}
              >
                coordBox
              </Text>
            </Graph>
          );
        }
      `}</LiveCodeBlock>
      <h2>Controlling the Coordinate Step</h2>
      <p>
        The <code>coordStep</code> property defines the step size of the grid in
        the horizontal and vertical directions. The default value is 1 for both
        axes.
      </p>
      <p>
        Sometimes you want the horizontal axis to increment at a different rate
        than the vertical axis. This is where the <code>coordStep</code>{" "}
        property comes in.
      </p>
      <LiveCodeBlock>{`
        import { Graph, Grid, Plot, Rect, Text, BoundingBox, Plot } from '@curves/graph'

        export default function MyGraph() {
          const top = 0;
          const bottom = 10;
          const left = 0;
          const right = 1;
          

          const coordBox = { 
            horizontal: [left, right],
            vertical: [top, bottom],
          };

          return (
            <Graph 
              coordBox={coordBox}
              height={300}
              width="100%"
              padding={15}
              coordStep={[0.1, 1]}
            >
              <Grid />
              <BoundingBox 
                bbox={coordBox}
                opacity={0.2}
                strokeColor={'body'}
                strokeDasharray={5}
              />
              <Plot.Parametric 
                domain={[0, 1]}
                f={(t: number) => {
                  const x = t;
                  const y = Math.sin(t * 2 * Math.PI) + 5;
                  return [x, y];
                }}
              />
            </Graph>
          );
        }
      `}</LiveCodeBlock>
      <h2>Themes</h2>
      The theme prop is used to style and customize the appearance of your
      Graph. It can either accept the name of one of the predefined themes or a
      custom theme object.
      <h3>Predefined Themes</h3>
      {Object.keys(defaultThemes).map((theme) => (
        <div key={theme}>
          <pre>theme: "{theme}"</pre>
          <LiveCodeBlock collapsed>{`
            import { Graph, Grid, Text, BoundingBox,Line } from '@curves/graph'

            export default function MyGraph() {

              return (
                <Graph 
                  theme="${theme}"
                  height={300}
                  width="100%"
                  coordBox={{ horizontal: [-4, 4], vertical: [4, -4] }}
                >
                  <Grid />
                  <Line to={[0, 1]} strokeWidth={4} strokeColor={0} arrow />
                  <Line to={[1, 0]} strokeWidth={4} strokeColor={1} arrow />
                  <Line to={[1, 1]} strokeWidth={4} strokeColor={2} arrow />
                </Graph>
              );
            }
          `}</LiveCodeBlock>
        </div>
      ))}
      <h3>Custom Themes</h3>
      <p>
        You can also define a custom theme by passing an object to the theme
        prop. This object should conform to the Theme interface. Here's an
        example of a custom theme:
      </p>
      <CodeBlock>{`
        const customTheme: Theme = {
          background: "#f5f5f5",
          body: "#1c1e21",
          text: "#1c1e21",
          fontSize: 12,
          fontWeight: 400,
          fontFamily: "monospace",
          grid: {
            stepStrokeColor: "#d3d3d3",
            stepStrokeWidth: 1,
            maxStepSize: 100,
            axisStrokeColor: ["#797e86", "#797e86"],
            axisStrokeWidth: 3,
            labelsColor: ["#1c1e21", "#1c1e21"],
            labelsFontSize: 12,
          },
          palette: [
            "#FFB84C",
            "#5cb7b6",
            "#F16767",
            "#f1fa8c",
            "#50fa7b",
            "#bd93f9",
            "#8be9fd",
            "#ff79c6",
            "#ffb86c",
            "#ff5555",
            "#5af78e",
            "#94e1ea",
            "#a384e0",
            "#dfb267",
          ],
        };
      `}</CodeBlock>
    </>
  );
}
