// Patches every planet, species, and kyber crystal already in Sanity with
// the richer lore fields added to their schemas: notableCharacters,
// keyEvents, appearances, and trivia. This powers the detail side panel in
// the Character Builder. Matched by name, so safe to re-run.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-builder-details.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const planetDetails = {
  Tatooine: {
    notableCharacters: ['Luke Skywalker', 'Anakin Skywalker', 'Obi-Wan Kenobi', 'Jabba the Hutt'],
    keyEvents: ['The Boonta Eve Podrace', "Luke's discovery of R2-D2 and C-3PO", 'The rescue of Han Solo from Jabba the Hutt'],
    appearances: ['The Phantom Menace', 'A New Hope', 'Return of the Jedi', 'The Mandalorian'],
    trivia: "Its twin suns, Tatoo I and Tatoo II, produced one of the most iconic shots in the entire franchise.",
  },
  Naboo: {
    notableCharacters: ['Padmé Amidala', 'Jar Jar Binks', 'Palpatine'],
    keyEvents: ['The Invasion of Naboo', 'The Battle of Naboo'],
    appearances: ['The Phantom Menace', 'Attack of the Clones', 'Revenge of the Sith'],
    trivia: "Naboo's core is honeycombed with plasma-filled tunnels the Gungans use to travel beneath its crust.",
  },
  Coruscant: {
    notableCharacters: ['Palpatine', 'Mace Windu', 'Chancellor Valorum'],
    keyEvents: ['The Battle of Coruscant', 'The Jedi Temple march during Order 66'],
    appearances: ['The Phantom Menace', 'Attack of the Clones', 'Revenge of the Sith', 'The Clone Wars', 'Andor'],
    trivia: 'Coruscant has been continuously built upon for thousands of years, forming a single city that covers the entire planet.',
  },
  Hoth: {
    notableCharacters: ['Luke Skywalker', 'Han Solo', 'Leia Organa'],
    keyEvents: ['The Battle of Hoth'],
    appearances: ['The Empire Strikes Back'],
    trivia: 'Luke Skywalker was nearly killed by a wampa here before using the Force to reach his lightsaber and escape.',
  },
  Dagobah: {
    notableCharacters: ['Yoda', 'Luke Skywalker'],
    keyEvents: ["Luke's Jedi training", "Luke's vision in the dark side cave"],
    appearances: ['The Empire Strikes Back', 'Return of the Jedi'],
    trivia: 'Yoda lived here in hidden exile for years, sheltered from the Empire by the swamp and the strong presence of the Force.',
  },
  Kashyyyk: {
    notableCharacters: ['Chewbacca', 'Tarfful'],
    keyEvents: ['The Battle of Kashyyyk', 'Order 66 on Kashyyyk'],
    appearances: ['Revenge of the Sith', 'Solo: A Star Wars Story', 'The Clone Wars'],
    trivia: "Wookiee cities are built high in the planet's towering wroshyr trees rather than on the ground.",
  },
  Mustafar: {
    notableCharacters: ['Anakin Skywalker', 'Obi-Wan Kenobi', 'Darth Vader'],
    keyEvents: ['The duel between Anakin Skywalker and Obi-Wan Kenobi'],
    appearances: ['Revenge of the Sith', 'Obi-Wan Kenobi'],
    trivia: 'Darth Vader later built his personal castle here, on the site of the duel that nearly killed him.',
  },
  Endor: {
    notableCharacters: ['Wicket W. Warrick', 'Leia Organa', 'Han Solo'],
    keyEvents: ['The Battle of Endor'],
    appearances: ['Return of the Jedi'],
    trivia: "The forest moon's shield generator protected the second Death Star until Rebel troops and the Ewoks destroyed it.",
  },
  Kamino: {
    notableCharacters: ['Jango Fett', 'Boba Fett', 'Taun We'],
    keyEvents: ['The discovery of the secret clone army'],
    appearances: ['Attack of the Clones', 'The Clone Wars', 'The Bad Batch'],
    trivia: 'Kamino was deliberately erased from most Republic archives to keep the clone army a secret.',
  },
  Geonosis: {
    notableCharacters: ['Count Dooku', 'Poggle the Lesser'],
    keyEvents: ['The Battle of Geonosis, the opening battle of the Clone Wars'],
    appearances: ['Attack of the Clones', 'The Clone Wars'],
    trivia: "Its droid foundries produced much of the Separatists' battle droid army.",
  },
}

