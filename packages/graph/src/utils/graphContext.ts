import { Vec2, Vec2ish, Transform, point, transform } from "@coord/core";
import React, { CSSProperties } from "react";
import { BBox, Theme, PartialBy, BBoxish, ScalarPoint, Space } from "@/types";
import { normalizeBBox } from "@/utils";
import {
  projectCoordFactory,
  projectSizeFactory,
  unprojectCoordFactory,
} from "./scalars";
import { defaultThemes } from "./themes";
import { fitCoordBoxToView } from "./fitCoordBoxToView";
import {
  isServerComponent,
  useSafeCallback,
  useSafeLayoutEffect,
  useSafeMemo,
  useSafeRef,
  useSafeState,
} from "@/hooks/safe-server-hooks";

export type GraphContext = {
  ref: React.RefObject<SVGSVGElement> | null;
  computeColor: (color: string | number) => string;
  projectSize: ReturnType<typeof projectSizeFactory>;
  unprojectSize: ReturnType<typeof projectSizeFactory>;
  projectAbsoluteSize: ReturnType<typeof projectSizeFactory>;
  projectCoord: (point: ScalarPoint, inferredUnit?: Space) => Vec2;
  unprojectCoord: (point: ScalarPoint, inferredUnit?: Space) => Vec2;
  projectionTransform: Transform;
  coordBox: BBox;
  coordStep: Vec2;
  viewspaceSize: Vec2;
  theme: Theme;
};

export type GraphElement<T = {}, TParentElProps = {}> = {
  context: GraphContext;
} & T &
  TParentElProps;

export const withGraphContext = <P extends GraphElement>(
  Component: React.ComponentType<P>
): React.FC<PartialBy<P, "context">> => {
  return function withContext(props) {
    const { context } = props;
    if (!context) {
      throw new Error("This component must be a direct child of Graph");
    }

    return React.createElement(Component, { ...(props as P) });
  };
};

export const passContextToChildren = (
  children: React.ReactNode,
  context: GraphContext
) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const props = { ...child.props };
      props.context = context;
      props.children = passContextToChildren(props.children, context);

      return React.cloneElement(child, props);
    }
    return child;
  });
};

type ContextArguments = {
  /**
   * The coordinate of the bounding box of the graph that's guaranteed to be visible.
   * The real bounding box of the graph may be affect by the padding and the aspect ration of the graph element
   * @defaultValue { horizontal: point(-10, 10), vertical: point(10, -10) }
   * @example
   * ```tsx
   * <Graph coordBox={{ horizontal: [-10, 10], vertical: [10, -10] }} />
   * ```
   * @example
   * ```tsx
   * // [top, right, bottom, left]
   * <Graph coordBox={[10, 10, -10, -10]} />
   * ```
   *
   * @see {@link BBoxish}
   */
  coordBox: BBoxish;
  /**
   * The step for each axis in the graph.
   * @defaultValue point(1, 1)
   * @example
   * ```tsx
   * <Graph coordStep={[1, 1]} />
   * ```
   * @see {@link Vec2ish}
   * */
  coordStep: Vec2ish;
  /**
   * The width of the graph element
   * @defaultValue 400
   */

  width: CSSProperties["width"];
  /**
   * The height of the graph element
   * @defaultValue 400
   * */
  height: CSSProperties["height"];

  /**
   * The padding in pixels of the graph.
   * @defaultValue 0
   * */
  padding: number;
  /**
   * The theme of the graph.
   * @defaultValue darkTheme
   * @see {@link Theme}
   * */
  theme: Theme | keyof typeof defaultThemes;
};

const parseViewspaceSizeInput = (size: CSSProperties["width"]) => {
  const normalized = normalizeCssSize(size);
  if (typeof normalized === "number") return normalized;
  return null;
};

