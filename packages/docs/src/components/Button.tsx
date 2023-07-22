import cn from "clsx";
import type {
  ComponentProps,
  ReactElement,
} from "react";

export const Button = ({
  children,
  className,
  ...props
}: ComponentProps<"button">): ReactElement => {
  return (
    <button
      className={cn(
        "transition-all active:opacity-50",
        "rounded-md border border-black/5 bg-white/5 p-1.5 text-gray-600 hover:text-gray-900",
        "dark:border-white/10 dark:bg-white/10 dark:text-gray-400 dark:hover:text-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
