# HANDOFF

## Session summary

This session kept Parla’s existing mobile-first, local-first flash-drill architecture and repositioned the dataset toward a stronger **core English pattern training** direction.

## What changed

1. **Foundation-layer dataset expansion**
   - Expanded `public/data/cards.json` from 8 published cards to 44 published cards.
   - Added 36 new core cards across:
     - Self / identity / background
     - Intent / plans
     - Daily actions / time
     - Opinions / uncertainty
     - Repair / survival
     - Conversation questions
   - Preserved all existing cards.

2. **Backward-compatible schema extension**
   - Added optional card fields:
     - `family`
     - `slots`
     - `quick_variations`
     - `practice_note`
     - `ai_transfer_prompt`
   - `StaticCardRepository` validation now accepts and validates these optional fields.

3. **Lightweight pattern-learning UI support**
   - Reveal now emphasizes `Pattern` more clearly.
   - Reveal and card detail show compact `Quick variations` when present.
   - Card detail now shows `AI practice later` hints only there, keeping the main drill fast.
   - Card metadata now exposes `family` and `slots` when available.

4. **Foundation browsing support**
   - Home page now highlights the foundation layer and links to `/browse?tag=core`.
   - Browse page accepts `tag` from the URL and surfaces pattern/variation previews.

5. **Docs refresh**
   - `README.md` now explains the foundation-layer direction and optional schema fields.
   - `docs/parla-dataset-prompt-playbook-ja.md` now needs future card generation to favor reusable core patterns first.

## Validation run

- `npm run lint`
- `npm run build`

## Suggested next steps

1. Add small tests around dataset validation for the new optional fields.
2. Add a tiny browse section or saved shortcut for major core families if users need faster navigation.
3. Expand the next batch by deepening contrast pairs inside the core layer instead of chasing raw card count.
4. Consider adding one lightweight “core only” drill preset if browse-to-drill becomes a frequent need.
