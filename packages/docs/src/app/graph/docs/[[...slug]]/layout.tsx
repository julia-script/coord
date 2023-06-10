import { Sidebar } from "@/components/Sidebar";
import { getRoute, getRoutes } from "@/content/graph/docs/routeMaps";
import Link from "next/link";

import { GoChevronRight, GoChevronLeft } from "react-icons/go";

export default function Layout(props: {
  params: { slug?: string[] };
  children: React.ReactNode;
}) {
  const routeDetails = getRoute(
    ["graph", "docs", ...(props.params.slug ?? [])].join("/")
  );

  const nextRoute = routeDetails.next ? getRoute(routeDetails.next) : null;
  const prevRoute = routeDetails.prev ? getRoute(routeDetails.prev) : null;

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-grow flex-col md:flex-row ">
      <Sidebar items={getRoutes()} />
      <div className="mx-auto flex w-full max-w-6xl">
        <div className="w-full px-4 py-4">
          <article className="prose prose-invert w-full max-w-none overflow-hidden">
            <header className="mb-4">
              {/* breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm  text-white/50">
                <span>Docs</span>
                <GoChevronRight size={16} />
                <span>{routeDetails.sectionTitle}</span>
                <GoChevronRight size={16} />
                <span>{routeDetails.title}</span>
              </nav>
            </header>
            {props.children}
            <footer className="mt-8 flex justify-between">
              {prevRoute && (
                <Link
                  href={"/" + prevRoute.route}
                  className="flex items-center gap-2 text-sm font-semibold text-white/90 no-underline hover:text-white"
                >
                  <GoChevronLeft size={16} /> {prevRoute.title}
                </Link>
              )}
              {nextRoute && (
                <Link
                  href={"/" + nextRoute.route}
                  className="ml-auto flex items-center gap-2 text-sm font-semibold text-white/90 no-underline hover:text-white"
                >
                  {nextRoute.title} <GoChevronRight size={16} />
                </Link>
              )}
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
