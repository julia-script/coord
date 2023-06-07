"use client";

import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

export type RouteSection = {
  title: string;
  children: Readonly<RouteItem[]>;
};
export type RouteItem = {
  title: string;
  route: string;
  file: string;
};
export function Sidebar({ items }: { items: Readonly<RouteSection[]> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full border-slate-200/10 md:max-w-[250px] border-y md:border-y-0 md:border-r mb-4 md:mb-0 h-full">
      <div className="m-auto container px-4 md:hidden">
        <button
          className="w-full text-left text-sm font-semibold text-white/90 hover:text-white/100 py-4 "
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </div>

      <div
        className={clsx("m-auto container px-4 pb-4 md:block md:py-4", {
          hidden: !open,
        })}
      >
        <Menu items={items} />
      </div>
    </div>
  );
}

export function Menu({ items }: { items: Readonly<RouteSection[]> }) {
  return (
    <nav className="text-sm pl-2">
      <ul role="list" className="flex flex-col gap-y-4">
        {items.map((section) => (
          <SidebarSection key={section.title} title={section.title}>
            {section.children.map((item) => (
              <NavItem key={item.route} href={item.route}>
                {item.title}
              </NavItem>
            ))}
          </SidebarSection>
        ))}
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
