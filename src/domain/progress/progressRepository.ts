import type { ProgressItem } from "./progressTypes";

export interface ProgressRepository {
  getProgress(cardId: string): Promise<ProgressItem | null>;
  saveProgress(progress: ProgressItem): Promise<void>;
  getAllProgress(): Promise<ProgressItem[]>;
  toggleFavorite(cardId: string): Promise<void>;
  toggleWantToUse(cardId: string): Promise<void>;
  toggleConfusing(cardId: string): Promise<void>;
  hideCard(cardId: string): Promise<void>;
}
