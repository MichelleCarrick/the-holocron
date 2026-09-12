'use client'

import { useState } from 'react'

export type Question = {
  _id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty?: string
}

type GameState = {
  questions: Question[]
  optionsByQuestion: Record<string, string[]>
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildGame(questions: Question[]): GameState {
  const shuffledQuestions = shuffle(questions)
  const optionsByQuestion: Record<string, string[]> = {}
  for (const q of shuffledQuestions) {
    optionsByQuestion[q._id] = shuffle(q.options)
  }
  return { questions: shuffledQuestions, optionsByQuestion }
}

function getRank(pct: number) {
  if (pct >= 90) return 'Jedi Master'
  if (pct >= 70) return 'Jedi Knight'
  if (pct >= 50) return 'Padawan'
  return 'Youngling'
}

export default function TriviaGame({ questions }: { questions: Question[] }) {
  // The question and option order is shuffled only in response to a real
  // click (starting or restarting), never automatically on mount — that
  // keeps the very first render identical on the server and the client,
  // so there's nothing to shuffle before the user has actually interacted.
  const [game, setGame] = useState<GameState | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <p className="text-zinc-400">No questions yet. Add some in the Studio at /studio.</p>
    )
  }

  function restart() {
    setGame(buildGame(questions))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (!game) {
    return (
      <div className="enter-fade flex flex-col items-center gap-4 rounded-xl border border-gold/30 bg-zinc-900/50 p-8 text-center shadow-[0_0_50px_rgba(201,162,74,0.15)] backdrop-blur">
        <p className="text-zinc-300">
          {questions.length} questions, shuffled fresh every time. Ready to test your knowledge of the galaxy?
        </p>
        <button
          onClick={restart}
          className="mt-2 rounded-full bg-gold px-8 py-3 font-display text-sm uppercase tracking-widest text-black shadow-[0_0_20px_rgba(201,162,74,0.45)] transition-transform hover:scale-105"
        >
          Begin Challenge
        </button>
      </div>
    )
  }

  const total = game.questions.length

  if (finished) {
    const pct = Math.round((score / total) * 100)
    const rank = getRank(pct)
    return (
      <div className="enter-fade flex flex-col items-center gap-4 rounded-xl border border-gold/30 bg-zinc-900/50 p-8 text-center shadow-[0_0_50px_rgba(201,162,74,0.15)] backdrop-blur">
        <p className="font-display text-xs uppercase tracking-widest text-zinc-500">Challenge Complete</p>
        <p className="font-display text-4xl text-gold">
          {score} / {total}
        </p>
        <p className="text-sm uppercase tracking-widest text-zinc-400">Rank: {rank}</p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-gold px-8 py-3 font-display text-sm uppercase tracking-widest text-black shadow-[0_0_20px_rgba(201,162,74,0.45)] transition-transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    )
  }

  const current = game.questions[index]
  const options = game.optionsByQuestion[current._id]

  function selectAnswer(option: string) {
    if (selected) return
    setSelected(option)
    if (option === current.correctAnswer) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  return (
    <div key={current._id} className="enter-fade w-full">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-widest text-zinc-500">
        <span>
          Question {index + 1} of {total}
        </span>
        {current.difficulty && <span>{current.difficulty}</span>}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-gold transition-all duration-300"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <h2 className="mt-6 font-display text-xl leading-relaxed text-zinc-100 sm:text-2xl">
        {current.question}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option
          const isCorrectOption = option === current.correctAnswer

          let className =
            'holo-card rounded-lg border p-4 text-left text-sm transition-all duration-200 border-zinc-700 bg-zinc-900/40 text-zinc-200'
          if (selected) {
            if (isCorrectOption) {
              className =
                'rounded-lg border p-4 text-left text-sm border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
            } else if (isSelected) {
              className = 'rounded-lg border p-4 text-left text-sm border-red-500/60 bg-red-500/10 text-red-300'
            } else {
              className = 'rounded-lg border p-4 text-left text-sm border-zinc-800 bg-zinc-900/20 text-zinc-500'
            }
          } else {
            className += ' hover:border-gold/50 hover:-translate-y-0.5'
          }

          return (
            <button key={option} onClick={() => selectAnswer(option)} disabled={!!selected} className={className}>
              {option}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="detail-fade-in mt-6 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <p className={selected === current.correctAnswer ? 'font-semibold text-emerald-400' : 'font-semibold text-red-400'}>
            {selected === current.correctAnswer ? 'Correct!' : `Not quite — the answer was ${current.correctAnswer}.`}
          </p>
          {current.explanation && <p className="mt-2 text-sm text-zinc-400">{current.explanation}</p>}
          <button
            onClick={next}
            className="mt-4 rounded-full bg-gold px-6 py-2 font-display text-xs uppercase tracking-widest text-black shadow-[0_0_16px_rgba(201,162,74,0.4)] transition-transform hover:scale-105"
          >
            {index + 1 >= total ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}
