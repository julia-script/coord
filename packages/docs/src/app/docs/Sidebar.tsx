"use client";

import { useState } from "react";
import clsx from "clsx";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full border-slate-200/10 md:max-w-[250px] border-y md:border-y-0 md:border-r mb-4 md:mb-0 ">
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
          <NavItem text="Installation" href="/docs/getting-started" />
        </SidebarSection>
        <SidebarSection title="🧩 Components">
          <NavItem text="Graph" href="/docs/components/graph" />
          <NavItem text="Grid" href="/docs/components/grid" />
          <NavItem text="Marker" href="/docs/components/marker" />
          <NavItem text="Plot" href="/docs/components/plot" />
          <NavItem text="Line" href="/docs/components/line" />
          <NavItem text="PolyLine" href="/docs/components/polyline" />
          <NavItem text="Rect" href="/docs/components/rect" />
          <NavItem text="BoundingBox" href="/docs/components/bounding-box" />
          <NavItem text="Label" href="/docs/components/label" />
          <NavItem text="Text" href="/docs/components/text" />
        </SidebarSection>
        <SidebarSection title="🕹️ Interaction">
          <NavItem text="Navigation" href="/docs/interactions/navigation" />
          <NavItem text="Markers and Labels" href="/docs/interactions/marker" />
        </SidebarSection>
        <SidebarSection title="📦 Interfaces">
          <NavItem text="Point" href="/docs/interfaces/point" />
          <NavItem text="BBox" href="/docs/interfaces/bbox" />
        </SidebarSection>
        <SidebarSection title="📚 Guides">
          <NavItem
            text="Server components"
            href="/docs/guides/server-components"
          />
          <NavItem text="Known issues" href="/docs/guides/known-issues" />
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
interface NavItemProps {
  text: string;
  href: string;
}

export function NavItem(props: NavItemProps) {
  return (
    <li className="relative pl-1">
      <a
        className="block w-full pl-3 py-1 hover:text-gray-100 text-gray-100/80 border-l-2 border-slate-100/10 hover:border-slate-100/50"
        href={props.href}
      >
        {props.text}
      </a>
    </li>
  );
}
