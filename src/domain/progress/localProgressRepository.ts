import { safeStorage } from "@/lib/storage";
import { addDays, nowIso } from "@/lib/dates";
import type { ProgressItem, Rating } from "./progressTypes";
import type { ProgressRepository } from "./progressRepository";

const KEY = "parla_progress_v1";

function fallback(cardId: string): ProgressItem {
  return {
    card_id: cardId,
    last_reviewed_at: nowIso(),
    rating: "close",
    review_count: 0,
    correct_streak: 0,
    next_due_at: addDays(new Date(), 1).toISOString(),
    favorite: false,
    want_to_use: false,
    confusing: false,
    hidden: false,
  };
}

export class LocalProgressRepository implements ProgressRepository {
  private readAll(): ProgressItem[] {
    const raw = safeStorage.getItem(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ProgressItem[];
    } catch {
      return [];
    }
  }

  private writeAll(items: ProgressItem[]) {
    safeStorage.setItem(KEY, JSON.stringify(items));
  }

  async getProgress(cardId: string): Promise<ProgressItem | null> {
    const found = this.readAll().find((item) => item.card_id === cardId);
    return found ?? null;
  }

  async saveProgress(progress: ProgressItem): Promise<void> {
    const current = this.readAll();
    const next = current.filter((item) => item.card_id !== progress.card_id);
    next.push(progress);
    this.writeAll(next);
  }

  async getAllProgress(): Promise<ProgressItem[]> {
    return this.readAll();
  }

  private async mutate(cardId: string, fn: (item: ProgressItem) => ProgressItem) {
    const current = this.readAll();
    const base = current.find((item) => item.card_id === cardId) ?? fallback(cardId);
    const updated = fn(base);
    const next = current.filter((item) => item.card_id !== cardId);
    next.push(updated);
    this.writeAll(next);
  }

  async toggleFavorite(cardId: string): Promise<void> {
    return this.mutate(cardId, (item) => ({ ...item, favorite: !item.favorite }));
  }

  async toggleWantToUse(cardId: string): Promise<void> {
    return this.mutate(cardId, (item) => ({ ...item, want_to_use: !item.want_to_use }));
  }

  async toggleConfusing(cardId: string): Promise<void> {
    return this.mutate(cardId, (item) => ({ ...item, confusing: !item.confusing }));
  }

  async hideCard(cardId: string): Promise<void> {
    return this.mutate(cardId, (item) => ({ ...item, hidden: true }));
  }

  static createReviewProgress(cardId: string, rating: Rating, nextDue: Date, streak: number, reviewCount: number): ProgressItem {
    return {
      card_id: cardId,
      last_reviewed_at: nowIso(),
      rating,
      review_count: reviewCount,
      correct_streak: streak,
      next_due_at: nextDue.toISOString(),
      favorite: false,
      want_to_use: false,
      confusing: false,
      hidden: false,
    };
  }
}
