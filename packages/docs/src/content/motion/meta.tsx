import { PageItem } from "@/components/navigation";
import { GoBook } from "react-icons/go";

export const header: PageItem[] = [
  {
    title: "Docs",
    icon: <GoBook />,
    route: "/motion/docs",
  },
];

export const sidebar: PageItem[] = [
  {
    title: "Getting Started",
    route: "/motion/docs",
    items: [
      {
        title: "Installation",
        route: "/motion/docs/installation",
      },
    ],
  },
  {
    title: "State animation",
    route: "/motion/docs/state-animation",
    isPage: false,
    items: [
      {
        title: "What is it",
        route: "/motion/docs/state-animation/what-is-state-animation",
      },
    ],
  },
];
