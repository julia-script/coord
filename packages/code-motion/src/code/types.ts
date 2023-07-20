export type Token = {
  content: string;
  skipLines: number;
  indent: number;
  styles: string[];
  type: "static" | "insertion" | "deletion";
  pastStyles: string[];
};
