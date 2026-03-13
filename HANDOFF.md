# HANDOFF

## Session summary

This session tightened the immersion direction by removing remaining Japanese-first surfaces outside the drill card and adding a single global toggle point for future English-only mode.

## What changed

1. **Global Japanese support toggle point**
   - Added `src/domain/cards/cardSupport.ts` with:
     - `japaneseSupportEnabled`
     - `getJapaneseHint(card)`
   - Drill and detail screens now use this helper, making future English-only switching straightforward.

2. **Drill hint source hardened**
   - Drill no longer falls back to `japanese_meaning`; it only uses `support.jaHint` when support is enabled.
   - This avoids accidental Japanese exposure when cards are prepared for English-only operation.

3. **Browse screen made English-first**
   - Card preview text in `/browse` now shows `prompts.intent` + `prompts.situation` instead of Japanese meaning.

4. **Card detail Japanese meaning made optional**
   - Japanese meaning is hidden behind a small `Check meaning` button and is not shown by default.

5. **Docs updated**
   - README updated to note English-first defaults in browse/detail in addition to drill flow.

## Validation run

- `npm run lint` ✅ pass
- `npm run build` ✅ pass

## Suggested next steps

1. Replace `japaneseSupportEnabled` constant with persisted user setting (`english-first` / `english-only`).
2. Migrate remaining Japanese copy in metadata fields (e.g., `contrast`) if those areas become part of frequent drill review surfaces.
3. Add a schema migration script for larger datasets to enforce `support.jaHint` as the only Japanese support field.
