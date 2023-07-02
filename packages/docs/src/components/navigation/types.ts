import { ReactNode } from "react";

export type PageItem = {
  title: string;
  route: string;

  isPage?: boolean;
  icon?: ReactNode;
  layout?: "full" | "default";
  target?: string;
  items?: PageItem[];
};
