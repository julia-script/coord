import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div className="flex">
          <p id={"copy"} className="font-display font-mono text-xs text-white">
            Copyright © {new Date().getFullYear()} Julia Ortiz
          </p>
        </div>
      </div>
    </footer>
  );
}
