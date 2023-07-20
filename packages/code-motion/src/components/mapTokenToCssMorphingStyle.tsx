import cn from "clsx";
import { Theme, computeStyles } from "..";
import { TokenProps } from "./Token/TokenElement";
import { CSSProperties } from "react";
import { isUndefined } from "@coord/core/dist";

export const mapTokenToCssMorphingStyle = (
  props: TokenProps,
  prevTheme: Theme
) => {
  const { token, theme } = props;
  props.className = cn(
    props.className,
    `cm-tkn-${token.type}`
  );
  props.style = {};
  token.pastStyles = [
    "foreground",
    ...token.pastStyles,
  ];
  token.styles = ["foreground", ...token.styles];

  if (token.type === "deletion") {
    const styles = computeStyles(
      prevTheme,
      token.pastStyles
    );

    Object.assign(
      props.style,
      propertiesAsVariables({
        ...styles,
        position: "absolute",
        top: 0,
        left: 0,
        visibility: "hidden",
        "--tkn-dx": token.pastPosition.column,
        "--tkn-dy": token.pastPosition.line,
      } as CSSProperties)
    );

    return props;
  }
  if (token.type === "insertion") {
    const styles = computeStyles(
      theme,
      token.styles
    );
    Object.assign(
      props.style,
      propertiesAsVariables(styles)
    );

    return props;
  }

  const styles = computeStyles(
    theme,
    token.styles
  );

  const pastStyles = computeStyles(
    prevTheme,
    token.pastStyles
  );

  const dx =
    token.pastPosition.column -
    token.position.column;
  const dy =
    token.pastPosition.line - token.position.line;

  const positionVars: Record<
    string,
    number | string
  > = {};
  if (dx) positionVars["--tkn-from-dx"] = dx;
  if (dy) positionVars["--tkn-from-dy"] = dy;

  Object.assign(
    props.style,
    propertiesAsVariables(styles),
    propertiesAsVariables(
      pastStyles,
      false,
      "--tkn-from"
    ),
    positionVars
  );
  return props;
};

const propertiesAsVariables = (
  properties: CSSProperties,
  includeRest = true,
  prefix = "--tkn"
) => {
  const { opacity, color, ...styles } =
    properties;
  const out = includeRest ? styles : {};

  Object.assign(
    out,
    opacity
      ? {
          [`${prefix}-opacity`]: opacity,
        }
      : {},
    color
      ? {
          [`${prefix}-color`]: color,
        }
      : {}
  );

  return out;
};
