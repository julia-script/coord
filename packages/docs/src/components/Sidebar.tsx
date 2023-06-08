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
    <div className="border-dark-200/10 mb-4 w-full border-y md:mb-0 md:max-w-[250px] md:border-y-0 md:border-r">
      <div className="container m-auto px-4 md:hidden">
        <button
          className="w-full py-4 text-left text-sm font-semibold text-white/90 hover:text-white/100 "
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </div>

      <div
        className={clsx("container m-auto px-4 pb-4 md:block md:py-4", {
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
    <nav className="pl-2 text-sm">
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
      <h2 className="font-display font-semibold text-white">{props.title}</h2>
      <ul role="list" className="mt-2 flex flex-col gap-y-0 lg:mt-4">
        {props.children}
      </ul>
    </li>
  );
}

export const NavItem = (props: { href: string; children: React.ReactNode }) => {
  return (
    <li className="relative pl-1">
      <Link
        className="hover:text-dark-100 text-dark-100/80 borderdark-100/10 hover:borderdark-100/50 block w-full border-l-2 py-1 pl-3"
        href={props.href}
      >
        {props.children}
      </Link>
    </li>
  );
};
