import { raise } from "@coord/core";

export const routes = {
  graph: [
    {
      title: "Getting Started",
      children: [
        {
          title: "About",
          route: "graph/docs",
        },
        {
          title: "Installation",
          route: "graph/docs/installation",
        },
      ],
    },
    {
      title: "Components",
      children: [
        {
          title: "Graph",
          route: "graph/docs/components/graph",
        },
        {
          title: "Grid",
          route: "graph/docs/components/grid",
        },
        {
          title: "Marker",
          route: "graph/docs/components/marker",
        },
        {
          title: "Plot",
          route: "graph/docs/components/plot",
        },
        {
          title: "Line",
          route: "graph/docs/components/line",
        },
        {
          title: "PolyLine",
          route: "graph/docs/components/polyline",
        },
        {
          title: "Rect",
          route: "graph/docs/components/rect",
        },
        {
          title: "BoundingBox",
          route:
            "graph/docs/components/bounding-box",
        },
        {
          title: "Label",
          route: "graph/docs/components/label",
        },
        {
          title: "Text",
          route: "graph/docs/components/text",
        },
      ],
    },
    {
      title: "Interactions",
      children: [
        {
          title: "Navigation",
          route:
            "graph/docs/interactions/navigation",
        },
        {
          title: "Markers and Labels",
          route:
            "graph/docs/interactions/dragging-elements",
        },
      ],
    },
    {
      title: "interfaces",
      children: [
        {
          title: "Scalar Types",
          route:
            "graph/docs/interfaces/scalar-types",
        },
        {
          title: "Bounding Box",
          route:
            "graph/docs/interfaces/bounding-box",
        },
      ],
    },

    {
      title: "Demo",
      children: [
        {
          title:
            "Tutorial: Find intersection of two lines",

          route:
            "graph/docs/demo/find-intersection-of-two-lines",
        },
      ],
    },
  ],
  motion: [
    {
      title: "Getting Started",
      children: [
        {
          title: "About",
          route: "motion/docs",
        },
        {
          title: "Installation",
          route: "motion/docs/installation",
        },
      ],
    },
    {
      title: "State Animation",
      children: [
        {
          title: "What is it?",
          route:
            "motion/docs/state-animation/what-is-state-animation",
        },
        {
          title: "Make Scene",
          route:
            "motion/docs/state-animation/make-scene",
        },
        {
          title: "Make Movie",
          route:
            "motion/docs/state-animation/make-movie",
        },
      ],
    },
    {
      title: "State Controls",
      children: [
        {
          title: "Controlling State",
          route:
            "motion/docs/state-controls/state-controls",
        },
        {
          title: "Flow",
          route:
            "motion/docs/state-controls/animation-flow",
        },
        {
          title: "Tweening",
          route:
            "motion/docs/state-controls/tweening",
        },
        {
          title: "Spring",
          route:
            "motion/docs/state-controls/spring",
        },

        {
          title: "Number Control",
          route:
            "motion/docs/state-controls/number-state-control",
        },
        {
          title: "Point Control",
          route:
            "motion/docs/state-controls/point-state-control",
        },
        {
          title: "Transform Control",
          route:
            "motion/docs/state-controls/transform-state-control",
        },
        {
          title: "Color Control",
          route:
            "motion/docs/state-controls/color-state-control",
        },
        {
          title: "String Control",
          route:
            "motion/docs/state-controls/string-state-control",
        },
      ],
    },
    {
      title: "React",
      children: [
        {
          title: "Introduction",
          route: "motion/docs/react/introduction",
        },
        {
          title: "Hooks",
          route:
            "motion/docs/react/use-motion-controller",
        },
        {
          title: "Components",
          route: "motion/docs/react/player",
        },
        {
          title: "@coord/graph integration",
          route:
            "motion/docs/react/coord-graph-integration",
        },
      ],
    },
    {
      title: "Guides",
      children: [
        {
          title:
            "Not everything needs to be in state",
          route:
            "motion/docs/guides/not-everything-needs-to-be-in-state",
        },
      ],
    },
  ],
} as const;

function assertProjectKey(
  key: string
): asserts key is keyof typeof routes {
  if (key in routes === false) {
    throw new Error(`Project ${key} not found`);
  }
}
export const getRoutes = (project: string) => {
  assertProjectKey(project);
  return routes[project].map((section) => ({
    ...section,
    children: section.children.map((child) => ({
      ...child,
    })),
  }));
};
export type RouteItem = {
  title: string;
  route: string;
  sectionTitle: string;
  next: string | null;
  prev: string | null;
};
type RoutePath =
  (typeof routes)[keyof typeof routes][number]["children"][number]["route"];

export const routeMap = new Map<
  RoutePath,
  RouteItem
>();

for (const project in routes) {
  const projectRoutes =
    routes[project as keyof typeof routes];
  let prev: RouteItem | null = null;

  for (const section of projectRoutes) {
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
}
export const routePaths = [...routeMap.keys()];

export function assertRoute(
  route: string
): asserts route is RoutePath {
  if (!routeMap.has(route)) {
    throw new Error(
      `Route ${route} does not exist`
    );
  }
}

export function getRoute(
  route: string
): Omit<RouteItem, "component"> {
  assertRoute(route);
  return routeMap.get(route) ?? raise();
}
