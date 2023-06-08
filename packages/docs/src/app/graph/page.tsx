"use client";
import { LiveCodeBlock } from "@/components/CodeBlock";

import {
  Graph,
  Grid,
  LabelContainer,
  Line,
  Marker,
  Plot,
  Text,
  darkTheme,
  point,
  useNavigationState,
  useStopwatch,
  lerp,
} from "@coord/graph";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

const Hero = () => {
  const [coordBox, setCoordBox] = useNavigationState({
    horizontal: [-3, 3],
    vertical: [2, -2],
  });
  const [[a1, b1], setWave1] = useState([-3, -0.5]);
  const [[a2, b2], setWave2] = useState([0.7, 3.26]);
  const [interacted, setInteracted] = useState(false);
  const { t, pause } = useStopwatch({
    autoplay: true,
    repeat: true,
    duration: 15_000,
  });
  useLayoutEffect(() => {
    if (interacted) return;
    const tLoop = loopAnimation(t, 0, 1);
    setWave1([lerp(-3, -2, tLoop), lerp(-0.5, -1, tLoop)]);
    setWave2([lerp(0.7, 0, tLoop), lerp(3.26, 5, tLoop)]);
  }, [t]);

  useLayoutEffect(() => {
    if (!interacted) return;
    pause();
  }, [interacted, pause]);

  const waveF1 = (x: number) => Math.sin(((x - a1) * Math.PI * 2) / (b1 - a1));
  const waveF2 = (x: number) => Math.sin(((x - a2) * Math.PI * 2) / (b2 - a2));

  return (
    <Graph
      padding={20}
      className="bg-dark-950 max-h-[700px]"
      width="100%"
      height={"50vh"}
      coordBox={coordBox}
      onCoordBoxChange={setCoordBox}
      theme={{
        ...darkTheme,
        background: "transparent",
        grid: {
          ...darkTheme.grid,
          stepStrokeColor: "rgba(255,255,255,0.05)",
          axisStrokeColor: ["#4b5563", "#4b5563"],
          labelsColor: ["#4b5563", "#4b5563"],
          axisStrokeWidth: 1,
        },
      }}
    >
      <Grid displayAxis={false} displayNumbers={false} displayGrid={true} />

      <Plot.ofX
        f={waveF1}
        strokeColor={3}
        strokeWidth={2}
        strokeDasharray={"1 5"}
        opacity={0.8}
      />
      <Plot.ofX
        f={waveF2}
        strokeColor={2}
        strokeWidth={2}
        strokeDasharray={"1 5"}
        opacity={0.8}
      />

      <Plot.ofX f={(x) => waveF1(x) + waveF2(x)} strokeColor={1} />
      <Line from={[a1, 0]} to={[b1, 0]} strokeColor={3} />

      <Plot.ofX domain={[a1, b1]} f={waveF1} strokeColor={3} strokeWidth={2} />
      <Line from={[a2, 0]} to={[b2, 0]} strokeColor={2} />
      <Plot.ofX domain={[a2, b2]} f={waveF2} strokeColor={2} strokeWidth={2} />

      <Marker
        position={point(a1, 0)}
        color={3}
        onChange={({ x }) => {
          setInteracted(true);
          setWave1(([_, b]) => [x, b]);
        }}
      />
      <Marker
        position={point(b1, 0)}
        color={3}
        onChange={({ x }) => {
          setInteracted(true);
          setWave1(([a, _]) => [a, x]);
        }}
      />
      <Marker
        position={point(a2, 0)}
        color={2}
        onChange={({ x }) => {
          setInteracted(true);
          setWave2(([_, b]) => [x, b]);
        }}
      />
      <Marker
        position={point(b2, 0)}
        color={2}
        onChange={({ x }) => {
          setInteracted(true);
          setWave2(([a, _]) => [a, x]);
        }}
      />

      <LabelContainer
        className="transition-opacity duration-500"
        size={["90vs", "30vs"]}
        distance={120}
        target={[a2, 0]}
        targetOffset={40}
        strokeWidth={1}
        strokeDasharray={"2"}
        opacity={interacted ? 0 : 1}
      >
        <Text position={["45vs", "15vs"]} fontSize={14}>
          Drag me!
        </Text>
      </LabelContainer>
    </Graph>
  );
};
const easeInOut = (t: number) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

