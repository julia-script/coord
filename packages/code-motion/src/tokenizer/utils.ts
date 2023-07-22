import { Token } from "../types";

export const existsInThePast = (token: Token) => {
  return token.type !== "insertion";
};

export const existsInTheFuture = (
  token: Token
) => {
  return token.type !== "deletion";
};
