"use client";
import {
  useRef,
  ComponentProps,
  PropsWithChildren,
} from "react";
import { PageItem } from "./types";
import cn from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { normalizeRoute } from "@/utils/routes";

type MenuProps = {
  items: PageItem[];
} & ComponentProps<"ul">;

function MenuLabel({
  href,
  isPage = true,
  ...rest
}: PropsWithChildren<{
  href: string;
  isPage?: boolean;
  target?: string;
  className?: string;
}>) {
  if (isPage) {
    return <Link href={href} {...rest} />;
  }
  return <span {...rest} />;
}

function MenuItem({ item }: { item: PageItem }) {
  // const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const active =
    normalizeRoute(pathname) ===
    normalizeRoute(item.route);

  return (
    <li className={"flex flex-col gap-1"}>
      <MenuLabel
        key={item.title}
        className={cn(
          "flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm transition-colors [word-break:break-word]",
          "[-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border",
          {
            ["bg-white/10 font-semibold"]: active,
            ["dark:text-white/80"]: !active,

            [cn(
              "cursor-pointer",
              "hover:bg-gray-100 dark:hover:bg-white/20"
            )]: item.isPage ?? true,
          }
        )}
        href={item.route}
        isPage={item.isPage}
        target={item.target}
      >
        {item.title}
        {/* <button
          className={cn(
            "flex w-6 items-center justify-center transition-transform",
            {
              "rotate-180": !open,
            }
          )}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   // setOpen((o) => !o);
          // }}
        >
          {item.items && <GoChevronDown />}
        </button> */}
      </MenuLabel>
      {item.items && (
        <div className="ltr:pl-3 rtl:pr-3">
          <Menu
            className={cn(
              "relative before:absolute before:inset-y-1",
              'before:w-px before:bg-gray-200 before:content-[""] dark:before:bg-neutral-800',
              "ltr:pl-3 ltr:before:left-0 rtl:pr-3 rtl:before:right-0"
            )}
            items={item.items}
          />
        </div>
      )}
    </li>
  );
}
function Menu({ items, className }: MenuProps) {
  return (
    <ul
      className={cn(
        "flex flex-col gap-1",
        className
      )}
    >
      {items.map((item) => (
        <MenuItem key={item.route} item={item} />
      ))}
    </ul>
  );
}

type SidebarProps = {
  items: PageItem[];
};
export function Sidebar({ items }: SidebarProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  return (
    <aside
      className={cn(
        "nextra-sidebar-container flex flex-col",
        "dark:max-md:bg-dark max-md:fixed max-md:bottom-0 max-md:top-0 max-md:z-[15] max-md:w-full max-md:overscroll-contain max-md:bg-white max-md:pt-[calc(var(--navbar-height))]",
        "motion-reduce:transform-none md:shrink-0",
        "transition-transform duration-300 ease-in-out",
        "print:hidden",
        // showSidebar ? "md:w-64" : "md:w-20",
        "md:w-64",
        "md:sticky md:self-start",
        // true ? "md:hidden" : "md:sticky md:self-start",
        "max-md:-translate-y-full [body.menu-open_&]:max-md:translate-y-0"
      )}
      ref={containerRef}
    >
      <div
        className={cn(
          "overflow-y-auto overflow-x-hidden",
          "grow p-4 md:h-[calc(100vh-var(--navbar-height)-var(--menu-height))]"
          // showSidebar ? "scrollbar" : "no-scrollbar"
        )}
        ref={sidebarRef}
      >
        <Menu items={items} />
      </div>
    </aside>
  );
}
