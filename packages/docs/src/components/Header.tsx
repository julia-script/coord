import Link from "next/link";
import { GoMarkGithub, GoBook } from "react-icons/go";

export function Header() {
  return (
    <header className="w-full py-4 border-b border-white/10">
      <div className="mx-auto px-4 max-w-6xl flex items-center justify-between">
        <div className="flex">
          <h1 className="font-display text-white font-semibold font-mono">
            <Link href="/graph">
              @coord/<span className="text-accent-graph-400">graph</span>
            </Link>
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <Link
            href="/graph/docs"
            className="gap-2 flex items-center text-white/90 font-semibold hover:text-white whitespace-nowrap"
          >
            <GoBook size={18} />
            Docs
          </Link>

          <a
            href="https://github.com/julia-script/coord/tree/main/packages/graph"
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2 flex items-center text-white/90 font-semibold hover:text-white whitespace-nowrap"
          >
            <GoMarkGithub size={18} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
