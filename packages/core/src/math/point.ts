export type Pointish = Point | [number, number] | { x: number; y: number };
export class Point {
  constructor(public x: number, public y: number) {}
  static fromPointish(pointish: Pointish) {
    if (pointish instanceof Point) {
      return pointish;
    }
    if (Array.isArray(pointish)) {
      return point(pointish[0], pointish[1]);
    }
    return point(pointish.x, pointish.y);
  }
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  clone() {
    return point(this.x, this.y);
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }
  isNaN() {
    return Number.isNaN(this.x) || Number.isNaN(this.y);
  }

  lerp(target: Point, t: number) {
    return point(
      this.x + (target.x - this.x) * t,
      this.y + (target.y - this.y) * t
    );
  }
  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return point(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  angleTo(target: Point) {
    return this.angle() - target.angle();
  }

  squaredDistanceTo(target: Point) {
    return target.sub(this).lengthSquared();
  }
  distanceTo(target: Point) {
    return target.sub(this).length();
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }
  sub(target: Point) {
    return point(this.x - target.x, this.y - target.y);
  }
  add(target: Point) {
    return point(this.x + target.x, this.y + target.y);
  }
  mul(target: Point) {
    return point(this.x * target.x, this.y * target.y);
  }
  div(target: Point) {
    return point(this.x / target.x, this.y / target.y);
  }

  scale(factor: number) {
    return point(this.x * factor, this.y * factor);
  }
  abs() {
    return point(Math.abs(this.x), Math.abs(this.y));
  }
}

export function point(x: number, y: number) {
  return new Point(x, y);
}
