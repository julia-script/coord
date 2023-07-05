import "katex/dist/katex.min.css";
import { PreMDX } from "@/components/PreMdx";

import { Sidebar } from "@/components/navigation";
import cn from "clsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Fragment,
  PropsWithChildren,
} from "react";
import {
  RouteInfo,
  RouteSummary,
  getProjectRoutes,
  getRouteInfo,
} from "@/utils/routes";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@primer/octicons-react";
import Link from "next/link";

function Breadcrumb({
  path,
}: {
  path: RouteSummary[];
}) {
  return (
    <div className="mt-1.5 flex items-center gap-1 overflow-hidden text-sm text-gray-500 contrast-more:text-current dark:text-gray-400">
      {path.map((item, index) => {
        const isLink = item.isPage;
        const isActive =
          index === path.length - 1;

        return (
          <Fragment key={item.route + item.title}>
            {index > 0 && (
              <ChevronRightIcon className="w-3.5 shrink-0" />
            )}
            <div
              className={cn(
                "whitespace-nowrap transition-colors",
                isActive
                  ? "font-medium text-gray-700 contrast-more:font-bold contrast-more:text-current dark:text-gray-100 contrast-more:dark:text-current"
                  : [
                      "min-w-[24px] overflow-hidden text-ellipsis",
                      isLink &&
                        "hover:text-gray-900 dark:hover:text-gray-100",
                    ]
              )}
              title={item.title}
            >
              {isLink && !isActive ? (
                <Link href={item.route}>
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

function Body({
  routeInfo,
  children,
}: PropsWithChildren<{
  routeInfo: RouteInfo;
}>) {
  const { previous, next } = routeInfo;
  return (
    <article
      className={cn(
        "w-full max-w-none break-words",
        "min-h-[calc(100vh-var(--navbar-height))] min-w-0 flex-col justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]"
      )}
    >
      <main className=" w-full min-w-0 max-w-6xl px-6 pt-4 md:px-12">
        <Breadcrumb
          path={routeInfo.breadcrumbs}
        />

        <div className="prose prose-invert my-3 max-w-none">
          {children}
        </div>
        <div
          className={cn(
            "mb-8 flex items-center border-t pt-8 dark:border-neutral-800",
            "contrast-more:border-neutral-400 dark:contrast-more:border-neutral-400",
            "print:hidden"
          )}
        >
          {previous && (
            <Link
              href={previous.route}
              title={previous.title}
              className={cn(
                "hover:text-primary-600 flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] dark:text-gray-300 md:text-lg",
                "ltr:pr-4 rtl:pl-4"
              )}
            >
              <ChevronRightIcon
                className={cn(
                  "inline h-5 shrink-0",
                  "ltr:rotate-180"
                )}
              />
              {previous.title}
            </Link>
          )}
          {next && (
            <Link
              href={next.route}
              title={next.title}
              className={cn(
                "hover:text-primary-600 flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] dark:text-gray-300 md:text-lg",
                "ltr:ml-auto ltr:pl-4 ltr:text-right rtl:mr-auto rtl:pr-4 rtl:text-left"
              )}
            >
              {next.title}
              <ChevronLeftIcon
                className={cn(
                  "inline h-5 shrink-0",
                  "ltr:rotate-180"
                )}
              />
            </Link>
          )}
        </div>
      </main>
    </article>
  );
}

const getAccentColor = (route: string) => {
  if (route.startsWith("graph")) {
    return "337 100%";
  }
  if (route.startsWith("motion")) {
    return "164 100%";
  }
  if (route.startsWith("editor")) {
    return "200 100%";
  }

  return "0 0%";
};
export default async function Layout(
  props: PropsWithChildren<{
    params: { slug?: string[] };
  }>
) {
  const route =
    props.params.slug?.join("/") ?? "";
  const { sidebar, header } =
    await getProjectRoutes(route);
  const routeInfo = await getRouteInfo(route);
  return (
    <>
      <style type="text/css">{`
        :root {
          --accent-color: ${getAccentColor(
            route
          )};
        }
      `}</style>
      <Header items={header} />

      {routeInfo.layout !== "full" && (
        <div
          className={"mx-auto flex max-w-[90rem]"}
        >
          <Sidebar items={sidebar} />
          <Body routeInfo={routeInfo}>
            {props.children}
          </Body>
        </div>
      )}
      {routeInfo.layout === "full" && (
        <div
          className={
            "mx-auto flex w-full grow flex-col"
          }
        >
          {props.children}
        </div>
      )}
      <Footer />
    </>
  );
}
