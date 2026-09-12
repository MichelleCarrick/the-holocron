// Turn-based duel simulator shared by the Duel Arena. Pure functions, no
// React here, so the math can be reasoned about (and tested) on its own.
//
// An earlier version compared attack vs. defense directly (attacker wins
// the round only if their score is strictly higher). Simulating it caught
// two real problems: mirror matches between similarly-statted fighters
// (e.g. Yoda vs. Yoda) barely ever resolved because both sides' rolls kept
// canceling out, and some matchups where both fighters had high defense
// relative to the other's attack ground on for 40+ rounds because hits
// landed too rarely. Switching to a probability-based hit chance — every
// attacker always has at least a 10% chance to land a hit, and at most a
// 90% chance to whiff — bounds how long a fight can realistically run
// while still making the stronger fighter win the large majority of the
// time.

export type Fighter = {
  id: string
  name: string
  forcePower: number
  saberSkill: number
  agility: number
  wisdom: number
  resilience: number
}

export type LogLine = {
  round: number
  text: string
  defenderId: string
  defenderHealth: number
  defenderMaxHealth: number
}

export type DuelOutcome = {
  winner: Fighter | null // null only in the vanishingly rare exact-health tie
  log: LogLine[]
  finalHealth: Record<string, number>
  maxHealth: Record<string, number>
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

// Same "roll twice and average" triangular distribution used in the
// Character Builder, so randomness feels consistent across the site.
function triSwing(range: number) {
  const roll = () => Math.random() * range * 2 - range
  return Math.round((roll() + roll()) / 2)
}

function hitChance(attack: number, defense: number) {
  return clamp(50 + (attack - defense) * 2, 10, 90)
}

const HIT_LINES = [
  "{a} lands a precise strike, cutting through {b}'s guard!",
  "{a}'s blade flashes — a solid hit on {b}!",
  "{a} channels the Force into the blow, staggering {b}!",
  "A quick feint from {a} catches {b} off guard!",
  "{a} presses the advantage and connects!",
]

const MISS_LINES = [
  "{b} deflects the strike with a Force-guided parry!",
  "{a}'s attack goes wide as {b} sidesteps!",
  "{b} reads the attack and blocks it cleanly!",
  "{a} presses forward, but {b} holds the line!",
  "{b} narrowly avoids a killing blow!",
]

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatLine(template: string, attacker: string, defender: string) {
  return template.replace('{a}', attacker).replace('{b}', defender)
}

// Health, attack, and defense are all derived from the same 5 stats used
// everywhere else on the site (Force, Saber Skill, Agility, Wisdom,
// Resilience) so a character's duel performance is never a black box.
export function simulateDuel(a: Fighter, b: Fighter): DuelOutcome {
  const maxHealth: Record<string, number> = {
    [a.id]: 50 + a.resilience * 0.5,
    [b.id]: 50 + b.resilience * 0.5,
  }
  const health: Record<string, number> = { ...maxHealth }

  const goesFirst =
    a.agility === b.agility ? (Math.random() < 0.5 ? a : b) : a.agility > b.agility ? a : b
  const order = goesFirst === a ? [a, b] : [b, a]

  const log: LogLine[] = []
  const MAX_ROUNDS = 60

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    for (const attacker of order) {
      const defender = attacker === a ? b : a
      if (health[a.id] <= 0 || health[b.id] <= 0) break

      const attack = attacker.saberSkill * 0.6 + attacker.forcePower * 0.4 + triSwing(8)
      const defense = defender.agility * 0.7 + defender.wisdom * 0.3 + triSwing(8)
      const hit = Math.random() * 100 < hitChance(attack, defense)

      if (hit) {
        const damage = Math.max(3, Math.round((attack - defense * 0.6) / 2))
        health[defender.id] = Math.max(0, health[defender.id] - damage)
        log.push({
          round,
          text: formatLine(pick(HIT_LINES), attacker.name, defender.name),
          defenderId: defender.id,
          defenderHealth: health[defender.id],
          defenderMaxHealth: maxHealth[defender.id],
        })
      } else {
        log.push({
          round,
          text: formatLine(pick(MISS_LINES), attacker.name, defender.name),
          defenderId: defender.id,
          defenderHealth: health[defender.id],
          defenderMaxHealth: maxHealth[defender.id],
        })
      }

      if (health[defender.id] <= 0) {
        log.push({
          round,
          text: `${attacker.name} lands the finishing blow — ${defender.name} yields!`,
          defenderId: defender.id,
          defenderHealth: 0,
          defenderMaxHealth: maxHealth[defender.id],
        })
        return { winner: attacker, log, finalHealth: health, maxHealth }
      }
    }
  }

  const winner =
    health[a.id] === health[b.id] ? null : health[a.id] > health[b.id] ? a : b
  return { winner, log, finalHealth: health, maxHealth }
}
