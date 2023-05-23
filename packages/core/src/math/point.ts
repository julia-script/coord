export class Point {
  constructor(public x: number, public y: number) {}
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  clone() {
    return point(this.x, this.y);
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
  scale(factor: number) {
    return point(this.x * factor, this.y * factor);
  }
}

export function point(x: number, y: number) {
  return new Point(x, y);
}
