# Parla

Parla is a mobile-first, high-tempo English expression trainer focused on **non-input recall**:

> see prompt → think silently → reveal → self-rate → next

## MVP scope

- React + TypeScript with Next.js App Router (Vercel friendly)
- Flash drill mode with self-rating (`easy`, `close`, `hard`)
- Focused drill mode via query (`mode=due|hard|confusing|want_to_use`)
- Browse mode with category/function/register/tag filters
- Review mode (due / hard / confusing / want-to-use)
- Card detail mode with metadata and progress flags
- Static starter card dataset (`public/data/cards.json`)
- Optional static audio URLs per card
- Local-first persistence via `localStorage`

## Architecture

UI is decoupled from data and storage details through domain abstractions:

- `CardRepository` (`src/domain/cards/`)
- `ProgressRepository` (`src/domain/progress/`)
- `AudioResolver` (`src/domain/audio/`)
- Review logic (`src/domain/review/`)

Current MVP implementations:

- `StaticCardRepository` (reads static JSON)
- `LocalProgressRepository` (writes to localStorage)
- `StaticAudioResolver` (resolves optional card audio URLs)

## Refactor highlights

- Added shared data hook `useParlaData` for cards/progress fetching to remove page-level duplication.
- Added `selectDrillCards` and `DrillMode` in review selectors so focused drill queues are domain-driven.
- Review page now links each section to focused drills (`/drill?mode=...`).
- Drill page now respects mode-based queues and keeps hidden cards excluded.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Dataset authoring workflow

Prompt templates for generating and polishing the initial 50-card dataset are documented in:

- `docs/parla-dataset-prompt-playbook-ja.md`

This playbook includes: full-generation prompt, cleanup prompt, contrast refinement prompt, audio metadata append prompt, and per-category prompt variants.


## Vercel deployment checklist

- Ensure Node.js 18+ runtime in Vercel project settings (Next.js 14 compatible).
- Build command: `npm run build`
- Output: default Next.js output (no extra config required).
- Install command: `npm install`
- Environment variables: none required for current local-first MVP.
- Verified in this repo: both `npm run lint` and `npm run build` pass.
