// Upserts the full canon character roster (matched by name) with all six
// Top Trumps-style stats: forcePower, alignment, saberSkill, agility,
// wisdom, and resilience. This both fills in the three new stats on the
// original four characters and adds fourteen more, so the Character
// Builder's "closest match" and comparison features have a much larger
// and richer roster to draw from.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-canon-characters.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const canonCharacters = [
  { name: 'Yoda', forcePower: 98, alignment: 95, saberSkill: 85, agility: 90, wisdom: 100, resilience: 70 },
  { name: 'Darth Vader', forcePower: 92, alignment: -90, saberSkill: 90, agility: 55, wisdom: 75, resilience: 95 },
  { name: 'Luke Skywalker', forcePower: 78, alignment: 80, saberSkill: 80, agility: 75, wisdom: 70, resilience: 65 },
  { name: 'Obi-Wan Kenobi', forcePower: 82, alignment: 78, saberSkill: 92, agility: 78, wisdom: 88, resilience: 70 },
  { name: 'Anakin Skywalker', forcePower: 90, alignment: 55, saberSkill: 88, agility: 88, wisdom: 55, resilience: 75 },
  { name: 'Palpatine', forcePower: 95, alignment: -98, saberSkill: 60, agility: 60, wisdom: 92, resilience: 60 },
  { name: 'Mace Windu', forcePower: 85, alignment: 60, saberSkill: 96, agility: 88, wisdom: 80, resilience: 70 },
  { name: 'Darth Maul', forcePower: 75, alignment: -80, saberSkill: 93, agility: 95, wisdom: 55, resilience: 80 },
  { name: 'Qui-Gon Jinn', forcePower: 80, alignment: 82, saberSkill: 82, agility: 72, wisdom: 85, resilience: 65 },
  { name: 'Ahsoka Tano', forcePower: 72, alignment: 75, saberSkill: 84, agility: 88, wisdom: 78, resilience: 68 },
  { name: 'Rey', forcePower: 88, alignment: 70, saberSkill: 78, agility: 80, wisdom: 60, resilience: 72 },
  { name: 'Kylo Ren', forcePower: 84, alignment: -55, saberSkill: 82, agility: 70, wisdom: 55, resilience: 78 },
  { name: 'Count Dooku', forcePower: 83, alignment: -70, saberSkill: 90, agility: 65, wisdom: 85, resilience: 60 },
  { name: 'Agen Kolar', forcePower: 45, alignment: 65, saberSkill: 55, agility: 60, wisdom: 55, resilience: 50 },
  { name: 'Savage Opress', forcePower: 70, alignment: -75, saberSkill: 80, agility: 82, wisdom: 40, resilience: 88 },
  { name: 'Shaak Ti', forcePower: 48, alignment: 72, saberSkill: 50, agility: 55, wisdom: 60, resilience: 48 },
  { name: 'Aayla Secura', forcePower: 46, alignment: 74, saberSkill: 56, agility: 60, wisdom: 48, resilience: 46 },
  { name: 'General Grievous', forcePower: 5, alignment: -50, saberSkill: 75, agility: 85, wisdom: 60, resilience: 90 },
]

async function upsert(character) {
  const existing = await client.fetch(`*[_type == "canonCharacter" && name == $name][0]{_id}`, {
    name: character.name,
  })

  if (existing) {
    await client.patch(existing._id).set(character).commit()
    console.log('Updated canonCharacter:', character.name)
  } else {
    await client.create({ _type: 'canonCharacter', ...character })
    console.log('Created canonCharacter:', character.name)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  for (const character of canonCharacters) {
    await upsert(character)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
