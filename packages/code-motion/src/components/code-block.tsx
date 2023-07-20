// import React, {
//   ComponentProps,
//   useMemo,
// } from "react";
// import {
//   AnimatedTag,
//   LanguageOptions,
//   Regions,
//   Tagifier,
// } from "@/code";
// import { SmoothReplace } from "./smooth-replace";
// import {
//   CodeOptions,
//   normalizeOptions,
// } from "@/hooks";
// import { Typewriter } from "./type-replace";
// import { Theme, curves } from "..";

// export type CodeState = {
//   theme?: Theme;
//   code: AnimatedTag[];
//   transition: number;
//   noBg?: boolean;
//   options?: Partial<
//     Omit<CodeOptions, "language" | "easing">
//   >;
// } & React.HTMLAttributes<HTMLPreElement>;

// export function CodeBlock({
//   code,
//   theme = curves,
//   language,
//   noBg = false,
//   children,
//   ...rest
// }: {
//   code: string;
//   noBg?: boolean;
//   theme?: Theme;
//   language?: LanguageOptions;
// } & ComponentProps<"pre">) {
//   const tags = useMemo(
//     () =>
//       Tagifier.generateTags(
//         ["", code],
//         theme,
//         language
//       ),
//     [code]
//   );
//   const style = Object.assign(
//     { overflow: "hidden" },
//     noBg
//       ? {}
//       : {
//           padding: "0.5em",
//           borderRadius: "0.2em",
//           ...theme.styles.background,
//         }
//   );
//   return (
//     <pre style={style} {...rest}>
//       {children}
//       <code>
//         {tags.map((tag) => (
//           <span key={tag._id} style={tag.styles}>
//             {tag.code}
//           </span>
//         ))}
//       </code>
//     </pre>
//   );
// }
// export function CodeMorph({
//   code,
//   transition,
//   options = {},
//   theme = curves,
//   noBg = false,
//   ...rest
// }: CodeState) {
//   const config = normalizeOptions(options);
//   const style = Object.assign(
//     noBg
//       ? {}
//       : {
//           padding: "0.5em",
//           borderRadius: "0.2em",
//           ...theme.styles.background,
//         }
//   );
//   return (
//     <pre style={style} {...rest}>
//       {config.mode === "fade" ? (
//         <SmoothReplace
//           transition={transition}
//           tags={code}
//         />
//       ) : (
//         <Typewriter
//           transition={transition}
//           tags={code}
//         />
//       )}
//     </pre>
//   );
// }

// type CodeMotionProps = {
//   code: Regions[];
//   language?: LanguageOptions;
// } & Omit<CodeState, "code">;

// export function CodeMotion({
//   code,
//   theme = curves,
//   language,
//   ...rest
// }: CodeMotionProps) {
//   const tags = useMemo(
//     () =>
//       Tagifier.generateTags(
//         code,
//         theme,
//         language
//       ),
//     [code]
//   );
//   return <CodeMorph code={tags} {...rest} />;
// }
