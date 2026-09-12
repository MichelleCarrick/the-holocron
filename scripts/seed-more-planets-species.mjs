// Adds five more planets and five more species to the character builder,
// each with an icon uploaded as its image. Safe to re-run: items are
// matched by name, so existing ones are updated in place instead of
// duplicated.
//
// Icons come from game-icons.net (via the game-icons/icons GitHub mirror),
// licensed CC BY 3.0 — credited in the site footer (see app/layout.tsx).
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-more-planets-species.mjs
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

const planets = [
  {
    name: 'Kashyyyk',
    description: 'A vast forest world of towering wroshyr trees, homeworld of the Wookiees.',
    forceModifier: 1,
    alignmentModifier: 2,
    saberModifier: 3,
    nameFragments: ['Kash', 'Wyy', 'Rrowr', 'Thur'],
    icon: { icon: 'delapouite/forest.svg', bg: '#0e2a12', accent: '#5fbf6a' },
  },
  {
    name: 'Mustafar',
    description: 'A volcanic world of rivers of lava and mining stations, later home to a Sith fortress.',
    forceModifier: 2,
    alignmentModifier: -6,
    saberModifier: 2,
    nameFragments: ['Must', 'Far', 'Ashk', 'Vulc'],
    icon: { icon: 'lorc/volcano.svg', bg: '#2a0e08', accent: '#ff6a3d' },
  },
  {
    name: 'Endor',
    description: 'A lush forest moon of towering trees, home to the tribal Ewoks.',
    forceModifier: 0,
    alignmentModifier: 4,
    saberModifier: 0,
    nameFragments: ['End', 'Bright', 'Fern', 'Wik'],
    icon: { icon: 'delapouite/circle-forest.svg', bg: '#122a1a', accent: '#7fd68a' },
  },
  {
    name: 'Kamino',
    description: 'A remote ocean world of endless storms, home to a cloning facility hidden from the galaxy.',
    forceModifier: 0,
    alignmentModifier: 0,
    saberModifier: 1,
    nameFragments: ['Kam', 'Tipoc', 'Rain', 'Nimb'],
    icon: { icon: 'lorc/waves.svg', bg: '#0a2436', accent: '#5fc9e8' },
  },
  {
    name: 'Geonosis',
    description: 'An arid, rocky world riddled with insectoid hive colonies and droid foundries.',
    forceModifier: 1,
    alignmentModifier: -4,
    saberModifier: 1,
    nameFragments: ['Geo', 'Nosis', 'Hive', 'Karst'],
    icon: { icon: 'delapouite/beehive.svg', bg: '#2a1f10', accent: '#d9a24a' },
  },
]

const species = [
  {
    name: 'Rodian',
    description: 'A keen-eyed, green-skinned species famed across the galaxy as trackers and bounty hunters.',
    forceModifier: 0,
    alignmentModifier: -2,
    saberModifier: 1,
    nameFragments: ['Gre', 'Do', 'Ro', 'Van'],
    icon: { icon: 'lorc/frog.svg', bg: '#132a10', accent: '#7fd65a' },
  },
  {
    name: 'Trandoshan',
    description: 'A reptilian species of natural-born hunters, strong, tough-skinned, and slow to forgive a debt unpaid.',
    forceModifier: -1,
    alignmentModifier: -3,
    saberModifier: 4,
    nameFragments: ['Bos', 'Sk', 'Dosh', 'Krrs'],
    icon: { icon: 'lorc/lizardman.svg', bg: '#241a0d', accent: '#c9975a' },
  },
  {
    name: 'Ewok',
    description: 'A small, furry, forest-dwelling species from Endor, primitive in technology but fierce in defense of their home.',
    forceModifier: 1,
    alignmentModifier: 5,
    saberModifier: -3,
    nameFragments: ['Wic', 'Tee', 'Kub', 'Warr'],
    icon: { icon: 'delapouite/bear-head.svg', bg: '#241708', accent: '#b98a54' },
  },
  {
    name: 'Mon Calamari',
    description: 'An amphibious, salmon-hued species of skilled shipwrights and strategists from the ocean world Mon Cala.',
    forceModifier: 2,
    alignmentModifier: 4,
    saberModifier: -1,
    nameFragments: ['Ack', 'Bar', 'Cal', 'Renn'],
    icon: { icon: 'lorc/triton-head.svg', bg: '#0d2733', accent: '#e8946a' },
  },
  {
    name: 'Duros',
    description: 'A blue-skinned, big-eyed species among the galaxy’s earliest spacefarers, prized as natural pilots and explorers.',
    forceModifier: 0,
    alignmentModifier: 1,
    saberModifier: 0,
    nameFragments: ['Dur', 'Cad', 'Bel', 'Ithor'],
    icon: { icon: 'delapouite/astronaut-helmet.svg', bg: '#0e1c2a', accent: '#6fa8dc' },
  },
]

async function upsert(type, item) {
  const existing = await client.fetch(`*[_type == $type && name == $name][0]{_id}`, {
    type,
    name: item.name,
  })

  const svg = await fetchIcon(item.icon.icon, item.icon.bg, item.icon.accent)
  const asset = await client.assets.upload('image', Buffer.from(svg), {
    filename: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`,
    contentType: 'image/svg+xml',
  })

  const fields = {
    name: item.name,
    description: item.description,
    forceModifier: item.forceModifier,
    alignmentModifier: item.alignmentModifier,
    saberModifier: item.saberModifier,
    nameFragments: item.nameFragments,
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
  }

  if (existing) {
    await client.patch(existing._id).set(fields).commit()
    console.log(`Updated ${type}:`, item.name)
  } else {
    await client.create({ _type: type, ...fields })
    console.log(`Created ${type}:`, item.name)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  for (const planet of planets) await upsert('planet', planet)
  for (const s of species) await upsert('species', s)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
