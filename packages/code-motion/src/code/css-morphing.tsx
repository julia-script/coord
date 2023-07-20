import { useInsertionEffect } from "react";
const tokenStyles = `
.cm-tkn {
  animation-duration: 1s;
}
`;
const animationCSS = `
.cm-line::before {
  transition: color 1s;
}
.cm-tkn-insertion {
  animation-name: cm-tkn-insertion;
}
.cm-tkn-deletion {
  animation-name: cm-tkn-deletion;
}
.cm-tkn-static {
  animation-name: cm-tkn-static;
}
@keyframes cm-tkn-deletion {
  0% { opacity: var(--tkn-opacity, 1); visibility: visible; }
  50% { opacity: 0; visibility: hidden; }
  100% {}
}
@keyframes cm-tkn-insertion {
  0% { opacity: 0; }
  50% {}
  100% { opacity: var(--tkn-opacity, 1); }
}
@keyframes cm-tkn-static {
  0% {
    opacity: var(--tkn-from-opacity, 1);
    color: var(--tkn-from-color,);
    transform: translate(calc(1ch * var(--tkn-from-dx, 0)), calc(100% * var(--tkn-from-dy, 0)));
  }
  20% {}
  100% {
    opacity: var(--tkn-opacity, 1);
    color: var(--tkn-color,);
    translate: 0;
  }
}
`;
let refCount = 0;
let element: HTMLStyleElement | null = null;
export function useMorphingCSS() {
  useInsertionEffect(() => {
    if (element === null) {
      element = document.createElement("style");
      element.id = "code-block-animations";
      element.innerHTML =
        tokenStyles + "\n" + animationCSS;
      document.head.appendChild(element);
    }
    refCount++;
    return () => {
      refCount--;
      if (refCount === 0) {
        element?.remove();
        element = null;
      }
    };
  });
}
