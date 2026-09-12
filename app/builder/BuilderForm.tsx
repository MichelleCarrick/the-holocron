'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '../../sanity/lib/image'

// Animates a number counting up to its target whenever the target changes —
// the "HUD readout" feel of a game stat screen powering on, instead of
// numbers just snapping into place.
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0)
  const previous = useRef(0)

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const effectiveDuration = reduceMotion ? 0 : duration

    const from = previous.current
    const delta = target - from
    let frameId: number
    let start: number | null = null

    function step(timestamp: number) {
      if (start === null) start = timestamp
      const progress = effectiveDuration === 0 ? 1 : Math.min((timestamp - start) / effectiveDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + delta * eased))
      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        previous.current = target
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])

  return value
}

type Modifier = {
  _id: string
  name: string
  description?: string
  image?: SanityImageSource
  forceModifier: number
  alignmentModifier: number
  saberModifier: number
  agilityModifier?: number
  wisdomModifier?: number
  resilienceModifier?: number
  nameFragments?: string[]
  color?: string
  notableCharacters?: string[]
  keyEvents?: string[]
  appearances?: string[]
  trivia?: string
}

type CanonCharacter = {
  _id: string
  name: string
  image?: SanityImageSource
  forcePower: number
  alignment: number
  saberSkill: number
  agility: number
  wisdom: number
  resilience: number
}

type BuildType = {
  _id: string
  key: string
  name: string
  description: string
}

type Props = {
  planets: Modifier[]
  species: Modifier[]
  crystals: Modifier[]
  canonCharacters: CanonCharacter[]
  buildTypes: BuildType[]
}

// The five "power" stats used for the Top Trumps-style scorecard. Alignment
// is tracked separately since it's a moral axis, not a power level.
const POWER_STAT_KEYS = ['force', 'saber', 'agility', 'wisdom', 'resilience'] as const
type PowerStatKey = (typeof POWER_STAT_KEYS)[number]

const POWER_STAT_LABELS: Record<PowerStatKey, string> = {
  force: 'Force Power',
  saber: 'Saber Skill',
  agility: 'Agility',
  wisdom: 'Wisdom',
  resilience: 'Resilience',
}

const CANON_STAT_KEYS: Record<PowerStatKey, keyof CanonCharacter> = {
  force: 'forcePower',
  saber: 'saberSkill',
  agility: 'agility',
  wisdom: 'wisdom',
  resilience: 'resilience',
}

type DuelResult = {
  character: CanonCharacter
  margin: number
  outcome: 'win' | 'lose'
}

type Result = {
  name: string
  force: number
  alignment: number
  saber: number
  agility: number
  wisdom: number
  resilience: number
  powerLevel: number
  tier: string
  buildType: BuildType | null
  closestMatch: CanonCharacter | null
  statRanks: Record<PowerStatKey, number>
  rosterSize: number
  duelResults: DuelResult[]
}

