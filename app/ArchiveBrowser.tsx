"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "../sanity/lib/image";
import { CATEGORY_OPTIONS, ERA_OPTIONS, categoryStyle } from "./categoryStyles";

export type ArchiveEntry = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  era?: string;
  summary?: string;
  image?: SanityImageSource;
};

const SELECT_CLASS =
  "rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-gold focus:outline-none";

export default function ArchiveBrowser({ entries }: { entries: ArchiveEntry[] }) {
  const [category, setCategory] = useState("all");
  const [era, setEra] = useState("all");

  const filtered = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (category === "all" || entry.category === category) &&
          (era === "all" || entry.era === era)
      ),
    [entries, category, era]
  );

  if (entries.length === 0) {
    return (
      <p className="text-zinc-400">
        No entries yet. Add one in the Studio at /studio.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={SELECT_CLASS}
          aria-label="Filter by category"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={era}
          onChange={(e) => setEra(e.target.value)}
          className={SELECT_CLASS}
          aria-label="Filter by era"
        >
          {ERA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-400">
          No entries match these filters.
        </p>
      ) : (
        <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry, index) => {
            const style = categoryStyle(entry.category);
            return (
              <li
                key={entry._id}
                className="enter-fade"
                style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
              >
                <Link
                  href={`/archive/${entry.slug}`}
                  className={`holo-card block h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all duration-300 hover:-translate-y-0.5 ${style.glow}`}
                >
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/5">
                      {entry.image && (
                        <Image
                          src={urlFor(entry.image).width(128).height(128).url()}
                          alt={entry.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-display text-lg tracking-wide text-zinc-100">
                        {entry.title}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`rounded-full border px-2 py-0.5 uppercase tracking-wider ${style.badge}`}
                        >
                          {style.label || entry.category}
                        </span>
                        {entry.era && (
                          <span className="text-zinc-500">{entry.era}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {entry.summary && (
                    <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                      {entry.summary}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
