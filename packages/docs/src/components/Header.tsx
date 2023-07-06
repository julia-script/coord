"use client";
import Link from "next/link";
import {
  Menu,
  Transition,
} from "@headlessui/react";
import {
  MarkGithubIcon,
  ThreeBarsIcon,
  XIcon,
} from "@primer/octicons-react";
import cn from "clsx";
import {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { PageItem } from "./navigation";
import { Logo } from "./GraphLogo";

export function NavbarMenu({
  className,
  menu,
  children,
}: {
  className?: string;
  menu: PageItem;
  children: ReactNode;
}): ReactElement {
  const { items } = menu;

  return (
    <div className="relative inline-block">
      <Menu>
        <Menu.Button
          className={cn(
            className,
            "-ml-2 hidden items-center whitespace-nowrap rounded p-2 md:inline-flex",
            "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          {children}
        </Menu.Button>
        <Transition
          leave="transition-opacity"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items
            className="absolute right-0 z-20 mt-1 max-h-64 min-w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/20"
            // tabIndex={0}
          >
            {Object.entries(items || {}).map(
              ([key, item]) => (
                <Menu.Item key={key}>
                  <Link
                    href={item.route}
                    className={cn(
                      "relative hidden w-full select-none whitespace-nowrap text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 md:inline-block",
                      "py-1.5 transition-colors ltr:pl-3 ltr:pr-9 rtl:pl-9 rtl:pr-3"
                    )}
                    target={item.target}
                  >
                    {item.title || key}
                  </Link>
                </Menu.Item>
              )
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

type HeaderProps = {
  items?: PageItem[];
};
export function Header({
  items = [],
}: HeaderProps): ReactElement {
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    document.body.classList.add("menu-open");

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menu]);

  return (
    <div className="sticky top-0 z-20 w-full bg-transparent print:hidden">
      <div
        className={cn(
          "dark:bg-dark pointer-events-none absolute z-[-1] h-full w-full bg-white",
          "shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]",
          "contrast-more:shadow-[0_0_0_1px_#000] contrast-more:dark:shadow-[0_0_0_1px_#fff]"
        )}
      />
      <nav className="mx-auto flex h-[var(--navbar-height)] max-w-[90rem] items-center justify-end gap-1 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] sm:gap-2">
        <div className="flex items-center ltr:mr-auto rtl:ml-auto">
          <Logo />
        </div>
        {[
          ...items,
          {
            title: "GitHub",
            icon: <MarkGithubIcon />,
            route:
              "https://github.com/julia-script/coord/tree/main/packages/graph",
          } as PageItem,
        ].map((menu) => {
          const isActive = false;
          if (!menu.items?.length ?? false)
            return (
              <Link
                key={menu.title}
                className={cn(
                  "text-sm contrast-more:text-gray-700 contrast-more:dark:text-gray-100",
                  "relative flex items-center gap-2 whitespace-nowrap p-1 sm:p-2 md:inline-flex"
                )}
                href={menu.route}
              >
                {menu.icon}{" "}
                <span className="hidden sm:inline-flex">
                  {menu.title}
                </span>
              </Link>
            );
          return (
            <NavbarMenu
              key={menu.title}
              className={cn(
                "text-sm contrast-more:text-gray-700 contrast-more:dark:text-gray-100",
                "flex gap-1",
                {
                  "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200":
                    !isActive,
                  "font-medium subpixel-antialiased":
                    isActive,
                }
              )}
              menu={menu}
            >
              {menu.icon}
              {menu.title}
            </NavbarMenu>
          );
        })}

        <button
          type="button"
          aria-label="Menu"
          className="-mr-2 rounded p-2 active:bg-gray-400/20 md:hidden"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <XIcon /> : <ThreeBarsIcon />}
        </button>
      </nav>
    </div>
  );
}
