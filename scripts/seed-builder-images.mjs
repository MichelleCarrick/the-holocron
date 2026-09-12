// Uploads an icon for each planet, species, and kyber crystal already in
// Sanity, and patches the matching document's `image` field to point at it.
//
// Icons come from game-icons.net (via the game-icons/icons GitHub mirror),
// licensed CC BY 3.0 — free to use and recolor as long as they're credited.
// That credit lives in the site footer (see app/layout.tsx). No Star Wars
// artwork is used anywhere; these are generic icons (a desert, a snowflake,
// a gem, etc.) picked to evoke each item without copying any franchise art.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-builder-images.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const GAME_ICONS_BASE = 'https://raw.githubusercontent.com/game-icons/icons/master/'

// Every game-icons.net SVG is a 512x512 black square with one white icon
// path on top. Swapping those two colors gives each item its own look.
async function fetchIcon(path, bg, accent) {
  const res = await fetch(GAME_ICONS_BASE + path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  const svg = await res.text()
  return svg
    .replace('<path d="M0 0h512v512H0z"/>', `<path fill="${bg}" d="M0 0h512v512H0z"/>`)
    .replace(/fill="#fff"/g, `fill="${accent}"`)
}

// icon: game-icons.net path (author/icon-name.svg), credited in the footer
// bg/accent: background and icon colors, themed per item
const iconSpecs = {
  planet: {
    Tatooine: { icon: 'delapouite/desert.svg', bg: '#3a2a15', accent: '#e8c789' },
    Naboo: { icon: 'delapouite/oasis.svg', bg: '#123a2c', accent: '#7fd0d6' },
    Coruscant: { icon: 'delapouite/modern-city.svg', bg: '#201f2b', accent: '#ffd97a' },
    Hoth: { icon: 'lorc/snowflake-1.svg', bg: '#16324a', accent: '#f2f8ff' },
    Dagobah: { icon: 'delapouite/swamp.svg', bg: '#0e2414', accent: '#6fae5c' },
  },
  species: {
    Human: { icon: 'delapouite/person.svg', bg: '#1c1f2a', accent: '#d9a066' },
    Wookiee: { icon: 'delapouite/gorilla.svg', bg: '#241708', accent: '#b98a54' },
    "Twi'lek": { icon: 'lorc/squid-head.svg', bg: '#0d2733', accent: '#4f9dc9' },
    Zabrak: { icon: 'lorc/bull-horns.svg', bg: '#2a1010', accent: '#c96b6b' },
    Togruta: { icon: 'delapouite/tiger-head.svg', bg: '#2a1020', accent: '#d98bb0' },
  },
  kyberCrystal: {
    'Blue Crystal': { icon: 'lorc/crystal-shine.svg', bg: '#05070c', accent: '#4fa8ff' },
    'Green Crystal': { icon: 'lorc/crystal-growth.svg', bg: '#05070c', accent: '#4fdc8a' },
    'Yellow Crystal': { icon: 'lorc/floating-crystal.svg', bg: '#05070c', accent: '#ffe066' },
    'Purple Crystal': { icon: 'lorc/crystal-cluster.svg', bg: '#05070c', accent: '#b06fff' },
    'Red Crystal': { icon: 'delapouite/fire-gem.svg', bg: '#05070c', accent: '#ff5c5c' },
  },
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }

  for (const [type, specs] of Object.entries(iconSpecs)) {
    const docs = await client.fetch(`*[_type == $type]{_id, name}`, { type })

    for (const doc of docs) {
      const spec = specs[doc.name]
      if (!spec) {
        console.warn(`No icon defined for ${type} "${doc.name}", skipping`)
        continue
      }

      const svg = await fetchIcon(spec.icon, spec.bg, spec.accent)
      const asset = await client.assets.upload('image', Buffer.from(svg), {
        filename: `${slugify(doc.name)}.svg`,
        contentType: 'image/svg+xml',
      })

      await client
        .patch(doc._id)
        .set({ image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
        .commit()

      console.log(`Set image for ${type}: ${doc.name}`)
    }
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
