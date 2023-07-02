"use client";
import { Graph, Plot } from "@coord/graph";
import Link, { LinkProps } from "next/link";
import { ComponentProps, Fragment, PropsWithChildren, useState } from "react";
import { GoChevronRight } from "react-icons/go";
import cn from "clsx";
import { usePathname } from "next/navigation";

function ProjectLink({
  className,
  children,
  selected,

  ...rest
}: PropsWithChildren<{
  className?: string;
  selected: boolean;
}> &
  LinkProps) {
  return (
    <Link
      className={cn(
        className,

        {
          [`font-bold opacity-90 transition-opacity duration-200 hover:opacity-100 ${className}`]:
            selected,
          [cn(
            "text-white opacity-80 transition-opacity duration-200 hover:opacity-100",
            "[text-shadow:_0_0_5px_rgb(255_255_255_/_100%)]",
            "px-1 py-2 text-xs"
          )]: !selected,
        }
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Logo() {
  const pathname = usePathname();
  const selected = pathname.split("/")[1] ?? "";

  const [hover, setHover] = useState<"motion" | "editor" | "graph">("motion");

  const c = {
    motion: (
      <ProjectLink
        className="text-motion"
        selected={selected === "motion"}
        href="/motion"
        onMouseEnter={() => setHover("motion")}
      >
        motion
      </ProjectLink>
    ),

    graph: (
      <ProjectLink
        className="text-graph"
        selected={selected === "graph"}
        href="/graph"
        onMouseEnter={() => setHover("graph")}
      >
        graph
      </ProjectLink>
    ),
    editor: (
      <ProjectLink
        className="text-editor"
        selected={selected === "editor"}
        href="/editor"
        onMouseEnter={() => setHover("editor")}
      >
        editor
      </ProjectLink>
    ),
  } as const;
  return (
    <div className="flex items-center font-mono text-sm sm:text-base">
      <Link
        href="/"
        className="font-bold opacity-80 transition-opacity duration-200 hover:opacity-100"
      >
        curves
      </Link>
      <span className="">
        <GoChevronRight />
      </span>
      {selected in c ? (
        <div className="flex items-center">{c[selected as keyof typeof c]}</div>
      ) : null}
      <div
        className={cn(
          "group",
          "transition-all duration-200",
          "glow shadow-white/5",
          "ml-2 flex items-center overflow-hidden rounded-md border border-white/20 px-1 sm:ml-4 sm:px-2",
          {
            "hover:shadow-graph/40": hover === "graph",
            "hover:shadow-motion/40": hover === "motion",
            "hover:shadow-editor/40": hover === "editor",
          }
        )}
      >
        {Object.entries(c)
          .filter(([k]) => k !== selected)
          .map(([k, v], i) => (
            <Fragment key={k}>
              {i > 0 && <span className="mx-1 text-white opacity-30">/</span>}

              {v}
            </Fragment>
          ))}
      </div>
    </div>
  );
}

export const GraphLogo = ({
  size = 400,
  globalMultiplier = 1,
}: {
  size?: number;
  globalMultiplier?: number;
}) => {
  const PI2 = Math.PI * 2;
  const [a1, b1, a2, b2] = [PI2 * 0.04, PI2 * 1, PI2 * 0.27, PI2 * 0.93];
  const dashMultiplier = size / 400;
  const dasharray = [15 * dashMultiplier, 20 * dashMultiplier];
  const domain: [number, number] = [-3, 3];
  const f = (x: number, a: number, b: number) =>
    Math.sin(((x - a) * Math.PI * 2) / (b - a));
  return (
    <Graph
      coordBox={[-2.5, 2.5, 2.5, -2.5]}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Plot.ofX
        domain={domain}
        f={(x) => f(x, a1, b1)}
        strokeColor={0}
        strokeWidth={`${0.12 * globalMultiplier}cs`}
        strokeDasharray={dasharray.map((v) => v + "px").join(" ")}
      />
      <Plot.ofX
        domain={domain}
        f={(x) => f(x, a2, b2)}
        strokeColor={2}
        strokeWidth={`${0.12 * globalMultiplier}cs`}
        strokeDasharray={dasharray.map((v) => v + "px").join(" ")}
      />
      <Plot.ofX
        domain={domain}
        f={(x) => f(x, a1, b1) + f(x, a2, b2)}
        strokeColor={1}
        strokeWidth={`${0.3 * globalMultiplier}cs`}
      />
    </Graph>
  );
};
