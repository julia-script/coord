"use client";

import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full border-slate-200/10 md:max-w-[250px] border-y md:border-y-0 md:border-r mb-4 md:mb-0 py-4">
      <div className="m-auto container px-4 py-4 md:hidden">
        <button
          className="w-full text-left text-sm font-semibold text-white/90 hover:text-white/100"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </div>

      <div
        className={clsx("m-auto container px-4 pb-4 md:block", {
          hidden: !open,
        })}
      >
        <Menu />
      </div>
    </div>
  );
}

export function Menu() {
  return (
    <nav className="text-sm pl-2">
      <ul role="list" className="flex flex-col gap-y-4">
        <SidebarSection title="🚀 Getting started">
          <NavItem href="/graph/docs">About</NavItem>
          <NavItem href="/graph/docs/getting-started">Installation</NavItem>
        </SidebarSection>
        <SidebarSection title="🧩 Components">
          <NavItem href="/graph/docs/components/graph">Graph</NavItem>
          <NavItem href="/graph/docs/components/grid">Grid</NavItem>
          <NavItem href="/graph/docs/components/marker">Marker</NavItem>
          <NavItem href="/graph/docs/components/plot">Plot</NavItem>
          <NavItem href="/graph/docs/components/line">Line</NavItem>
          <NavItem href="/graph/docs/components/polyline">PolyLine</NavItem>
          <NavItem href="/graph/docs/components/rect">Rect</NavItem>
          <NavItem href="/graph/docs/components/bounding-box">
            BoundingBox
          </NavItem>
          <NavItem href="/graph/docs/components/label">Label</NavItem>
          <NavItem href="/graph/docs/components/text">Text</NavItem>
        </SidebarSection>
        <SidebarSection title="🕹️ Interaction">
          <NavItem href="/graph/docs/interactions/navigation">
            Navigation
          </NavItem>
          <NavItem href="/graph/docs/interactions/markers-and-labels">
            Markers and Labels
          </NavItem>
        </SidebarSection>
        <SidebarSection title="📦 Interfaces">
          <NavItem href="/graph/docs/interfaces/point">Point</NavItem>
          <NavItem href="/graph/docs/interfaces/bbox">BBox</NavItem>
        </SidebarSection>
        <SidebarSection title="📚 Guides">
          <NavItem href="/graph/docs/guides/server-components">
            Server Components
          </NavItem>
          <NavItem href="/graph/docs/guides/known-issues">Known Issues</NavItem>
        </SidebarSection>
      </ul>
    </nav>
  );
}
interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}
function SidebarSection(props: SidebarSectionProps) {
  return (
    <li>
      <h2 className="font-display text-white font-semibold">{props.title}</h2>
      <ul role="list" className="mt-2 lg:mt-4 gap-y-0 flex flex-col">
        {props.children}
      </ul>
    </li>
  );
}

export const NavItem = (props: { href: string; children: React.ReactNode }) => {
  return (
    <li className="relative pl-1">
      <Link
        className="block w-full pl-3 py-1 hover:text-gray-100 text-gray-100/80 border-l-2 border-slate-100/10 hover:border-slate-100/50"
        href={props.href}
      >
        {props.children}
      </Link>
    </li>
  );
};
