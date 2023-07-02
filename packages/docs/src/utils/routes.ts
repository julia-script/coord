import { PageItem } from "@/components/navigation";
import * as graph from "@/content/graph/meta";
import * as motion from "@/content/motion/meta";

const allRoutes: PageItem[][] = [
  [
    { title: "Graph", route: "/graph", layout: "full" },
    { title: "Motion", route: "/motion", layout: "full" },
    { title: "Editor", route: "/editor", layout: "full" },
  ],
  graph.sidebar,
  motion.sidebar,
];

export const getProjectRoutes = (route: string) => {
  if (route === "/graph") return graph;
  if (route === "/motion") return motion;
  return {
    sidebar: [],
    header: [],
  };
};

export const normalizeRoute = (route: string) => {
  return "/" + route.split("/").filter(Boolean).join("/");
};
export type RouteSummary = Pick<PageItem, "title" | "route" | "isPage">;
export type RouteInfo = {
  item: PageItem;
  previous: RouteSummary | null;
  next: RouteSummary | null;
  breadcrumbs: RouteSummary[];
  layout: "full" | "default";
};
export const mapRoutesToHref = (items: PageItem[][]) => {
  const map: Record<string, RouteInfo> = {};
  let prev: RouteInfo | null = null;

  const traverse = (items: PageItem[], path: RouteSummary[]) => {
    for (const item of items) {
      const summary = {
        title: item.title,
        route: item.route,
        isPage: item.isPage ?? true,
      };
      const current: RouteInfo = {
        item,
        previous: prev
          ? {
              title: prev.item.title,
              route: prev.item.route,
              isPage: item.isPage ?? true,
            }
          : null,
        next: null,
        breadcrumbs: [...path, summary],
        layout: item.layout ?? "default",
      };
      map[normalizeRoute(item.route)] = current;

      if (summary.isPage) {
        if (prev) prev.next = summary;
        prev = current;
      }
      if (item.items) {
        traverse(item.items, current.breadcrumbs);
      }
    }
  };

  for (const item of items) {
    prev = null;
    traverse(item, []);
  }

  return map;
};

const routeMap = mapRoutesToHref(allRoutes);

export const getRouteInfo = (route: string) => {
  const normalized = normalizeRoute(route);
  if (!routeMap[normalized]) {
    throw new Error(`Route ${route} does not exist`);
  }
  return routeMap[normalized];
};
