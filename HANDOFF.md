# HANDOFF

## Session summary

This session focused on **refactoring the previous MVP** while preserving Parla's core loop:

- prompt -> silent recall -> reveal -> self-rate -> next

## What was refactored

1. **Shared client data loading**
   - Introduced `src/hooks/useParlaData.ts`.
   - Home, Browse, Review, and Drill now share one pattern for loading published cards + progress.
   - Reduced duplicated `useEffect`/repository wiring.

2. **Review-driven drill queues**
   - Added `DrillMode` and `selectDrillCards` to `src/domain/review/reviewSelectors.ts`.
   - Drill page (`/drill`) now supports `mode` query:
     - `all`
     - `due`
     - `hard`
     - `confusing`
     - `want_to_use`
   - Review page “Start focused drill” now links to mode-specific drill routes.

3. **Card detail action cleanup**
   - Consolidated repeated toggle flows into one helper (`runAction`) in `src/app/card/[id]/page.tsx`.
   - Keeps behavior the same while reducing repeated async code.

4. **Docs update**
   - Updated README to include focused drill mode and refactor highlights.

## Current behavior notes

- Hidden cards remain excluded from standard drill queues and review selectors.
- Confusing cards still surface early in due selection.
- Audio remains optional and URL-based; no runtime TTS required.

## Remaining limitations / future work

1. Add real static audio files for seeded cards.
2. Add a richer empty-state UX for focused drills when no cards match mode.
3. Add tests for review selectors (`selectDrillCards`, due/confusing precedence).
4. Expand dataset toward target 50 cards.
5. Consider server-compatible card repository path for future SSR/edge needs.
