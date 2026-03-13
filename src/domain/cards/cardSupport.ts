import type { Card } from "./cardTypes";

// Future toggle point for `english-first` vs `english-only` modes.
export const japaneseSupportEnabled = true;

export function getJapaneseHint(card: Card): string | null {
  if (!japaneseSupportEnabled) return null;
  return card.support?.jaHint ?? null;
}
