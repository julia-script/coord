export const routes = [
  {
    title: "Getting Started",
    children: [
      {
        title: "About",
        route: "/",
        component: import("./about.mdx"),
      },
      {
        title: "Installation",
        route: "/getting-started",
        component: import("./getting-started.mdx"),
      },
    ],
  },
  {
    title: "Components",
    children: [
      {
        title: "Graph",
        route: "/components/graph",
        component: import("./components/graph.mdx"),
      },
      {
        title: "Grid",
        route: "/components/grid",
        component: import("./components/grid.mdx"),
      },
      {
        title: "Marker",
        route: "/components/marker",
        component: import("./components/marker.mdx"),
      },
      {
        title: "Plot",
        route: "/components/plot",
        component: import("./components/plot.mdx"),
      },
      {
        title: "Line",
        route: "/components/line",
        component: import("./components/line.mdx"),
      },
      {
        title: "PolyLine",
        route: "/components/polyline",
        component: import("./components/polyline.mdx"),
      },
      {
        title: "Rect",
        route: "/components/rect",
        component: import("./components/rect.mdx"),
      },
      {
        title: "BoundingBox",
        route: "/components/bounding-box",
        component: import("./components/bounding-box.mdx"),
      },
      {
        title: "Label",
        route: "/components/label",
        component: import("./components/label.mdx"),
      },
      {
        title: "Text",
        route: "/components/text",
        component: import("./components/text.mdx"),
      },
    ],
  },
] as const;

type RouteItem = {
  title: string;
  route: string;
  component: Promise<typeof import("*.mdx")>;
};
type RoutePath = (typeof routes)[number]["children"][number]["route"];

export const routeMap = new Map<RoutePath, RouteItem>();

for (const section of routes) {
  for (const child of section.children) {
    routeMap.set(child.route, child);
  }
}
export const routePaths = [...routeMap.keys()];

export function assertRoute(route: string): asserts route is RoutePath {
  if (!routeMap.has(route)) {
    throw new Error(`Route ${route} does not exist`);
  }
}

export function getRoute(route: string) {
  assertRoute(route);
  return routeMap.get(route)!;
}