const speciesDetails = {
  Human: {
    notableCharacters: ['Luke Skywalker', 'Leia Organa', 'Han Solo', 'Darth Vader'],
    keyEvents: [],
    appearances: ['Every live-action Star Wars film and series'],
    trivia: 'Humans hold leadership roles across nearly every faction in the galaxy, from the Jedi Order to the Empire.',
  },
  Wookiee: {
    notableCharacters: ['Chewbacca', 'Tarfful'],
    keyEvents: ['The Battle of Kashyyyk'],
    appearances: ['Revenge of the Sith', 'A New Hope', 'Solo: A Star Wars Story'],
    trivia: 'Wookiees can live well over 400 years and are famed for honoring unbreakable life debts.',
  },
  "Twi'lek": {
    notableCharacters: ['Aayla Secura', 'Hera Syndulla', 'Bib Fortuna'],
    keyEvents: [],
    appearances: ['The Phantom Menace', 'The Clone Wars', 'Star Wars Rebels'],
    trivia: "A Twi'lek's lekku, or head-tails, are sensitive enough to express subtle emotion or even convey a silent language.",
  },
  Zabrak: {
    notableCharacters: ['Darth Maul', 'Savage Opress', 'Agen Kolar'],
    keyEvents: ['The Duel of the Fates on Naboo'],
    appearances: ['The Phantom Menace', 'The Clone Wars'],
    trivia: 'Zabrak facial tattoos traditionally signify clan identity or a personal rite of passage.',
  },
  Togruta: {
    notableCharacters: ['Ahsoka Tano', 'Shaak Ti'],
    keyEvents: [],
    appearances: ['The Clone Wars', 'Star Wars Rebels', 'Ahsoka'],
    trivia: "A Togruta's montrals grant a passive form of echolocation, helping them sense their surroundings.",
  },
  Rodian: {
    notableCharacters: ['Greedo'],
    keyEvents: ['The cantina confrontation with Han Solo'],
    appearances: ['A New Hope', 'The Clone Wars'],
    trivia: 'Rodian hunters traditionally track prey by scent and heat as much as by sight.',
  },
  Trandoshan: {
    notableCharacters: ['Bossk'],
    keyEvents: [],
    appearances: ['The Empire Strikes Back', 'The Clone Wars'],
    trivia: 'Trandoshans can regenerate lost limbs, a trait tied to their reptilian physiology.',
  },
  Ewok: {
    notableCharacters: ['Wicket W. Warrick', 'Chief Chirpa'],
    keyEvents: ['The Battle of Endor'],
    appearances: ['Return of the Jedi'],
    trivia: "Despite primitive technology, the Ewoks' mastery of their home terrain proved decisive against Imperial forces.",
  },
  'Mon Calamari': {
    notableCharacters: ['Admiral Ackbar'],
    keyEvents: ['The Battle of Endor'],
    appearances: ['Return of the Jedi', 'The Clone Wars', 'Andor'],
    trivia: "Mon Calamari shipyards built much of the Rebel Alliance's fleet, including its distinctive cruisers.",
  },
  Duros: {
    notableCharacters: ['Cad Bane'],
    keyEvents: [],
    appearances: ['The Clone Wars', 'The Book of Boba Fett'],
    trivia: 'Duros were among the first species in the galaxy to develop interstellar space travel.',
  },
}

const crystalDetails = {
  'Blue Crystal': {
    notableCharacters: ['Obi-Wan Kenobi', 'Rey'],
    keyEvents: [],
    appearances: ['A New Hope', 'Attack of the Clones', 'The Force Awakens'],
    trivia: 'Blue blades are traditionally carried by Jedi Guardians, who favor combat prowess in defense of the light side.',
  },
  'Green Crystal': {
    notableCharacters: ['Luke Skywalker', 'Yoda', 'Qui-Gon Jinn'],
    keyEvents: [],
    appearances: ['Return of the Jedi', 'The Phantom Menace'],
    trivia: 'Green blades are traditionally carried by Jedi Consulars, who favor wisdom and diplomacy over combat.',
  },
  'Yellow Crystal': {
    notableCharacters: ['Ahsoka Tano', 'Rey'],
    keyEvents: [],
    appearances: ['The Clone Wars', 'The Rise of Skywalker'],
    trivia: 'Yellow blades are most associated with the Jedi Temple Guards and Jedi Sentinels.',
  },
  'Purple Crystal': {
    notableCharacters: ['Mace Windu'],
    keyEvents: [],
    appearances: ['Attack of the Clones', 'Revenge of the Sith'],
    trivia: "Mace Windu's purple blade exists because actor Samuel L. Jackson asked for a color that would stand out on screen.",
  },
  'Red Crystal': {
    notableCharacters: ['Darth Vader', 'Darth Maul', 'Kylo Ren'],
    keyEvents: [],
    appearances: ['A New Hope', 'The Phantom Menace', 'The Force Awakens'],
    trivia: "A red blade comes from a synthetic crystal 'bled' through the dark side, since natural kyber resists the Sith.",
  },
}

async function patchAll(type, detailsByName) {
  const docs = await client.fetch(`*[_type == $type]{_id, name}`, { type })
  for (const doc of docs) {
    const details = detailsByName[doc.name]
    if (!details) {
      console.warn(`No details defined for ${type} "${doc.name}", skipping`)
      continue
    }
    await client.patch(doc._id).set(details).commit()
    console.log(`Patched ${type}:`, doc.name)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  await patchAll('planet', planetDetails)
  await patchAll('species', speciesDetails)
  await patchAll('kyberCrystal', crystalDetails)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
