import { client } from "../../sanity/lib/client";
import Watermark from "../Watermark";
import BuilderForm from "./BuilderForm";

async function getData() {
  const [planets, species, crystals, canonCharacters, buildTypes] = await Promise.all([
    client.fetch(`*[_type == "planet"] | order(name asc){_id, name, description, image, forceModifier, alignmentModifier, saberModifier, agilityModifier, wisdomModifier, resilienceModifier, nameFragments, notableCharacters, keyEvents, appearances, trivia}`, {}, { next: { revalidate: 0 } }),
    client.fetch(`*[_type == "species"] | order(name asc){_id, name, description, image, forceModifier, alignmentModifier, saberModifier, agilityModifier, wisdomModifier, resilienceModifier, nameFragments, notableCharacters, keyEvents, appearances, trivia}`, {}, { next: { revalidate: 0 } }),
    client.fetch(`*[_type == "kyberCrystal"] | order(name asc){_id, name, color, description, image, forceModifier, alignmentModifier, saberModifier, notableCharacters, keyEvents, appearances, trivia}`, {}, { next: { revalidate: 0 } }),
    client.fetch(`*[_type == "canonCharacter"] | order(name asc){_id, name, image, forcePower, alignment, saberSkill, agility, wisdom, resilience}`, {}, { next: { revalidate: 0 } }),
    client.fetch(`*[_type == "buildType"]{_id, key, name, description}`, {}, { next: { revalidate: 0 } }),
  ]);
  return { planets, species, crystals, canonCharacters, buildTypes };
}

export default async function BuilderPage() {
  const { planets, species, crystals, canonCharacters, buildTypes } = await getData();

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="flex w-full max-w-4xl flex-1 flex-col items-center px-6 py-16 sm:px-10">
        <div className="enter-fade relative mb-12 text-center">
          <Watermark className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06]" />
          <h1 className="font-display text-4xl tracking-[0.15em] text-gold sm:text-5xl">
            CHARACTER BUILDER
          </h1>
          <p className="mt-4 text-zinc-400">
            Choose your origins and let the Force decide your path.
          </p>
        </div>
        <BuilderForm
          planets={planets}
          species={species}
          crystals={crystals}
          canonCharacters={canonCharacters}
          buildTypes={buildTypes}
        />
      </main>
    </div>
  );
}
