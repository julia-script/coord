"use client";
import {
  Graph,
  Grid,
  Marker,
  Plot,
  Text,
  Transform,
  Vec2,
  point,
  transform,
} from "@coord/graph";
import {
  controlColor,
  all,
  controlTransform,
  makeScene,
  makeMovie,
  controlString,
  repeat,
  chain,
  wait,
  controlNumber,
} from "@coord/motion";
import {
  useMotionController,
  MotionPlayerControls,
  MotionPlayer,
} from "@coord/motion-react";

const blink = (t: number, blinkDuration = 0.5) => {
  const blink = Math.floor(t / (blinkDuration * 1000)) % 2;
  return blink === 1;
};
const cameraShake = (intensity: number = 1, tFactor = 1) => {
  const waveLengths = [2.3, 1.5, 1.2, 1.1, 1.05, 1.01, 1.001];

  return (t: number): Vec2 => {
    let x = 0;
    let y = 0;
    t *= tFactor;
    for (let i = 0; i < waveLengths.length; i++) {
      const waveLength = waveLengths[i];
      const sinWave = Math.sin(t * waveLength * Math.PI * 2);
      const cosWave = Math.cos(t * waveLength * Math.PI * 2);
      x += sinWave * intensity;
      y += cosWave * intensity;
    }

    x /= waveLengths.length;
    y /= waveLengths.length;
    return point(x, y);
  };
};

const shake = cameraShake(1, 0.001);
const sceneA = makeScene(
  "Scene A",
  {
    color: "#ffffff",

    text: "",
  },
  function* () {
    const text = yield* controlString("text");

    yield* chain(
      wait(1),
      text.to("Hi").in(0.3),
      wait(1),
      text.to(", my name is Julia").in(0.6, "append"),
      wait(1.5),
      text.to("I'm a software engineer").in(0.6, "shuffle"),
      wait(2),
      text.clear(0.5),
      wait(1)
    );
  }
);
export default function Page() {
  const controls = useMotionController(
    makeMovie("Finding the intersection of two lines", {
      sceneA: sceneA,
      sceneB: sceneA,
    }),
    {
      fps: 60,
    }
  );

  const { sceneA: state } = controls.state;

  return (
    <div className="flex flex-col">
      <div className="container mx-auto">
        <pre>{JSON.stringify(controls.meta, null, 2)}</pre>

        <MotionPlayer controls={controls} autoplay>
          <div className="flex aspect-video w-full flex-col justify-center  bg-gray-300">
            <pre className="p-10 text-[3em] text-pink-700">
              {state.text}
              {blink(controls.currentTime) ? "|" : ""}
            </pre>
          </div>
          {/* <Graph width="100%">
            <g
              style={{
                transform: `translate(${shake(controls.currentTime).x}px, ${
                  shake(controls.currentTime).y
                }px)`,
              }}
            >
              <Text position={[0, 0]} textAnchor={"start"} fontSize={"1cs"}>
                {state.text}
                {blink(controls.currentTime) ? "|" : ""}
              </Text>
            </g>
          </Graph> */}
        </MotionPlayer>
      </div>
    </div>
  );
}
