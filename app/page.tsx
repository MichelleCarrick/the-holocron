import { client } from "../sanity/lib/client";

type ArchiveEntry = {
  _id: string;
  title: string;
  category: string;
  era?: string;
  summary?: string;
};

async function getEntries(): Promise<ArchiveEntry[]> {
  return client.fetch(
    `*[_type == "archiveEntry"] | order(title asc){
      _id,
      title,
      category,
      era,
      summary
    }`
  );
}

export default async function Home() {
  const entries = await getEntries();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-16 px-8">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
          The Holocron
        </h1>

        {entries.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No entries yet. Add one in the Studio at /studio.
          </p>
        ) : (
          <ul className="w-full flex flex-col gap-6">
            {entries.map((entry) => (
              <li
                key={entry._id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                  {entry.title}
                </h2>
                <p className="text-sm uppercase tracking-wide text-zinc-500 mb-2">
                  {entry.category}
                  {entry.era ? ` • ${entry.era}` : ""}
                </p>
                {entry.summary && (
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {entry.summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
