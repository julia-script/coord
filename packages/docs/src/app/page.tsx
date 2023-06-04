"use client";
import Image from "next/image";
import { Graph, GraphControls, Grid } from "./graph";

function Sidebar() {
  return (
    <nav className=" text-sm pl-2">
      <ul role="list" className="flex flex-col gap-y-4">
        <SidebarSection title="Section 1">
          <NavItem text="Getting started" href="#" />
          <NavItem text="Installation" href="#" />
          <NavItem text="Release notes" href="#" />
        </SidebarSection>
        <SidebarSection title="Section 2">
          <NavItem text="Item 4" href="#" />
          <NavItem text="Item 5" href="#" />
          <NavItem text="Item 6" href="#" />
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
        className="block w-full pl-3 py-1 hover:text-slate-200 text-slate-200/50 border-l-2 border-slate-100/10 hover:border-slate-100/50"
        href={props.href}
      >
        {props.text}
      </a>
    </li>
  );
}
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-4">
      <div className="mx-auto container flex">
        <div
          id="sidebar"
          className="w-full max-w-[200px] border-r border-slate-200/5"
        >
          <Sidebar />
        </div>
        <div className="w-full px-4">
          <article className="prose dark:prose-invert">
            <GraphControls
              properties={{
                test: {
                  input: "number",
                },
              }}
            >
              {({ test }) => (
                <div>{test}</div>
                // <Graph fit>
                //   <Grid />
                // </Graph>
              )}
            </GraphControls>
            <h1>
              Getting started with <span className="text-blue-500">Graph</span>
            </h1>
            <p>
              Graph is a React component library for building data
              visualizations on the web.
            </p>
            <h2>Installation</h2>

            <p>
              Graph is available as an npm package. To install it, run the
              following command:
            </p>
            <pre>
              <code>npm install @graph-ui/core</code>
            </pre>
          </article>
        </div>
      </div>
    </main>
  );
}