const normalizeCssSize = (size: CSSProperties["width"]) => {
  if (typeof size === "number") return size;
  if (typeof size === "string") {
    const match = size.match(/(\d+)(px|$)/);
    if (match && match[1]) return parseInt(match[1]);
  }
  return size;
};
const useViewspaceSize = (
  ref: React.RefObject<SVGSVGElement> | null,
  width: CSSProperties["width"],
  height: CSSProperties["height"]
) => {
  const parsedWidth = parseViewspaceSizeInput(width);
  const parsedHeight = parseViewspaceSizeInput(height);
  const [ready, setReady] = useSafeState(
    isServerComponent || (parsedWidth !== null && parsedHeight !== null)
  );

  const [viewspaceSize, setViewspaceSize] = useSafeState<Vec2>(
    Vec2.of([parsedWidth ?? 400, parsedHeight ?? 400])
  );

  useSafeLayoutEffect(() => {
    if (parsedWidth !== null && parsedHeight !== null) return;
    const current = ref?.current;
    if (!current) return;
    const setSize = (currentWidth: number, currentHeight: number) => {
      const size = point(
        parsedWidth ?? currentWidth,
        parsedHeight ?? currentHeight
      );
      setViewspaceSize(size);
      if (!ready) setReady(true);
    };

    const rect = current.getBoundingClientRect();

    setSize(rect.width, rect.height);
    const observer = new ResizeObserver(([entry]) => {
      // const { width, height } = current.getBoundingClientRect();

      // console.log(width, current.clientWidth, height);
      setSize(current.clientWidth, current.clientHeight);
    });
    observer.observe(current);
    return () => {
      observer.disconnect();
    };
  }, [parsedHeight, parsedWidth]);

  return { viewspaceSize, ready };
};

export const useGraphContext = (
  props: ContextArguments
): GraphContext & { ready: boolean } => {
  const ref = useSafeRef<SVGSVGElement>(null);
  const { viewspaceSize, ready } = useViewspaceSize(
    ref,
    props.width ?? 400,
    props.height ?? 400
  );
  const coordStep = Vec2.of(props.coordStep ?? [1, 1]);

  const coordBox = fitCoordBoxToView(
    normalizeBBox(
      props.coordBox ?? {
        horizontal: [-10, 10],
        vertical: [10, -10],
      }
    ),
    coordStep,
    viewspaceSize,
    props.padding
  );

  const projectionTransform = useSafeMemo(() => {
    const coordWidth = coordBox.horizontal.y - coordBox.horizontal.x;
    const coordHeight = coordBox.vertical.y - coordBox.vertical.x;

    const a = viewspaceSize.x / coordWidth;
    const d = viewspaceSize.y / coordHeight;

    const tx = coordBox.horizontal.x * -a;
    const ty = coordBox.vertical.x * -d;
    return transform(a, 0, 0, d, tx, ty);
  }, [
    coordBox.horizontal.x,
    coordBox.horizontal.y,
    coordBox.vertical.x,
    coordBox.vertical.y,
  ]);

  const theme = useSafeMemo(() => {
    if (typeof props.theme === "object") {
      return props.theme;
    }
    if (typeof props.theme === "string" && props.theme in defaultThemes) {
      return defaultThemes[props.theme];
    }
    return defaultThemes.dark;
  }, [props.theme]);

  const computeColor = useSafeCallback(
    (color: string | number) => {
      if (typeof color === "string") {
        switch (color) {
          case "background":
            return theme.background.fill ?? "transparent";
          case "body":
            return theme.body;
          case "text":
            return theme.text.fill ?? theme.body;
          default:
            return color;
        }
      }
      return theme.palette[color % theme.palette.length] || "black";
    },
    [theme]
  );

  const projectCoord = useSafeCallback(
    projectCoordFactory(projectionTransform),
    [projectionTransform]
  );

  const unprojectCoord = useSafeCallback(
    unprojectCoordFactory(projectionTransform),
    [projectionTransform]
  );

  const projectSize = useSafeCallback(projectSizeFactory(projectionTransform), [
    projectionTransform,
  ]);

  const projectAbsoluteSize = useSafeCallback(
    projectSizeFactory(projectionTransform, true),
    [projectionTransform]
  );
  const unprojectSize = useSafeCallback(
    projectSizeFactory(projectionTransform, false, true),
    [projectionTransform]
  );

  return {
    ref,
    viewspaceSize,
    coordStep,
    coordBox,
    projectionTransform,
    theme,
    computeColor,
    projectCoord,
    unprojectCoord,
    projectSize,
    projectAbsoluteSize,
    unprojectSize,
    ready,
  };
};
