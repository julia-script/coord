import { Header } from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="bg-dark-950 dark text-white">
      <body className={inter.className}>
        <main className="flex min-h-screen w-full flex-col items-center justify-stretch">
          {children}
        </main>
      </body>
    </html>
  );
}
