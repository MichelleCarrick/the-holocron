import { client } from "../../sanity/lib/client";
import Watermark from "../Watermark";
import DuelArena, { type DuelCharacter } from "./DuelArena";

async function getCanonCharacters(): Promise<DuelCharacter[]> {
  return client.fetch(
    `*[_type == "canonCharacter"] | order(name asc){
      "id": _id,
      name,
      image,
      forcePower,
      saberSkill,
      agility,
      wisdom,
      resilience
    }`,
    {},
    { next: { revalidate: 0 } }
  );
}

export default async function DuelPage() {
  const characters = await getCanonCharacters();

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center px-6 py-16 sm:px-10">
        <div className="enter-fade relative mb-12 text-center">
          <Watermark className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06]" />
          <h1 className="font-display text-4xl tracking-[0.15em] text-gold sm:text-5xl">
            DUEL ARENA
          </h1>
          <p className="mt-4 text-zinc-400">
            Pit two canon characters against each other and watch the duel unfold.
          </p>
        </div>

        <DuelArena characters={characters} />
      </main>
    </div>
  );
}
