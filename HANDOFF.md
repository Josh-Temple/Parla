# HANDOFF

## Session summary

Polished post-refactor learning UX with reliable Browse URL filter syncing, improved `ai_survival` drill ordering diversity without breaking priority, and a quality rewrite of first 30 AI-survival card metadata.

## What changed

1. Synced `/browse` filters with URL query changes (`category`, `tag`, `function`, `register`) via `useEffect`, so in-page quick links always update visible filter state.
2. Improved `ai_survival` ordering to keep strict review priority (`due` → `unseen` → `later`) while diversifying categories inside each priority group.
3. Rewrote the first 30 cards in `public/data/cards.json` to feel hand-authored:
   - specific reusable `pattern`
   - direct Japanese recall cues in `support.jaHint`
   - realistic `example` sentences
   - phrase-accurate `slots`
   - concrete, card-specific `practice_note`
4. Re-ran validation checks successfully.

## Validation run

- `npm run lint` ✅
- `npm run build` ✅

## Suggested next steps

1. Continue the same metadata quality pass for cards 31+ so consistency is maintained across the full AI-survival set.
2. Consider adding lightweight automated content linting rules for card metadata quality (e.g., reject placeholder-like examples).
3. Add unit tests for review selector ordering invariants for `ai_survival` (priority grouping + category diversification).

## Session update (2026-04-30)

- Added a clear Home learning path with a 3-step flow: Learn → Use with AI → Review.
- Added AI-survival category pack links that deep-link to `/drill?mode=ai_survival&category=...`.
- Updated drill page to support optional `category` filtering for `ai_survival` while preserving review prioritization behavior.
- Added a completion panel in `DrillCard` so sessions end with actionable next steps instead of silently looping.
- Enhanced `/use-with-ai` with:
  - Today practiced AI-survival cards (up to 10, local progress based)
  - A generated “Today’s AI practice prompt” using practiced phrases when available
  - Copy action with feedback
  - Practice pack quick links

## Session update (2026-05-01)

- Simplified Home hierarchy to remove duplicate top-level drill CTA and keep one dominant primary action inside Step 1 of Today’s practice flow.
- Added explicit Practice packs section on Home so the page order is now: Hero + stats → Today’s practice flow → Practice packs.
- Unified local-day logic by introducing `src/lib/date.ts` with `getLocalDayRange` and `isSameLocalDay`, then reused this logic in Home and Use with AI.
- Updated drill routing to support `tag` filtering (`/drill?mode=hard&tag=ai`) and switched weak-review links/labels to **Review weak AI phrases**.
- Refactored `DrillCard` completion logic:
  - Tracks `ratedCount` based only on rating button actions.
  - Completion panel now reports `Rated X phrases` and `Session cards: Y`.
  - Requeue handling is computed synchronously before completion checks, preventing false early completion on last-card hard ratings.
- Reordered `/use-with-ai` sections so Today’s prompt appears before browse links, following the requested priority flow.
- Validation re-run completed successfully.

### Validation run

- `npm run lint` ✅
- `npm run build` ✅

## Session update (2026-05-01, layout refinement)

- Refined Home page layout to remove visual overlap in the daily flow cards and make each step vertically structured (label above full-width action).
- Introduced minimalist section rhythm using divider lines and consistent spacing (`home-section`, `flow-list`, `flow-item`).
- Updated button base style to `inline-flex` for reliable sizing/alignment and ensured flow CTAs render full width consistently.
- Improved top navigation responsiveness by allowing wrap and adding a mobile divider so nav links and the language toggle no longer collide on narrow viewports.
- Kept existing IA/content while simplifying presentation through typography, whitespace, and subtle borders.

### Validation run

- `npm run lint` ✅

## Session update (2026-05-03)

- Fixed `DrillCard` completion-panel **Start again** behavior to fully reset session state (`index`, `ratedCount`, `revealed`, hints, completion flag).
- Updated Home stats to be AI-survival scoped by deriving `ai + survival + core` cards and computing:
  - Today practiced (AI survival only)
  - Available now (AI survival due/unseen via existing selector behavior)
  - Weak AI phrases (AI survival hard cards)
- Replaced misleading Home stat label **Needs review** with **Available now**.
- Added an inline drill-page comment clarifying how `tag` query scoping works for normal review modes (e.g. `/drill?mode=hard&tag=ai`).
- Enhanced `/use-with-ai` today prompt to include practiced phrase categories and an explicit simple-questions/end-corrections instruction.
- Re-ran validation checks successfully.

### Validation run

- `npm run lint` ✅
- `npm run build` ✅


## Session update (2026-05-03, curriculum-quality phase)

- Improved AI-survival dataset quality for cards `ai_016` through `ai_050` in `public/data/cards.json`.
  - Renamed category usage from **AI Questions** to **Expression Help** for `ai_016`-`ai_030`.
  - Rewrote card-front recall fields (`prompts.intent`, `prompts.situation`, `support.jaHint`) to be concrete and actionable.
  - Reworked low-information metadata (`pattern`, `example`, `notes`, `contrast`, `quick_variations`, `practice_note`, `ai_transfer_prompt`) to reduce generic repetition.
  - Removed template-like example suffixes and placeholder phrasing in Simpler English/Corrections blocks.
- Updated `CardCategory` type union to include `Expression Help` instead of `AI Questions`.
- Added `docs/card-quality-checklist.md` for future dataset edits.

### Validation run

- `npm run lint` ✅
- `npm run build` ✅
