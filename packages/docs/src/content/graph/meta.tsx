import { PageItem } from "@/components/navigation";
import { GoBook } from "react-icons/go";

export const header: PageItem[] = [
  {
    title: "Docs",
    icon: <GoBook />,
    route: "/graph/docs",
  },
];

export const sidebar: PageItem[] = [
  {
    title: "Getting Started",
    route: "/graph/docs",
    items: [
      {
        title: "Installation",
        route: "/graph/docs/installation",
      },
    ],
  },
  {
    title: "Components",
    route: "/graph/docs/components",
    isPage: false,
    items: [
      {
        title: "Graph",
        route: "/graph/docs/components/graph",
      },
      {
        title: "Grid",
        route: "/graph/docs/components/grid",
      },
      {
        title: "Marker",
        route: "/graph/docs/components/marker",
      },
      {
        title: "Plot",
        route: "/graph/docs/components/plot",
      },
      {
        title: "Line",
        route: "/graph/docs/components/line",
      },
      {
        title: "PolyLine",
        route: "/graph/docs/components/polyline",
      },
      {
        title: "Rect",
        route: "/graph/docs/components/rect",
      },
      {
        title: "BoundingBox",
        route: "/graph/docs/components/bounding-box",
      },
      {
        title: "Label",
        route: "/graph/docs/components/label",
      },
      {
        title: "Text",
        route: "/graph/docs/components/text",
      },
    ],
  },

  {
    title: "Interactions",
    route: "/graph/docs/interactions",
    isPage: false,
    items: [
      {
        title: "Navigation",
        route: "/graph/docs/interactions/navigation",
      },
      {
        title: "Markers and Labels",
        route: "/graph/docs/interactions/dragging-elements",
      },
    ],
  },
  {
    title: "interfaces",
    route: "/graph/docs/interfaces",
    isPage: false,
    items: [
      {
        title: "Scalar Types",
        route: "/graph/docs/interfaces/scalar-types",
      },
      {
        title: "Bounding Box",
        route: "/graph/docs/interfaces/bounding-box",
      },
    ],
  },
  {
    title: "Demo",
    route: "/graph/docs/demo",
    isPage: false,
    items: [
      {
        title: "Tutorial: Find intersection of two lines",
        route: "/graph/docs/demo/find-intersection-of-two-lines",
      },
    ],
  },
];
