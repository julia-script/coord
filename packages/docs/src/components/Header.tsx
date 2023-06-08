import Link from "next/link";
import { GoMarkGithub, GoBook } from "react-icons/go";

export function Header() {
  return (
    <header className="w-full border-b border-white/10 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div className="flex">
          <h1 className="font-display font-mono font-semibold text-white">
            <Link href="/graph">
              @coord/<span className="text-accent-graph-400">graph</span>
            </Link>
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <Link
            href="/graph/docs"
            className="flex items-center gap-2 whitespace-nowrap font-semibold text-white/90 hover:text-white"
          >
            <GoBook size={18} />
            Docs
          </Link>

          <a
            href="https://github.com/julia-script/coord/tree/main/packages/graph"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 whitespace-nowrap font-semibold text-white/90 hover:text-white"
          >
            <GoMarkGithub size={18} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
