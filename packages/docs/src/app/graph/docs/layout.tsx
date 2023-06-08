import { Sidebar } from "@/components/Sidebar";
import { getRoutes } from "@/content/graph/docs/routeMaps";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-grow flex-col md:flex-row ">
      <Sidebar items={getRoutes()} />
      <div className="mx-auto flex w-full max-w-6xl">
        <div className="w-full px-4 py-4">
          <article className="prose prose-invert w-full max-w-none overflow-hidden">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
