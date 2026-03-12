import type { Card, CardCategory, CardFilters } from "./cardTypes";
import type { CardRepository } from "./cardRepository";

export class StaticCardRepository implements CardRepository {
  private cache: Card[] | null = null;

  private async loadCards() {
    if (this.cache) return this.cache;
    const response = await fetch("/data/cards.json", { cache: "force-cache" });
    if (!response.ok) throw new Error("Failed to load card dataset");
    this.cache = (await response.json()) as Card[];
    return this.cache;
  }

  async getAllCards(): Promise<Card[]> {
    return this.loadCards();
  }

  async getPublishedCards(): Promise<Card[]> {
    const cards = await this.loadCards();
    return cards.filter((card) => card.status.published);
  }

  async getCardById(id: string): Promise<Card | null> {
    const cards = await this.loadCards();
    return cards.find((card) => card.id === id) ?? null;
  }

  async getCardsByCategory(category: CardCategory): Promise<Card[]> {
    const cards = await this.getPublishedCards();
    return cards.filter((card) => card.category === category);
  }

  async getCardsByFilters(filters: CardFilters): Promise<Card[]> {
    const cards = await this.getPublishedCards();
    return cards.filter((card) => {
      if (filters.category && card.category !== filters.category) return false;
      if (filters.function && card.function !== filters.function) return false;
      if (filters.register && card.register !== filters.register) return false;
      if (filters.tags?.length) {
        const hasAll = filters.tags.every((tag) => card.tags.includes(tag));
        if (!hasAll) return false;
      }
      return true;
    });
  }
}
