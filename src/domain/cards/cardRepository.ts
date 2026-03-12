import type { Card, CardCategory, CardFilters } from "./cardTypes";

export interface CardRepository {
  getAllCards(): Promise<Card[]>;
  getPublishedCards(): Promise<Card[]>;
  getCardById(id: string): Promise<Card | null>;
  getCardsByCategory(category: CardCategory): Promise<Card[]>;
  getCardsByFilters(filters: CardFilters): Promise<Card[]>;
}
