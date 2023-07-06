import { point, Vec2, Vec2ish } from "./vec2";

export class Transform {
  _matrix: Mat3x3;
  constructor(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number
  ) {
    this._matrix = [a, b, tx, c, d, ty, 0, 0, 1];
  }
  static identity() {
    return new Transform(1, 0, 0, 1, 0, 0);
  }
  static fromTransform(transform: Transform) {
    return new Transform(
      transform._matrix[0],
      transform._matrix[1],
      transform._matrix[3],
      transform._matrix[4],
      transform._matrix[2],
      transform._matrix[5]
    );
  }
  static fromMatrix(matrix: Mat3x3) {
    return new Transform(
      matrix[0],
      matrix[1],
      matrix[3],
      matrix[4],
      matrix[2],
      matrix[5]
    );
  }

  getPosition() {
    return point(
      this._matrix[2],
      this._matrix[5]
    );
  }

  getRotation() {
    return Math.atan2(
      this._matrix[1],
      this._matrix[0]
    );
  }

  getScale() {
    return point(
      this._matrix[0],
      this._matrix[4]
    );
  }

  copy() {
    return Transform.fromMatrix(this._matrix);
  }
  setPosition(position: Vec2ish) {
    return this.copy().setPositionSelf(position);
  }
  setPositionSelf(position: Vec2ish) {
    const { x, y } = Vec2.of(position);
    const { _matrix } = this;
    _matrix[2] = x;
    _matrix[5] = y;
    return this;
  }

  setRotation(rotation: number) {
    return this.copy().setRotationSelf(rotation);
  }
  setRotationSelf(rotation: number) {
    const { _matrix } = this;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    _matrix[0] = cos;
    _matrix[1] = sin;
    _matrix[3] = -sin;
    _matrix[4] = cos;

    return this;
  }

  setScale(factor: Vec2ish | number) {
    return this.copy().setScaleSelf(factor);
  }
  setScaleSelf(factor: Vec2ish | number) {
    const { x, y } = Vec2.of(
      typeof factor === "number"
        ? [factor, factor]
        : factor
    );
    const { _matrix } = this;
    _matrix[0] = x;
    _matrix[4] = y;
    return this;
  }

  /*
   * Scale the transform by the given factor.
   */

  scale(factor: Vec2ish | number) {
    return this.copy().scaleSelf(factor);
  }

  scaleSelf(factor: Vec2ish | number) {
    const { x, y } = Vec2.of(
      typeof factor === "number"
        ? [factor, factor]
        : factor
    );
    const { _matrix } = this;
    _matrix[0] *= x;
    _matrix[1] *= x;
    _matrix[3] *= y;
    _matrix[4] *= y;
    return this;
  }
  scaleAboutOrigin(center: Vec2, factor: number) {
    return this.copy().scaleAboutOriginSelf(
      center,
      factor
    );
  }
  scaleAboutOriginSelf(
    center: Vec2,
    factor: number
  ) {
    const { x, y } = center;
    const { _matrix } = this;

    // Translate the center of scaling to origin
    _matrix[2] += x;
    _matrix[5] += y;

    // Scale the transform
    _matrix[0] *= factor;
    _matrix[1] *= factor;
    _matrix[3] *= factor;
    _matrix[4] *= factor;

    // Translate the center back to its original position, scaled
    _matrix[2] -= x * factor;
    _matrix[5] -= y * factor;

    return this;
  }

  translate(offset: Vec2ish) {
    return this.copy().translateSelf(offset);
  }

  translateSelf(offset: Vec2ish) {
    const { x, y } = Vec2.of(offset);
    const { _matrix } = this;
    _matrix[2] += x;
    _matrix[5] += y;
    return this;
  }

  rotate(angle: number) {
    return this.copy().rotateSelf(angle);
  }

  rotateSelf(angle: number) {
    const { _matrix } = this;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const [a, b, tx, c, d, ty] = _matrix;
    _matrix[0] = a * cos + c * sin;
    _matrix[1] = b * cos + d * sin;
    _matrix[2] = tx * cos + ty * sin;
    _matrix[3] = c * cos - a * sin;
    _matrix[4] = d * cos - b * sin;
    _matrix[5] = ty * cos - tx * sin;
    return this;
  }

  lerp(target: Transform, factor: number) {
    return this.copy().lerpSelf(target, factor);
  }
  lerpSelf(target: Transform, factor: number) {
    const { _matrix } = this;
    const [a, b, tx, c, d, ty] = _matrix;
    const [ta, tb, ttx, tc, td, tty] =
      target._matrix;
    _matrix[0] = a + (ta - a) * factor;
    _matrix[1] = b + (tb - b) * factor;
    _matrix[2] = tx + (ttx - tx) * factor;
    _matrix[3] = c + (tc - c) * factor;
    _matrix[4] = d + (td - d) * factor;
    _matrix[5] = ty + (tty - ty) * factor;
    return this;
  }
  invert() {
    return this.copy().invertSelf();
  }
  invertSelf() {
    const { _matrix } = this;
    const [a, b, tx, c, d, ty] = _matrix;
    const det = a * d - b * c;
    _matrix[0] = d / det;
    _matrix[1] = -b / det;
    _matrix[2] = (b * ty - d * tx) / det;
    _matrix[3] = -c / det;
    _matrix[4] = a / det;
    _matrix[5] = (c * tx - a * ty) / det;
    return this;
  }
  applyTo(p: Vec2) {
    const { x, y } = p;
    const { _matrix } = this;
    const [a, b, tx, c, d, ty] = _matrix;

    return point(
      a * x + c * y + tx,
      b * x + d * y + ty
    );
  }

  applyInverseTo(p: Vec2) {
    const { x, y } = p;
    const { _matrix } = this;
    const [a, b, tx, c, d, ty] = _matrix;
    const det = a * d - b * c;

    return point(
      (d * (x - tx) - c * (y - ty)) / det,
      (a * (y - ty) - b * (x - tx)) / det
    );
  }
  toCss() {
    const [a, b, tx, c, d, ty] = this._matrix;
    // matrix(scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY())
    return `matrix(${[a, c, b, d, tx, ty].join(
      ","
    )})`;
  }
}
export function transform(): Transform;
export function transform(
  a: number,
  b: number,
  c: number,
  d: number,
  tx: number,
  ty: number
): Transform;

export function transform(
  a = 1,
  b = 0,
  c = 0,
  d = 1,
  tx = 0,
  ty = 0
) {
  return new Transform(a, b, c, d, tx, ty);
}
// prettier-ignore
type Mat3x3 = [
  a: number, b: number, tx: number,
  c: number, d: number, ty: number,
  _: number, __: number, ___: number
];
