# HANDOFF

## Session summary

This session added a lightweight staged review layer on top of Parla's existing fast recall loop without introducing a backend or a full SRS.

## What changed

1. **Progress schema extension**
   - Added optional progress fields:
     - `interval_step`
     - `same_day_requeue_count`
     - `last_interval_days`
   - `LocalProgressRepository` now normalizes missing fields on read/write so old saved progress still works.

2. **Simple staged scheduler**
   - `reviewScheduler.ts` now uses a fixed ladder:
     - same-session
     - 1 day
     - 3 days
     - 7 days
     - 14 days
     - 30 days
   - `hard` resets streak, keeps weak cards in the same-session stage, and otherwise moves a card back one step.
   - `close` advances one step.
   - `easy` advances two steps.

3. **Same-session requeue in drill flow**
   - Weak/new cards rated `hard` are reinserted a few cards later in the current drill session.
   - Requeue stays lightweight and in-memory for the current session while still persisting the updated progress snapshot locally.

4. **Due-first daily flow**
   - The all-cards drill now prioritizes due cards first, then unseen cards, then later scheduled cards.
   - Category diversification is preserved within the due-first ordering bands.

5. **Docs refresh**
   - `README.md` now documents the lightweight staged review behavior and backward-compatible migration approach.

## Validation run

- `npm run lint`
- `npm run build`

## Suggested next steps

1. Add focused unit tests around `computeNextReview` for each rating and edge step.
2. Consider a tiny UI hint when a card is requeued for the same session if users need more transparency.
3. If daily flow needs stronger pacing later, add a very small cap for new cards introduced before finishing due cards.
