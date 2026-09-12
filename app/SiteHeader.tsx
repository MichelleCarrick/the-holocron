"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Archive" },
  { href: "/timeline", label: "Timeline" },
  { href: "/builder", label: "Character Builder" },
  { href: "/duel", label: "Duel Arena" },
  { href: "/trivia", label: "Trivia" },
  { href: "/studio", label: "Studio" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isLinkActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gold/20 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.25em] text-gold sm:text-base"
        >
          THE HOLOCRON
        </Link>

        <div className="hidden gap-6 text-sm tracking-wide lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
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

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col gap-1.5 p-1 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`h-px w-6 bg-zinc-300 transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-zinc-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-zinc-300 transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-gold/10 bg-background/95 px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4 text-sm">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={isActive ? "text-gold" : "text-zinc-400"}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
