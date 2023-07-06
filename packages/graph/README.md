# @coord/graph

The @coord/graph is a React Library that allows
you to create mathematical visualizations on the
web.

## Why use it?

I'm a big fans of tools like Desmos. However, I
also realize that moving your math logic from code
to a separate tool can sometimes be a hassle.

This library aims to solve this problem by
allowing developers to utilize the best of coding
and graphing tools in a single platform without
the extra hassle.

It's still a work in progress, but I'm excited to
share it with you and I hope you find it helpful!

Keep in mind that the API is still subject to
change.

## Installation

```bash
npm install @coord/graph
```

## Hello World

```tsx collapsed live
import {
  Graph,
  Grid,
  Plot,
  useNavigationState,
} from "@coord/graph";

export default function MyGraph() {
  const [coordBox, setCoordBox] =
    useNavigationState();

  return (
    <Graph
      coordBox={coordBox}
      onCoordBoxChange={setCoordBox}
      height={300}
      width="100%"
    >
      <Grid />
      <Plot.ofX f={(x) => Math.sin(x)} />
    </Graph>
  );
}
```

## Documentation

Check out the official @coord/graph page at
https://coord-docs.vercel.app/graph for more
details.
