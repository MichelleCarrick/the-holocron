// A small, targeted buff so that at least one or two builds can beat every
// single canon character, including Yoda — right now the best possible
// build (even with maximum lucky rolls) tops out just below him. Rather
// than re-balancing everything again, this nudges the specific combo that
// was already closest: Dagobah (the strongest planet) + a Zabrak-style
// crystal-boosted saber build. Small, deliberate deltas only:
//   - Dagobah's agility modifier goes from -5 to +5 (there's no strong
//     reason the strongest planet should be bad at agility) and its saber
//     modifier from -5 to 0 (removes a needless penalty).
//   - Zabrak's saber modifier +2, Red Crystal's saber modifier +2.
// Together these are just enough to let the single best possible
// combination (Dagobah + Zabrak + Red Crystal, with ideal rolls) edge out
// Yoda, without meaningfully shifting the overall distribution for every
// other build.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/buff-ultimate-build.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function patchByName(type, name, fields) {
  const doc = await client.fetch(`*[_type == $type && name == $name][0]{_id}`, { type, name })
  if (!doc) {
    console.warn(`${type} "${name}" not found, skipping`)
    return
  }
  await client.patch(doc._id).set(fields).commit()
  console.log(`Patched ${type}:`, name, fields)
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  await patchByName('planet', 'Dagobah', { agilityModifier: 5, saberModifier: 0 })
  await patchByName('species', 'Zabrak', { saberModifier: 16 })
  await patchByName('kyberCrystal', 'Red Crystal', { saberModifier: 18 })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
