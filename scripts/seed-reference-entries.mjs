// Creates/updates Archive Entries for every character, battle, and event
// referenced across the Character Builder's planets, species, and kyber
// crystals (see scripts/seed-builder-details.mjs), so anything mentioned
// in the builder's detail panel can also be looked up on the main Archive
// page. Safe to re-run: entries are matched by slug.
//
// Icons come from game-icons.net (via the game-icons/icons GitHub mirror),
// licensed CC BY 3.0 — credited in the site footer (see app/layout.tsx).
// Characters reuse the same icon as their species/allegiance where one
// already exists in the archive, recolored to reflect their alignment.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-reference-entries.mjs
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

// Reusable icon presets, so characters visually match their species or
// allegiance already shown elsewhere on the site.
const ICON = {
  jediBlue: { icon: 'lorc/hood.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  jediGreen: { icon: 'lorc/robe.svg', bg: '#0e2414', accent: '#4fdc8a' },
  jediPurple: { icon: 'lorc/hood.svg', bg: '#1a0f2a', accent: '#b06fff' },
  sithRed: { icon: 'darkzaitzev/hooded-figure.svg', bg: '#240808', accent: '#ff5c5c' },
  sithBurnt: { icon: 'darkzaitzev/hooded-figure.svg', bg: '#241008', accent: '#e8946a' },
  person: (bg, accent) => ({ icon: 'delapouite/person.svg', bg, accent }),
  helmet: (bg, accent) => ({ icon: 'delapouite/astronaut-helmet.svg', bg, accent }),
  wookiee: { icon: 'delapouite/gorilla.svg', bg: '#241708', accent: '#b98a54' },
  ewok: { icon: 'delapouite/bear-head.svg', bg: '#241708', accent: '#b98a54' },
  rodian: { icon: 'lorc/frog.svg', bg: '#132a10', accent: '#7fd65a' },
  trandoshan: { icon: 'lorc/lizardman.svg', bg: '#241a0d', accent: '#c9975a' },
  togruta: { icon: 'delapouite/tiger-head.svg', bg: '#2a1020', accent: '#d98bb0' },
  monCalamari: { icon: 'lorc/triton-head.svg', bg: '#0d2733', accent: '#e8946a' },
  twilek: { icon: 'lorc/squid-head.svg', bg: '#0d2733', accent: '#4f9dc9' },
  zabrakLight: { icon: 'lorc/bull-horns.svg', bg: '#0a1f33', accent: '#4fa8ff' },
  zabrakDark: { icon: 'lorc/bull-horns.svg', bg: '#2a1010', accent: '#ff5c5c' },
  geonosian: { icon: 'delapouite/beehive.svg', bg: '#2a1f10', accent: '#d9a24a' },
}

const characters = [
  {
    slug: 'anakin-skywalker',
    title: 'Anakin Skywalker',
    era: 'Prequel Era',
    summary: 'A gifted Jedi Knight whose fear of loss led him to fall to the dark side and become Darth Vader.',
    body: block(
      'Discovered as a slave on Tatooine and trained by Obi-Wan Kenobi, Anakin Skywalker became one of the most powerful Jedi of his generation before Palpatine turned him against the Order he served.'
    ),
    icon: ICON.jediBlue,
  },
  {
    slug: 'jabba-the-hutt',
    title: 'Jabba the Hutt',
    era: 'Original Trilogy',
    summary: 'A powerful and ruthless crime lord who ran a vast criminal empire from his palace on Tatooine.',
    body: block(
      "Jabba the Hutt controlled smuggling and slaving operations across the Outer Rim, and held a bounty on Han Solo's head for years before the Rebellion freed him."
    ),
    icon: ICON.person('#3a2a15', '#d9a24a'),
  },
  {
    slug: 'padme-amidala',
    title: 'Padmé Amidala',
    era: 'Prequel Era',
    summary: 'The elected Queen and later Senator of Naboo, a devoted advocate for democracy in the Republic.',
    body: block(
      "Padmé Amidala led Naboo's resistance during its invasion and later served in the Galactic Senate, secretly marrying Anakin Skywalker before her death at the birth of their twins."
    ),
    icon: ICON.person('#123a2c', '#7fd0d6'),
  },
  {
    slug: 'jar-jar-binks',
    title: 'Jar Jar Binks',
    era: 'Prequel Era',
    summary: 'A clumsy but good-hearted Gungan who became an unlikely representative in the Galactic Senate.',
    body: block(
      'Exiled from the Gungan city of Otoh Gunga, Jar Jar Binks helped forge the alliance between the Gungans and the Naboo before later serving in the Senate.'
    ),
    icon: ICON.person('#0e2414', '#6fae5c'),
  },
  {
    slug: 'palpatine',
    title: 'Palpatine',
    era: 'Prequel Era',
    summary: 'The secret Sith Lord Darth Sidious, who rose from Senator to Chancellor to Emperor of the galaxy.',
    body: block(
      'Palpatine orchestrated the Clone Wars from both sides, issued Order 66 to destroy the Jedi, and ruled the galaxy as Emperor until his defeat above the second Death Star.'
    ),
    icon: ICON.sithRed,
  },
  {
    slug: 'mace-windu',
    title: 'Mace Windu',
    era: 'Prequel Era',
    summary: 'A senior member of the Jedi Council famed for his mastery of lightsaber combat and his rare purple blade.',
    body: block(
      'Mace Windu led the Jedi Order alongside Yoda during the Clone Wars and confronted Palpatine directly when the Chancellor\'s true identity as a Sith Lord was revealed.'
    ),
    icon: ICON.jediPurple,
  },
  {
    slug: 'chancellor-valorum',
    title: 'Chancellor Valorum',
    era: 'Prequel Era',
    summary: 'The Supreme Chancellor of the Galactic Republic during the invasion of Naboo, weakened by Senate corruption.',
    body: block(
      "Valorum's inability to act decisively during the Naboo crisis was engineered by Palpatine, who used the resulting no-confidence vote to have himself elected Chancellor."
    ),
    icon: ICON.person('#241a05', '#c9a24a'),
  },
  {
    slug: 'han-solo',
    title: 'Han Solo',
    era: 'Original Trilogy',
    summary: 'A roguish smuggler and captain of the Millennium Falcon who became a hero of the Rebel Alliance.',
    body: block(
      'Initially motivated by profit, Han Solo returned to help destroy the first Death Star and went on to become a general in the fight against the Empire.'
    ),
    icon: ICON.person('#1c1f2a', '#d9a066'),
  },
  {
    slug: 'leia-organa',
    title: 'Leia Organa',
    era: 'Original Trilogy',
    summary: 'A princess of Alderaan, Rebel leader, and secret twin sister of Luke Skywalker.',
    body: block(
      'Leia Organa helped found and lead the Rebel Alliance against the Empire, later discovering her own connection to the Force as the daughter of Anakin Skywalker.'
    ),
    icon: ICON.person('#0a1f33', '#dfe8f2'),
  },
  {
    slug: 'chewbacca',
    title: 'Chewbacca',
    era: 'Original Trilogy',
    summary: "Han Solo's loyal Wookiee co-pilot and lifelong friend, bound to him by an unpaid life debt.",
    body: block(
      'Chewbacca served as first mate aboard the Millennium Falcon through the fight against the Empire and remained one of the galaxy\'s most trusted warriors and pilots.'
    ),
    icon: ICON.wookiee,
  },
  {
    slug: 'tarfful',
    title: 'Tarfful',
    era: 'Prequel Era',
    summary: 'A Wookiee chieftain who led his people in the defense of Kashyyyk during the Clone Wars.',
    body: block(
      'Tarfful fought alongside Yoda and the Republic during the Battle of Kashyyyk, only for the clone troopers under his command to turn on the Jedi when Order 66 was issued.'
    ),
    icon: ICON.wookiee,
  },
  {
    slug: 'wicket-w-warrick',
    title: 'Wicket W. Warrick',
    era: 'Original Trilogy',
    summary: 'A young Ewok scout from Endor who befriended Princess Leia and helped the Rebellion defeat the Empire.',
    body: block(
      "Wicket's discovery of the stranded Rebel strike team led the Ewoks of Endor to join the fight against the Empire's shield generator garrison."
    ),
    icon: ICON.ewok,
  },
  {
    slug: 'jango-fett',
    title: 'Jango Fett',
    era: 'Prequel Era',
    summary: 'A skilled Mandalorian bounty hunter who served as the genetic template for the Republic\'s clone army.',
    body: block(
      "Jango Fett was hired to provide his genetic material for the clone troopers in exchange for an unaltered clone of his own, whom he raised as his son, Boba."
    ),
    icon: ICON.helmet('#16202a', '#9fb4c9'),
  },
  {
    slug: 'boba-fett',
    title: 'Boba Fett',
    era: 'Original Trilogy',
    summary: "An unaltered clone of Jango Fett who grew up to become one of the galaxy's most feared bounty hunters.",
    body: block(
      'Boba Fett tracked down the Millennium Falcon for Darth Vader and delivered the carbonite-frozen Han Solo to Jabba the Hutt before later reclaiming his father\'s legacy.'
    ),
    icon: ICON.helmet('#16202a', '#7fae6f'),
  },
  {
    slug: 'taun-we',
    title: 'Taun We',
    era: 'Prequel Era',
    summary: 'A Kaminoan aide who guided Obi-Wan Kenobi through the cloning facilities on Kamino.',
    body: block(
      "Taun We assisted in overseeing the secret clone army's creation on Kamino and helped reveal the army's existence to the Jedi Order."
    ),
    icon: ICON.person('#0a2436', '#5fc9e8'),
  },
  {
    slug: 'count-dooku',
    title: 'Count Dooku',
    era: 'Prequel Era',
    summary: 'A former Jedi Master turned Sith Lord who led the Separatist movement against the Republic.',
    body: block(
      'Known as Darth Tyranus, Count Dooku served as Palpatine\'s Sith apprentice and public face of the Separatist Alliance throughout the Clone Wars.'
    ),
    icon: ICON.sithBurnt,
  },
  {
    slug: 'poggle-the-lesser',
    title: 'Poggle the Lesser',
    era: 'Prequel Era',
    summary: 'The Archduke of Geonosis, whose droid foundries armed the Separatist war effort.',
    body: block(
      'Poggle the Lesser hosted the secret meeting of Separatist leaders on Geonosis and provided the plans for the Death Star to Count Dooku.'
    ),
    icon: ICON.geonosian,
  },
  {
    slug: 'aayla-secura',
    title: 'Aayla Secura',
    era: 'Prequel Era',
    summary: 'A Twi\'lek Jedi Knight and general who served the Republic throughout the Clone Wars.',
    body: block(
      'Aayla Secura commanded clone troopers on numerous battlefronts before being killed by her own men when Order 66 was issued.'
    ),
    icon: ICON.twilek,
  },
  {
    slug: 'hera-syndulla',
    title: 'Hera Syndulla',
    summary: 'A Twi\'lek pilot and rebel cell leader who helped spark the early rebellion against the Empire.',
    body: block(
      'Hera Syndulla captained the starship Ghost and led a small band of rebels whose actions helped grow the fledgling Rebel Alliance.'
    ),
    icon: ICON.twilek,
  },
  {
    slug: 'bib-fortuna',
    title: 'Bib Fortuna',
    era: 'Original Trilogy',
    summary: "A Twi'lek majordomo who served as Jabba the Hutt's most trusted advisor.",
    body: block(
      "Bib Fortuna managed the day-to-day affairs of Jabba's palace on Tatooine, screening visitors and enforcing the crime lord's will."
    ),
    icon: ICON.twilek,
  },
  {
    slug: 'darth-maul',
    title: 'Darth Maul',
    era: 'Prequel Era',
    summary: 'A fearsome Zabrak Sith apprentice trained by Darth Sidious, wielding a double-bladed lightsaber.',
    body: block(
      'Darth Maul killed Qui-Gon Jinn in a duel on Naboo before being defeated by Obi-Wan Kenobi, though he survived to plot revenge for years afterward.'
    ),
    icon: ICON.zabrakDark,
  },
  {
    slug: 'savage-opress',
    title: 'Savage Opress',
    era: 'Prequel Era',
    summary: "A Zabrak warrior transformed into a powerful Sith assassin and Darth Maul's brother.",
    body: block(
      'Savage Opress was trained in the dark side by Asajj Ventress and Count Dooku before helping his brother Maul rebuild a criminal empire.'
    ),
    icon: ICON.zabrakDark,
  },
  {
    slug: 'agen-kolar',
    title: 'Agen Kolar',
    era: 'Prequel Era',
    summary: 'A Zabrak Jedi Master and member of the Jedi Council during the Clone Wars.',
    body: block(
      "Agen Kolar was one of the Jedi Masters who confronted Chancellor Palpatine upon discovering his identity as the Sith Lord Darth Sidious."
    ),
    icon: ICON.zabrakLight,
  },
  {
    slug: 'ahsoka-tano',
    title: 'Ahsoka Tano',
    summary: "Anakin Skywalker's Togruta Padawan, who later left the Jedi Order but continued fighting for good.",
    body: block(
      'Ahsoka Tano was trained by Anakin Skywalker during the Clone Wars and, after leaving the Jedi Order, continued to resist the Empire on her own terms.'
    ),
    icon: ICON.togruta,
  },
  {
    slug: 'shaak-ti',
    title: 'Shaak Ti',
    era: 'Prequel Era',
    summary: 'A Togruta Jedi Master who oversaw the training of clone troopers on Kamino.',
    body: block(
      'Shaak Ti served on the Jedi Council and personally supervised clone trooper training on Kamino throughout the Clone Wars.'
    ),
    icon: ICON.togruta,
  },
  {
    slug: 'greedo',
    title: 'Greedo',
    era: 'Original Trilogy',
    summary: 'A Rodian bounty hunter sent to collect Han Solo for Jabba the Hutt.',
    body: block(
      'Greedo cornered Han Solo in the Mos Eisley cantina to collect on his debt to Jabba the Hutt, with famously fatal results for himself.'
    ),
    icon: ICON.rodian,
  },
  {
    slug: 'bossk',
    title: 'Bossk',
    era: 'Original Trilogy',
    summary: 'A Trandoshan bounty hunter hired by Darth Vader to track down the Millennium Falcon.',
    body: block(
      'Bossk was one of the bounty hunters assembled aboard the Executor to hunt the Millennium Falcon after its escape from Hoth.'
    ),
    icon: ICON.trandoshan,
  },
  {
    slug: 'chief-chirpa',
    title: 'Chief Chirpa',
    era: 'Original Trilogy',
    summary: 'The chieftain of the Ewok tribe that sheltered and aided the Rebel strike team on Endor.',
    body: block(
      "Chief Chirpa welcomed Han Solo, Leia Organa, and Luke Skywalker into his tribe's village and committed his warriors to the battle against the Empire."
    ),
    icon: ICON.ewok,
  },
  {
    slug: 'admiral-ackbar',
    title: 'Admiral Ackbar',
    era: 'Original Trilogy',
    summary: 'A Mon Calamari military strategist who commanded the Rebel fleet at the Battle of Endor.',
    body: block(
      'Admiral Ackbar helped design much of the Rebel Alliance\'s starfleet and led it into battle above Endor when the Rebellion sprung its trap on the Empire.'
    ),
    icon: ICON.monCalamari,
  },
  {
    slug: 'cad-bane',
    title: 'Cad Bane',
    summary: 'A notorious Duros bounty hunter known across the galaxy for his skill and ruthlessness.',
    body: block(
      'Cad Bane took on high-profile jobs throughout the Clone Wars era and remained a feared name in the criminal underworld for decades afterward.'
    ),
    icon: ICON.helmet('#0e1c2a', '#6fa8dc'),
  },
  {
    slug: 'rey',
    title: 'Rey',
    era: 'Sequel Era',
    summary: 'A scavenger from Jakku who discovered she was strong with the Force and trained as a Jedi.',
    body: block(
      'Rey found Luke Skywalker in his self-imposed exile, trained under both him and the spirits of the Jedi before her, and confronted the resurrected Emperor Palpatine.'
    ),
    icon: ICON.jediBlue,
  },
  {
    slug: 'qui-gon-jinn',
    title: 'Qui-Gon Jinn',
    era: 'Prequel Era',
    summary: 'A wise and unconventional Jedi Master who discovered Anakin Skywalker on Tatooine.',
    body: block(
      'Qui-Gon Jinn insisted on training Anakin Skywalker despite the Jedi Council\'s doubts, and was killed by Darth Maul on Naboo before he could do so himself.'
    ),
    icon: ICON.jediGreen,
  },
  {
    slug: 'general-grievous',
    title: 'General Grievous',
    era: 'Prequel Era',
    summary: 'A cyborg military commander of the Separatist droid army, famed for collecting the lightsabers of Jedi he defeated.',
    body: block(
      'Despite having no connection to the Force, General Grievous trained under Count Dooku to become a formidable lightsaber duelist, wielding up to four blades at once against the Jedi.'
    ),
    icon: ICON.helmet('#182018', '#8fbf6a'),
  },
  {
    slug: 'kylo-ren',
    title: 'Kylo Ren',
    era: 'Sequel Era',
    summary: 'Born Ben Solo, a powerful Force user who turned to the dark side in emulation of his grandfather, Darth Vader.',
    body: block(
      'Kylo Ren led the Knights of Ren and later the First Order, ultimately turning back to the light before his death in the final battle against the Emperor\'s forces.'
    ),
    icon: ICON.sithRed,
  },
]

const events = [
  {
    slug: 'battle-of-naboo',
    title: 'Battle of Naboo',
    category: 'event',
    era: 'Prequel Era',
    summary: "The climactic battle that ended the Trade Federation's invasion of Naboo, including the duel that took Qui-Gon Jinn's life.",
    body: block(
      'Fought on land, in space, and underwater all at once, the Battle of Naboo saw Padmé Amidala retake her palace while Obi-Wan Kenobi avenged his master by defeating Darth Maul.'
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#0e2a1a', accent: '#6fd68a' },
  },
  {
    slug: 'boonta-eve-podrace',
    title: 'Boonta Eve Podrace',
    category: 'event',
    era: 'Prequel Era',
    summary: "A dangerous, high-speed podrace on Tatooine that a young Anakin Skywalker won to secure his freedom.",
    body: block(
      "Qui-Gon Jinn wagered on Anakin Skywalker in the Boonta Eve Podrace, and the boy's victory both funded the Naboo starship's repairs and won him his freedom from slavery."
    ),
    icon: { icon: 'delapouite/checkered-flag.svg', bg: '#3a2a15', accent: '#e8c789' },
  },
  {
    slug: 'battle-of-coruscant',
    title: 'Battle of Coruscant',
    category: 'event',
    era: 'Prequel Era',
    summary: "A Separatist assault on the Republic's capital, ending with the rescue of Chancellor Palpatine and Anakin Skywalker's first steps toward the dark side.",
    body: block(
      "General Grievous led a Separatist fleet to kidnap Chancellor Palpatine over Coruscant, prompting a rescue by Anakin Skywalker and Obi-Wan Kenobi that ended with Palpatine's manipulation of Anakin deepening."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#201530', accent: '#ffd97a' },
  },
  {
    slug: 'battle-of-hoth',
    title: 'Battle of Hoth',
    category: 'event',
    era: 'Original Trilogy',
    summary: "The Empire's assault on the Rebel Alliance's hidden Echo Base, forcing a desperate evacuation.",
    body: block(
      "Imperial AT-AT walkers overran the Rebel shield generator on Hoth, scattering the Alliance's fleet and separating Han Solo and Leia Organa from Luke Skywalker."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#0e2436', accent: '#cfe8ff' },
  },
  {
    slug: 'battle-of-kashyyyk',
    title: 'Battle of Kashyyyk',
    category: 'event',
    era: 'Prequel Era',
    summary: "A Clone Wars battle to defend the Wookiee homeworld from Separatist invasion, cut short by the issuing of Order 66.",
    body: block(
      'Yoda fought alongside Chewbacca and Tarfful to repel a Separatist invasion of Kashyyyk, only for the clone troopers under his command to turn on him when Order 66 was given.'
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#10240f', accent: '#5fbf6a' },
  },
  {
    slug: 'duel-on-mustafar',
    title: 'Duel on Mustafar',
    category: 'event',
    era: 'Prequel Era',
    summary: 'The devastating lightsaber duel between Obi-Wan Kenobi and the newly-fallen Darth Vader.',
    body: block(
      "Obi-Wan Kenobi confronted his former apprentice on the volcanic world of Mustafar, leaving Anakin Skywalker gravely wounded and setting the stage for his rebirth as Darth Vader."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#2a0e08', accent: '#ff6a3d' },
  },
  {
    slug: 'battle-of-endor',
    title: 'Battle of Endor',
    category: 'event',
    era: 'Original Trilogy',
    summary: 'The decisive battle in which the Rebel Alliance destroyed the second Death Star and the Emperor died.',
    body: block(
      "With help from the Ewoks on the forest moon's surface, Rebel forces destroyed the shield generator protecting the second Death Star, allowing its destruction as Luke Skywalker redeemed his father above."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#122a1a', accent: '#7fd68a' },
  },
  {
    slug: 'battle-of-geonosis',
    title: 'Battle of Geonosis',
    category: 'event',
    era: 'Prequel Era',
    summary: 'The first battle of the Clone Wars, sparked by a Jedi rescue mission that escalated into full-scale war.',
    body: block(
      "A mission to rescue Obi-Wan Kenobi, Anakin Skywalker, and Padmé Amidala from Geonosian captivity became the Republic's first deployment of the clone army, officially beginning the Clone Wars."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#2a1f10', accent: '#d9a24a' },
  },
  {
    slug: 'discovery-of-the-clone-army',
    title: 'Discovery of the Clone Army',
    category: 'event',
    era: 'Prequel Era',
    summary: "Obi-Wan Kenobi's discovery of a secret clone army being grown on Kamino for the Republic.",
    body: block(
      'Following a lead from a poison dart, Obi-Wan Kenobi traveled to Kamino and uncovered a clone army commissioned years earlier, ostensibly for the Republic, using Jango Fett as its genetic template.'
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#0a2436', accent: '#5fc9e8' },
  },
  {
    slug: 'rescue-from-jabbas-palace',
    title: "Rescue from Jabba's Palace",
    category: 'event',
    era: 'Original Trilogy',
    summary: 'A daring plan by Luke Skywalker, Leia Organa, and their allies to free Han Solo from carbonite.',
    body: block(
      "Luke Skywalker, Leia Organa, Lando Calrissian, and Chewbacca infiltrated Jabba the Hutt's palace to free Han Solo, ending with Jabba's death and the destruction of his sail barge."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#241a05', accent: '#c9a24a' },
  },
  {
    slug: 'mos-eisley-cantina-standoff',
    title: 'Mos Eisley Cantina Standoff',
    category: 'event',
    era: 'Original Trilogy',
    summary: "A tense confrontation in which Han Solo dealt with the bounty hunter Greedo before it could go any further.",
    body: block(
      "While meeting Luke Skywalker and Obi-Wan Kenobi at the Mos Eisley cantina, Han Solo was cornered by the bounty hunter Greedo demanding payment for Jabba the Hutt."
    ),
    icon: { icon: 'lorc/explosion-rays.svg', bg: '#3a2a15', accent: '#e8c789' },
  },
]

async function upsertEntry(entry, category) {
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
    category: entry.category ?? category,
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
  for (const character of characters) await upsertEntry(character, 'character')
  for (const event of events) await upsertEntry(event, 'event')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
