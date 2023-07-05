import {
  Random,
  Vec2,
  point,
  transform,
} from "@coord/core";

type CameraShakeConfig = {
  timeFactor?: number;
  waveCount?: number;
  seed?: number;
};

const SCALE_FACTOR = 0.001;
const MAX_ROTATION = Math.PI / 1000;

export const makeCameraShake = (
  config: CameraShakeConfig = {}
) => {
  const {
    timeFactor = 1,
    seed = 0,
    waveCount = 4,
  } = config;
  const random = new Random(seed);
  const xWaves = random.list(
    waveCount,
    100,
    1000
  );
  const yWaves = random.list(
    waveCount,
    100,
    1000
  );
  const scaleWaves = random.list(
    waveCount,
    100,
    1000
  );
  const phases = random.list(waveCount, 0, 0.5);
  return (t: number, intensity = 1) => {
    let x = 0;
    let y = 0;
    let rot = 0;
    let scale = 0;
    t *= timeFactor;
    for (let i = 0; i < waveCount; i++) {
      const xWave = xWaves[i]!;
      const yWave = yWaves[i]!;
      const scaleWave = scaleWaves[i]!;
      const phase = phases[i]!;

      x += Math.sin(
        ((t + xWave * phase) / xWave) *
          Math.PI *
          2
      );
      y += Math.cos(
        ((t + yWave * phase) / yWave) *
          Math.PI *
          2
      );

      scale += Math.sin(
        ((t + scaleWave * phase) / scaleWave) *
          Math.PI *
          2
      );
    }
    x /= waveCount;
    y /= waveCount;
    scale /= waveCount;
    rot = y;

    rot *= MAX_ROTATION * intensity;
    scale = 1 + scale * SCALE_FACTOR * intensity;
    const out = transform();

    out.translateSelf(
      point(x, y).scale(intensity)
    );
    out.scaleSelf(scale);
    out.rotateSelf(rot);
    return out;
  };
};

export const cameraShake = makeCameraShake();
