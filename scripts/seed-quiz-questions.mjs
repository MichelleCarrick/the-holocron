// Seeds the Trivia Challenge question bank. Matched by question text, so
// safe to re-run — existing questions get updated in place.
//
// Run with: SANITY_API_WRITE_TOKEN="..." node scripts/seed-quiz-questions.mjs
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'q5xhi9pt',
  dataset: 'production',
  apiVersion: '2026-09-11',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const questions = [
  {
    question: "What color is Yoda's lightsaber?",
    options: ['Green', 'Blue', 'Purple', 'Red'],
    correctAnswer: 'Green',
    explanation: 'Green blades are traditionally carried by Jedi Consulars, who favor wisdom over raw combat — a fitting match for Yoda.',
    era: 'Original Trilogy',
    difficulty: 'Youngling',
  },
  {
    question: 'Which planet is the homeworld of the Wookiees?',
    options: ['Kashyyyk', 'Naboo', 'Endor', 'Geonosis'],
    correctAnswer: 'Kashyyyk',
    explanation: 'Kashyyyk is a vast forest world where Wookiee cities are built high in the towering wroshyr trees.',
    era: 'Prequel Era',
    difficulty: 'Youngling',
  },
  {
    question: "What is the name of Han Solo's ship?",
    options: ['Millennium Falcon', 'Slave I', 'Ghost', 'Executor'],
    correctAnswer: 'Millennium Falcon',
    explanation: 'A battered but famously fast light freighter — "the ship that made the Kessel Run in less than twelve parsecs."',
    era: 'Original Trilogy',
    difficulty: 'Youngling',
  },
  {
    question: 'Which Sith apprentice wields a double-bladed lightsaber?',
    options: ['Darth Maul', 'Darth Vader', 'Count Dooku', 'Kylo Ren'],
    correctAnswer: 'Darth Maul',
    explanation: 'Darth Maul killed Qui-Gon Jinn in a duel on Naboo before being defeated by Obi-Wan Kenobi.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: "A kyber crystal 'bled' through the dark side produces what color blade?",
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    correctAnswer: 'Red',
    explanation: "Natural kyber resists the Sith, so a red blade comes from a synthetic crystal corrupted through the dark side.",
    era: 'Original Trilogy',
    difficulty: 'Padawan',
  },
  {
    question: 'Which battle is considered the opening battle of the Clone Wars?',
    options: ['Battle of Geonosis', 'Battle of Naboo', 'Battle of Hoth', 'Battle of Endor'],
    correctAnswer: 'Battle of Geonosis',
    explanation: 'A rescue mission for three captured Jedi escalated into the Republic\'s first deployment of the clone army.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: 'Who trained Luke Skywalker in the swamps of Dagobah?',
    options: ['Yoda', 'Obi-Wan Kenobi', 'Qui-Gon Jinn', 'Mace Windu'],
    correctAnswer: 'Yoda',
    explanation: 'Yoda lived in hidden exile on Dagobah for years before training Luke there.',
    era: 'Original Trilogy',
    difficulty: 'Youngling',
  },
  {
    question: 'What secret directive turned clone troopers against their Jedi generals?',
    options: ['Order 66', 'Order 99', 'Directive 7', 'Protocol Zero'],
    correctAnswer: 'Order 66',
    explanation: 'Issued by Chancellor Palpatine, Order 66 was executed simultaneously across the galaxy and nearly wiped out the Jedi Order.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: 'Which small, tribal species helped the Rebel Alliance on Endor?',
    options: ['Ewoks', 'Gungans', 'Jawas', 'Porgs'],
    correctAnswer: 'Ewoks',
    explanation: "The Ewoks' mastery of their home terrain proved decisive against Imperial forces at the Battle of Endor.",
    era: 'Original Trilogy',
    difficulty: 'Youngling',
  },
  {
    question: "Which ocean world secretly housed the Republic's cloning facilities?",
    options: ['Kamino', 'Coruscant', 'Mustafar', 'Geonosis'],
    correctAnswer: 'Kamino',
    explanation: 'Kamino was deliberately erased from most Republic archives to keep the clone army a secret.',
    era: 'Prequel Era',
    difficulty: 'Jedi Master',
  },
  {
    question: 'Who does Obi-Wan Kenobi duel on the volcanic world of Mustafar?',
    options: ['Anakin Skywalker', 'Darth Maul', 'Count Dooku', 'General Grievous'],
    correctAnswer: 'Anakin Skywalker',
    explanation: 'The duel left Anakin gravely wounded, setting the stage for his rebirth as Darth Vader.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: 'Which amphibious species is famed for shipbuilding, including Admiral Ackbar?',
    options: ['Mon Calamari', 'Duros', 'Rodian', "Twi'lek"],
    correctAnswer: 'Mon Calamari',
    explanation: "Mon Calamari shipyards built much of the Rebel Alliance's fleet, including its distinctive cruisers.",
    era: 'Original Trilogy',
    difficulty: 'Jedi Master',
  },
  {
    question: 'Which lightsaber color is traditionally carried by wise, diplomacy-focused Jedi Consulars?',
    options: ['Green', 'Blue', 'Yellow', 'Purple'],
    correctAnswer: 'Green',
    explanation: 'Blue blades, by contrast, are traditionally carried by combat-focused Jedi Guardians.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: 'Which cyborg general collected the lightsabers of Jedi he defeated?',
    options: ['General Grievous', 'Darth Maul', 'Cad Bane', 'Jango Fett'],
    correctAnswer: 'General Grievous',
    explanation: 'Despite having no connection to the Force, Grievous trained under Count Dooku to become a formidable duelist.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: "Which bounty hunter served as the genetic template for the Republic's clone army?",
    options: ['Jango Fett', 'Boba Fett', 'Cad Bane', 'Greedo'],
    correctAnswer: 'Jango Fett',
    explanation: 'Jango provided his genetic material in exchange for an unaltered clone of his own, whom he raised as his son, Boba.',
    era: 'Prequel Era',
    difficulty: 'Jedi Master',
  },
  {
    question: 'Which planet is a single city covering its entire surface?',
    options: ['Coruscant', 'Naboo', 'Tatooine', 'Endor'],
    correctAnswer: 'Coruscant',
    explanation: 'Coruscant has served as the capital of the Republic, the Empire, and the New Republic in turn.',
    era: 'Prequel Era',
    difficulty: 'Youngling',
  },
  {
    question: "Which species is known for its big eyes and being among the galaxy's earliest spacefarers?",
    options: ['Duros', 'Rodian', 'Zabrak', 'Togruta'],
    correctAnswer: 'Duros',
    explanation: 'Duros were among the first species to develop interstellar travel, prized ever since as pilots and explorers.',
    era: 'The Old Republic',
    difficulty: 'Jedi Master',
  },
  {
    question: '"The Chosen One," prophesied to bring balance to the Force, refers to whom?',
    options: ['Anakin Skywalker', 'Luke Skywalker', 'Rey', 'Obi-Wan Kenobi'],
    correctAnswer: 'Anakin Skywalker',
    explanation: 'Anakin fulfilled the prophecy in the end by destroying the Emperor and saving his son, Luke.',
    era: 'Prequel Era',
    difficulty: 'Padawan',
  },
  {
    question: 'What creature nearly kills Luke Skywalker on Hoth before he escapes using the Force?',
    options: ['Wampa', 'Rancor', 'Sarlacc', 'Tauntaun'],
    correctAnswer: 'Wampa',
    explanation: 'Luke used the Force to summon his lightsaber and cut himself free after being captured by the creature.',
    era: 'Original Trilogy',
    difficulty: 'Padawan',
  },
  {
    question: 'What is the name of the Jedi Order rank a Force-sensitive youth holds while apprenticed to a Master?',
    options: ['Padawan', 'Initiate', 'Knight', 'Sentinel'],
    correctAnswer: 'Padawan',
    explanation: 'A Padawan who completes their training is knighted as a Jedi Knight.',
    era: 'The Old Republic',
    difficulty: 'Youngling',
  },
]

async function upsert(question) {
  const existing = await client.fetch(`*[_type == "quizQuestion" && question == $question][0]{_id}`, {
    question: question.question,
  })

  if (existing) {
    await client.patch(existing._id).set(question).commit()
    console.log('Updated quizQuestion:', question.question)
  } else {
    await client.create({ _type: 'quizQuestion', ...question })
    console.log('Created quizQuestion:', question.question)
  }
}

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN env var')
  }
  for (const question of questions) {
    await upsert(question)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
