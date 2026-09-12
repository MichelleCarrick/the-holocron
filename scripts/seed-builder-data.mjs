import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const planets = [
  {name: 'Tatooine', description: 'A harsh desert world of moisture farmers and smugglers.', forceModifier: 0, alignmentModifier: 0, saberModifier: 2, nameFragments: ['Dune', 'Sand', 'Jundland', 'Anchor']},
  {name: 'Naboo', description: 'A peaceful, verdant world of rolling hills and underwater cities.', forceModifier: 2, alignmentModifier: 5, saberModifier: 0, nameFragments: ['Nabi', 'Theed', 'Gung', 'Amid']},
  {name: 'Coruscant', description: 'A city that covers an entire planet, seat of galactic power.', forceModifier: 3, alignmentModifier: 0, saberModifier: 1, nameFragments: ['Cor', 'Senex', 'Skye', 'Eclip']},
  {name: 'Hoth', description: 'A frozen, unforgiving ice world.', forceModifier: -1, alignmentModifier: 2, saberModifier: 3, nameFragments: ['Frost', 'Echo', 'Glace', 'Rime']},
  {name: 'Dagobah', description: 'A mysterious, Force-heavy swamp world.', forceModifier: 5, alignmentModifier: 3, saberModifier: -2, nameFragments: ['Mossa', 'Bog', 'Dagu', 'Swren']},
]

const species = [
  {name: 'Human', description: 'Adaptable and common throughout the galaxy.', forceModifier: 0, alignmentModifier: 0, saberModifier: 1, nameFragments: ['Kel', 'Ry', 'Dar', 'Ana']},
  {name: 'Wookiee', description: 'Tall, powerful, and fiercely loyal.', forceModifier: -2, alignmentModifier: 3, saberModifier: 5, nameFragments: ['Chew', 'Gror', 'Waka', 'Rrgh']},
  {name: "Twi'lek", description: 'Known for resourcefulness and head-tails called lekku.', forceModifier: 1, alignmentModifier: 0, saberModifier: 1, nameFragments: ['Aal', 'Ryl', 'Sha', 'Bri']},
  {name: 'Zabrak', description: 'Resilient, marked by facial tattoos and cranial horns.', forceModifier: 2, alignmentModifier: -3, saberModifier: 2, nameFragments: ['Dat', 'Mau', 'Sav', 'Zek']},
  {name: 'Togruta', description: 'Perceptive hunters with distinctive montrals and lekku.', forceModifier: 3, alignmentModifier: 4, saberModifier: 0, nameFragments: ['Ah', 'Sok', 'Tano', 'Shaa']},
]

const crystals = [
  {name: 'Blue Crystal', color: 'Blue', description: 'Associated with Jedi Guardians.', forceModifier: 1, alignmentModifier: 3, saberModifier: 2},
  {name: 'Green Crystal', color: 'Green', description: 'Associated with Jedi Consulars.', forceModifier: 2, alignmentModifier: 4, saberModifier: 1},
  {name: 'Yellow Crystal', color: 'Yellow', description: 'Associated with Jedi Temple Guards.', forceModifier: 1, alignmentModifier: 2, saberModifier: 3},
  {name: 'Purple Crystal', color: 'Purple', description: 'A rare crystal favoured by unconventional Jedi.', forceModifier: 3, alignmentModifier: 1, saberModifier: 2},
  {name: 'Red Crystal', color: 'Red', description: 'A synthetic crystal bled by the dark side.', forceModifier: 2, alignmentModifier: -8, saberModifier: 2},
]

const canonCharacters = [
  {name: 'Yoda', forcePower: 95, alignment: 90, saberSkill: 80},
  {name: 'Darth Vader', forcePower: 90, alignment: -85, saberSkill: 88},
  {name: 'Luke Skywalker', forcePower: 75, alignment: 70, saberSkill: 78},
  {name: 'Obi-Wan Kenobi', forcePower: 80, alignment: 75, saberSkill: 90},
]

const buildTypes = [
  {key: 'warrior', name: 'Warrior', description: 'A disciplined fighter who leans on blade skill as much as the Force, standing on the light side of the line.'},
  {key: 'force-user', name: 'Force User', description: 'Someone whose connection to the Force outweighs their skill with a blade, drawn instinctively toward the light.'},
  {key: 'dark-adept', name: 'Dark Adept', description: 'A being whose Force sensitivity has curdled toward the dark side, valuing power over the blade.'},
  {key: 'sith-warrior', name: 'Sith Warrior', description: 'A dark-aligned fighter equally comfortable in a duel as wielding dark power.'},
  {key: 'sentinel', name: 'Sentinel', description: 'A balanced generalist, equally capable with the Force and the blade.'},
  {key: 'rogue-jedi', name: 'Nomad / Rogue Jedi', description: 'An unaligned wanderer, not fully committed to either side, forging their own path.'},
]

async function seed(type, items) {
  for (const item of items) {
    const created = await client.create({ _type: type, ...item })
    console.log('Created', type + ':', created.name)
  }
}

async function run() {
  await seed('planet', planets)
  await seed('species', species)
  await seed('kyberCrystal', crystals)
  await seed('canonCharacter', canonCharacters)
  await seed('buildType', buildTypes)
  console.log('Done seeding builder data!')
}

run().catch((err) => {
  console.error('Something went wrong:', err.message)
  process.exit(1)
})
