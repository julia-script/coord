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
        <main className="flex min-h-screen flex-col items-center">
          <Header />
          <div className="flex h-full w-full flex-grow flex-col">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
