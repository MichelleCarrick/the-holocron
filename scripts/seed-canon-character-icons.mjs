// Uploads an icon for each canon character and sets it as their `image`.
// Reuses the exact same icon (path, background, accent) already assigned
// to that character's Archive Entry page in seed-archive-entries.mjs /
// seed-reference-entries.mjs, so a character looks the same whether you
// see them in the archive or in the Character Builder's canon roster.
// Matched by name, so safe to re-run.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-canon-character-icons.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const GAME_ICONS_BASE = 'https://raw.githubusercontent.com/game-icons/icons/master/'

async function fetchIcon(path, bg, accent) {
  const res = await fetch(GAME_ICONS_BASE + path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  const svg = await res.text()
  return svg
    .replace('<path d="M0 0h512v512H0z"/>', `<path fill="${bg}" d="M0 0h512v512H0z"/>`)
    .replace(/fill="#fff"/g, `fill="${accent}"`)
}

const icons = {
  Yoda: { icon: 'delapouite/wizard-face.svg', bg: '#0e2414', accent: '#4fdc8a' },
  'Darth Vader': { icon: 'darkzaitzev/hooded-figure.svg', bg: '#240808', accent: '#ff5c5c' },
  'Luke Skywalker': { icon: 'lorc/hood.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  'Obi-Wan Kenobi': { icon: 'lorc/robe.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  'Anakin Skywalker': { icon: 'lorc/hood.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  Palpatine: { icon: 'darkzaitzev/hooded-figure.svg', bg: '#240808', accent: '#ff5c5c' },
  'Mace Windu': { icon: 'lorc/hood.svg', bg: '#1a0f2a', accent: '#b06fff' },
  'Darth Maul': { icon: 'lorc/bull-horns.svg', bg: '#2a1010', accent: '#ff5c5c' },
  'Qui-Gon Jinn': { icon: 'lorc/robe.svg', bg: '#0e2414', accent: '#4fdc8a' },
  'Ahsoka Tano': { icon: 'delapouite/tiger-head.svg', bg: '#2a1020', accent: '#d98bb0' },
  Rey: { icon: 'lorc/hood.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  'Kylo Ren': { icon: 'darkzaitzev/hooded-figure.svg', bg: '#240808', accent: '#ff5c5c' },
  'Count Dooku': { icon: 'darkzaitzev/hooded-figure.svg', bg: '#241008', accent: '#e8946a' },
  'Agen Kolar': { icon: 'lorc/bull-horns.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  'Savage Opress': { icon: 'lorc/bull-horns.svg', bg: '#2a1010', accent: '#ff5c5c' },
  'Shaak Ti': { icon: 'delapouite/tiger-head.svg', bg: '#2a1020', accent: '#d98bb0' },
  'Aayla Secura': { icon: 'lorc/squid-head.svg', bg: '#0d2733', accent: '#4f9dc9' },
  'General Grievous': { icon: 'delapouite/astronaut-helmet.svg', bg: '#182018', accent: '#8fbf6a' },
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }

  const docs = await client.fetch(`*[_type == "canonCharacter"]{_id, name}`)
  for (const doc of docs) {
    const spec = icons[doc.name]
    if (!spec) {
      console.warn(`No icon defined for canonCharacter "${doc.name}", skipping`)
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

    console.log('Set image for canonCharacter:', doc.name)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
