import Image from "next/image";
import { Sidebar } from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <header className="w-full py-4">
        <div className="mx-auto px-4 max-w-6xl flex items-center justify-between">
          <div className="flex">
            <h1 className="font-display text-white font-semibold font-mono">
              @curves/<span className="text-red-300">graph</span>
            </h1>
          </div>
          <div className="flex items-center">
            <a href="#" className="text-slate-200/50 hover:text-slate-200">
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="flex justify-between flex-col md:flex-row w-full max-w-6xl">
        <Sidebar />
        <div className="mx-auto max-w-6xl w-full">
          <div className="w-full px-4 flex items-center justify-center">
            <article className="prose dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
