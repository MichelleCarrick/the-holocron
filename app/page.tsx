import { client } from "../sanity/lib/client";
import ArchiveBrowser, { type ArchiveEntry } from "./ArchiveBrowser";
import Watermark from "./Watermark";

async function getEntries(): Promise<ArchiveEntry[]> {
  return client.fetch(
    `*[_type == "archiveEntry"] | order(title asc){
      _id,
      title,
      "slug": slug.current,
      category,
      era,
      summary,
      image
    }`,
    {},
    { next: { revalidate: 0 } }
  );
}

export default async function Home() {
  const entries = await getEntries();

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-16 sm:px-10">
        <div className="enter-fade relative mb-14 text-center">
          <Watermark className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06]" />
          <h1 className="font-display text-4xl tracking-[0.15em] text-gold sm:text-5xl">
            THE HOLOCRON
          </h1>
          <p className="mt-4 text-zinc-400">
            A living archive of lore from across the galaxy.
          </p>
        </div>

        <ArchiveBrowser entries={entries} />
      </main>
    </div>
  );
}
