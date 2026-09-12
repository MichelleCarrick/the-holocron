"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Archive" },
  { href: "/builder", label: "Character Builder" },
  { href: "/studio", label: "Studio" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-gold/20 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.25em] text-gold sm:text-base"
        >
          THE HOLOCRON
        </Link>
        <div className="flex gap-5 text-sm tracking-wide sm:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 transition-colors ${
                  isActive ? "text-gold" : "text-zinc-400 hover:text-gold"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-px bg-gold shadow-[0_0_8px_rgba(201,162,74,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
