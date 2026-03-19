import type { Card, CardCategory, CardDataset, CardFilters } from "./cardTypes";
import type { CardRepository } from "./cardRepository";

const SUPPORTED_SCHEMA_VERSION = 1;

type LegacyCardDataset = Card[];
type RawCardDataset = CardDataset | LegacyCardDataset;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isCard(value: unknown): value is Card {
  if (!isRecord(value)) return false;

  const prompts = value.prompts;
  const status = value.status;
  const support = value.support;
  const audio = value.audio;

  return (
    typeof value.id === "string" &&
    typeof value.category === "string" &&
    typeof value.phrase === "string" &&
    typeof value.function === "string" &&
    typeof value.register === "string" &&
    typeof value.pattern === "string" &&
    typeof value.example === "string" &&
    typeof value.notes === "string" &&
    isStringArray(value.tags) &&
    isStringArray(value.similar) &&
    typeof value.contrast === "string" &&
    isRecord(prompts) &&
    typeof prompts.intent === "string" &&
    typeof prompts.situation === "string" &&
    (!("cloze" in prompts) || typeof prompts.cloze === "string") &&
    (!("support" in value) || !support || (isRecord(support) && (!("jaHint" in support) || typeof support.jaHint === "string"))) &&
    (!("family" in value) || typeof value.family === "string") &&
    (!("slots" in value) || isStringArray(value.slots)) &&
    (!("quick_variations" in value) || isStringArray(value.quick_variations)) &&
    (!("practice_note" in value) || typeof value.practice_note === "string") &&
    (!("ai_transfer_prompt" in value) || typeof value.ai_transfer_prompt === "string") &&
    typeof value.difficulty === "number" &&
    (!("audio" in value) || !audio || (isRecord(audio) && (!("phraseUrl" in audio) || typeof audio.phraseUrl === "string") && (!("exampleUrl" in audio) || typeof audio.exampleUrl === "string") && (!("voice" in audio) || typeof audio.voice === "string"))) &&
    isRecord(status) &&
    typeof status.published === "boolean"
  );
}

function readCardsFromDataset(data: RawCardDataset): Card[] {
  if (Array.isArray(data)) {
    console.warn("Legacy card dataset format detected; migrating in-memory to schema_version=1");
    return data.filter(isCard);
  }

  if (!isRecord(data) || !Array.isArray(data.cards) || typeof data.schema_version !== "number") {
    console.warn("Invalid card dataset format");
    return [];
  }

  if (data.schema_version > SUPPORTED_SCHEMA_VERSION) {
    console.warn(`Unsupported schema_version=${data.schema_version}; expected <= ${SUPPORTED_SCHEMA_VERSION}`);
    return [];
  }

  return data.cards.filter(isCard);
}

export class StaticCardRepository implements CardRepository {
  private cache: Card[] | null = null;

  private async loadCards(): Promise<Card[]> {
    if (this.cache) return this.cache;
    const response = await fetch("/data/cards.json", { cache: "force-cache" });
    if (!response.ok) throw new Error("Failed to load card dataset");

    const json = (await response.json()) as RawCardDataset;
    this.cache = readCardsFromDataset(json);
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
