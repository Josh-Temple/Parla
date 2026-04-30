import type { Card } from "../cards/cardTypes";
import type { ProgressItem } from "../progress/progressTypes";

export type DrillMode = "all" | "due" | "hard" | "confusing" | "want_to_use" | "ai_survival";

const toMap = (progress: ProgressItem[]): Map<string, ProgressItem> => new Map(progress.map((item) => [item.card_id, item]));
function diversifyByCategory(cards: Card[]): Card[] {
  const buckets = new Map<string, Card[]>();
  cards.forEach((card) => {
    const current = buckets.get(card.category) ?? [];
    current.push(card);
    buckets.set(card.category, current);
  });

  const categories = Array.from(buckets.keys());
  const mixed: Card[] = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    categories.forEach((category) => {
      const bucket = buckets.get(category);
      if (bucket?.length) {
        mixed.push(bucket.shift() as Card);
        remaining = true;
      }
    });
  }
  return mixed;
}

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

export function prioritizeDailyCards(cards: Card[], progress: ProgressItem[], now = new Date()): Card[] {
  const map = toMap(progress);
  const due: Card[] = [];
  const unseen: Card[] = [];
  const later: Card[] = [];

  cards.forEach((card) => {
    const item = map.get(card.id);
    if (item?.hidden) return;
    if (!item) {
      unseen.push(card);
      return;
    }
    if (new Date(item.next_due_at) <= now) {
      due.push(card);
      return;
    }
    later.push(card);
  });

  return [...due, ...unseen, ...later];
}



export function getAiSurvivalCards(cards: Card[]): Card[] {
  return cards.filter((card) => card.tags.includes("ai") && card.tags.includes("survival") && card.tags.includes("core"));
}

export function getPrioritizedAiSurvivalCards(cards: Card[], progress: ProgressItem[], now = new Date()): Card[] {
  const filtered = getAiSurvivalCards(cards);
  const map = toMap(progress);
  const due: Card[] = [];
  const unseen: Card[] = [];
  const later: Card[] = [];

  filtered.forEach((card) => {
    const item = map.get(card.id);
    if (item?.hidden) return;
    if (!item) {
      unseen.push(card);
      return;
    }
    if (new Date(item.next_due_at) <= now) {
      due.push(card);
      return;
    }
    later.push(card);
  });

  return [...diversifyByCategory(due), ...diversifyByCategory(unseen), ...diversifyByCategory(later)];
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
    case "ai_survival":
      return getPrioritizedAiSurvivalCards(cards, progress);
    case "all":
    default:
      return prioritizeDailyCards(cards, progress);
  }
}
