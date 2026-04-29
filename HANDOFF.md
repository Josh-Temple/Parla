# HANDOFF

## Session summary

Refocused Parla from a general phrase trainer into an AI-survival English trainer while keeping the existing local-first flash-drill architecture.

## What changed

1. Updated home flow and copy to emphasize AI-survival learning and external AI usage.
2. Extended card type unions for new AI-focused categories and functions.
3. Added ~100 AI-survival cards to `public/data/cards.json` and tagged them `ai/survival/core`.
4. Added AI-survival drill mode priority via `/drill?mode=ai_survival`.
5. Added `/use-with-ai` page with copyable external-AI prompt templates.
6. Promoted “Use this with AI” in card detail with a copyable mini prompt.
7. Added browse quick links for AI-survival-focused filtering.
8. Updated navigation and README to reflect product direction.

## Validation to run

- `npm run lint`
- `npm run build`

## Suggested next steps

1. Improve card writing quality pass for style consistency (natural spoken English variants).
2. Add optional onboarding that starts new users directly in AI-survival mode.
3. Add lightweight analytics hooks (local-only or privacy-preserving) to measure card usefulness.


## Session update (2026-04-29)

- Unified `ai_survival` with core `DrillMode` and review selectors so hidden cards and scheduling are respected.
- Added copy-success and copy-failure feedback on `/use-with-ai` and card mini-prompt copy.
- Added AI-survival quick browse links on `/use-with-ai`.
- Rewrote AI-survival card metadata fields in `public/data/cards.json` to replace generic scaffolding with practical learning cues.
- Validation completed: `npm run lint` and `npm run build` passed.
