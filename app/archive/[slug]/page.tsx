import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import { categoryStyle } from "../../categoryStyles";
import Watermark from "../../Watermark";

type EntryDetail = {
  _id: string;
  title: string;
  category: string;
  era?: string;
  summary?: string;
  image?: SanityImageSource;
  body?: PortableTextBlock[];
};

type RelatedEntry = {
  _id: string;
  title: string;
  slug: string;
  image?: SanityImageSource;
};

async function getEntry(slug: string): Promise<EntryDetail | null> {
  return client.fetch(
    `*[_type == "archiveEntry" && slug.current == $slug][0]{
      _id, title, category, era, summary, image, body
    }`,
    { slug },
    { next: { revalidate: 0 } }
  );
}

async function getRelated(category: string, excludeId: string): Promise<RelatedEntry[]> {
  return client.fetch(
    `*[_type == "archiveEntry" && category == $category && _id != $excludeId] | order(title asc)[0...3]{
      _id, title, "slug": slug.current, image
    }`,
    { category, excludeId },
    { next: { revalidate: 0 } }
  );
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-base leading-relaxed text-zinc-300">{children}</p>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-3 mt-6 font-display text-xl text-gold">{children}</h2>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-6 font-display text-lg text-gold">{children}</h3>
    ),
  },
};

export default async function ArchiveEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);

  if (!entry) {
    notFound();
  }

  const style = categoryStyle(entry.category);
  const related = await getRelated(entry.category, entry._id);

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="flex w-full max-w-4xl flex-1 flex-col px-6 py-16 sm:px-10">
        <Link
          href="/"
          className="mb-8 w-fit text-sm text-zinc-500 transition-colors hover:text-gold"
        >
          ← Back to the Archive
        </Link>

        <div className="enter-fade flex flex-col gap-8 sm:flex-row">
          <div className="relative mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 sm:mx-0">
            <Watermark
              className="absolute inset-0 h-full w-full opacity-[0.08]"
              style={{ color: style.accent }}
            />
            {entry.image && (
              <Image
                src={urlFor(entry.image).width(400).height(400).fit("crop").url()}
                alt={entry.title}
                fill
                sizes="192px"
                className="object-cover"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-full border px-2 py-0.5 uppercase tracking-wider ${style.badge}`}>
                {style.label || entry.category}
              </span>
              {entry.era && <span className="text-zinc-500">{entry.era}</span>}
            </div>
            <h1 className="mt-2 font-display text-3xl tracking-wide text-gold sm:text-4xl">
              {entry.title}
            </h1>
            {entry.summary && (
              <p className="mt-4 text-lg leading-relaxed text-zinc-300">{entry.summary}</p>
            )}
          </div>
        </div>

        {entry.body && entry.body.length > 0 && (
          <div className="enter-fade mt-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
            <PortableText value={entry.body} components={portableTextComponents} />
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <p className="font-display text-xs uppercase tracking-widest text-zinc-500">
              More {style.label || entry.category}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`/archive/${item.slug}`}
                    className={`holo-card flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 transition-all duration-300 ${style.glow}`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-800 ring-1 ring-white/5">
                      {item.image && (
                        <Image
                          src={urlFor(item.image).width(80).height(80).url()}
                          alt={item.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="truncate text-sm text-zinc-200">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