const loopAnimation = (t: number, start: number, end: number) => {
  const duration = end - start;
  if (t > 0.5) {
    return start + (1 - easeInOut((t - 0.5) * 2)) * duration;
  }
  return start + easeInOut(t * 2) * duration;
};
export default function Page() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto flex items-center flex-col -mt-32 px-4">
        <h1 className="text-2xl bg-dark-900/50 p-2 md:text-4xl font-bold text-dark-100 text-center">
          Visualize Math with <span className="text-red-400">Code</span>
        </h1>
        <h2 className="text-md md:text-xl bg-dark-900/70 font-mono  text-dark-100 text-center">
          <code>
            @coord/<span className="text-red-400">graph</span>
          </code>{" "}
          is Graphing React Component Library{" "}
        </h2>
        <div className="mt-8">
          <Link
            href="/graph/docs"
            className="bg-red-400 text-white px-4 py-2 rounded-md"
          >
            Get Started
          </Link>
        </div>
        <section className="py-12 gap-y-8 flex flex-col mt-32">
          {[
            {
              left: (
                <>
                  {" "}
                  <h3>Visual Math for React developers</h3>
                  <p>
                    Complex and abstract ideas often becomes easier to grasp
                    when you can visualize them.
                  </p>
                  <p>
                    Write equations in TypeScript, and watch them come to life
                    as interactive graphs.
                  </p>
                </>
              ),
              right: (
                <LiveCodeBlock>{`
                import { Graph, Grid, Plot } from "@coord/graph";

                export default function MyGraph() {
                  return (
                    <Graph padding={20} width="100%" height={300}>
                      <Grid />
                      <Plot.ofX 
                        f={(x) => Math.sin(x) * Math.exp(-x / 10)} 
                        strokeColor={8} 
                      />
                    </Graph>
                  );
                }
              `}</LiveCodeBlock>
              ),
            },
            {
              left: (
                <>
                  <h3>Learning and Teaching made interactive</h3>
                  <p>
                    Make your graphs interactive by adding markers, labels, and
                    animations.
                  </p>
                </>
              ),
              right: (
                <LiveCodeBlock
                  collapsed={true}
                  partiallyVisibleWhenCollapsed={true}
                >{`
                  import {
                    Graph,
                    Grid,
                    Plot,
                    Marker,
                    Point,
                    PolyLine,
                    LabelContainer,
                    Text,
                    useCoordState,
                    useNavigationState,
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
                    const [coordBox, setCoordBox] = useNavigationState();
                    const [p0, setP0] = useCoordState([-7, 0]);
                    const [p1, setP1] = useCoordState([-2, -8]);
                    const [p2, setP2] = useCoordState([2, 8]);
                    const [p3, setP3] = useCoordState([7, 0]);

                    return (
                      <>
                        <Graph
                          height={300}
                          width="100%"
                          coordBox={coordBox}
                          onCoordBoxChange={setCoordBox}
                        >
                          <Grid />
                          <PolyLine
                            points={[p0, p1, p2, p3]}
                            strokeColor={1}
                            strokeDasharray={2}
                          />
                          <Plot.Parametric
                            domain={[0, 1]}
                            f={(t) => cubicBezier(p0, p1, p2, p3, t)}
                            strokeColor={2}
                          />

                          <Marker position={p0} onChange={setP0} label={"P0"} />
                          <Marker position={p1} onChange={setP1} label={"P1"} />
                          <Marker position={p2} onChange={setP2} label={"P2"} />
                          <Marker position={p3} onChange={setP3} label={"P3"} />

                          <LabelContainer
                            size={["90vs", "30vs"]}
                            target={p0}
                            targetOffset={25}
                            strokeWidth={1}
                            strokeDasharray={"2"}
                          >
                            <Text position={["45vs", "15vs"]} fontSize={14}>
                              Drag me!
                            </Text>
                          </LabelContainer>
                        </Graph>
                      </>
                    );
                  }
              `}</LiveCodeBlock>
              ),
            },
          ].map(({ left, right }, i) => (
            <div key={i} className="grid md:grid-cols-[40%,60%] gap-8">
              <div className="prose prose-invert max-w-full text-center md:text-right">
                {left}
              </div>
              <div>{right}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
