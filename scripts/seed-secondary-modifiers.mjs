// Populates agilityModifier/wisdomModifier/resilienceModifier for every
// planet and species. These fields existed in the schema but were never
// given real values (they defaulted to 0), which meant every build's
// Agility/Wisdom/Resilience was ~50 regardless of what you picked. This
// gives each planet/species a distinct, lore-flavored effect on those
// three stats, matched by name so it's safe to re-run.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-secondary-modifiers.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const planetModifiers = {
  Tatooine: { agilityModifier: 2, wisdomModifier: 0, resilienceModifier: 3 },
  Naboo: { agilityModifier: 1, wisdomModifier: 3, resilienceModifier: 0 },
  Coruscant: { agilityModifier: 1, wisdomModifier: 2, resilienceModifier: -1 },
  Hoth: { agilityModifier: -3, wisdomModifier: 0, resilienceModifier: 5 },
  Dagobah: { agilityModifier: -2, wisdomModifier: 5, resilienceModifier: 2 },
  Kashyyyk: { agilityModifier: 1, wisdomModifier: 1, resilienceModifier: 4 },
  Mustafar: { agilityModifier: -1, wisdomModifier: -2, resilienceModifier: 3 },
  Endor: { agilityModifier: 4, wisdomModifier: 1, resilienceModifier: 0 },
  Kamino: { agilityModifier: 2, wisdomModifier: 2, resilienceModifier: -1 },
  Geonosis: { agilityModifier: 3, wisdomModifier: -2, resilienceModifier: 1 },
}

const speciesModifiers = {
  Human: { agilityModifier: 1, wisdomModifier: 1, resilienceModifier: 1 },
  Wookiee: { agilityModifier: -2, wisdomModifier: 0, resilienceModifier: 6 },
  "Twi'lek": { agilityModifier: 3, wisdomModifier: 1, resilienceModifier: -1 },
  Zabrak: { agilityModifier: 2, wisdomModifier: -1, resilienceModifier: 3 },
  Togruta: { agilityModifier: 4, wisdomModifier: 2, resilienceModifier: 0 },
  Rodian: { agilityModifier: 3, wisdomModifier: -1, resilienceModifier: 0 },
  Trandoshan: { agilityModifier: 1, wisdomModifier: -2, resilienceModifier: 5 },
  Ewok: { agilityModifier: 3, wisdomModifier: 1, resilienceModifier: -2 },
  'Mon Calamari': { agilityModifier: -1, wisdomModifier: 4, resilienceModifier: 1 },
  Duros: { agilityModifier: 2, wisdomModifier: 2, resilienceModifier: -1 },
}

async function patchAll(type, modifiersByName) {
  const docs = await client.fetch(`*[_type == $type]{_id, name}`, { type })
  for (const doc of docs) {
    const mods = modifiersByName[doc.name]
    if (!mods) {
      console.warn(`No secondary modifiers defined for ${type} "${doc.name}", skipping`)
      continue
    }
    await client.patch(doc._id).set(mods).commit()
    console.log(`Patched ${type}:`, doc.name)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  await patchAll('planet', planetModifiers)
  await patchAll('species', speciesModifiers)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
