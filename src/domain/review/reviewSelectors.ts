import type { Card } from "../cards/cardTypes";
import type { ProgressItem } from "../progress/progressTypes";

export type DrillMode = "all" | "due" | "hard" | "confusing" | "want_to_use";

const toMap = (progress: ProgressItem[]): Map<string, ProgressItem> => new Map(progress.map((item) => [item.card_id, item]));

export function getDueCards(cards: Card[], progress: ProgressItem[], now = new Date()): Card[] {
  const map = toMap(progress);
  return cards.filter((card) => {
    const p = map.get(card.id);
    if (p?.hidden) return false;
    if (!p) return true;
    return new Date(p.next_due_at) <= now;
  });
}

export function getHardCards(cards: Card[], progress: ProgressItem[]): Card[] {
  const map = toMap(progress);
  return cards.filter((card) => {
    const p = map.get(card.id);
    return !p?.hidden && p?.rating === "hard";
  });
}

export function getConfusingCards(cards: Card[], progress: ProgressItem[]): Card[] {
  const map = toMap(progress);
  return cards.filter((card) => {
    const p = map.get(card.id);
    return !p?.hidden && !!p?.confusing;
  });
}

export function getWantToUseCards(cards: Card[], progress: ProgressItem[]): Card[] {
  const map = toMap(progress);
  return cards.filter((card) => {
    const p = map.get(card.id);
    return !p?.hidden && !!p?.want_to_use;
  });
}

export function selectDrillCards(cards: Card[], progress: ProgressItem[], mode: DrillMode): Card[] {
  switch (mode) {
    case "due":
      return getDueCards(cards, progress);
    case "hard":
      return getHardCards(cards, progress);
    case "confusing":
      return getConfusingCards(cards, progress);
    case "want_to_use":
      return getWantToUseCards(cards, progress);
    case "all":
    default: {
      const hiddenIds = new Set(progress.filter((item) => item.hidden).map((item) => item.card_id));
      return cards.filter((card) => !hiddenIds.has(card.id));
    }
  }
}
