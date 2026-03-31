# Parla

Parla is a mobile-first, high-tempo English expression trainer focused on **non-input recall**:

> see prompt → think silently → reveal → self-rate → next

This iteration keeps that flash-drill loop intact, but shifts the starter content toward a **foundation layer of reusable core English patterns**. The goal is not to turn Parla into a chatbot. The goal is to help learners automate a small set of high-frequency sentence frames that they can later carry into AI conversation practice outside the app.

## MVP scope

- React + TypeScript with Next.js App Router (Vercel friendly)
- Flash drill mode with self-rating (`easy`, `close`, `hard`)
- Lightweight staged review: same-session requeue for weak cards plus day-based interval ladder
- Focused drill mode via query (`mode=due|hard|confusing|want_to_use`)
- Browse mode with category/function/register/tag filters
- Review mode (due / hard / confusing / want-to-use)
- Focused drill modes may be empty depending on progress state; app provides an all-cards fallback CTA
- Card detail mode with metadata and progress flags
- Versioned static starter card dataset (`public/data/cards.json`)
- Current starter dataset ships with **50 published cards**:
  - 8 original situational phrase cards
  - 36 original core/foundation cards centered on reusable sentence patterns
  - 6 additional request-family cards for tighter contrast practice
- Optional static audio URLs per card
- Local-first persistence via `localStorage`
- Installable PWA shell with manifest, home-screen metadata, and offline asset caching

## Home flow

The home screen is intentionally lightweight and centered on the daily study start:

- **Today** is the main action surface with the primary drill CTA.
- A compact inline summary shows reviewed-today, due, and goal progress.
- **Quick access** is limited to secondary entry points such as Browse and, only when relevant, Hard cards.
- Empty home sections are hidden instead of rendered as dashboard placeholders.

## Product direction

Parla is now designed around two complementary layers:

1. **Situational phrases** for immediately useful expressions.
2. **Core patterns** for early speaking/output training.

The foundation layer prioritizes short, modern patterns learners can vary by swapping slots, for example:

- `I am from ...`
- `I want to ...`
- `I usually ...`
- `I think ...`
- `Could you say that again?`
- `What do you mean by ...?`

These cards are meant to prepare learners for later AI conversation practice without adding chat features inside Parla itself.

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

- Front side keeps `prompts.intent` and `prompts.situation` as the primary cues
- `prompts.cloze` is optional and should only appear when it strengthens phrase recall
- Cloze hints are hidden by default in drill mode and are revealed only when the learner taps the cloze hint button
- Japanese is optional support only (`support.jaHint`) and can be switched at runtime
- Reveal keeps pace by showing phrase + pattern + example + short usage note
- When present, `quick_variations` are shown compactly on reveal to reinforce reusable structure
- Browse and card detail prioritize English copy by default

## Lightweight review scheduling

Parla keeps the fast recall loop, but now adds a small staged review layer instead of a heavy SRS:

- Interval ladder: `same-session -> 1 day -> 3 days -> 7 days -> 14 days -> 30 days`
- `hard` keeps weak cards close and can requeue them later in the same session
- `close` advances one step at a time
- `easy` advances faster by skipping ahead two steps when possible
- All-cards drill now prioritizes due cards first, then unseen cards, before later scheduled cards

Progress remains local-first in `localStorage`, and existing saved progress is migrated in-place by treating new scheduling fields as optional defaults.

## Language support modes

Language support mode is persisted in `localStorage`:

- `english-first` (default): shows Hint controls when `support.jaHint` exists
- `english-only`: hides all Japanese hint UI (study flow stays English-only)

Use the nav toggle (`EN-first` / `EN-only`) to switch modes at runtime.

Notes:

- Cards can be authored without Japanese by omitting `support.jaHint`.
- The current starter dataset includes Japanese hints for both the original situational cards and the new core starter layer, but `english-only` mode keeps the UI Japanese-free.

## Dataset schema

`public/data/cards.json` uses an extensible envelope:

```json
{
  "schema_version": 1,
  "cards": []
}
```

Required card fields remain backward compatible with the original MVP. This iteration adds a few **optional** authoring fields for pattern learning support, with a stronger family-first interpretation:

- `family`: groups closely related patterns that should be compared and practiced together
- `slots`: names replaceable parts of the phrase
- `quick_variations`: 2–4 short natural variations shown compactly on reveal/detail
- `practice_note`: one-line note about how the pattern changes
- `ai_transfer_prompt`: a small suggestion for later AI conversation practice, shown only on card detail


Cloze authoring rule:

- a cloze should support phrase recall, not random vocabulary recall
- if the strongest blank would only hide a noun, place name, or trivial content word, omit the cloze
- cards without cloze remain complete because intent + situation stay primary

Repository behavior notes:

- Supports current envelope format (`schema_version: 1`)
- Gracefully rejects malformed datasets
- Includes temporary in-memory fallback for legacy top-level array datasets to ease migration windows
- Validates new optional pattern fields when present

## Dataset authoring workflow

Prompt templates for generating and polishing the dataset are documented in:

- `docs/parla-dataset-prompt-playbook-ja.md`

The recommended next content direction is:

1. expand high-frequency patterns family-by-family,
2. keep situational phrases as a secondary layer,
3. prefer learnable slot-based variation over raw volume,
4. treat cloze as optional and only keep it when it sharpens phrase recall.

## Foundation starter coverage

The current core starter layer focuses on six practical families:

1. Self / identity / background
2. Intent / need / plan
3. Daily actions / time
4. Opinions / uncertainty / comparison
5. Repair / survival expressions
6. Questions to continue conversation

Use `/browse?tag=core` to browse the foundation layer separately from older situational cards.

## PWA support

Parla now includes a lightweight Progressive Web App setup:

- Web app manifest exposed at `/manifest.webmanifest`
- Standalone install metadata for Android and iOS home-screen launch
- Service worker registration on the client
- Offline caching for the core app shell, dataset JSON, and app icons

Notes:

- Progress still lives in `localStorage`, so installed/offline use works on the same device/browser profile that has stored progress.
- First install/offline availability happens after the app is visited once online so the service worker can cache the shell.

## Vercel deployment checklist

- Ensure Node.js 18+ runtime in Vercel project settings (Next.js 14 compatible).
- Build command: `npm run build`
- Output: default Next.js output (no extra config required).
- Install command: `npm install`
- Environment variables: none required for current local-first MVP.
