# Parla

Parla is a mobile-first, high-tempo English expression trainer focused on **non-input recall**:

> see prompt → think silently → reveal → self-rate → next

## MVP scope

- React + TypeScript with Next.js App Router (Vercel friendly)
- Flash drill mode with self-rating (`easy`, `close`, `hard`)
- Focused drill mode via query (`mode=due|hard|confusing|want_to_use`)
- Browse mode with category/function/register/tag filters
- Review mode (due / hard / confusing / want-to-use)
- Focused drill modes may be empty depending on progress state; app provides an all-cards fallback CTA
- Card detail mode with metadata and progress flags
- Versioned static starter card dataset (`public/data/cards.json`)
- Current starter dataset ships with **8 published cards** (usable immediately)
- Optional static audio URLs per card
- Local-first persistence via `localStorage`

## Architecture

UI is decoupled from data and storage details through domain abstractions:

- `CardRepository` (`src/domain/cards/`)
- `ProgressRepository` (`src/domain/progress/`)
- `AudioResolver` (`src/domain/audio/`)
- Review logic (`src/domain/review/`)

Current MVP implementations:

- `StaticCardRepository` (reads static JSON dataset envelope)
- `LocalProgressRepository` (writes to localStorage)
- `StaticAudioResolver` (resolves optional card audio URLs)

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

## English-first drill cues

The drill experience prioritizes English cueing for faster recall:

- Front side shows `prompts.intent`, `prompts.situation`, and optional `prompts.cloze`
- Japanese is optional support only (`support.jaHint`) and can be switched at runtime
- Reveal keeps pace by showing phrase + example + short English usage note
- Browse and card detail prioritize English copy by default

## Language support modes

Language support mode is persisted in `localStorage`:

- `english-first` (default): shows Hint controls when `support.jaHint` exists
- `english-only`: hides all Japanese hint UI (study flow stays English-only)

Use the nav toggle (`EN-first` / `EN-only`) to switch modes at runtime.

Notes:
- Cards can be authored without Japanese by omitting `support.jaHint`.
- In the current starter dataset, all 8 published cards include `support.jaHint`, but `english-only` mode keeps the UI Japanese-free.

## Dataset schema

`public/data/cards.json` now uses an extensible envelope:

```json
{
  "schema_version": 1,
  "cards": []
}
```

This allows future metadata/schema evolution without changing repository interfaces.

Repository behavior notes:

- Supports current envelope format (`schema_version: 1`)
- Gracefully rejects malformed datasets
- Includes a temporary in-memory fallback for legacy top-level array datasets to ease migration windows

## Dataset authoring workflow

Prompt templates for generating and polishing the initial 50-card dataset are documented in:

- `docs/parla-dataset-prompt-playbook-ja.md`

## Vercel deployment checklist

- Ensure Node.js 18+ runtime in Vercel project settings (Next.js 14 compatible).
- Build command: `npm run build`
- Output: default Next.js output (no extra config required).
- Install command: `npm install`
- Environment variables: none required for current local-first MVP.
