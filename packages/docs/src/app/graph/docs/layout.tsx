import { Sidebar } from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between flex-col md:flex-row w-full max-w-6xl">
      <Sidebar />
      <div className="mx-auto max-w-6xl w-full">
        <div className="w-full px-4 flex items-center justify-center py-4">
          <article className="prose dark:prose-invert max-w-none w-full overflow-hidden">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
