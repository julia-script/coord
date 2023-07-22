import "./globals.css";
import { Inconsolata } from "next/font/google";
import cn from "clsx";

const mono = Inconsolata({
  weight: ["600"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "@coord/graph",
  description: "A graphing library for React",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" dir="ltr">
      <body
        className={cn(
          mono.variable,
          "dark:bg-dark dark:text-white"
        )}
      >
        {children}
      </body>
    </html>
  );
}
