export const routes = [
  {
    title: "🚀 Getting Started",
    children: [
      {
        title: "About",
        route: "graph/docs",
        file: "about.mdx",
        component: import("./about.mdx"),
      },
      {
        title: "Installation",
        route: "graph/docs/getting-started",
        component: import("./getting-started.mdx"),
        file: "getting-started.mdx",
      },
    ],
  },
  {
    title: "🧩 Components",
    children: [
      {
        title: "Graph",
        route: "graph/docs/components/graph",
        file: "components/graph.mdx",
        component: import("./components/graph.mdx"),
      },
      {
        title: "Grid",
        route: "graph/docs/components/grid",
        file: "components/grid.mdx",
        component: import("./components/grid.mdx"),
      },
      {
        title: "Marker",
        route: "graph/docs/components/marker",
        file: "components/marker.mdx",
        component: import("./components/marker.mdx"),
      },
      {
        title: "Plot",
        route: "graph/docs/components/plot",
        file: "components/plot.mdx",
        component: import("./components/plot.mdx"),
      },
      {
        title: "Line",
        route: "graph/docs/components/line",
        file: "components/line.mdx",
        component: import("./components/line.mdx"),
      },
      {
        title: "PolyLine",
        route: "graph/docs/components/polyline",
        file: "components/polyline.mdx",
        component: import("./components/polyline.mdx"),
      },
      {
        title: "Rect",
        route: "graph/docs/components/rect",
        file: "components/rect.mdx",
        component: import("./components/rect.mdx"),
      },
      {
        title: "BoundingBox",
        route: "graph/docs/components/bounding-box",
        file: "components/bounding-box.mdx",
        component: import("./components/bounding-box.mdx"),
      },
      {
        title: "Label",
        route: "graph/docs/components/label",
        file: "components/label.mdx",
        component: import("./components/label.mdx"),
      },
      {
        title: "Text",
        route: "graph/docs/components/text",
        file: "components/text.mdx",
        component: import("./components/text.mdx"),
      },
    ],
  },
  {
    title: "🕹️ Interactions",
    children: [
      {
        title: "Navigation",
        route: "graph/docs/interactions/navigation",
        file: "interactions/navigation.mdx",
        component: import("./interactions/navigation.mdx"),
      },
      {
        title: "Markers and Labels",
        route: "graph/docs/interactions/dragging-elements",
        file: "interactions/dragging-elements.mdx",
        component: import("./interactions/dragging-elements.mdx"),
      },
    ],
  },
  {
    title: "📦 interfaces",
    children: [
      {
        title: "Scalar Types",
        route: "graph/docs/interfaces/scalar-types",
        file: "interfaces/scalar-types.mdx",
        component: import("./interfaces/scalar-types.mdx"),
      },
      {
        title: "Bounding Box",
        route: "graph/docs/interfaces/bounding-box",
        file: "interfaces/bounding-box.mdx",
        component: import("./interfaces/bounding-box.mdx"),
      },
    ],
  },
  // {
  //   title: "📚 Guides",

  //   children: [
  //     {
  //       title: "Server Components",
  //       route: "graph/docs/guides/server-components",
  //       file: "guides/server-components.mdx",
  //       component: import("./guides/server-components.mdx"),
  //     },
  //     {
  //       title: "Known Issues",
  //       route: "graph/docs/guides/known-issues",
  //       file: "guides/known-issues.mdx",
  //       component: import("./guides/known-issues.mdx"),
  //     },
  //   ],
  // },

  {
    title: "📚 Demo",
    children: [
      {
        title: "Tutorial: Find intersection of two lines",

        route: "graph/docs/demo/find-intersection-of-two-lines",
        file: "demo/find-intersection-of-two-lines.mdx",
        component: import("./demo/find-intersection-of-two-lines.mdx"),
      },
    ],
  },
] as const;
export const getRoutes = () => {
  return routes.map((section) => ({
    ...section,
    children: section.children.map((child) => ({
      ...child,
      component: null,
    })),
  }));
};
export type RouteItem = {
  title: string;
  route: string;
  sectionTitle: string;
  file: string;
  next: string | null;
  prev: string | null;
  component: Promise<typeof import("*.mdx")>;
};
type RoutePath = (typeof routes)[number]["children"][number]["route"];

export const routeMap = new Map<RoutePath, RouteItem>();
let prev: RouteItem | null = null;

for (const section of routes) {
  for (const child of section.children) {
    const current: RouteItem = {
      ...child,
      sectionTitle: section.title,
      prev: prev?.route ?? null,
      next: null,
    };
    routeMap.set(child.route, current);
    if (prev) {
      prev.next = current.route;
    }

    prev = current;
  }
}

export const routePaths = [...routeMap.keys()];

export function assertRoute(route: string): asserts route is RoutePath {
  if (!routeMap.has(route)) {
    throw new Error(`Route ${route} does not exist`);
  }
}

export function getRouteComponent(route: string) {
  assertRoute(route);
  route;

  return routeMap.get(route)!.component;
}

export function getRoute(route: string): Omit<RouteItem, "component"> {
  assertRoute(route);
  const { component, ...rest } = routeMap.get(route)!;
  return rest;
}
