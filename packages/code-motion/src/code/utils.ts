import { Token } from "./types";

export const existsInThePast = (token: Token) => {
  return token.type !== "insertion";
};

export const existsInTheFuture = (
  token: Token
) => {
  return token.type !== "deletion";
};

export type TokenFilter = (
  token: Token
) => boolean;

export type ApplyTo = "past" | "future" | "both";
export type LimitedApplyTo = "past" | "future";

export function shouldApplyToFuture(
  when: ApplyTo
): boolean {
  return when !== "past";
}

export function shouldApplyToPast(
  when: ApplyTo
): boolean {
  return when !== "future";
}
