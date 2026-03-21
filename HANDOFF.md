# HANDOFF

## Session summary

This session added baseline PWA support to Parla so the app can be installed and can keep its main shell available offline after the first online visit.

## What changed

1. **PWA foundation added**
   - Added a Next.js app manifest route at `src/app/manifest.ts`.
   - Added install metadata in `src/app/layout.tsx` for manifest, icons, and Apple web app behavior.

2. **Service worker registration**
   - Added a small client component at `src/components/ServiceWorkerRegistration.tsx`.
   - Root layout now registers `/sw.js` when the browser supports service workers.

3. **Offline shell caching**
   - Added `public/sw.js` with a simple app-shell cache strategy.
   - Pre-caches the main routes, dataset JSON, manifest, and icons.
   - Navigation requests fall back to cached app routes when the network is unavailable.

4. **Install assets**
   - Added maskable-style app icons under `public/icons/`.

5. **Docs refresh**
   - README now documents the PWA capability and its current constraints.

## Validation run

- `npm run lint`
- `npm run build`

## Suggested next steps

1. If stronger offline behavior is needed, add an explicit offline page and more granular runtime caching rules for dynamic Next assets.
2. Consider generating PNG icons in addition to SVG if you need broader install-surface compatibility across devices and stores.
3. If Parla later syncs progress across devices, revisit the current `localStorage`-based persistence assumptions for installed PWA usage.
