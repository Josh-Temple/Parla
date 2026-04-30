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
