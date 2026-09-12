import { client } from "../../sanity/lib/client";
import Watermark from "../Watermark";
import TriviaGame, { type Question } from "./TriviaGame";

async function getQuestions(): Promise<Question[]> {
  return client.fetch(
    `*[_type == "quizQuestion"]{
      _id, question, options, correctAnswer, explanation, difficulty
    }`,
    {},
    { next: { revalidate: 0 } }
  );
}

export default async function TriviaPage() {
  const questions = await getQuestions();

  return (
    <div className="flex flex-1 flex-col items-center">
      <main className="flex w-full max-w-2xl flex-1 flex-col items-center px-6 py-16 sm:px-10">
        <div className="enter-fade relative mb-12 text-center">
          <Watermark className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06]" />
          <h1 className="font-display text-4xl tracking-[0.15em] text-gold sm:text-5xl">
            TRIVIA CHALLENGE
          </h1>
          <p className="mt-4 text-zinc-400">
            Test your knowledge of the galaxy.
          </p>
        </div>

        <TriviaGame questions={questions} />
      </main>
    </div>
  );
}
