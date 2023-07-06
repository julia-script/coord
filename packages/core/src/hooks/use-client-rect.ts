import {
  useSafeLayoutEffect,
  useSafeRef,
} from "./safe-hooks";

export function useClientRect<
  TRef extends HTMLElement = HTMLDivElement
>(fn: (rect: DOMRect) => void) {
  const ref = useSafeRef<TRef | null>(null);

  useSafeLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const newRect =
        ref.current?.getBoundingClientRect();
      if (newRect) {
        fn(newRect);
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return ref;
}