type ActiveDetail = {
  type: string
  item: Modifier
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function pick<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateName(planet?: Modifier, species?: Modifier) {
  const first = pick(species?.nameFragments ?? []) ?? 'Kae'
  const second = pick(planet?.nameFragments ?? []) ?? 'Ral'
  return `${first}${second.toLowerCase()}`
}

// Rolling twice and averaging gives a triangular distribution centered on 0
// (extreme swings are rarer than with one flat roll) — like rolling two dice
// instead of one.
function rollSwing(range: number) {
  const roll = () => Math.random() * range * 2 - range
  return Math.round((roll() + roll()) / 2)
}

function getBuildTypeKey(force: number, alignment: number, saber: number) {
  const isDark = alignment < -15
  const isLight = alignment > 15

  if (isDark && saber >= force) return 'sith-warrior'
  if (isDark && force > saber) return 'dark-adept'
  if (isLight && force > saber) return 'force-user'
  if (isLight && saber >= force) return 'warrior'
  if (Math.abs(force - saber) < 10) return 'sentinel'
  return 'rogue-jedi'
}

// A single, shared 3-tier system used for both the character you build and
// every canon character, so "who's stronger than who" is legible at a
// glance: Padawan < Knight < Grand Master, the same rank progression the
// Jedi Order itself uses. Thresholds are calibrated against the canon
// roster's own power levels (average of the 5 power stats) — Grand Master
// starts where legends like Anakin and Count Dooku sit, Knight covers
// solid, well-known fighters, and Padawan is everyone still finding
// their footing (which most builds, and a few canon characters, land in).
function getTier(powerLevel: number) {
  if (powerLevel >= 76) return 'Grand Master'
  if (powerLevel >= 60) return 'Knight'
  return 'Padawan'
}

function canonPowerLevel(character: CanonCharacter) {
  return (
    (character.forcePower + character.saberSkill + character.agility + character.wisdom + character.resilience) / 5
  )
}

// 6-dimensional distance across every stat. Alignment runs -100..100 (twice
// the range of the other stats), so its difference is halved first to put
// it on the same scale before comparing.
function findClosestMatch(
  stats: { force: number; alignment: number; saber: number; agility: number; wisdom: number; resilience: number },
  canonCharacters: CanonCharacter[]
) {
  if (!canonCharacters.length) return null
  let closest = canonCharacters[0]
  let smallestDistance = Infinity
  for (const character of canonCharacters) {
    const distance = Math.sqrt(
      (stats.force - character.forcePower) ** 2 +
        ((stats.alignment - character.alignment) / 2) ** 2 +
        (stats.saber - character.saberSkill) ** 2 +
        (stats.agility - character.agility) ** 2 +
        (stats.wisdom - character.wisdom) ** 2 +
        (stats.resilience - character.resilience) ** 2
    )
    if (distance < smallestDistance) {
      smallestDistance = distance
      closest = character
    }
  }
  return closest
}

// Where would this stat value place if it were added to the canon roster?
// 1 = highest in the galaxy for that stat.
function rankAmongCanon(value: number, canonCharacters: CanonCharacter[], key: keyof CanonCharacter) {
  const higher = canonCharacters.filter((c) => (c[key] as number) > value).length
  return higher + 1
}

// A duel comes down to blade skill and raw Force power first, quick
// reflexes second, and a smaller edge from foresight and staying power —
// so Saber Skill and Force Power are weighted heaviest. Alignment is left
// out entirely: being light- or dark-aligned doesn't make you a better
// fighter. Weights sum to 1, so the result stays on the same 0-100 scale
// as the stats themselves.
const DUEL_WEIGHTS: Record<PowerStatKey, number> = {
  force: 0.3,
  saber: 0.35,
  agility: 0.15,
  wisdom: 0.1,
  resilience: 0.1,
}

function duelScore(stats: Record<PowerStatKey, number>) {
  return POWER_STAT_KEYS.reduce((total, key) => total + stats[key] * DUEL_WEIGHTS[key], 0)
}

function canonDuelScore(character: CanonCharacter) {
  return duelScore({
    force: character.forcePower,
    saber: character.saberSkill,
    agility: character.agility,
    wisdom: character.wisdom,
    resilience: character.resilience,
  })
}

function simulateDuels(playerStats: Record<PowerStatKey, number>, canonCharacters: CanonCharacter[]): DuelResult[] {
  const playerScore = duelScore(playerStats)
  return canonCharacters
    .map((character) => {
      const margin = Math.round(playerScore - canonDuelScore(character))
      return { character, margin, outcome: margin >= 0 ? ('win' as const) : ('lose' as const) }
    })
    .sort((a, b) => b.margin - a.margin)
}

export default function BuilderForm({ planets, species, crystals, canonCharacters, buildTypes }: Props) {
  const [planetId, setPlanetId] = useState(planets[0]?._id ?? '')
  const [speciesId, setSpeciesId] = useState(species[0]?._id ?? '')
  const [crystalId, setCrystalId] = useState(crystals[0]?._id ?? '')
  const [result, setResult] = useState<Result | null>(null)
  const [activeDetail, setActiveDetail] = useState<ActiveDetail | null>(null)

  function selectPlanet(id: string) {
    setPlanetId(id)
    const item = planets.find((p) => p._id === id)
    if (item) setActiveDetail({ type: 'Planet', item })
  }

  function selectSpecies(id: string) {
    setSpeciesId(id)
    const item = species.find((s) => s._id === id)
    if (item) setActiveDetail({ type: 'Species', item })
  }

  function selectCrystal(id: string) {
    setCrystalId(id)
    const item = crystals.find((c) => c._id === id)
    if (item) setActiveDetail({ type: 'Kyber Crystal', item })
  }

  function handleBuild() {
    const planet = planets.find((p) => p._id === planetId)
    const chosenSpecies = species.find((s) => s._id === speciesId)
    const crystal = crystals.find((c) => c._id === crystalId)

    // Kyber crystals only ever modify Force, Alignment, and Saber Skill —
    // they're a lightsaber component, not something that changes how quick
    // or wise you are — so they simply don't contribute to the other three.
    const force = clamp(
      50 + (planet?.forceModifier ?? 0) + (chosenSpecies?.forceModifier ?? 0) + (crystal?.forceModifier ?? 0) + rollSwing(5),
      0,
      100
    )
    const alignment = clamp(
      0 +
        (planet?.alignmentModifier ?? 0) +
        (chosenSpecies?.alignmentModifier ?? 0) +
        (crystal?.alignmentModifier ?? 0) +
        rollSwing(10),
      -100,
      100
    )
    const saber = clamp(
      50 + (planet?.saberModifier ?? 0) + (chosenSpecies?.saberModifier ?? 0) + (crystal?.saberModifier ?? 0) + rollSwing(5),
      0,
      100
    )
    const agility = clamp(
      50 + (planet?.agilityModifier ?? 0) + (chosenSpecies?.agilityModifier ?? 0) + rollSwing(5),
      0,
      100
    )
    const wisdom = clamp(
      50 + (planet?.wisdomModifier ?? 0) + (chosenSpecies?.wisdomModifier ?? 0) + rollSwing(5),
      0,
      100
    )
    const resilience = clamp(
      50 + (planet?.resilienceModifier ?? 0) + (chosenSpecies?.resilienceModifier ?? 0) + rollSwing(5),
      0,
      100
    )

    const powerLevel = Math.round((force + saber + agility + wisdom + resilience) / 5)
    const tier = getTier(powerLevel)

    const buildTypeKey = getBuildTypeKey(force, alignment, saber)
    const buildType = buildTypes.find((b) => b.key === buildTypeKey) ?? null
    const closestMatch = findClosestMatch({ force, alignment, saber, agility, wisdom, resilience }, canonCharacters)
    const name = generateName(planet, chosenSpecies)

    const statValues: Record<PowerStatKey, number> = { force, saber, agility, wisdom, resilience }
    const statRanks = POWER_STAT_KEYS.reduce((acc, keyName) => {
      acc[keyName] = rankAmongCanon(statValues[keyName], canonCharacters, CANON_STAT_KEYS[keyName])
      return acc
    }, {} as Record<PowerStatKey, number>)
    const duelResults = simulateDuels(statValues, canonCharacters)

    setResult({
      name,
      force,
      alignment,
      saber,
      agility,
      wisdom,
      resilience,
      powerLevel,
      tier,
      buildType,
      closestMatch,
      statRanks,
      rosterSize: canonCharacters.length + 1,
      duelResults,
    })
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <ImageCardPicker label="Planet" items={planets} selectedId={planetId} onSelect={selectPlanet} />
        <ImageCardPicker label="Species" items={species} selectedId={speciesId} onSelect={selectSpecies} />
        <ImageCardPicker label="Kyber Crystal" items={crystals} selectedId={crystalId} onSelect={selectCrystal} />
      </div>

      <button
        onClick={handleBuild}
        className="self-start rounded-full bg-gold px-8 py-3 font-display text-sm uppercase tracking-widest text-black shadow-[0_0_20px_rgba(201,162,74,0.45)] transition-transform hover:scale-105"
      >
        Build My Character
      </button>

      {result && <ScoreCard result={result} />}

      <DetailPanel detail={activeDetail} onClose={() => setActiveDetail(null)} />
    </div>
  )
}

function ScoreCard({ result }: { result: Result }) {
  const animatedPowerLevel = useCountUp(result.powerLevel)

  return (
    <div
      key={result.name}
      className="enter-fade flex flex-col gap-5 rounded-xl border border-gold/30 bg-zinc-900/50 p-6 shadow-[0_0_50px_rgba(201,162,74,0.15)] backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-2xl tracking-wide text-gold">{result.name}</h2>
        <div className="shrink-0 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-right">
          <p className="font-display text-xl leading-none text-gold tabular-nums">{animatedPowerLevel}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-zinc-400">{result.tier}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Stat
          label={POWER_STAT_LABELS.force}
          value={result.force}
          rank={result.statRanks.force}
          rosterSize={result.rosterSize}
          barClassName="bg-gradient-to-r from-violet-700 to-fuchsia-400"
        />
        <Stat
          label={POWER_STAT_LABELS.saber}
          value={result.saber}
          rank={result.statRanks.saber}
          rosterSize={result.rosterSize}
          barClassName="bg-gradient-to-r from-amber-600 to-amber-300"
        />
        <Stat
          label={POWER_STAT_LABELS.agility}
          value={result.agility}
          rank={result.statRanks.agility}
          rosterSize={result.rosterSize}
          barClassName="bg-gradient-to-r from-emerald-600 to-emerald-300"
        />
        <Stat
          label={POWER_STAT_LABELS.wisdom}
          value={result.wisdom}
          rank={result.statRanks.wisdom}
          rosterSize={result.rosterSize}
          barClassName="bg-gradient-to-r from-cyan-700 to-cyan-300"
        />
        <Stat
          label={POWER_STAT_LABELS.resilience}
          value={result.resilience}
          rank={result.statRanks.resilience}
          rosterSize={result.rosterSize}
          barClassName="bg-gradient-to-r from-orange-700 to-orange-300"
        />
        <Stat
          label={result.alignment >= 0 ? 'Light Side' : 'Dark Side'}
          value={Math.abs(result.alignment)}
          barClassName={
            result.alignment >= 0
              ? 'bg-gradient-to-r from-sky-700 to-sky-300'
              : 'bg-gradient-to-r from-red-700 to-red-400'
          }
        />
      </div>

      {result.buildType && (
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-zinc-500">
            Build Type: {result.buildType.name}
          </p>
          <p className="mt-1 text-zinc-300">{result.buildType.description}</p>
        </div>
      )}

      {result.closestMatch && <ComparisonPanel result={result} match={result.closestMatch} />}

      <DuelOutcomes duelResults={result.duelResults} />
    </div>
  )
}

function DuelOutcomes({ duelResults }: { duelResults: DuelResult[] }) {
  if (!duelResults.length) return null

  const wins = duelResults.filter((d) => d.outcome === 'win')
  const losses = duelResults.filter((d) => d.outcome === 'lose').sort((a, b) => a.margin - b.margin)

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-widest text-zinc-500">
        Duel Outcomes — {wins.length} of {duelResults.length} Canon Characters
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Based on a duel score weighting Saber Skill and Force Power heaviest, then Agility, Wisdom, and Resilience.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DuelList title="You Would Defeat" tone="win" entries={wins} />
        <DuelList title="You Would Lose To" tone="lose" entries={losses} />
      </div>
    </div>
  )
}

