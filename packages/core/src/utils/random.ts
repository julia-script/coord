export class Random {
  private _seed: number;
  private readonly _initialSeed: number;

  constructor(seed: number | string) {
    if (typeof seed === "string") {
      seed = this.fromString(seed);
    }
    this._seed = seed;
    this._initialSeed = seed;
  }

  public next(): number {
    // LCG parameters for Numerical Recipes
    const m = Math.pow(2, 32);
    const a = 1664525;
    const c = 1013904223;

    this._seed = (a * this._seed + c) % m;
    return this._seed / m;
  }

  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  public intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max));
  }

  public list(n: number, min: number = 0, max: number = 1): number[] {
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      result.push(this.range(min, max));
    }
    return result;
  }

  public reset(): void {
    this._seed = this._initialSeed;
  }

  public chance = (chance: number = 0.5): boolean => {
    return this.next() <= chance;
  };

  private fromString(str: string): number {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed += str.charCodeAt(i);
    }
    return seed;
  }
}
