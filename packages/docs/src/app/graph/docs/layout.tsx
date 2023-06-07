import { Sidebar } from "@/components/Sidebar";
import { getRoutes } from "@/content/graph/docs/routeMaps";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between flex-col md:flex-row w-full max-w-6xl mx-auto">
      <Sidebar items={getRoutes()} />
      <div className="mx-auto max-w-6xl w-full flex ">
        <div className="w-full px-4 py-4">
          <article className="prose dark:prose-invert max-w-none w-full overflow-hidden">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
