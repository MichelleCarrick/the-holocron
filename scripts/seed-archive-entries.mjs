// Creates/updates a starter set of Archive Entries (lore pages) covering
// every category in the schema, each with an icon uploaded as its image.
// Safe to re-run: entries are matched by slug, so existing ones (like the
// original "Yoda" entry) get updated in place instead of duplicated.
//
// Icons come from game-icons.net (via the game-icons/icons GitHub mirror),
// licensed CC BY 3.0 — free to use and recolor as long as they're credited.
// That credit lives in the site footer (see app/layout.tsx). No Star Wars
// artwork is used anywhere; these are generic icons (a hooded figure, a
// spaceship, a burst, etc.) picked to evoke each entry without copying any
// franchise art.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-archive-entries.mjs
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
// path on top. Swapping those two colors gives each entry its own look.
async function fetchIcon(path, bg, accent) {
  const res = await fetch(GAME_ICONS_BASE + path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  const svg = await res.text()
  return svg
    .replace('<path d="M0 0h512v512H0z"/>', `<path fill="${bg}" d="M0 0h512v512H0z"/>`)
    .replace(/fill="#fff"/g, `fill="${accent}"`)
}

function block(text) {
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', marks: [], text }],
    },
  ]
}

const entries = [
  {
    slug: 'yoda',
    title: 'Yoda',
    category: 'character',
    era: 'Original Trilogy',
    summary:
      'A 900-year-old Jedi Master, small in stature but immensely powerful in the Force, who trained generations of Jedi from his exile on the swamp planet Dagobah.',
    body: block(
      'Yoda served as Grand Master of the Jedi Order for centuries before the fall of the Republic. After the rise of the Empire, he went into hiding on Dagobah, where he later trained Luke Skywalker in the ways of the Force.'
    ),
    icon: { icon: 'delapouite/wizard-face.svg', bg: '#0e2414', accent: '#4fdc8a' },
  },
  {
    slug: 'darth-vader',
    title: 'Darth Vader',
    category: 'character',
    era: 'Original Trilogy',
    summary:
      'Once the celebrated Jedi Anakin Skywalker, he fell to the dark side and became the Emperor’s enforcer, feared across the galaxy as the Dark Lord of the Sith.',
    body: block(
      'Darth Vader hunted down the remnants of the Jedi Order for two decades before being redeemed by his son, Luke Skywalker, in the final confrontation with Emperor Palpatine.'
    ),
    icon: { icon: 'darkzaitzev/hooded-figure.svg', bg: '#240808', accent: '#ff5c5c' },
  },
  {
    slug: 'luke-skywalker',
    title: 'Luke Skywalker',
    category: 'character',
    era: 'Original Trilogy',
    summary:
      'A moisture farmer from Tatooine who discovered his connection to the Force and became the pivotal figure in the fall of the Empire.',
    body: block(
      'Trained first by Obi-Wan Kenobi and then by Yoda, Luke Skywalker confronted Darth Vader and the Emperor aboard the second Death Star, redeeming his father and ending the Sith.'
    ),
    icon: { icon: 'lorc/hood.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  },
  {
    slug: 'obi-wan-kenobi',
    title: 'Obi-Wan Kenobi',
    category: 'character',
    era: 'Prequel Era',
    summary:
      'A disciplined Jedi Master who trained Anakin Skywalker and later watched over his son Luke from exile on Tatooine.',
    body: block(
      'Obi-Wan Kenobi fought through the Clone Wars alongside Anakin Skywalker before the Republic’s fall, then spent years in hiding on Tatooine until guiding Luke Skywalker toward his destiny.'
    ),
    icon: { icon: 'lorc/robe.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  },
  {
    slug: 'tatooine',
    title: 'Tatooine',
    category: 'planet',
    era: 'Original Trilogy',
    summary: 'A harsh desert world of moisture farmers and smugglers, orbited by twin suns.',
    body: block(
      'A remote, sparsely governed world on the Outer Rim, Tatooine is home to moisture farmers, Tusken Raiders, and the criminal underworld of Mos Eisley.'
    ),
    icon: { icon: 'delapouite/desert.svg', bg: '#3a2a15', accent: '#e8c789' },
  },
  {
    slug: 'naboo',
    title: 'Naboo',
    category: 'planet',
    era: 'Prequel Era',
    summary: 'A peaceful, verdant world of rolling hills and underwater Gungan cities.',
    body: block(
      'Naboo is governed by an elected monarchy and shares its surface with the native Gungan people, who maintain hidden cities beneath its oceans.'
    ),
    icon: { icon: 'delapouite/oasis.svg', bg: '#123a2c', accent: '#7fd0d6' },
  },
  {
    slug: 'coruscant',
    title: 'Coruscant',
    category: 'planet',
    era: 'Prequel Era',
    summary: 'A city that covers an entire planet, seat of galactic power for millennia.',
    body: block(
      'Coruscant has served as the capital of the Republic, the Empire, and the New Republic in turn, its surface entirely covered by an ecumenopolis of towers and skylanes.'
    ),
    icon: { icon: 'delapouite/modern-city.svg', bg: '#201f2b', accent: '#ffd97a' },
  },
  {
    slug: 'dagobah',
    title: 'Dagobah',
    category: 'planet',
    era: 'Original Trilogy',
    summary: 'A mysterious, Force-heavy swamp world hidden deep in wild space.',
    body: block(
      'Shrouded in fog and thick jungle, Dagobah is saturated with the Force. Yoda lived here in exile for years, training Luke Skywalker in its bogs and caves.'
    ),
    icon: { icon: 'delapouite/swamp.svg', bg: '#0e2414', accent: '#6fae5c' },
  },
  {
    slug: 'hoth',
    title: 'Hoth',
    category: 'planet',
    era: 'Original Trilogy',
    summary: 'A frozen, unforgiving ice world on the Outer Rim.',
    body: block(
      'Home to native wampas and burrowing tauntauns, Hoth briefly hosted the Rebel Alliance’s Echo Base before an Imperial assault forced its evacuation.'
    ),
    icon: { icon: 'lorc/snowflake-1.svg', bg: '#16324a', accent: '#f2f8ff' },
  },
  {
    slug: 'kashyyyk',
    title: 'Kashyyyk',
    category: 'planet',
    era: 'Prequel Era',
    summary: 'A vast forest world of towering wroshyr trees, homeworld of the Wookiees.',
    body: block(
      'Kashyyyk’s cities are built high in its endless forest canopy. The Wookiees who call it home fought alongside Republic clone troopers during the Clone Wars.'
    ),
    icon: { icon: 'delapouite/forest.svg', bg: '#0e2a12', accent: '#5fbf6a' },
  },
  {
    slug: 'mustafar',
    title: 'Mustafar',
    category: 'planet',
    era: 'Prequel Era',
    summary: 'A volcanic world of rivers of lava and mining stations, later home to a Sith fortress.',
    body: block(
      'Mustafar was the site of Anakin Skywalker’s fateful duel with Obi-Wan Kenobi, and later the location Darth Vader chose to build his personal castle.'
    ),
    icon: { icon: 'lorc/volcano.svg', bg: '#2a0e08', accent: '#ff6a3d' },
  },
  {
    slug: 'endor',
    title: 'Endor',
    category: 'planet',
    era: 'Original Trilogy',
    summary: 'A lush forest moon of towering trees, home to the tribal Ewoks.',
    body: block(
      'The forest moon of Endor hosted a shield generator protecting the second Death Star, and became the site of the Ewoks’ decisive help in the Rebellion’s victory.'
    ),
    icon: { icon: 'delapouite/circle-forest.svg', bg: '#122a1a', accent: '#7fd68a' },
  },
  {
    slug: 'kamino',
    title: 'Kamino',
    category: 'planet',
    era: 'Prequel Era',
    summary: 'A remote ocean world of endless storms, home to a cloning facility hidden from the galaxy.',
    body: block(
      'Kamino’s cloners secretly bred the Republic’s clone trooper army on this stormy ocean world, isolated from the rest of the galaxy by its own choosing.'
    ),
    icon: { icon: 'lorc/waves.svg', bg: '#0a2436', accent: '#5fc9e8' },
  },
  {
    slug: 'geonosis',
    title: 'Geonosis',
    category: 'planet',
    era: 'Prequel Era',
    summary: 'An arid, rocky world riddled with insectoid hive colonies and droid foundries.',
    body: block(
      'Geonosis’s hive colonies ran vast droid foundries for the Separatists, and its dusty arenas saw the opening battle of the Clone Wars.'
    ),
    icon: { icon: 'delapouite/beehive.svg', bg: '#2a1f10', accent: '#d9a24a' },
  },
  {
    slug: 'wookiee',
    title: 'Wookiee',
    category: 'species',
    era: 'Original Trilogy',
    summary: 'A tall, powerful, fiercely loyal species native to the forest world of Kashyyyk.',
    body: block(
      'Known for their great strength and skill as pilots and warriors, Wookiees form close, lifelong bonds and are famed for honoring life-debts to those who save them.'
    ),
    icon: { icon: 'delapouite/gorilla.svg', bg: '#241708', accent: '#b98a54' },
  },
  {
    slug: 'twilek',
    title: "Twi'lek",
    category: 'species',
    era: 'Prequel Era',
    summary: 'A resourceful species recognized by their colorful skin and expressive head-tails, called lekku.',
    body: block(
      "Twi'leks hail from the arid world of Ryloth and are found throughout the galaxy as diplomats, entertainers, and traders, adapting readily to life among other species."
    ),
    icon: { icon: 'lorc/squid-head.svg', bg: '#0d2733', accent: '#4f9dc9' },
  },
  {
    slug: 'zabrak',
    title: 'Zabrak',
    category: 'species',
    era: 'Prequel Era',
    summary: 'A resilient species marked by facial tattoos and cranial horns, native to Iridonia.',
    body: block(
      'Known for their toughness and independence, Zabrak have produced both devoted Jedi and formidable Sith, including Darth Maul.'
    ),
    icon: { icon: 'lorc/bull-horns.svg', bg: '#2a1010', accent: '#c96b6b' },
  },
  {
    slug: 'togruta',
    title: 'Togruta',
    category: 'species',
    era: 'Prequel Era',
    summary: 'Perceptive, hunting-minded natives of Shili, recognized by their montrals and head-tails.',
    body: block(
      'Togruta possess a passive form of echolocation through their montrals, and are known throughout the galaxy for skilled Jedi like Ahsoka Tano and Shaak Ti.'
    ),
    icon: { icon: 'delapouite/tiger-head.svg', bg: '#2a1020', accent: '#d98bb0' },
  },
  {
    slug: 'human',
    title: 'Human',
    category: 'species',
    era: 'The Old Republic',
    summary: 'The most widespread species in the galaxy, found on countless worlds in every era.',
    body: block(
      'Adaptable and numerous, Humans are found among the Jedi, the Sith, the Republic, the Empire, and everywhere in between, with no single homeworld defining them.'
    ),
    icon: { icon: 'delapouite/person.svg', bg: '#1c1f2a', accent: '#d9a066' },
  },
  {
    slug: 'rodian',
    title: 'Rodian',
    category: 'species',
    era: 'Original Trilogy',
    summary: 'A keen-eyed, green-skinned species famed across the galaxy as trackers and bounty hunters.',
    body: block(
      'Rodians are prized as trackers and hunters for their sharp senses, with the bounty hunter Greedo among the best known of their kind.'
    ),
    icon: { icon: 'lorc/frog.svg', bg: '#132a10', accent: '#7fd65a' },
  },
  {
    slug: 'trandoshan',
    title: 'Trandoshan',
    category: 'species',
    era: 'Original Trilogy',
    summary: 'A reptilian species of natural-born hunters, strong, tough-skinned, and slow to forgive a debt unpaid.',
    body: block(
      'Trandoshans revere hunting as a sacred pursuit, and many make their living as bounty hunters and slavers across the Outer Rim.'
    ),
    icon: { icon: 'lorc/lizardman.svg', bg: '#241a0d', accent: '#c9975a' },
  },
  {
    slug: 'ewok',
    title: 'Ewok',
    category: 'species',
    era: 'Original Trilogy',
    summary: 'A small, furry, forest-dwelling species from Endor, primitive in technology but fierce in defense of their home.',
    body: block(
      'Living in tribal villages high in the trees of Endor, the Ewoks proved crucial allies to the Rebel Alliance in the battle against the Empire’s shield generator.'
    ),
    icon: { icon: 'delapouite/bear-head.svg', bg: '#241708', accent: '#b98a54' },
  },
  {
    slug: 'mon-calamari',
    title: 'Mon Calamari',
    category: 'species',
    era: 'Original Trilogy',
    summary: 'An amphibious, salmon-hued species of skilled shipwrights and strategists from the ocean world Mon Cala.',
    body: block(
      'Mon Calamari shipwrights built much of the Rebel Alliance’s fleet, including their distinctive cruisers, and produced respected military leaders like Admiral Ackbar.'
    ),
    icon: { icon: 'lorc/triton-head.svg', bg: '#0d2733', accent: '#e8946a' },
  },
  {
    slug: 'duros',
    title: 'Duros',
    category: 'species',
    era: 'The Old Republic',
    summary: 'A blue-skinned, big-eyed species among the galaxy’s earliest spacefarers, prized as natural pilots and explorers.',
    body: block(
      'Duros were among the first species to develop interstellar travel, and their descendants are still found throughout the galaxy as pilots, explorers, and traders.'
    ),
    icon: { icon: 'delapouite/astronaut-helmet.svg', bg: '#0e1c2a', accent: '#6fa8dc' },
  },
  {
    slug: 'blue-kyber-crystal',
    title: 'Blue Kyber Crystal',
    category: 'kyberCrystal',
    era: 'The Old Republic',
    summary: 'A kyber crystal associated with the Jedi Guardians, producing a blue lightsaber blade.',
    body: block(
      'Blue-bladed lightsabers are traditionally carried by Jedi Guardians, who focus on combat prowess in defense of the light side.'
    ),
    icon: { icon: 'lorc/crystal-shine.svg', bg: '#05070c', accent: '#4fa8ff' },
  },
  {
    slug: 'green-kyber-crystal',
    title: 'Green Kyber Crystal',
    category: 'kyberCrystal',
    era: 'The Old Republic',
    summary: 'A kyber crystal associated with the Jedi Consulars, producing a green lightsaber blade.',
    body: block(
      'Green-bladed lightsabers are traditionally carried by Jedi Consulars, who emphasize wisdom and a deep connection to the Force over combat.'
    ),
    icon: { icon: 'lorc/crystal-growth.svg', bg: '#05070c', accent: '#4fdc8a' },
  },
  {
    slug: 'yellow-kyber-crystal',
    title: 'Yellow Kyber Crystal',
    category: 'kyberCrystal',
    era: 'The Old Republic',
    summary: 'A kyber crystal associated with the Jedi Temple Guards, producing a yellow lightsaber blade.',
    body: block(
      'Yellow-bladed lightsabers are most associated with the Jedi Temple Guards and Jedi Sentinels, who balance combat skill with subtler talents.'
    ),
    icon: { icon: 'lorc/floating-crystal.svg', bg: '#05070c', accent: '#ffe066' },
  },
  {
    slug: 'purple-kyber-crystal',
    title: 'Purple Kyber Crystal',
    category: 'kyberCrystal',
    era: 'Original Trilogy',
    summary: 'A rare kyber crystal favored by unconventional Jedi, producing a purple lightsaber blade.',
    body: block(
      'Purple-bladed lightsabers are rare and carried only by a handful of Jedi throughout history, said to reflect an unusually personal bond with the Force.'
    ),
    icon: { icon: 'lorc/crystal-cluster.svg', bg: '#05070c', accent: '#b06fff' },
  },
  {
    slug: 'red-kyber-crystal',
    title: 'Red Kyber Crystal',
    category: 'kyberCrystal',
    era: 'Original Trilogy',
    summary: 'A synthetic crystal bled by the dark side of the Force, producing a red lightsaber blade.',
    body: block(
      'Unable to attune themselves to a natural kyber crystal, the Sith instead corrupt or "bleed" one through the dark side, giving their blades a bloody red glow.'
    ),
    icon: { icon: 'delapouite/fire-gem.svg', bg: '#05070c', accent: '#ff5c5c' },
  },
  {
    slug: 'jedi-order',
    title: 'The Jedi Order',
    category: 'faction',
    era: 'The Old Republic',
    summary: 'An ancient order of Force-sensitive peacekeepers sworn to defend the Republic and serve the light side of the Force.',
    body: block(
      'For a thousand generations the Jedi Order trained its members from childhood, guiding the Republic as diplomats and guardians until it was betrayed and nearly destroyed during the rise of the Empire.'
    ),
    icon: { icon: 'lorc/bordered-shield.svg', bg: '#241a05', accent: '#c9a24a' },
  },
  {
    slug: 'millennium-falcon',
    title: 'Millennium Falcon',
    category: 'vehicle',
    era: 'Original Trilogy',
    summary: 'A battered but famously fast light freighter, "the ship that made the Kessel Run in less than twelve parsecs."',
    body: block(
      'Piloted for years by smugglers before joining the fight against the Empire, the Millennium Falcon became one of the most recognizable ships in the galaxy despite its unassuming appearance.'
    ),
    icon: { icon: 'delapouite/spaceship.svg', bg: '#1c1f24', accent: '#aeb6c6' },
  },
  {
    slug: 'lightsaber',
    title: 'Lightsaber',
    category: 'technology',
    era: 'The Old Republic',
    summary: "An elegant weapon powered by a kyber crystal, carried almost exclusively by the Jedi and the Sith.",
    body: block(
      "Each lightsaber is built by its wielder around a kyber crystal, which determines the blade's color and is said to form a personal bond with a Force-sensitive user."
    ),
    icon: { icon: 'lorc/energy-sword.svg', bg: '#06210f', accent: '#4fdc8a' },
  },
  {
    slug: 'order-66',
    title: 'Order 66',
    category: 'event',
    era: 'Prequel Era',
    summary: 'The secret directive that turned the Republic’s clone troopers against their Jedi commanders, all but wiping out the Jedi Order.',
    body: block(
      'Issued by Chancellor Palpatine as the Clone Wars drew to a close, Order 66 was executed simultaneously across the galaxy and marked the transformation of the Republic into the Empire.'
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#240808', accent: '#ff5c5c' },
  },
]

async function upsertEntry(entry) {
  const existing = await client.fetch(`*[_type == "archiveEntry" && slug.current == $slug][0]{_id}`, {
    slug: entry.slug,
  })

  const svg = await fetchIcon(entry.icon.icon, entry.icon.bg, entry.icon.accent)
  const asset = await client.assets.upload('image', Buffer.from(svg), {
    filename: `${entry.slug}.svg`,
    contentType: 'image/svg+xml',
  })

  const fields = {
    title: entry.title,
    slug: { _type: 'slug', current: entry.slug },
    category: entry.category,
    era: entry.era,
    summary: entry.summary,
    body: entry.body,
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
  }

  if (existing) {
    await client.patch(existing._id).set(fields).commit()
    console.log('Updated archiveEntry:', entry.title)
  } else {
    await client.create({ _type: 'archiveEntry', ...fields })
    console.log('Created archiveEntry:', entry.title)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  for (const entry of entries) {
    await upsertEntry(entry)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
