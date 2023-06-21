import {
  useSafeCallback,
  useSafeLayoutEffect,
  useSafeRef,
  useSafeState,
} from "./safe-hooks";

const DOMRectClass =
  typeof DOMRect === "undefined"
    ? class DOMRect {
        constructor(
          public x: number,
          public y: number,
          public width: number,
          public height: number
        ) {}

        get top() {
          return this.y;
        }

        get left() {
          return this.x;
        }

        get right() {
          return this.x + this.width;
        }

        get bottom() {
          return this.y + this.height;
        }

        toJSON() {
          return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            top: this.top,
            left: this.left,
            right: this.right,
            bottom: this.bottom,
          };
        }
      }
    : DOMRect;
export function useClientRect<TRef extends HTMLElement = HTMLDivElement>(
  fn: (rect: DOMRect) => void
) {
  const ref = useSafeRef<TRef | null>(null);
  // const [rect, setRect] = useSafeState(() => {
  //   const { x = 0, y = 0, width = 0, height = 0 } = defaultValue;
  //   return new DOMRectClass(x, y, width, height);
  // });
  // const updateRect = useSafeCallback(() => {
  //   const newRect = ref.current?.getBoundingClientRect();
  //   if (newRect) {
  //     setRect(newRect);
  //   }
  // }, [ref]);

  useSafeLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const newRect = ref.current?.getBoundingClientRect();
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
