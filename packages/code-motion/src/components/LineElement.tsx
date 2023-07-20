import React, { ComponentProps } from "react";
import cn from "clsx";
import { Theme, computeStyles } from "..";

export function LineElement({
  number,
  children,
  className,
  theme,
  ...props
}: {
  number: number;
  theme: Theme;
} & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "cm-line",
        `cm-line--${number}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
