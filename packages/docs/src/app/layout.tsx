import { Header } from "@/components/Header";
import "./globals.css";
// import { Inter } from "@next/font/google";
import { Footer } from "@/components/Footer";
import cn from "clsx";
// const inter = Inter({ subsets: ["latin"] });

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
          // inter.className,
          "dark:bg-dark dark:text-white"
        )}
      >
        {children}
      </body>
    </html>
  );
}
