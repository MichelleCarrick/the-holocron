import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import SiteHeader from "./SiteHeader";
import Watermark from "./Watermark";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Holocron",
  description:
    "A Star Wars fan archive of lore, plus an interactive Character Builder.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <Watermark className="h-[120vmin] w-[120vmin] text-gold opacity-[0.03]" />
        </div>

        <SiteHeader />

        {children}

        <footer className="border-t border-gold/10 px-8 py-4 text-center text-xs text-zinc-500">
          Icons by{" "}
          <a
            href="https://game-icons.net/1x1/lorc/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold"
          >
            Lorc
          </a>
          ,{" "}
          <a
            href="https://game-icons.net/1x1/delapouite/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold"
          >
            Delapouite
          </a>
          , and{" "}
          <a
            href="https://game-icons.net/1x1/darkzaitzev/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold"
          >
            DarkZaitzev
          </a>{" "}
          via{" "}
          <a
            href="https://game-icons.net"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold"
          >
            game-icons.net
          </a>
          , licensed{" "}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold"
          >
            CC BY 3.0
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
