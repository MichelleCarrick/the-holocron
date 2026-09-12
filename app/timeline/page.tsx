import Image from "next/image";
import Link from "next/link";
import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { ERA_OPTIONS, categoryStyle } from "../categoryStyles";
import Watermark from "../Watermark";
import type { SanityImageSource } from "@sanity/image-url";

type TimelineEntry = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  era?: string;
  image?: SanityImageSource;
};

async function getEntries(): Promise<TimelineEntry[]> {
  return client.fetch(
    `*[_type == "archiveEntry"] | order(title asc){
      _id, title, "slug": slug.current, category, era, image
    }`,
    {},
    { next: { revalidate: 0 } }
  );
}

// Chronological order, oldest first — the same six eras used across the
// site's era filters and content, just ordered here instead of alphabetized.
const ERA_ORDER = ERA_OPTIONS.filter((option) => option.value !== "all").map(
  (option) => option.value
);
const UNDATED_LABEL = "Undated";

export default async function TimelinePage() {
  const entries = await getEntries();

  const byEra = new Map<string, TimelineEntry[]>();
  for (const entry of entries) {
    const key = entry.era ?? UNDATED_LABEL;
    if (!byEra.has(key)) byEra.set(key, []);
    byEra.get(key)!.push(entry);
  }

  const orderedEras = [...ERA_ORDER, UNDATED_LABEL].filter((era) => byEra.has(era));

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="flex w-full max-w-4xl flex-1 flex-col items-center px-6 py-16 sm:px-10">
        <div className="enter-fade relative mb-14 text-center">
          <Watermark className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06]" />
          <h1 className="font-display text-4xl tracking-[0.15em] text-gold sm:text-5xl">
            GALACTIC TIMELINE
          </h1>
          <p className="mt-4 text-zinc-400">
            The archive, laid out across galactic history.
          </p>
        </div>

        <div className="relative w-full border-l border-gold/20 pl-8 sm:pl-10">
          {orderedEras.map((era) => (
            <section key={era} className="enter-fade relative mb-14 last:mb-0">
              <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(201,162,74,0.8)] sm:-left-[calc(2.5rem+5px)]" />
              <h2 className="font-display text-lg tracking-widest text-gold sm:text-xl">
                {era}
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {byEra.get(era)!.map((entry) => {
                  const style = categoryStyle(entry.category);
                  return (
                    <li key={entry._id}>
                      <Link
                        href={`/archive/${entry.slug}`}
                        className={`holo-card flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 transition-all duration-300 hover:-translate-y-0.5 ${style.glow}`}
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-800 ring-1 ring-white/5">
                          {entry.image && (
                            <Image
                              src={urlFor(entry.image).width(80).height(80).url()}
                              alt={entry.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm text-zinc-200">{entry.title}</p>
                          <span className={`inline-block rounded-full border px-1.5 py-0 text-[10px] uppercase tracking-wider ${style.badge}`}>
                            {style.label || entry.category}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
