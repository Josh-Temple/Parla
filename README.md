# Parla

Parla is a mobile-first trainer for learning the English phrases needed to use AI as a language partner.

> see prompt → think silently → reveal → self-rate → next

Parla is **not** a chatbot. It does not include in-app LLM chat APIs. It helps learners automate practical English phrases first, then transfer them to external AI tools.

## Product focus

- Learn short “AI survival” phrases (meaning help, simplification, correction, conversation control)
- Drill with the existing flash loop and self-rating
- Copy ready-to-use prompts on `/use-with-ai` and practice in ChatGPT / Gemini / Claude / voice AI outside Parla

## Core architecture (unchanged)

- Next.js + React + TypeScript
- localStorage-first progress
- Rating loop (`easy`, `close`, `hard`)
- Review modes (`due`, `hard`, `confusing`, `want_to_use`)
- PWA/offline shell behavior

## Starter dataset

`public/data/cards.json` now includes a primary AI-survival starter layer (~100 cards) tagged with:

- `ai`
- `survival`
- `core`

These cards are prioritized by the AI-survival drill mode (`/drill?mode=ai_survival`).

## Run locally

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Deployment checklist

- Node.js 18+
- Build: `npm run build`
- Install: `npm install`
- No environment variables required for current local-first mode
