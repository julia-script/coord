"use client";
import { CodeBlock, LiveCodeBlock } from "@/components/CodeBlock";
import { Graph, Marker, useCoord } from "@coord/graph";

export default function Page() {
  const p0 = useCoord([0, 0]);
  const p1 = useCoord([1, 1]);
  const p2 = useCoord([2, 2]);
  return (
    <>
      <LiveCodeBlock collapsed>{`  
        import {
          Graph,
          Grid,
          Plot,
          Marker,
          Point,
          PolyLine,
          LabelContainer,
          Text,
          useCoord,
        } from "@coord/graph";

        const cubicBezier = (p0: Point, p1: Point, p2: Point, p3: Point, t: number) => {
          const u = 1 - t;
          const tt = t * t;
          const uu = u * u;
          const uuu = uu * u;
          const ttt = tt * t;

          const p = p0.scale(uuu);
          const q = p1.scale(3 * uu * t);
          const r = p2.scale(3 * u * tt);
          const s = p3.scale(ttt);

          return p.add(q).add(r).add(s);
        };

        export default function MyGraph() {
          const p0 = useCoord([-7, 0]);
          const p1 = useCoord([-2, -8]);
          const p2 = useCoord([2, 8]);
          const p3 = useCoord([7, 0]);

          return (
            <Graph height={400} width="100%">
              <Grid />
              <PolyLine
                points={[p0.position, p1.position, p2.position, p3.position]}
                strokeColor={1}
                strokeDasharray={2}
              />
              <Plot.Parametric
                domain={[0, 1]}
                f={(t) =>
                  cubicBezier(p0.position, p1.position, p2.position, p3.position, t)
                }
                strokeColor={2}
              />
            
              <Marker {...p0} label={"P0"} />
              <Marker {...p1} label={"P1"} />
              <Marker {...p2} label={"P2"} />
              <Marker {...p3} label={"P3"} />

              <LabelContainer
                size={["90vs", "30vs"]}
                target={p0.position}
                targetOffset={25}
                strokeWidth={1}
                strokeDasharray={"2"}
              >
                <Text 
                  position={["45vs", "15vs"]}
                  fontSize={14}
                >
                    {p0.isDragging ? '🔥👌' :'Drag me!'}
                </Text>
              </LabelContainer>
            </Graph>
          );
        }
      `}</LiveCodeBlock>
      <h1>Marker Component</h1>

      <h2>Description</h2>

      <p>
        The Marker component is a utility for placing labels or icons at
        specific positions on your graph.
      </p>

      <h2>Static Markers</h2>

      <p>
        Static markers have a fixed position on the graph, defined by
        coordinates passed to the <code>position</code> prop. They don't change
        position unless the <code>position</code> value changes.
      </p>

      <LiveCodeBlock>{`
        import { Graph, Grid, Marker, PolyLine, useCoord } from "@coord/graph";

        export default function MyGraph() {
          const p0 = [-4, -3];
          const p1 = [4, -3];
          const p2 = [0, 4];
          return (
            <Graph height={400} width="100%">
              <Grid />
              <PolyLine 
                points={[p0, p1, p2, p0]} 
                strokeColor={1} 
                strokeDasharray={5} 
              />
              <Marker position={p0} label={"🔒"} color={1}/>
              <Marker position={p1} label={"🔒"} color={1}/>
              <Marker position={p2} label={"🔒"} color={1}/>
            </Graph>
          );
        }
      `}</LiveCodeBlock>

      <h2>Controllable Markers with useCoord Hook</h2>

      <p>
        The <code>useCoord</code> hook is a utility for creating markers that
        can be dragged around the graph.
      </p>

      <p>
        It returns an object with the position and the events to be attached to
        the marker, so it can be used like this:
      </p>
      <CodeBlock>{`
        const point = useCoord([-4, -3]);

        ...

        <Marker {...point} label={"🔥"} />;
      `}</CodeBlock>

      <LiveCodeBlock>{`
        import { Graph, Grid, Marker, PolyLine, Text, useCoord } from "@coord/graph";

        export default function MyGraph() {
          const p0 = useCoord([-4, -3]);
          const p1 = useCoord([4, -3]);
          const p2 = useCoord([0, 4]);
          return (
            <Graph height={400} width="100%">
              <Grid />
              <PolyLine 
                points={[p0.position, p1.position, p2.position, p0.position]} 
                strokeColor={1} 
                strokeDasharray={5} 
                fill={"#00000088"}
              />
              <Marker {...p0} label={"🌚"} />
              <Marker {...p1} label={"🌝"} />
              <Marker {...p2} label={"🌞"} color={"body"}/>

              <Text 
                position={
                  p0.position
                    .add(p1.position)
                    .add(p2.position)
                    .scale(1/3)
                }
                fontSize={14}
              >
                Drag us!
              </Text>
            </Graph>
          );
        }
      `}</LiveCodeBlock>
    </>
  );
}
