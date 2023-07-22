export type Token = {
  content: string;
  skipLines: number;
  indent: number;
  styles: string[];
  type: "static" | "insertion" | "deletion";
  pastStyles: string[];
};

export type ApplyTo = "past" | "future" | "both";
export type LimitedApplyTo = "past" | "future";
