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

const waveF = (a: number, b: number) => (x: number) =>
  Math.sin(((x - a) * Math.PI * 2) / (b - a));

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
    duration: 30_000,
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
        background: { fill: "transparent" },
      }}
    >
      <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur result="blurred" stdDeviation="15"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blurred"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <Grid displayAxis={false} displayNumbers={false} displayGrid={true} />

      {/* First wave */}
      <Plot.ofX
        f={waveF(a1, b1)}
        strokeColor={3}
        strokeWidth={2}
        strokeDasharray={"1 5"}
        opacity={0.8}
      />

      <Plot.ofX
        domain={[a1, b1]}
        f={waveF(a1, b1)}
        strokeColor={3}
        strokeWidth={2}
      />
      <Line from={[a1, 0]} to={[b1, 0]} strokeColor={3} />

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

      {/* Second wave */}

      <Plot.ofX
        f={waveF(a2, b2)}
        strokeColor={2}
        strokeWidth={2}
        strokeDasharray={"1 5"}
        opacity={0.8}
      />
      <Line from={[a2, 0]} to={[b2, 0]} strokeColor={2} />

      <Plot.ofX
        domain={[a2, b2]}
        f={waveF(a2, b2)}
        strokeColor={2}
        strokeWidth={2}
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
      {/* Sum of the waves */}
      <Plot.ofX
        f={(x) => waveF(a1, b1)(x) + waveF(a2, b2)(x)}
        strokeColor={1}
        filter="url(#neon)"
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
        filter="url(#neon)"
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
      <div className="from-dark-950/0 to-dark-950/100 pointer-events-none  relative mx-auto -mt-32 bg-gradient-to-b  px-4 text-center">
        <h1 className=" text-dark-100 p-2 text-center text-2xl font-bold md:text-4xl">
          Visualize Math with{" "}
          <span className="text-accent-graph-400">Code</span>
        </h1>
        <h2 className="text-md  text-dark-100 text-center  font-mono md:text-xl">
          <code>
            @coord/<span className="text-accent-graph-400">graph</span>
          </code>{" "}
          is Graphing React Library{" "}
        </h2>
        <div className="mt-8">
          <Link
            href="/graph/docs"
            className="bg-accent-graph-400 pointer-events-auto rounded-md px-6 py-3 text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="container mx-auto flex flex-col items-center  px-4">
        <section className="flex flex-col gap-y-8 py-12 md:mt-16">
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
                    Vec2,
                    PolyLine,
                    LabelContainer,
                    Text,
                    useCoordState,
                    useNavigationState,
                  } from "@coord/graph";

                  const cubicBezier = (p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number) => {
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
            <div key={i} className="grid gap-8 md:grid-cols-[40%,60%]">
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
