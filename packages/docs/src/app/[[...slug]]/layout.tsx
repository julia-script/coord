import { Sidebar } from "@/components/Sidebar";
import { getRoute, getRoutes } from "@/routeMaps";

import Link from "next/link";
import "katex/dist/katex.min.css";

import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Layout(props: {
  params: { slug?: string[] };
  children: React.ReactNode;
}) {
  const routeDetails = getRoute([...(props.params.slug ?? [])].join("/"));

  const nextRoute = routeDetails.next ? getRoute(routeDetails.next) : null;
  const prevRoute = routeDetails.prev ? getRoute(routeDetails.prev) : null;

  return (
    <>
      <Header />
      <div className="flex h-full w-full flex-grow flex-col">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-grow flex-col md:flex-row [&_.math]:text-white">
          <Sidebar items={getRoutes(props.params.slug?.[0] ?? "")} />
          <div className="mx-auto flex w-full max-w-6xl">
            <div className="w-full px-4 py-4">
              <article className="prose prose-invert w-full max-w-none overflow-hidden">
                <header className="mb-4">
                  <nav className="flex items-center gap-2 text-sm  text-white/50">
                    <span>Docs</span>
                    <GoChevronRight size={16} />
                    <span>{routeDetails.sectionTitle}</span>
                    <GoChevronRight size={16} />
                    <span>{routeDetails.title}</span>
                  </nav>
                </header>
                {props.children}
                <footer className="mt-8 flex justify-between pt-2">
                  {prevRoute && (
                    <Link
                      href={"/" + prevRoute.route}
                      className="text-md flex items-center gap-2 font-semibold text-white/90 no-underline hover:text-white"
                    >
                      <GoChevronLeft size={20} /> {prevRoute.title}
                    </Link>
                  )}
                  {nextRoute && (
                    <Link
                      href={"/" + nextRoute.route}
                      className="text-md ml-auto flex items-center gap-2 font-semibold text-white/90 no-underline hover:text-white"
                    >
                      {nextRoute.title} <GoChevronRight size={20} />
                    </Link>
                  )}
                </footer>
              </article>
            </div>
          </div>
        </div>{" "}
      </div>
      <Footer />
    </>
  );
}
