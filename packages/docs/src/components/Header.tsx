import Link from "next/link";

export function Header() {
  return (
    <header className="w-full py-4 border-b border-white/10">
      <div className="mx-auto px-4 max-w-6xl flex items-center justify-between">
        <div className="flex">
          <h1 className="font-display text-white font-semibold font-mono">
            <Link href="/graph">
              @coord/<span className="text-red-300">graph</span>
            </Link>
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <Link
            href="/graph/docs"
            className="text-white/90 font-semibold hover:text-white"
          >
            Docs
          </Link>

          <a href="#" className="text-white/90 font-semibold hover:text-white">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
