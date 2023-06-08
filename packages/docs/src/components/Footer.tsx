import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-4 mt-auto">
      <div className="mx-auto px-4 max-w-6xl flex items-center justify-between">
        <div className="flex">
          <p id={"copy"} className="font-display text-white text-xs font-mono">
            Copyright © {new Date().getFullYear()} Julia Ortiz
          </p>
        </div>
      </div>
    </footer>
  );
}
