'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '../../sanity/lib/image'
import { simulateDuel, type Fighter, type DuelOutcome } from './duelEngine'

export type DuelCharacter = Fighter & { image?: SanityImageSource }

const REVEAL_INTERVAL_MS = 450

export default function DuelArena({ characters }: { characters: DuelCharacter[] }) {
  const [fighterAId, setFighterAId] = useState(characters[0]?.id ?? '')
  const [fighterBId, setFighterBId] = useState(characters[1]?.id ?? '')
  const [outcome, setOutcome] = useState<DuelOutcome | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fighterA = characters.find((c) => c.id === fighterAId)
  const fighterB = characters.find((c) => c.id === fighterBId)

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => clearTimer, [])

  function reset() {
    clearTimer()
    setOutcome(null)
    setRevealedCount(0)
  }

  function beginDuel() {
    if (!fighterA || !fighterB || fighterA.id === fighterB.id) return
    clearTimer()
    const result = simulateDuel(fighterA, fighterB)
    setOutcome(result)
    setRevealedCount(0)
    intervalRef.current = setInterval(() => {
      setRevealedCount((count) => {
        if (count + 1 >= result.log.length) {
          clearTimer()
        }
        return Math.min(count + 1, result.log.length)
      })
    }, REVEAL_INTERVAL_MS)
  }

  function skipToResult() {
    clearTimer()
    if (outcome) setRevealedCount(outcome.log.length)
  }

  // Health at the current point in the reveal, derived by walking the log
  // up to revealedCount rather than jumping straight to the final values —
  // this is what makes the health bars drain in sync with the log.
  const currentHealth = useMemo(() => {
    if (!outcome || !fighterA || !fighterB) return null
    const health: Record<string, number> = {
      [fighterA.id]: outcome.maxHealth[fighterA.id],
      [fighterB.id]: outcome.maxHealth[fighterB.id],
    }
    for (let i = 0; i < revealedCount; i++) {
      const line = outcome.log[i]
      health[line.defenderId] = line.defenderHealth
    }
    return health
  }, [outcome, revealedCount, fighterA, fighterB])

  const isFightRevealing = !!outcome && revealedCount < outcome.log.length
  const isFightDone = !!outcome && revealedCount >= outcome.log.length

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FighterPicker
          label="Fighter A"
          characters={characters}
          selectedId={fighterAId}
          onSelect={(id) => {
            reset()
            setFighterAId(id)
          }}
        />
        <FighterPicker
          label="Fighter B"
          characters={characters}
          selectedId={fighterBId}
          onSelect={(id) => {
            reset()
            setFighterBId(id)
          }}
        />
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={beginDuel}
          disabled={!fighterA || !fighterB || fighterAId === fighterBId}
          className="rounded-full bg-gold px-8 py-3 font-display text-sm uppercase tracking-widest text-black shadow-[0_0_20px_rgba(201,162,74,0.45)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Begin Duel
        </button>
        {isFightRevealing && (
          <button
            onClick={skipToResult}
            className="rounded-full border border-zinc-700 px-6 py-3 text-sm text-zinc-300 transition-colors hover:border-gold hover:text-gold"
          >
            Skip to Result
          </button>
        )}
      </div>

      {fighterAId === fighterBId && (
        <p className="mt-3 text-center text-sm text-zinc-500">Pick two different fighters.</p>
      )}

      {outcome && fighterA && fighterB && currentHealth && (
        <div className="enter-fade mt-8 flex flex-col gap-6 rounded-xl border border-gold/30 bg-zinc-900/50 p-6 shadow-[0_0_50px_rgba(201,162,74,0.15)] backdrop-blur">
          <div className="grid grid-cols-2 gap-6">
            <HealthPanel
              character={fighterA}
              health={currentHealth[fighterA.id]}
              maxHealth={outcome.maxHealth[fighterA.id]}
            />
            <HealthPanel
              character={fighterB}
              health={currentHealth[fighterB.id]}
              maxHealth={outcome.maxHealth[fighterB.id]}
              align="right"
            />
          </div>

          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            {outcome.log.slice(0, revealedCount).map((line, i) => (
              <p key={i} className="detail-fade-in text-sm text-zinc-300">
                <span className="mr-2 text-xs text-zinc-600">R{line.round}</span>
                {line.text}
              </p>
            ))}
          </div>

          {isFightDone && (
            <div className="detail-fade-in text-center">
              {outcome.winner ? (
                <p className="font-display text-2xl tracking-wide text-gold">
                  {outcome.winner.name} is victorious!
                </p>
              ) : (
                <p className="font-display text-xl tracking-wide text-zinc-300">
                  The duel ends in a stalemate.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FighterPicker({
  label,
  characters,
  selectedId,
  onSelect,
}: {
  label: string
  characters: DuelCharacter[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const selected = characters.find((c) => c.id === selectedId)

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <span className="font-display text-xs uppercase tracking-widest text-zinc-400">{label}</span>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-gold focus:outline-none"
      >
        {characters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-2 flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-zinc-800 ring-1 ring-white/5">
            {selected.image && (
              <Image
                src={urlFor(selected.image).width(96).height(96).fit('crop').url()}
                alt={selected.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            )}
          </div>
          <span className="text-sm text-zinc-200">{selected.name}</span>
        </div>
      )}
    </div>
  )
}

function HealthPanel({
  character,
  health,
  maxHealth,
  align = 'left',
}: {
  character: DuelCharacter
  health: number
  maxHealth: number
  align?: 'left' | 'right'
}) {
  const pct = Math.max(0, Math.round((health / maxHealth) * 100))
  const barColor =
    pct > 50
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
      : pct > 20
        ? 'bg-gradient-to-r from-amber-600 to-amber-400'
        : 'bg-gradient-to-r from-red-700 to-red-500'

  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <div className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-800 ring-1 ring-white/5">
          {character.image && (
            <Image
              src={urlFor(character.image).width(80).height(80).fit('crop').url()}
              alt={character.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          )}
        </div>
        <span className="truncate text-sm font-medium text-zinc-200">{character.name}</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        {Math.round(health)} / {Math.round(maxHealth)}
      </p>
    </div>
  )
}
