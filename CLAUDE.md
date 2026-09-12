# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# The Holocron

## Project overview
A personal Star Wars fan site with two parts: a lore archive and an
interactive "Character Builder" quiz. Built with Next.js and Sanity CMS,
deployed via GitHub + Vercel.

## Commands
- `npm run dev` — start the Next.js dev server at http://localhost:3000
  (also serves the embedded Sanity Studio at `/studio` — there's no
  separate Studio process to run)
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- There is no test suite configured in this project.
- Seed/patch scripts: `SANITY_API_WRITE_TOKEN="..." node scripts/<name>.mjs`

## Tech stack
- Next.js 16 (App Router), React 19, TypeScript
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`)
- Tailwind CSS v4 for styling
- Sanity CMS (project ID: q5xhi9pt, dataset: production) for all content
- next-sanity for querying Sanity from Next.js
- Deployed on Vercel, auto-deploys from the `main` branch on GitHub

## Folder structure
- `app/page.tsx` — homepage, lists Archive Entries pulled from Sanity
- `app/builder/page.tsx` — Character Builder page (server component);
  fetches planets, species, kyber crystals, canon characters, and build
  types from Sanity and passes them to `BuilderForm`
- `app/builder/BuilderForm.tsx` — client component with the interactive
  quiz logic. `ImageCardPicker` renders each ingredient (Planet, Species,
  Kyber Crystal) as a grid of clickable image cards and shows the
  selected item's `description` underneath; "Build My Character" then
  runs the stat calculation, name generation, build-type matching, and
  closest-canon-character lookup, all client-side
- `app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio at `/studio`,
  configured by `sanity.config.ts` / `sanity/structure.ts`
- `sanity/schemaTypes/` — all content schema definitions (archiveEntry,
  planet, species, kyberCrystal, canonCharacter, buildType); each new
  type must be added to the `types` array in `sanity/schemaTypes/index.ts`
- `sanity/lib/client.ts` — the Sanity client actually used for reads
  (plain `client.fetch`, `useCdn: true`)
- `sanity/lib/live.ts` — defines `sanityFetch`/`SanityLive` (next-sanity's
  Live Content API) but this isn't wired into any page yet; pages fetch
  with the plain client above instead
- `sanity/env.ts` — reads projectId/dataset/apiVersion from env vars
- `scripts/` — one-off Node scripts for seeding/patching Sanity content;
  each needs a `SANITY_API_WRITE_TOKEN` env var to run
- `AGENTS.md` — auto-generated and re-added by `next dev` itself
  (see `node_modules/next/dist/server/lib/generate-agent-files.js`); it's
  fine to commit as-is, don't hand-edit it

## Character Builder logic (`BuilderForm.tsx`)
- Force/Alignment/Saber start from a base (50/0/50), add the selected
  planet's + species's + crystal's modifier for that stat, add a random
  swing of -5..+5, then clamp to 0-100 (Force/Saber) or -100..100
  (Alignment)
- Build type is chosen by a `getBuildTypeKey(force, alignment, saber)`
  rule (dark/light threshold at ±15 alignment, then compares force vs.
  saber) and matched against Sanity `buildType` docs by their `key` field
- Closest canon character is whichever `canonCharacter` doc minimizes
  Euclidean distance across (forcePower, alignment, saberSkill)
- Name generation picks one random species `nameFragment` + one random
  planet `nameFragment` (lowercased) and concatenates them

## Content model (Sanity)
- `archiveEntry`: lore entries — title, slug, category, era, image,
  summary, body (rich text)
- `planet`, `species`, `kyberCrystal`: character-builder ingredients. The
  schema defines six modifiers each (forceModifier, alignmentModifier,
  saberModifier, agilityModifier, wisdomModifier, resilienceModifier),
  an image, and (planet/species only) `nameFragments` used for name
  generation — but the builder currently only queries and uses
  force/alignment/saber; agility/wisdom/resilience are defined in the
  schema and unused so far
- `canonCharacter`: Vader, Yoda, Luke, Obi-Wan, etc. — only three stats
  (forcePower, alignment, saberSkill), same 0-100 scale as above
  (alignment is -100 to 100), used for "closest match"
- `buildType`: named archetypes (Warrior, Force User, Dark Adept, Sith
  Warrior, Sentinel, Nomad/Rogue Jedi), matched in code by a `key` field

## Conventions
- Env vars live in `.env.local` (NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_PROJECT_ID) and are mirrored in Vercel's project
  settings under Environments → Production
- New Sanity content types go in `sanity/schemaTypes/<name>.ts` and must
  be added to the `types` array in `sanity/schemaTypes/index.ts`
- One-off data scripts go in `scripts/`, run with:
  `SANITY_API_WRITE_TOKEN="..." node scripts/<name>.mjs`
- Stick to Tailwind utility classes for styling, matching existing pages
- I'm new to coding — please explain changes in plain language and
  avoid unnecessary new tools/libraries unless there's a clear reason
