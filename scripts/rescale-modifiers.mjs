// Sets the force/saber/agility/wisdom/resilience modifiers for every
// planet, species, and kyber crystal to values with real spread.
//
// The first attempt at this just multiplied the original small modifiers
// by 3, but that didn't fix the "every build feels the same" problem:
// averaging 5 stats together smooths out swings that only hit 1-2 stats
// at a time. A planet that's +15 force but -10 saber barely moves the
// average at all. So this version deliberately makes some planets/species
// weak across MOST of their five stats at once (e.g. Hoth, Ewok) and
// others strong across most of theirs (e.g. Dagobah, Wookiee), so picking
// a coherent "weak" or "strong" combination actually swings your overall
// power level, not just one bar on the chart.
//
// Alignment modifiers are untouched here — that's a separate moral axis,
// not part of the power/tier system.
//
// Safe to re-run: sets absolute values rather than multiplying live ones.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/rescale-modifiers.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// { forceModifier, saberModifier, agilityModifier, wisdomModifier, resilienceModifier }
const planetModifiers = {
  Tatooine: { forceModifier: -8, saberModifier: 2, agilityModifier: 6, wisdomModifier: -6, resilienceModifier: -14 },
  Naboo: { forceModifier: 4, saberModifier: -2, agilityModifier: 2, wisdomModifier: 8, resilienceModifier: 3 },
  Coruscant: { forceModifier: 6, saberModifier: 3, agilityModifier: 3, wisdomModifier: 10, resilienceModifier: 3 },
  Hoth: { forceModifier: -10, saberModifier: 2, agilityModifier: -25, wisdomModifier: -5, resilienceModifier: -17 },
  Dagobah: { forceModifier: 25, saberModifier: -5, agilityModifier: -5, wisdomModifier: 40, resilienceModifier: 30 },
  Kashyyyk: { forceModifier: 6, saberModifier: 10, agilityModifier: 3, wisdomModifier: 2, resilienceModifier: 14 },
  Mustafar: { forceModifier: 14, saberModifier: 12, agilityModifier: -3, wisdomModifier: -8, resilienceModifier: 40 },
  Endor: { forceModifier: -8, saberModifier: -15, agilityModifier: 8, wisdomModifier: -4, resilienceModifier: -16 },
  Kamino: { forceModifier: -3, saberModifier: 4, agilityModifier: 6, wisdomModifier: 6, resilienceModifier: -18 },
  Geonosis: { forceModifier: 2, saberModifier: 5, agilityModifier: 8, wisdomModifier: -20, resilienceModifier: -20 },
}

const speciesModifiers = {
  Human: { forceModifier: 0, saberModifier: 0, agilityModifier: 0, wisdomModifier: 0, resilienceModifier: 0 },
  Wookiee: { forceModifier: -5, saberModifier: 20, agilityModifier: -8, wisdomModifier: -4, resilienceModifier: 52 },
  "Twi'lek": { forceModifier: 2, saberModifier: 2, agilityModifier: 10, wisdomModifier: 2, resilienceModifier: -6 },
  Zabrak: { forceModifier: 8, saberModifier: 14, agilityModifier: 6, wisdomModifier: -8, resilienceModifier: 15 },
  Togruta: { forceModifier: 10, saberModifier: 3, agilityModifier: 18, wisdomModifier: 8, resilienceModifier: 6 },
  Rodian: { forceModifier: -3, saberModifier: 5, agilityModifier: 10, wisdomModifier: -12, resilienceModifier: -10 },
  Trandoshan: { forceModifier: -5, saberModifier: 15, agilityModifier: 2, wisdomModifier: -12, resilienceModifier: 25 },
  Ewok: { forceModifier: -8, saberModifier: -25, agilityModifier: 8, wisdomModifier: -6, resilienceModifier: -24 },
  'Mon Calamari': { forceModifier: 5, saberModifier: -8, agilityModifier: -5, wisdomModifier: 28, resilienceModifier: 10 },
  Duros: { forceModifier: -3, saberModifier: -6, agilityModifier: 8, wisdomModifier: 5, resilienceModifier: -12 },
}

const crystalModifiers = {
  'Blue Crystal': { forceModifier: 5, saberModifier: 5 },
  'Green Crystal': { forceModifier: 6, saberModifier: 0 },
  'Yellow Crystal': { forceModifier: 6, saberModifier: 10 },
  'Purple Crystal': { forceModifier: 10, saberModifier: 12 },
  'Red Crystal': { forceModifier: 12, saberModifier: 16 },
}

async function patchAll(type, modifiersByName) {
  const docs = await client.fetch(`*[_type == $type]{_id, name}`, { type })
  for (const doc of docs) {
    const mods = modifiersByName[doc.name]
    if (!mods) {
      console.warn(`No modifiers defined for ${type} "${doc.name}", skipping`)
      continue
    }
    await client.patch(doc._id).set(mods).commit()
    console.log(`Set modifiers for ${type}:`, doc.name)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  await patchAll('planet', planetModifiers)
  await patchAll('species', speciesModifiers)
  await patchAll('kyberCrystal', crystalModifiers)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