function DuelList({ title, tone, entries }: { title: string; tone: 'win' | 'lose'; entries: DuelResult[] }) {
  const toneClass = tone === 'win' ? 'text-gold' : 'text-red-400'

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
      <p className={`font-display text-xs uppercase tracking-widest ${toneClass}`}>{title}</p>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">None.</p>
      ) : (
        <ul className="mt-2 flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {entries.map(({ character, margin }) => (
            <li key={character._id} className="flex items-center gap-2">
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded bg-zinc-800 ring-1 ring-white/5">
                {character.image && (
                  <Image
                    src={urlFor(character.image).width(56).height(56).fit('crop').url()}
                    alt={character.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                )}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">{character.name}</span>
              <TierBadge tier={getTier(canonPowerLevel(character))} />
              <span className={`shrink-0 text-xs font-semibold ${toneClass}`}>
                {margin > 0 ? '+' : ''}
                {margin}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ComparisonPanel({ result, match }: { result: Result; match: CanonCharacter }) {
  const rows = POWER_STAT_KEYS.map((key) => ({
    label: POWER_STAT_LABELS[key],
    you: result[key],
    them: match[CANON_STAT_KEYS[key]] as number,
  }))
  const wins = rows.filter((row) => row.you > row.them).length

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
      <p className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-zinc-500">
        Closest Match: <span className="text-gold">{match.name}</span>
        <TierBadge tier={getTier(canonPowerLevel(match))} />
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-sm">
            <span className="w-24 shrink-0 text-zinc-400">{row.label}</span>
            <span className={`w-8 text-right ${row.you > row.them ? 'font-semibold text-gold' : 'text-zinc-300'}`}>
              {row.you}
            </span>
            <span className="text-xs text-zinc-600">vs</span>
            <span className={`w-8 ${row.them > row.you ? 'font-semibold text-gold' : 'text-zinc-300'}`}>
              {row.them}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-zinc-300">
        You&apos;d beat <span className="font-semibold text-gold">{match.name}</span> in{' '}
        <span className="font-semibold text-gold">{wins}</span> of {rows.length} categories.
      </p>
    </div>
  )
}

const TIER_BADGE_CLASSES: Record<string, string> = {
  'Grand Master': 'border-gold/40 bg-gold/10 text-gold',
  Knight: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  Padawan: 'border-zinc-600 bg-zinc-800 text-zinc-400',
}

const TIER_ICONS: Record<string, string> = {
  'Grand Master': '★',
  Knight: '◆',
  Padawan: '▪',
}

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        TIER_BADGE_CLASSES[tier] ?? TIER_BADGE_CLASSES.Padawan
      }`}
    >
      <span aria-hidden="true">{TIER_ICONS[tier] ?? TIER_ICONS.Padawan}</span>
      {tier}
    </span>
  )
}

function ImageCardPicker({
  label,
  items,
  selectedId,
  onSelect,
}: {
  label: string
  items: Modifier[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-display text-xs uppercase tracking-widest text-zinc-400">{label}</span>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {items.map((item) => {
          const isSelected = item._id === selectedId
          return (
            <button
              key={item._id}
              type="button"
              onClick={() => onSelect(item._id)}
              className={`holo-card flex flex-col items-center gap-2 rounded-lg border p-2 text-center transition-all duration-200 ${
                isSelected
                  ? 'border-gold bg-gold/10 shadow-[0_0_16px_rgba(201,162,74,0.35)]'
                  : 'border-zinc-800 bg-zinc-900/40 hover:-translate-y-0.5 hover:border-zinc-600'
              }`}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded bg-zinc-800 ring-1 ring-white/5">
                {item.image ? (
                  <Image
                    src={urlFor(item.image).width(200).height(200).fit('crop').url()}
                    alt={item.name}
                    fill
                    sizes="(min-width: 640px) 25vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                    No image
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium ${isSelected ? 'text-gold' : 'text-zinc-300'}`}>
                {item.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  barClassName,
  rank,
  rosterSize,
}: {
  label: string
  value: number
  barClassName: string
  rank?: number
  rosterSize?: number
}) {
  const animatedValue = useCountUp(value)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm text-zinc-300">
        <span>{label}</span>
        <span className="tabular-nums">
          {animatedValue}
          {rank && rosterSize && <span className="ml-2 text-xs text-zinc-500">#{rank} of {rosterSize}</span>}
        </span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${barClassName}`} style={{ width: `${animatedValue}%` }} />
      </div>
    </div>
  )
}

function DetailPanel({ detail, onClose }: { detail: ActiveDetail | null; onClose: () => void }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-10 bg-black/60 transition-opacity duration-300 ${
          detail ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-20 w-[min(24rem,90vw)] overflow-y-auto border-l border-gold/20 bg-zinc-950/95 p-6 shadow-[-20px_0_60px_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform duration-300 ease-out ${
          detail ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {detail && (
          <div key={detail.item._id} className="detail-fade-in flex flex-col gap-5">
            <button
              type="button"
              onClick={onClose}
              className="self-end text-sm text-zinc-500 transition-colors hover:text-gold"
            >
              ✕ Close
            </button>

            <div className="relative h-40 w-full overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/5">
              {detail.item.image && (
                <Image
                  src={urlFor(detail.item.image).width(400).height(300).fit('crop').url()}
                  alt={detail.item.name}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
              )}
            </div>

            <div>
              <p className="font-display text-xs uppercase tracking-widest text-zinc-500">{detail.type}</p>
              <h3 className="mt-1 font-display text-xl tracking-wide text-gold">{detail.item.name}</h3>
              {detail.item.description && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{detail.item.description}</p>
              )}
            </div>

            {!!detail.item.notableCharacters?.length && (
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Notable Characters</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {detail.item.notableCharacters.map((name) => (
                    <li
                      key={name}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-300"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!detail.item.keyEvents?.length && (
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Key Events</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
                  {detail.item.keyEvents.map((event) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
              </div>
            )}

            {!!detail.item.appearances?.length && (
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Appearances</p>
                <p className="mt-2 text-sm text-zinc-300">{detail.item.appearances.join(' • ')}</p>
              </div>
            )}

            {detail.item.trivia && (
              <p className="border-t border-zinc-800 pt-4 text-xs italic text-zinc-500">{detail.item.trivia}</p>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
